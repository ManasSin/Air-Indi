import express from "express";
import mongoose, { now } from "mongoose";
import { asyncHandler } from "../Service/asyncHandler.js";
import fs from "fs";
import path from "path";
import HotelBranch from "../Modal/Hotels/HotelBranchSchema.js";
import Booking from "../Modal/Hotels/BookingSchema.js";
// import PDFDocument from "pdfkit";

export const createBooking = asyncHandler(async (req, res) => {
  const userID = req.user._id;
  const { user, hotelBranchId } = req.query;
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
    .slice(0, 10)}-${checkOutDate
    .toString()
    .slice(0, 10)}-${new Date().setMilliseconds(0)}`;

  // console.log({ slugName: slugName });

  const bookingExists = await Booking.findOne({
    slugName: slugName,
  });
  if (bookingExists) {
    return res.status(400).json({
      status: "Error",
      message: "Booking can't be created",
      error: "Booking already exists.",
    });
  }

  const booking = new Booking({
    user: new mongoose.Types.ObjectId(String(user)),
    hotelBranch: new mongoose.Types.ObjectId(String(hotelBranchId)),
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

  const data = await booking.save();
  res.status(201).send({
    status: "OK",
    message: "Booking created successfully",
    booking: data,
  });
});

export const getBooking = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // trigger this when a successful booking is made
  try {
    // Generate a unique invoice number
    booking.invoiceNumber = `INV-${Date.now()}`;

    // Save the booking to the database
    await booking.save();

    // Generate the PDF invoice
    const outputPath = path.join(
      __dirname,
      "invoices",
      `${booking.invoiceNumber}.pdf`
    );
    generateInvoice(booking, outputPath);

    res.status(201).json({
      status: "OK",
      message: "Booking created and invoice generated",
      booking: booking,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Error creating booking",
      error: error.message,
    });
  }
});

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
