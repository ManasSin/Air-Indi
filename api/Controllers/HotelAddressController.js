import express from "express";
import { asyncHandler } from "../Service/asyncHandler.js";
import HotelAddress from "../Modal/HotelAddressSchema.js";
import Hotels from "../Modal/HotelsSchema.js";
import mongoose from "mongoose";

const router = express.Router();

// Create a new hotel address

export const createHotelAddress = asyncHandler(async (req, res) => {
  // console.log({ id: req.user._id });
  const user = req.user._id;
  const hotelId = req.query.hotelId;

  const HotelExistsForUser = await Hotels.find({
    _id: hotelId,
    createdByUser: user,
  });
  // console.log({ user: user }, { userExists: userExists });

  if (!HotelExistsForUser) return res.status(401).send("Hotel not found");

  let response = [];
  try {
    const { localArea, pinCode, city, state, country } = req.body;

    if (
      !localArea ||
      typeof localArea !== "string" ||
      localArea.trim().length < 1 ||
      !pinCode ||
      typeof pinCode !== "number" ||
      pinCode < 1 ||
      !city ||
      typeof city !== "string" ||
      city.trim().length < 1 ||
      !state ||
      typeof state !== "string" ||
      state.trim().length < 1 ||
      !country ||
      typeof country !== "string" ||
      country.trim().length < 1
    ) {
      return res
        .status(401)
        .send("The fields are not valid. Please check and try again.");
    }

    const localAreaStr = localArea
      .trim()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
    const locationStr = `${localAreaStr}-${pinCode}-${city
      .split(" ")
      .join("-")}`;
    const slugName = `${hotelId?.slice(18) || ""}-${locationStr}`;

    // console.log(slugName);

    const address = new HotelAddress({
      localArea,
      pinCode,
      city,
      state,
      country,
      slugName,
      createdByUser: user,
      hotel: hotelId,
    });

    const data = await address.save();
    // console.log(data);

    if (data) return (response = [...response, data]);

    return res.status(201).send({
      status: "OK",
      message: "Address created for this hotel",
      data: data,
    });
  } catch (e) {
    console.error(e);
    return res.status(401).send({ status: "Error", error: e.message });
  } finally {
    // after the hotelAddress is created in db, we need to update the hotels document to add the address id inside the address array of the hotel document

    const updatedHotel = await Hotels.findByIdAndUpdate(hotelId, {
      address: data._id,
    });
    updatedHotel ? response.push(updatedHotel) : null;

    if (updatedHotel)
      return res.send({
        status: "OK",
        message: "Address added to Hotel",
        updateHotelAddress: response?.updatedAddress || [],
      });

    return res.status(500).send({ status: "Error", error: "Server error." });
  }
});

// Get all hotel addresses
export const getAllHotelAddress = asyncHandler(async (req, res) => {
  const id = req.query.id;
  // console.log({ id: id });

  if (id) {
    try {
      const addresses = await HotelAddress.find({ hotel: id })
        .populate("hotel")
        .lean();
      res.status(200).json({ status: "OK", HotelAddress: addresses });
    } catch (err) {
      res.status(404).send({
        status: "Error",
        error: err.message,
        message: "User not found",
      });
    }
  } else {
    try {
      const addresses = await HotelAddress.find().populate("hotel").lean();
      res.status(200).json({ status: "OK", addresses: addresses });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error." });
    }
  }
});

// Get a hotel address by ID
export const getHotelAddressByID = asyncHandler(async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await HotelAddress.findById(addressId);
    if (!address) {
      return res.status(404).json({ error: "Address not found." });
    }
    res.json(address);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// Update a hotel address by ID
export const updateHotelAddress = asyncHandler(async (req, res) => {
  const addressId = req.query.id;
  const hotelId = req.query.hotel;
  const userId = req.user._id;
  // let updatedHotelAddress = [];
  const filter = {
    createdByUser: new mongoose.Types.ObjectId(String(req.query.user)),
    _id: addressId,
    hotel: hotelId,
  };
  // console.log({
  //   addressId,
  //   userId,
  //   hotel: req.query.hotel,
  //   user: new mongoose.Types.ObjectId(String(req.query.user)),
  // });

  if (userId.equals(req.query.user) === false)
    return res.status(401).send("Unauthorized");

  try {
    const { localArea, pinCode, city, state, country } = req.body;

    // validate the data sent by the user is valid and then check if these are exactly same the data available in the db

    if (
      !localArea ||
      typeof localArea !== "string" ||
      localArea.trim().length < 1 ||
      !pinCode ||
      typeof pinCode !== "number" ||
      !city ||
      typeof city !== "string" ||
      city.trim().length < 1 ||
      !state ||
      typeof state !== "string" ||
      state.trim().length < 1 ||
      !country ||
      typeof country !== "string" ||
      country.trim().length < 1
    ) {
      return res
        .status(401)
        .send("The fields are not valid. Please check and try again.");
    }

    // make a slug name using the same technique used in the Create Hotel API, then check if it exists in the db
    const localAreaStr = localArea
      .trim()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
    const locationStr = `${localAreaStr}-${pinCode}-${city
      .split(" ")
      .join("-")}`;
    const slugName = `${hotelId?.slice(18) || ""}-${locationStr}`;

    // check if address already exists
    const address = await HotelAddress.findOne({ slugName });
    if (address) {
      return res.status(400).json({
        status: "Error",
        message: "Address already exists",
        error: "Address already exists",
      });
    }

    let updateBody = {
      localArea,
      pinCode,
      city,
      state,
      country,
      slugName,
      updatedAt: new Date(),
    };

    const updatedAddress = await HotelAddress.findOneAndUpdate(
      filter,
      updateBody,
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(500).json({
        status: "Error",
        message: "Address could not be updated",
        error: "Server Error, please try again",
      });
    }

    res.status(200).json({
      status: "OK",
      message: "Address updated successfully.",
      updatedAddress: updatedAddress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Error",
      message: "Could not update address",
      error: err.message,
    });

    // } finally {
    //   const hotel = await HotelAddress.find({ _id: addressId });

    //   if (hotel) updatedHotelAddress = [...updatedHotelAddress, hotel];

    //   if (updatedHotelAddress)
    //     return res.status(200).send({
    //       status: "OK",
    //       message: "Address updated successfully.",
    //       updatedHotelAddress: updatedHotelAddress,
    //     });

    //   return res.status(500).send({ status: "Error", error: "Server error." });
  }

  // res
  //   .status(200)
  //   .send({ status: "OK", message: "Address updated successfully.", updatedHotelAddress: updatedHotelAddress });
});

// Delete a hotel address by ID
export const deleteHotelAddress = asyncHandler(async (req, res) => {
  const addressId = req.query.id;
  const loggedInUser = req.user._id;
  const pin = req.body.pinCode;
  const filter = {
    createdByUser: req.query.user,
    _id: addressId,
    pinCode: pin,
  };

  if (loggedInUser.equals(req.query.user) === false)
    return res.status(401).send("Unauthorized");

  try {
    let updateBody = {
      deletedAt:
        req.body.deletedAt === true
          ? new Date()
          : req.body.deletedAt === false
          ? null
          : "",
    };
    const deletedAddress = await HotelAddress.findOneAndUpdate(
      filter,
      updateBody,
      { new: true }
    );

    if (!deletedAddress) {
      return res.status(404).json({
        status: "Error",
        message: "Address not found",
        error: "Address not found",
      });
    }
    res.json({
      status: "OK",
      message: "Address deleted successfully.",
      deletedAddress: deletedAddress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Error",
      error: err.message,
      message: "Could not delete address",
    });
  }
});

export default router;
