import mongoose from "mongoose";
import Hotels from "../Modal/HotelsSchema.js";
import { asyncHandler } from "../Service/asyncHandler.js";

// ? create
export const createHotel = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    address,
    description,
    images,
    location,
    price,
    priceRange,
    amenities,
    services,
    rating,
    tags,
  } = req.body;
  try {
    if (
      !title ||
      typeof title !== "string" ||
      title.trim().length < 6 ||
      !address ||
      typeof address !== "string" ||
      address.trim().length < 1 ||
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
      !rating ||
      typeof rating !== "number" ||
      rating < 0 ||
      rating > 5 ||
      !tags ||
      !Array.isArray(tags) ||
      tags.length < 1
    ) {
      return res
        .status(401)
        .send("The fields are not valid. Please check and try again.");
    }

    const titleSlug = title
      .trim()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
    const locationStr = `${location.coordinates[0]}-${location.coordinates[1]}`;
    const addressStr = address.replace(/[^\w ]+/g, "").replace(/ +/g, "-");
    const Slug = `${titleSlug}-${locationStr}-${addressStr}`;

    const hotelExists = await Hotels.findOne({ slugName: Slug });
    if (hotelExists) {
      return res
        .status(400)
        .json({ status: "Error", error: "Hotel already exists." });
    }

    const hotel = new Hotels({
      title,
      location,
      category,
      address,
      description,
      images,
      price,
      rating: rating,
      priceRange,
      amenities,
      services,
      tags,
      slugName: Slug,
      createdByUser: req.user._id,
    });
    const data = await hotel.save();
    res.status(201).send({ status: "OK", data: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Error", error: "Server error." });
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
      const hotel = await Hotels.findById(id);
      return res.status(200).send({ status: "OK", hotel: hotel });
    } catch {
      return res
        .status(404)
        .json({ status: "Error", error: "Hotel not found." });
    }
  } else if (req.body.idList && Array.isArray(req.body.idList)) {
    // console.log(req.body.idList);

    const ids = Array.isArray(req.body.idList)
      ? req.body.idList.map((id) => new mongoose.Types.ObjectId(String(id)))
      : [new mongoose.Types.ObjectId(String(req.body.idList))];

    const hotels = await Hotels.find({ _id: { $in: ids } });

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

    const hotels = await Hotels.find({ createdByUser: userId });
    res.status(200).send({ status: "OK", hotels: hotels });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Error", error: "Server error." });
  }
});

// ? update
export const updateHotel = asyncHandler(async (req, res) => {
  const userID = req.user._id;

  try {
    if (!req.body.hotelId)
      return res.status(400).json({ error: "Bad request" });

    if (!userID && req.body.userId !== userID)
      return res.status(401).json({ error: "Please log in" });

    const id = req.body.hotelId;
    const updateObj = {
      title: req.body.title,
      location: req.body.location,
      category: req.body.category,
      address: req.body.address,
      description: req.body.description,
      images: req.body.images,
      price: req.body.price,
      rating: req.body.rating,
      priceRange: req.body.priceRange,
      amenities: req.body.amenities,
      services: req.body.services,
      tags: req.body.tags,
      slugName: req.body.slugName,
    };
    const filter = { _id: id, createdByUser: userID };
    const options = { new: true };

    const updatedHotel = await Hotels.findOneAndUpdate(
      filter,
      updateObj,
      options
    );
    if (!updatedHotel) {
      return res.status(404).json({ error: "Hotel not found." });
    }
    res.status(200).send({ status: "OK", data: updatedHotel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// ? delete
export const deleteHotel = asyncHandler(async (req, res) => {
  const userID = req.user._id;

  try {
    if (!req.body.hotelId)
      return res.status(400).json({ error: "Bad request" });

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
    res.status(500).json({ status: "Error", error: "Server error." });
  }
});
