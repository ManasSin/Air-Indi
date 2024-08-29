import express from "express";
import { asyncHandler } from "../Service/asyncHandler.js";
import HotelAddress from "../Modal/HotelAddressSchema.js";
import mongoose from "mongoose";
import User from "../Modal/UserSchema.js";

const router = express.Router();

// Create a new hotel address
export const createHotelAddress = asyncHandler(async (req, res) => {
  // console.log({ id: req.user._id });
  const user =
    req.user !== null || req.user !== undefined || !!req.user
      ? req.user._id
      : req.params.user;
  const { hotel: hotelId } = req.params;

  const userExists = await User.findById(new mongoose.Types.ObjectId(user));
  // console.log({ user: user }, { userExists: userExists });

  if (!user || !userExists) return res.status(401).send("User not found");

  // TODO: check if the hotel exists for the hotelId given in the params. to prevent creation of duplicate addresses for same hotel

  // check for hotel in hotel table and then proceed
  if (hotelId !== undefined || hotelId !== null) {
    const { localArea, pinCode, city, state, country } = req.body;

    if (!localArea || !pinCode || !city || !state || !country) {
      return res.status(401).send("Please provide all fields");
      // throw new CustomError("All fields are required");
    }
    const address = new HotelAddress({
      localArea,
      pinCode,
      city,
      state,
      country,
      createdByUser: new mongoose.Types.ObjectId(user),
      // hotel: new mongoose.Types.ObjectId(hotelId),
    });

    const data = await address.save();
    // console.log(data);

    return res.status(201).send({ data: data });
  } else {
    return res.status(401).send("Provide select hotel id");
    // throw new CustomError("hotel id given is not correct.");
  }
});

// Get all hotel addresses
export const getAllHotels = asyncHandler(async (req, res) => {
  try {
    const addresses = await HotelAddress.find();
    res.json(addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
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
export const updateAddress = asyncHandler(async (req, res) => {
  try {
    const { addressId } = req.params;
    const addressData = req.body;
    const updatedAddress = await HotelAddress.findByIdAndUpdate(
      addressId,
      addressData,
      { new: true }
    );
    if (!updatedAddress) {
      return res.status(404).json({ error: "Address not found." });
    }
    res.json(updatedAddress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// Delete a hotel address by ID
export const deleteAddress = asyncHandler(async (req, res) => {
  try {
    const { addressId } = req.params;
    const deletedAddress = await HotelAddressSchema.findByIdAndDelete(
      addressId
    );
    if (!deletedAddress) {
      return res.status(404).json({ error: "Address not found." });
    }
    res.json({ message: "Address deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

export default router;
