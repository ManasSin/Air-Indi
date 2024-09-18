import express from "express";
import mongoose from "mongoose";
import Hotels from "../../Modal/Hotels/HotelsSchema.js";
import HotelAddress from "../../Modal/Hotels/HotelAddressSchema.js";
import { asyncHandler } from "../../Service/asyncHandler.js";

// ? create
export const createHotel = asyncHandler(async (req, res) => {
  const userID = req.user._id;
  const {
    publicInfo,
    category,
    description,
    images,
    location,
    price,
    priceRange,
    amenities,
    services,
    tags,
  } = req.body;

  if (userID.equals(req.query.user) === false)
    return res.status(401).send("Unauthorized");

  if (req.query.user.role === "MODERATOR" || req.query.user.role === "OWNER") {
    // if the user.role === "OWNER" then change the req.user to the vendor user
    // if(req.query.user.role === "OWNER"){
    //   userID = req.query.user._id;
    // }

    try {
      if (
        !publicInfo ||
        typeof publicInfo !== "object" ||
        !publicInfo.title ||
        typeof publicInfo.title !== "string" ||
        publicInfo.title.trim().length < 6 ||
        !publicInfo.address ||
        typeof publicInfo.address !== "string" ||
        publicInfo.address.trim().length < 1 ||
        !publicInfo.nearBy ||
        typeof publicInfo.nearBy !== "string" ||
        publicInfo.nearBy.trim().length < 1 ||
        // !address ||
        // typeof address !== "string" ||
        // address.trim().length < 1 ||
        !price ||
        typeof price !== "number" ||
        price < 0 ||
        !description ||
        typeof description !== "string" ||
        description.trim().length < 10 ||
        !images ||
        !Array.isArray(images) ||
        images.length < 1 ||
        !location ||
        typeof location !== "object" ||
        !location.type ||
        location.type !== "Point" ||
        !location.coordinates ||
        !Array.isArray(location.coordinates) ||
        location.coordinates.length !== 2 ||
        !services ||
        !Array.isArray(services) ||
        services.length < 1 ||
        !amenities ||
        !Array.isArray(amenities) ||
        amenities.length < 1 ||
        !priceRange ||
        typeof priceRange !== "string" ||
        !["budget", "mid-range", "luxury", "ultra-luxury", "any"].includes(
          priceRange
        ) ||
        !tags ||
        !Array.isArray(tags) ||
        tags.length < 1
      ) {
        return res
          .status(401)
          .send("The fields are not valid. Please check and try again.");
      }

      const titleSlug = publicInfo.title
        .trim()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
      const locationStr = `${location.coordinates[0]}-${location.coordinates[1]}`;
      const Slug = `${titleSlug}-${locationStr}-${req.query.user?.slice(18)}`;

      const hotelExists = await Hotels.findOne({ slugName: Slug });
      if (hotelExists) {
        return res
          .status(400)
          .json({ status: "Error", error: "Hotel already exists." });
      }

      const hotel = new Hotels({
        publicInfo,
        location,
        category,
        description,
        images,
        price,
        priceRange,
        amenities,
        services,
        tags,
        slugName: Slug,
        createdByUser: req.user._id,
      });
      const data = await hotel.save();
      res.status(201).send({
        status: "OK",
        message: "Hotel created successfully",
        hotel: data,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status: "Error", message: "Server error", error: err.message });
    }
  } else {
    return res.status(401).send({
      status: "Error",
      message:
        "Please register yourself as a moderator or an owner to create a hotel",
      error: "USER or Others trying to create a hotel",
    });
  }
});

// ? get
// this route can be used in many ways,
// - to get all data without passing query or body
// - to get hotels information by array of ids
// - to get hotel information by single id in the query params
export const getHotels = asyncHandler(async (req, res) => {
  const id = req.query.id;

  if (id) {
    try {
      const hotel = await Hotels.findById(id).populate([
        { path: "branches", strictPopulate: false },
        { path: "createdByUser" },
        // { path: "reviews", strictPopulate: false },
        { path: "address", strictPopulate: false },
      ]);
      return res
        .status(200)
        .send({ status: "OK", message: "Hotel found", hotel: hotel });
    } catch {
      return res.status(404).json({
        status: "Error",
        message: "Hotel not found",
        error: "Hotel not found.",
      });
    }
  } else if (req.body.idList && Array.isArray(req.body.idList)) {
    // console.log(req.body.idList);

    const ids = Array.isArray(req.body.idList)
      ? req.body.idList.map((id) => new mongoose.Types.ObjectId(String(id)))
      : [new mongoose.Types.ObjectId(String(req.body.idList))];

    const hotels = await Hotels.find({ _id: { $in: ids } })
      .populate([{ path: "createdByUser" }, { path: "branches" }])
      .lean();

    if (hotels.length === 0)
      return res.status(404).send({
        status: "Error",
        error: `Hotels not found for these ids ${ids.join(", ")}.`,
      });
    return res.status(200).send({ status: "OK", hotels: hotels });
  } else {
    try {
      const hotels = await Hotels.find();
      res.status(200).send({ status: "OK", hotels: hotels });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "Error", error: "Server error." });
    }
  }
});

