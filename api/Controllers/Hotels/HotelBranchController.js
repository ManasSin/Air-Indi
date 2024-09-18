import mongoose from "mongoose";
import express from "express";
import { asyncHandler } from "../../Service/asyncHandler.js";
import HotelBranch from "../../Modal/Hotels/HotelBranchSchema.js";
import Hotels from "../../Modal/Hotels/HotelsSchema.js";
import Vendor from "../../Modal/User/VendorSchema.js";

export const createHotelBranch = asyncHandler(async (req, res) => {
  const hotelId = req.query.hotel;
  const userId = req.user._id;

  const {
    branchName,
    description,
    contactInfo,
    images,
    locality,
    facilities,
    services,
    tags,
    priceRange,
    pricePerNight,
    currency,
    amenities,
  } = req.body;

  if (userId.equals(req.query.user) === false)
    return res.status(401).send({
      status: "ERROR",
      message: "user not found",
      error: "unauthorized",
    });

  if (req.user.role === "MODERATOR" || req.user.role === "OWNER") {
    // TODO : do something for request validation
    try {
      const validationErrors = [];
      if (!branchName || typeof branchName !== "string") {
        validationErrors.push({
          field: "branchName",
          message: "branchName must be a string",
        });
      } else if (branchName.trim().length < 6) {
        validationErrors.push({
          field: "branchName",
          message: "branchName must be at least 6 characters long",
        });
      }

      if (!description || typeof description !== "string") {
        validationErrors.push({
          field: "description",
          message: "description must be a string",
        });
      } else if (description.trim().length < 10) {
        validationErrors.push({
          field: "description",
          message: "description must be at least 10 characters long",
        });
      }

      if (!contactInfo || typeof contactInfo !== "object") {
        validationErrors.push({
          field: "contactInfo",
          message: "contactInfo must be an object",
        });
      } else {
        if (
          !contactInfo.mobileNumber ||
          typeof contactInfo.mobileNumber !== "string"
        ) {
          validationErrors.push({
            field: "contactInfo.mobileNumber",
            message: "contactInfo.mobileNumber must be a string",
          });
        }

        if (
          contactInfo.phoneNumber &&
          typeof contactInfo.phoneNumber !== "string"
        ) {
          validationErrors.push({
            field: "contactInfo.phoneNumber",
            message: "contactInfo.phoneNumber must be a string",
          });
        }

        if (contactInfo.email && typeof contactInfo.email !== "string") {
          validationErrors.push({
            field: "contactInfo.email",
            message: "contactInfo.email must be a string",
          });
        }

        if (contactInfo.website && typeof contactInfo.website !== "string") {
          validationErrors.push({
            field: "contactInfo.website",
            message: "contactInfo.website must be a string",
          });
        }
      }

      if (!locality || typeof locality !== "string") {
        validationErrors.push({
          field: "locality",
          message: "locality must be a string",
        });
      } else if (locality.trim().length < 1) {
        validationErrors.push({
          field: "locality",
          message: "locality must be at least 1 character long",
        });
      }

      if (!images || !Array.isArray(images)) {
        validationErrors.push({
          field: "images",
          message: "images must be an array",
        });
      } else if (images.length < 1) {
        validationErrors.push({
          field: "images",
          message: "images must not be empty",
        });
      } else if (
        !images[0].secure_url ||
        images[0].secure_url.trim().length < 1
      ) {
        validationErrors.push({
          field: "images[0].secure_url",
          message: "images[0].secure_url must not be empty",
        });
      }

      if (!facilities || !Array.isArray(facilities)) {
        validationErrors.push({
          field: "facilities",
          message: "facilities must be an array",
        });
      }

      if (!services || !Array.isArray(services)) {
        validationErrors.push({
          field: "services",
          message: "services must be an array",
        });
      }

      if (!amenities || !Array.isArray(amenities)) {
        validationErrors.push({
          field: "amenities",
          message: "amenities must be an array",
        });
      }

      if (!tags || !Array.isArray(tags)) {
        validationErrors.push({
          field: "tags",
          message: "tags must be an array",
        });
      }

      if (!priceRange || typeof priceRange !== "string") {
        validationErrors.push({
          field: "priceRange",
          message: "priceRange must be a string",
        });
      } else if (
        !["budget", "mid-range", "luxury", "ultra-luxury", "any"].includes(
          priceRange
        )
      ) {
        validationErrors.push({
          field: "priceRange",
          message:
            "priceRange must be one of the following: budget, mid-range, luxury, ultra-luxury, any",
        });
      }

      if (typeof pricePerNight !== "number" || pricePerNight < 0) {
        validationErrors.push({
          field: "price",
          message: "price must be a number greater than 0",
        });
      }

      if (
        currency &&
        typeof currency !== "string" &&
        [
          "USD",
          "EUR",
          "INR",
          "GBP",
          "JPY",
          "AUD",
          "CAD",
          "CHF",
          "CNY",
          "SEK",
          "NZD",
        ].includes(currency)
      ) {
        validationErrors.push({
          field: "currency",
          message: "currency must be a string",
        });
      }

      if (validationErrors.length > 0) {
        return res.status(401).send({
          status: "Error",
          message: "Invalid input data",
          errors: validationErrors,
        });
      }

      const hotel = await Hotels.findById({ _id: hotelId, deletedAt: null });
      if (!hotel) {
        return res.status(404).json({
          status: "Error",
          message: "Hotel not found",
          error: "Hotel id given is not valid",
        });
      }

      const hotelSlug = hotel.slugName;
      const slug =
        branchName
          .trim()
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-") +
        "-" +
        locality +
        "-" +
        contactInfo.email +
        "-" +
        contactInfo.phoneNumber +
        hotelSlug;

      const hotelBranchExists = await HotelBranch.findOne({
        slugName: slug,
      });
      if (hotelBranchExists) {
        return res
          .status(400)
          .json({ status: "Error", error: "Hotel Branch already exists." });
      }

      const hotelBranch = new HotelBranch({
        parentHotel: hotelId,
        locality,
        contactInfo,
        branchName,
        description,
        contactInfo,
        facilities,
        services,
        amenities,
        tags,
        priceRange,
        pricePerNight,
        currency,
        images,
        slugName: slug,
        hotelId,
        userId,
        createdByUser: req.user._id,
        status: "pending",
      });

      const data = await hotelBranch.save();

      if (!data) {
        return res.status(500).json({
          status: "Error",
          message: "Error creating hotel branch",
          error: "Internal server error",
        });
      }

      const updatedHotel = await Hotels.findByIdAndUpdate(
        hotelId,
        {
          $push: { branches: data._id },
        },
        { new: true }
      ).populate("branches");

      if (!updatedHotel) {
        return res.status(500).json({
          status: "Error",
          message: "Error creating hotel branch",
          error: "Error adding branch to hotel",
        });
      }

      res.status(202).send({
        status: "OK",
        message: "Hotel branch created successfully",
        hotelBranch: data,
        updatedParentHotel: updatedHotel,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: " Cannot create hotel branch",
        error: error.message,
      });
    }
  } else {
    return res.status(401).send({
      status: "Error",
      message: "You need to be a moderator or Owner to perform this action",
      error: "Unauthorized role action attempted",
    });
  }
});

