import express from "express";
import { asyncHandler } from "../Service/asyncHandler.js";
import HotelAddress from "../Modal/HotelAddressSchema.js";
import mongoose from "mongoose";
import Hotels from "../Modal/HotelsSchema.js";

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

    console.log(slugName);

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

    return res.status(201).send({ data: data });
  } catch (e) {
    console.error(e);
    return res.status(401).send({ status: "Error", error: e.message });
  }
});

// Get all hotel addresses
export const getAllHotelAddress = asyncHandler(async (req, res) => {
  const id = req.query.id;
  // console.log({ id: id });

  if (id) {
    try {
      const addresses = await HotelAddress.find({ hotel: id }).populate(
        "hotel"
      );
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
      const addresses = await HotelAddress.find();
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
export const deleteHotelAddress = asyncHandler(async (req, res) => {
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