// ? get by ids (experimental)
export const getHotelsByIds = asyncHandler(async (req, res) => {
  if (!req.query.idList.isArray())
    return res.status(400).json({ error: "Bad request" });

  try {
    const ids = req.body.idList.isArray() ? req.body.idList : [req.body.idList];

    const hotels = await Hotels.find({ _id: { $in: ids } });
    // const hotel = await Hotels.findById(id);

    res.status(200).send({ status: "OK", hotels: hotels });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Error", error: "Server error." });
  }
});

// ? get by user
export const listHotelsByUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    if (!userId) return res.status(401).json({ error: "Please log in" });

    const hotels = await Hotels.find({ createdByUser: userId }).populate({
      path: "address",
      options: { strictPopulate: false },
    });
    res.status(200).send({ status: "OK", hotels: hotels });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Error", error: "Server error." });
  }
});

// ? list public data about hotels for non logged in users
// TODO:  in future send this data according to user location and radius
export const listPublicHotels = asyncHandler(async (req, res) => {
  const user = req.query.userId;

  if (user) {
    try {
      const hotels = await Hotels.find({ createdByUser: user }).populate({
        path: "address",
        options: { strictPopulate: false },
      });

      const dataToSend = hotels.map((hotel) => {
        return {
          _id: hotel._id,
          name: hotel.name,
          publicInfo: hotel.publicInfo,
          rating: hotel.rating || 0,
          price: hotel.price,
        };
      });

      res.status(200).send({
        status: "OK",
        message: `user has ${hotels.length} number of hotels`,
        hotels: dataToSend,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "Error",
        message: "Can't fetch hotels",
        error: "Server error.",
      });
    }
  } else if (req.query.idList && Array.isArray(req.query.idList)) {
    const ids = Array.isArray(req.query.idList)
      ? req.query.idList
      : [req.query.idList];

    const hotels = await Hotels.find({ _id: { $in: ids } })
      .populate([{ path: "createdByUser" }, { path: "branches" }])
      .lean();

    if (hotels.length === 0)
      return res.status(404).send({
        status: "Error",
        error: `Hotels not found for these ids ${ids.join(", ")}.`,
      });
    return res.status(200).send({
      status: "OK",
      message: `${hotels.length} number of hotels found`,
      hotels: hotels,
    });
  } else if (req.query.hotelId) {
    const hotel = await Hotels.findById(req.query.hotelId);

    if (!hotel) {
      return res.status(404).json({
        status: "Error",
        message: "Hotel not found",
        error: "Hotel id given is not valid",
      });
    }

    res.status(200).send({
      status: "OK",
      message: `user has ${hotel.length} number of hotels`,
      hotels: hotel,
    });
  } else {
    const hotels = await Hotels.find().populate({
      path: "address",
      options: { strictPopulate: false },
    });
    const dataToSend = hotels.map((hotel) => {
      return {
        _id: hotel._id,
        name: hotel.name,
        publicInfo: hotel.publicInfo,
        rating: hotel.rating || 0,
        price: hotel.price,
      };
    });

    res.status(200).send({
      status: "OK",
      message: `${hotels.length} number of hotels found`,
      hotels: dataToSend,
    });
  }
});