export const getAllHotelBranchForHotel = asyncHandler(async (req, res) => {
  const hotelId = req.query.hotel;
  const userId = req.user._id;

  if (userId.equals(req.query.user) === false)
    return res.status(401).send("Unauthorized");

  if (
    req.user.role === "MODERATOR" ||
    req.user.role === "OWNER" ||
    req.user.role === "STAFF"
  ) {
    if (req.user.role !== "OWNER") {
      switch (req.user.role) {
        case "MODERATOR":
          const VendorByModerator = await Vendor.findById({
            assignedModerators: userId,
            deletedAt: null,
          });
          req.user = VendorByModerator;
          break;
        case "STAFF":
          const VendorByStaff = await Vendor.findById({
            assignedStaffs: userId,
            deletedAt: null,
          });
          req.user = VendorByStaff;
          break;
        default:
          break;
      }
    }
    try {
      // const hotel = await Hotels.findById({
      //   _id: hotelId,
      //   createdBy: req.user._id,
      //   deletedAt: null,
      // });
      // if (!hotel) {
      //   return res.status(404).json({
      //     status: "Error",
      //     message: "Hotel not found",
      //     error: "Hotel id given is not valid",
      //   });
      // }

      const hotelBranches = await HotelBranch.find({
        parentHotel: hotelId,
        deletedAt: null,
      });
      if (!hotelBranches) {
        return res.status(404).json({
          status: "Error",
          message: "Hotel branches not found",
          error: "Hotel branches not found",
        });
      }

      res.status(200).send({
        status: "OK",
        message: "Hotel branches fetched successfully",
        hotelBranches: hotelBranches,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: "Cannot fetch hotel branches",
        error: error.message,
      });
    }
  } else {
    return res.status(401).send({
      status: "Error",
      message: "You can't access this route",
      error: "Unauthorized role action attempted",
    });
  }
});

