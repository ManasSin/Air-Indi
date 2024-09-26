import express from "express";
import mongoose from "mongoose";
import { asyncHandler } from "../Service/asyncHandler.js";
import HotelBranch from "../Modal/Hotels/HotelBranchSchema.js";
import Booking from "../Modal/Hotels/BookingSchema.js";
import Room from "../Modal/Rooms/RoomSchema.js";
// import PDFDocument from "pdfkit";

/* 
  functionality: 
  1. create booking for a hotel, update the hotelBranch
    1.1. if the booking is created and not paid within 30 mins send them an email,
    1.2. if the booking is created and still not paid within 60 mins, set isCancelled to true on the booking
    1.3. if the booking is created and paid within 60 mins or as soon as they pay, update the hotelBranch and send them an email

  2. get booking using the booking id and user id
    2.1. get booking, check if the booking belongs to the user,
      2.1.1 if the booking exists and is unpaid, return booking with time remaining to make payment, and assignedStaff details.
    2.2. check if the booking is already paid, if yes then return booking with the assignedStaff details, invoice, and location of the booked hotelBranch. 
    2.3. check if the booking is cancelled, if yes then return just the booking details, refund status, and payment mode.
    2.3. return booking

*/

export const createBooking = asyncHandler(async (req, res) => {
  const userID = req.user._id;
  const { userId: user, hotelBranchId, roomId } = req.query;
  const {
    checkInDate,
    checkOutDate,
    guests,
    paymentMethod,
    listingPrice,
    discount,
    serviceCharge,
    specialRequest,
    tax,
  } = req.body;

  if (userID.equals(user) === false)
    return res.status(401).json({
      status: "Error",
      message: "Unauthorized",
      error: "Unauthorized",
    });

  const hotelWithThisID = await HotelBranch.findOne({ _id: hotelBranchId });

  if (!hotelWithThisID) {
    return res.status(404).json({
      status: "Error",
      message: "Can not create booking",
      error: "Hotel not found with this ID",
    });
  }

  try {
    if (
      !checkInDate ||
      !checkOutDate ||
      !guests ||
      typeof guests !== "object" ||
      (guests.children !== undefined &&
        (typeof guests.children !== "number" || guests.children < 0)) ||
      (guests.infants !== undefined &&
        (typeof guests.infants !== "number" || guests.infants < 0)) ||
      !paymentMethod ||
      typeof paymentMethod !== "string" ||
      !["credit card", "debit card", "paypal", "online"].includes(
        paymentMethod
      ) ||
      !listingPrice ||
      typeof listingPrice !== "number" ||
      listingPrice < 0 ||
      !discount ||
      typeof discount !== "number" ||
      discount < 0 ||
      !(serviceCharge || typeof serviceCharge === "number") ||
      !(tax || typeof tax === "number") ||
      !specialRequest ||
      typeof specialRequest !== "string" ||
      specialRequest.trim().length < 1
    ) {
      return res
        .status(401)
        .send("The fields are not valid. Please check and try again.");
    }

    // get the serviceCharge, tax, totalAmount from the body, if not provided then take from the hotel details
    if (!serviceCharge || !tax) {
      // make serviceCharge  = 16 % of the listingPrice
      serviceCharge = listingPrice * 0.16;
      // make tax = 8 % of the listingPrice
      tax = listingPrice * 0.08;
    }

    // make totalAmount = listingPrice + serviceCharge + tax
    const totalAmount = listingPrice + serviceCharge + tax;

    const slugName = `${hotelBranchId.slice(18)}-${user.slice(18)}-${checkInDate
      .toString()
      .slice(0, 10)}-${checkOutDate.toString().slice(0, 10)}-${new Date()
      .toJSON()
      .slice(0, 10)}`.toLowerCase();

    // console.log({ slugName: slugName });

    const bookingExists = await Booking.findOne({
      slugName: slugName,
    });
    if (bookingExists) {
      return res.status(400).json({
        status: "Error",
        message: `Booking already exists. ${bookingExists.checkInDate.toDateString()}-${bookingExists.checkOutDate.toDateString()} for ${
          bookingExists.guests
        }`,
        error: "Booking already exists.",
      });
    }

    const booking = new Booking({
      user: new mongoose.Types.ObjectId(String(user)),
      hotelBranch: new mongoose.Types.ObjectId(String(hotelBranchId)),
      roomId: new mongoose.Types.ObjectId(String(roomId)),
      checkInDate,
      checkOutDate,
      guests,
      specialRequest,
      paymentMethod,
      listingPrice,
      discount,
      serviceCharge,
      tax,
      totalAmount,
      slugName,
    });

    let bookings, hotelBranches, rooms;
    // functionality list point number 1
    await Promise.all([
      (bookings = booking.save()),
      (hotelBranches = HotelBranch.findOneAndUpdate(
        { _id: hotelBranchId },
        { $inc: { bookingCount: 1 }, $push: { bookings: booking._id } }
      )),
      (rooms = Room.findOneAndUpdate(
        { _id: roomId },
        { $inc: { numberOfBookingsMade: 1 }, $push: { bookings: booking._id } }
      )),
      // user.updateOne({ $push: { bookings: booking._id } }),
    ]);
    res.status(201).send({
      status: "OK",
      message: "Booking created successfully",
      booking: { bookings, hotelBranches, rooms },
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Booking can't be created",
      error: error.message,
    });
  }
});