// ? update
export const updateHotel = asyncHandler(async (req, res) => {
  const userID = req.user._id;
  const {
    publicInfo,
    location,
    category,
    address,
    description,
    images,
    price,
    rating,
    priceRange,
    amenities,
    services,
    tags,
  } = req.body;
  const hotelId = req.query.hotel;

  if (userID.equals(req.query.user) === false)
    return res.status(401).json({
      status: "Error",
      message: "Unauthorized",
      error: "Unauthorized",
    });

  if (req.query.user.role === "MODERATOR" || req.query.user.role === "OWNER") {
    try {
      if (!hotelId)
        return res.status(400).json({
          status: "Error",
          message: "hotel Id is required",
          error: "hotel id not found",
        });

      // validate the request body fields according to the types of the model
      if (
        !publicInfo ||
        typeof publicInfo !== "object" ||
        !publicInfo.title ||
        typeof publicInfo.title !== "string" ||
        publicInfo.title.trim().length < 6 ||
        !publicInfo.address ||
        typeof publicInfo.address !== "string" ||
        publicInfo.address.trim().length < 1 ||
        !publicInfo.nearBy ||
        typeof publicInfo.nearBy !== "string" ||
        publicInfo.nearBy.trim().length < 1 ||
        // !address ||
        // typeof address !== "string" ||
        // address.trim().length < 1 ||
        !price ||
        typeof price !== "number" ||
        price < 0 ||
        !description ||
        typeof description !== "string" ||
        description.trim().length < 10 ||
        !images ||
        !Array.isArray(images) ||
        images.length < 1 ||
        !location ||
        typeof location !== "object" ||
        !location.type ||
        location.type !== "Point" ||
        !location.coordinates ||
        !Array.isArray(location.coordinates) ||
        location.coordinates.length !== 2 ||
        !services ||
        !Array.isArray(services) ||
        services.length < 1 ||
        !amenities ||
        !Array.isArray(amenities) ||
        amenities.length < 1 ||
        !priceRange ||
        typeof priceRange !== "string" ||
        !["budget", "mid-range", "luxury", "ultra-luxury", "any"].includes(
          priceRange
        ) ||
        !tags ||
        !Array.isArray(tags) ||
        tags.length < 1
      ) {
        return res
          .status(401)
          .send("The fields are not valid. Please check and try again.");
      }

      const titleSlug = publicInfo.title
        .trim()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
      const locationStr = `${location.coordinates[0]}-${location.coordinates[1]}`;
      const Slug = `${titleSlug}-${locationStr}-${req.query.user?.slice(18)}`;

      const hotelExists = await Hotels.findOne({ slugName: Slug });
      if (hotelExists) {
        return res
          .status(400)
          .json({ status: "Error", error: "Hotel already exists." });
      }

      // TODO: write a better validation check, this is not good

      // get the addresses for this hotel, using the hotel id and user id as filters from the HotelAddress model,
      const hotelAddresses = await HotelAddress.find({
        hotel: hotelId,
        createdByUser: userID,
      });

      const addressIds = hotelAddresses.map((address) =>
        address._id.toString()
      );

      const updateObj = {
        publicInfo: publicInfo,
        location: location,
        category: category,
        address: hotelAddresses ? addressIds : null,
        description: description,
        images: images,
        price: price,
        priceRange: priceRange,
        amenities: amenities,
        services: services,
        tags: tags,
        slugName: Slug,
      };

      const filter = { _id: hotelId, createdByUser: userID };
      const options = { new: true };

      const updatedHotel = await Hotels.findOneAndUpdate(
        filter,
        { $set: updateObj },
        options
      );
      if (!updatedHotel) {
        return res.status(404).json({
          status: "Error",
          message: "Could not update",
          error: "Hotel not found.",
        });
      }
      res.status(200).send({
        status: "OK",
        message: "Hotel updated successfully",
        hotel: updatedHotel,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status: "Error", message: "Server error", error: err.message });
    }
  } else {
    return res.status(401).send({
      status: "Error",
      message:
        "Seams like you are not allowed to perform this action. Please contact support",
      error: "USER or Others trying to update a hotel",
    });
  }
});

// ? delete
export const deleteHotel = asyncHandler(async (req, res) => {
  const userID = req.user._id;

  if (userID.equals(req.query.user) === false)
    return res.status(401).json({
      status: "Error",
      message: "Unauthorized",
      error: "Unauthorized",
    });
  if (!req.body.hotelId) return res.status(400).json({ error: "Bad request" });

  if (req.query.user.role === "MODERATOR" || req.query.user.role === "OWNER") {
    try {
      if (!userID && req.body.userId !== userID)
        return res.status(401).json({ error: "Please log in" });

      const id = req.body.hotelId;
      const updateObj = {
        deletedAt:
          req.body.deletedAt === true
            ? new Date()
            : req.body.deletedAt === false
            ? null
            : "",
      };
      const filter = { _id: id, createdByUser: userID };

      const deletedHotel = await Hotels.find(filter);
      if (!deletedHotel) {
        return res.status(404).json({ error: "Hotel not found." });
      }

      // console.log("deletedHotel", deletedHotel);

      await Hotels.findOneAndUpdate(filter, updateObj, { new: false });
      res
        .status(200)
        .json({ status: "OK", message: "Hotel date updated successfully." });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status: "Error", message: "Server Error", error: err.message });
    }
  } else {
    return res.status(401).send({
      status: "Error",
      message:
        "Seams like you are not allowed to perform this action. Please contact support",
      error: "USER or Others trying to update a hotel",
    });
  }
});