export const updateHotelBranch = asyncHandler(async (req, res) => {
  const branchId = req.query.branch;
  const hotelId = req.query.hotel;
  const userId = req.user._id;

  console.log(req.user);
  const {
    branchName,
    description,
    contactInfo,
    images,
    reviews,
    locality,
    facilities,
    services,
    amenities,
    tags,
    priceRange,
    pricePerNight,
    currency,
  } = req.body;
  if (userId.equals(req.query.user) === false)
    return res.status(401).send("Unauthorized");

  if (req.user.role === "MODERATOR" || req.user.role === "OWNER") {
    try {
      const validationErrors = [];
      if (!branchName || typeof branchName !== "string") {
        validationErrors.push({
          field: "branchName",
          message: "branchName must be a string",
        });
      } else if (branchName.trim().length < 6) {
        validationErrors.push({
          field: "branchName",
          message: "branchName must be at least 6 characters long",
        });
      }

      if (!description || typeof description !== "string") {
        validationErrors.push({
          field: "description",
          message: "description must be a string",
        });
      } else if (description.trim().length < 10) {
        validationErrors.push({
          field: "description",
          message: "description must be at least 10 characters long",
        });
      }

      if (!contactInfo || typeof contactInfo !== "object") {
        validationErrors.push({
          field: "contactInfo",
          message: "contactInfo must be an object",
        });
      } else {
        if (
          !contactInfo.mobileNumber ||
          typeof contactInfo.mobileNumber !== "string"
        ) {
          validationErrors.push({
            field: "contactInfo.mobileNumber",
            message: "contactInfo.mobileNumber must be a string",
          });
        }

        if (
          contactInfo.phoneNumber &&
          typeof contactInfo.phoneNumber !== "string"
        ) {
          validationErrors.push({
            field: "contactInfo.phoneNumber",
            message: "contactInfo.phoneNumber must be a string",
          });
        }

        if (contactInfo.email && typeof contactInfo.email !== "string") {
          validationErrors.push({
            field: "contactInfo.email",
            message: "contactInfo.email must be a string",
          });
        }

        if (contactInfo.website && typeof contactInfo.website !== "string") {
          validationErrors.push({
            field: "contactInfo.website",
            message: "contactInfo.website must be a string",
          });
        }
      }

      if (!locality || typeof locality !== "string") {
        validationErrors.push({
          field: "locality",
          message: "locality must be a string",
        });
      } else if (locality.trim().length < 1) {
        validationErrors.push({
          field: "locality",
          message: "locality must be at least 1 character long",
        });
      }

      if (!images || !Array.isArray(images)) {
        validationErrors.push({
          field: "images",
          message: "images must be an array",
        });
      } else if (images.length < 1) {
        validationErrors.push({
          field: "images",
          message: "images must not be empty",
        });
      } else if (
        !images[0].secure_url ||
        images[0].secure_url.trim().length < 1
      ) {
        validationErrors.push({
          field: "images[0].secure_url",
          message: "images[0].secure_url must not be empty",
        });
      }

      if (!facilities || !Array.isArray(facilities)) {
        validationErrors.push({
          field: "facilities",
          message: "facilities must be an array",
        });
      }

      if (!services || !Array.isArray(services)) {
        validationErrors.push({
          field: "services",
          message: "services must be an array",
        });
      }

      if (!amenities || !Array.isArray(amenities)) {
        validationErrors.push({
          field: "amenities",
          message: "amenities must be an array",
        });
      }

      if (!tags || !Array.isArray(tags)) {
        validationErrors.push({
          field: "tags",
          message: "tags must be an array",
        });
      }

      if (!priceRange || typeof priceRange !== "string") {
        validationErrors.push({
          field: "priceRange",
          message: "priceRange must be a string",
        });
      } else if (
        !["budget", "mid-range", "luxury", "ultra-luxury", "any"].includes(
          priceRange
        )
      ) {
        validationErrors.push({
          field: "priceRange",
          message:
            "priceRange must be one of the following: budget, mid-range, luxury, ultra-luxury, any",
        });
      }

      if (typeof pricePerNight !== "number" || pricePerNight < 0) {
        validationErrors.push({
          field: "price",
          message: "price must be a number greater than 0",
        });
      }

      if (
        currency &&
        typeof currency !== "string" &&
        [
          "USD",
          "EUR",
          "INR",
          "GBP",
          "JPY",
          "AUD",
          "CAD",
          "CHF",
          "CNY",
          "SEK",
          "NZD",
        ].includes(currency)
      ) {
        validationErrors.push({
          field: "currency",
          message: "currency must be a string",
        });
      }

      if (validationErrors.length > 0) {
        return res.status(401).send({
          status: "Error",
          message: "Invalid input data",
          errors: validationErrors,
        });
      }

      const hotel = await Hotels.findById({ _id: hotelId, deletedAt: null });
      if (!hotel) {
        return res.status(404).json({
          status: "Error",
          message: "Hotel not found",
          error: "Hotel id given is not valid",
        });
      }

      // TODO: need to make unique slugName here using some package.
      const hotelSlug = hotel.slugName;
      const slugName =
        branchName
          .trim()
          .replace(/[^\w ]+/g, "")
          .replace(/ +/g, "-") +
        "-" +
        locality +
        "-" +
        contactInfo.email +
        "-" +
        contactInfo.phoneNumber +
        hotelSlug;

      // check if branch with same slug already exists, if yes the update will fail
      const branchExists = await HotelBranch.findOne({ slugName });
      if (branchExists) {
        return res.status(400).json({
          status: "Error",
          message: "Hmm!, seems like you haven't changed anything.",
          error: "Branch data already same.",
        });
      }

      let updateBody = {
        branchName,
        description,
        contactInfo,
        reviews,
        slugName,
        locality,
        images,
        facilities,
        services,
        amenities,
        tags,
        priceRange,
        pricePerNight,
        currency,
        updatedByUser: req.user._id,
      };
      const updatedBranch = await HotelBranch.findByIdAndUpdate(
        { _id: branchId },
        { $set: updateBody },
        { new: true }
      );
      if (!updatedBranch) {
        return res.status(404).json({
          status: "Error",
          message: "Hotel branch not found",
          error: "Internal server error",
        });
      }
      res.status(200).send({
        status: "OK",
        message: "Hotel branch updated successfully",
        updatedBranch: updatedBranch,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: "Cannot update hotel branch",
        error: error.message,
      });
    }
  } else {
    return res.status(401).send({
      status: "Error",
      message: "You need to be a moderator or Owner to perform this action",
      error: "Unauthorized role action attempted",
    });
  }
});
