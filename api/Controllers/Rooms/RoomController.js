import mongoose from "mongoose";
import express from "express";
import { asyncHandler } from "../../Service/asyncHandler.js";
import Room from "../../Modal/Rooms/RoomSchema.js";
import Hotel from "../../Modal/Hotels/HotelsSchema.js";
import HotelBranch from "../../Modal/Hotels/HotelBranchSchema.js";

// create a new room
export const createRoom = asyncHandler(async (req, res) => {
  const {
    roomNumber,
    roomType,
    bedType,
    bedCount,
    floorNumber,
    roomSize,
    roomView,
    amenities,
    price,
    currency,
    images,
    description,
  } = req.body;

  const userID = req.user._id;
  const { userId: user, hotelBranchId } = req.query;

  const validationErrors = [];

  if (userID.equals(user) === false) {
    return res.status(401).json({
      status: "Error",
      message: "Unauthorized",
      error: "Unauthorized",
    });
  }

  if (
    req.user.role === "STAFF" ||
    req.user.role === "OWNER" ||
    req.user.role === "MANAGER"
  ) {
    try {
      // validate the request body fields according to the types of the model
      if (!roomNumber) {
        validationErrors.push({
          field: "roomNumber",
          message: "room number is required",
        });
      } else if (!typeof roomNumber === Number) {
        validationErrors.push({
          field: "roomNumber",
          message: "room number must be a number",
        });
      }

      if (!roomType) {
        validationErrors.push({
          field: "roomType",
          message: "room type is required",
        });
      } else if (
        Array.isArray(roomType) === false ||
        roomType.length === 0 ||
        roomType.some((rt) => {
          return (
            [
              "single",
              "double",
              "twin",
              "suite",
              "studio",
              "family",
              "king",
              "queen",
              "deluxe",
              "executive",
              "presidential",
              "other",
            ].includes(rt) === false
          );
        })
      ) {
        validationErrors.push({
          field: "roomType",
          message:
            "room type must be one of the following: single, double, twin, suite, studio, family, king, queen, deluxe, executive, presidential, other",
        });
      }

      if (!bedType) {
        validationErrors.push({
          field: "bedType",
          message: "bed type is required",
        });
      } else if (
        Array.isArray(bedType) === false ||
        bedType.length === 0 ||
        bedType.some((bt) => {
          return (
            [
              "single",
              "double",
              "twin",
              "king",
              "queen",
              "sofa",
              "murphy",
              "bunk",
              "other",
            ].includes(bt) === false
          );
        })
      ) {
        validationErrors.push({
          field: "bedType",
          message:
            "bed type must be one of the following: single, double, twin, queen, king, california king, eastern king, murphy, sofa bed, bunk bed, other",
        });
      }

      if (!bedCount) {
        validationErrors.push({
          field: "bedCount",
          message: "bed count is required",
        });
      } else if (!typeof bedCount === Number) {
        validationErrors.push({
          field: "bedCount",
          message: "bed count must be a number",
        });
      }

      if (!floorNumber) {
        validationErrors.push({
          field: "floorNumber",
          message: "floor number is required",
        });
      } else if (!typeof floorNumber === Number) {
        validationErrors.push({
          field: "floorNumber",
          message: "floor number must be a number",
        });
      }

      if (!roomSize) {
        validationErrors.push({
          field: "roomSize",
          message: "room size is required",
        });
      } else if (!typeof roomSize === Number) {
        validationErrors.push({
          field: "roomSize",
          message: "room size must be a number",
        });
      }

      if (!roomView) {
        validationErrors.push({
          field: "roomView",
          message: "room view is required",
        });
      } else if (
        Array.isArray(roomView) === false ||
        roomView.some((rv) => {
          return (
            [
              "sea",
              "mountain",
              "city",
              "lake",
              "forest",
              "beach",
              "other",
            ].includes(rv) === false
          );
        })
      ) {
        validationErrors.push({
          field: "roomView",
          message:
            "room view must be one of the following: sea, mountain, city, lake, forest, beach, other",
        });
      }

      if (
        !amenities ||
        !Array.isArray(amenities) ||
        amenities.some((a) => {
          return (
            [
              "airConditioning",
              "heating",
              "tv",
              "cable",
              "satellite",
              "freeWiFi",
              "coffeeMaker",
              "miniBar",
              "inRoomDining",
              "hairDryer",
              "iron",
              "ironingBoard",
              "safe",
              "workDesk",
              "bathrobe",
              "slippers",
              "toiletries",
              "kitchen",
              "kitchenette",
              "toaster",
              "oven",
              "microwave",
              "refrigerator",
              "other",
            ].includes(a) === false
          );
        })
      ) {
        validationErrors.push({
          field: "amenities",
          message:
            "amenities must includes the following: airConditioning, heating, tv, cable, satellite, freeWiFi, coffeeMaker, miniBar, inRoomDining, hairDryer, iron, ironingBoard, safe, workDesk, bathrobe, slippers, toiletries, kitchen, kitchenette, toaster, oven, microwave, refrigerator, other",
        });
      }

      // console.log(
      //   amenities.some((a) =>
      //     ["airConditioning", "heating", "tv", "cable"].includes(a)
      //   )
      // );

      if (!price) {
        validationErrors.push({
          field: "price",
          message: "price is required",
        });
      } else if (!typeof price === Number) {
        validationErrors.push({
          field: "price",
          message: "price must be a number",
        });
      }

      if (!currency) {
        validationErrors.push({
          field: "currency",
          message: "currency is required",
        });
      } else if (
        [
          "USD",
          "EUR",
          "GBP",
          "INR",
          "AUD",
          "CAD",
          "CNY",
          "JPY",
          "other",
        ].includes(currency) === false
      ) {
        validationErrors.push({
          field: "currency",
          message:
            "currency must be one of the following: USD, EUR, GBP, INR, AUD, CAD, CNY, JPY, other",
        });
      }

      if (images && !Array.isArray(images)) {
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

      if (description && !typeof description === String) {
        validationErrors.push({
          field: "description",
          message: "description must be a string",
        });
      }

      if (validationErrors.length > 0) {
        return res.status(400).json({
          status: "error",
          errors: validationErrors,
        });
      }

      const hotelBranchWithSameRoomNumber = await Room.findOne({
        roomNumber: roomNumber,
        hotelBranch: hotelBranchId,
      });
      if (hotelBranchWithSameRoomNumber) {
        return res.status(409).json({
          status: "error",
          message: "Room number already exists",
          error: "Room number already exists",
        });
      }

      const newRoom = await Room({
        roomNumber,
        roomType,
        bedType,
        bedCount,
        floorNumber,
        roomSize,
        roomView,
        amenities,
        price,
        currency,
        images,
        description,
        hotelBranch: new mongoose.Types.ObjectId(String(hotelBranchId)),
        createdByUser: new mongoose.Types.ObjectId(String(user)),
      });

      let room;
      let updatedHotelBranch;

      await Promise.all([
        (room = newRoom.save()),
        (updatedHotelBranch = HotelBranch.findByIdAndUpdate(hotelBranchId, {
          $push: { rooms: newRoom._id },
        })),
      ]);

      res.status(201).json({
        status: "OK",
        message: "Room created successfully",
        data: { room, updatedHotelBranch },
      });
    } catch (error) {
      return res.status(500).json({
        status: "Error",
        message: "Something went wrong while creating room",
        error: error.message,
      });
    }
  } else {
    return res.status(401).json({
      status: "Error",
      message: "You are not authorized to create a room",
      error: "user role does not match owner or moderator",
    });
  }
});

// get all rooms
export const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find().populate([
    { path: "hotelBranch", path: "createdByUser" },
  ]);

  res.status(200).json({
    status: "success",
    results: rooms.length,
    data: rooms,
  });
});

