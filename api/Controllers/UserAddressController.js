// Assuming you have imported necessary modules and dependencies
import express from "express";
import { UserAddress } from "../Modal/UserAddressSchema";
import { asyncHandler } from "../Service/asyncHandler.js";
import CustomError from "../Utils/CustomError.js";

const router = express.Router();

// Create a new hotel address
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { localArea, pincode, city, state, country } = req.body;

    if (localArea && pincode && city && state && country) {
      throw new CustomError("All fields are required", 400);
    }
  })
);

// Get all hotel addresses
router.get("/", async (req, res) => {
  try {
    const addresses = await HotelAddress.find();
    res.json(addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// Get a hotel address by ID
router.get("/:addressId", async (req, res) => {
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
router.put("/:addressId", async (req, res) => {
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
router.delete("/:addressId", async (req, res) => {
  try {
    const { addressId } = req.params;
    const deletedAddress = await HotelAddress.findByIdAndDelete(addressId);
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