export const getBooking = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { userId: user, bookingId } = req.query;

  if (userId.equals(user) === false)
    return res.status(401).json({
      status: "Error",
      message: "Unauthorized",
      error: "Unauthorized",
    });

  try {
    const booking = await Booking.findOne({
      _id: bookingId,
      user: user,
      isCancelled: { $ne: true },
    }).populate("user hotelBranch roomId", { strictPopulate: false });
    if (!booking) {
      return res.status(404).json({
        status: "Error",
        message: "Booking not found",
        error: "Booking not found",
      });
    }

    if (booking.isCancelled) {
      return res.status(404).json({
        status: "Error",
        message:
          "Booking cancelled on " +
          booking.isCancelled?.cancellationDate.toDateString(),
        error: "Booking cancelled by " + booking.isCancelled.deletedBy,
      });
    }

    const accordingToPaymentStatus =
      booking.paymentStatus === "paid"
        ? { connectStaff: booking.hotelBranch.assignedStaff }
        : {
            // convert the booking.createdAt to a Date object, and add 60 minutes to it, then convert it back to a timestamp, subtracting the current timestamp, and convert to minutes and decorate with "mins" or "hrs" (remove the decimal part)
            paymentTimeLeft:
              (new Date(booking.createdAt).getTime() +
                60 * 60 * 1000 -
                Date.now()) /
                (60 * 1000) <=
              60
                ? `${Math.floor(
                    (new Date(booking.createdAt).getTime() +
                      60 * 60 * 1000 -
                      Date.now()) /
                      (60 * 1000) /
                      60
                  )} hrs`
                : `${Math.floor(
                    (new Date(booking.createdAt).getTime() +
                      60 * 60 * 1000 -
                      Date.now()) /
                      (60 * 1000)
                  )} mins`,
          };

    // console.log(
    //   accordingToPaymentStatus,
    //   new Date(booking.createdAt),
    //   Date.now()
    // );
    let returnData = {
      bookingId: booking._id,
      paymentStatus: booking.paymentStatus,
      guests: booking.guests,
      totalAmount: booking.totalAmount,
      specialRequest: booking.specialRequest,
      paymentMethod: booking.paymentMethod,
      invoice:
        booking.invoice !== null ? booking.invoice : "No Invoice generated",
      ...accordingToPaymentStatus,
      checkInDate: booking.checkInDate.toISOString().slice(0, 10),
      checkOutDate: booking.checkOutDate.toISOString().slice(0, 10),
      bookedBy: booking.user.name,
      hotelName: booking.hotelBranch.name,
      roomNumber: booking.roomId?.roomNumber ? booking.roomId.roomNumber : "NA",
      roomType: booking.roomId?.roomType ? booking.roomId.roomType : "NA",
      roomPrice: booking.roomId?.price ? booking.roomId.price : "NA",
    };

    res.status(200).json({
      status: "OK",
      message: "Booking found successfully",
      booking: returnData,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "server error while fetching booking",
      error: error.message,
    });
  }
});

// Generate a unique invoice number
// booking.invoiceNumber = `INV-${Date.now()}`;

// Save the booking to the database
// await booking.save();

// Generate the PDF invoice
// const outputPath = path.join(
//   __dirname,
//   "invoices",
//   `${booking.invoiceNumber}.pdf`
// );
// generateInvoice(booking, outputPath);

// res.status(201).json({
//   status: "OK",
//   message: "Booking created and invoice generated",
//   booking: booking,
// });
// const generateInvoice = (booking, outputPath) => {
//   const doc = new PDFDocument();

//   // Pipe the PDF into a writable stream
//   doc.pipe(fs.createWriteStream(outputPath));

//   // Add content to the PDF
//   doc.fontSize(25).text("Invoice", { align: "center" });

//   doc
//     .fontSize(12)
//     .text(`Invoice Number: ${booking.invoiceNumber}`, { align: "left" });
//   doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, {
//     align: "left",
//   });
//   doc.text(`User: ${booking.user}`, { align: "left" });
//   doc.text(`Hotel: ${booking.hotel}`, { align: "left" });
//   doc.text(`Check-In Date: ${booking.checkInDate.toLocaleDateString()}`, {
//     align: "left",
//   });
//   doc.text(`Check-Out Date: ${booking.checkOutDate.toLocaleDateString()}`, {
//     align: "left",
//   });
//   doc.text(`Total Price: $${booking.totalPrice}`, { align: "left" });
//   doc.text(`Payment Method: ${booking.paymentMethod}`, { align: "left" });
//   doc.text(`Payment Status: ${booking.paymentStatus}`, { align: "left" });

//   // Finalize the PDF and end the stream
//   doc.end();
// };