// get a single room
export const getRoomById = asyncHandler(async (req, res) => {
  const { roomId, hotelBranchId } = req.query;

  if (!roomId || !hotelBranchId) {
    return res.status(400).json({
      status: "error",
      message: "Room ID or Hotel Branch ID is required",
      error: "IDs not provided",
    });
  }

  try {
    const room = await Room.findById(roomId).populate(
      "hotelBranch",
      null,
      HotelBranch
    );
    if (!room) {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
        error: "Room not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// update a room
export const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!room) {
    return res.status(404).json({
      status: "error",
      message: "Room not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: room,
  });
});

// update room status
export const updateRoomStatus = asyncHandler(async (req, res) => {
  const { roomId, hotelBranchId, status } = req.query;

  if (!roomId || !hotelBranchId) {
    return res.status(400).json({
      status: "error",
      message: "Room ID or Hotel Branch ID is required",
      error: "IDs not provided",
    });
  }

  if (
    ["ACTIVE", "INACTIVE", "HOUSEFUL", "BESTSELLER"].includes(status) === false
  ) {
    return res.status(400).json({
      status: "error",
      message: "Invalid room status",
      error: "Invalid room status",
    });
  }

  if (req.user.role !== "owner" && req.user.role !== "moderator") {
    const room = await Room.findByIdAndUpdate(
      roomId,
      {
        $set: {
          status: status,
        },
      },
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({
        status: "error",
        message: "Room not found",
        error: "Room not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Room status updated successfully",
      data: room,
    });
  }
});

// delete a room
export const deleteRoom = asyncHandler(async (req, res) => {
  const { roomId, hotelBranchId } = req.query;

  if (!roomId || !hotelBranchId) {
    return res.status(400).json({
      status: "error",
      message: "Room ID or Hotel Branch ID is required",
      error: "IDs not provided",
    });
  }
  const room = await Room.findByIdAndUpdate(
    {
      _id: roomId,
      hotelBranch: hotelBranchId,
    },
    {
      $set: {
        isDeleted: true,
      },
    },
    { new: true, runValidators: true }
  );

  if (!room) {
    return res.status(404).json({
      status: "error",
      message: "Room not found",
    });
  }

  res.status(204).json({
    status: "success",
    message: "Room deleted successfully",
    data: {
      deletedRoom: room._id,
    },
  });
});
