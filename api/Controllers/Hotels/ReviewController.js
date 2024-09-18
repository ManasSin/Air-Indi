import { asyncHandler } from "../../Service/asyncHandler.js";
import Review from "../../Modal/Hotels/ReviewSchema.js";
import Booking from "../../Modal/Hotels/BookingSchema.js";
import User from "../../Modal/User/UserSchema.js";
import Hotels from "../../Modal/Hotels/HotelsSchema.js";
import HotelBranch from "../../Modal/Hotels/HotelBranchSchema.js";
import { populate } from "dotenv";

export const createReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { hotelBranchId, bookingId } = req.query;

  const { review, rating, image } = req.body;

  const validationErrors = [];
  if (!review || typeof review !== "string") {
    validationErrors.push({
      field: "review",
      message: "review must be a string",
    });
  }
  if (!rating || typeof rating !== "number") {
    validationErrors.push({
      field: "rating",
      message: "rating must be a number",
    });
  }
  if (!image || !Array.isArray(image)) {
    validationErrors.push({
      field: "image",
      message: "image must be an array",
    });
  } else if (image.length < 1) {
    validationErrors.push({
      field: "image",
      message: "image must not be empty",
    });
  } else if (!image[0].secure_url || image[0].secure_url.trim().length < 1) {
    validationErrors.push({
      field: "image[0].secure_url",
      message: "image[0].secure_url must not be empty",
    });
  }

  if (validationErrors.length > 0) {
    return res.status(400).json({ status: "Error", message: validationErrors });
  }

  if (userId.equals(req.query.user) === false) {
    return res.status(401).json({ status: "Error", message: "Unauthorized" });
  }

  // check if the booking exists
  const booking = await Booking.findOne({ _id: bookingId }).lean(true);
  if (!booking) {
    return res.status(404).json({
      status: "Error",
      message: "Booking not found",
      error: "booking Id given does not exist",
    });
  }

  const slugName = `${bookingId?.toString().slice(18)}-${userId
    ?.toString()
    .slice(18)}-${
    booking && booking?.createdAt?.toString().slice(0, 10)
  }-${new Date().toJSON().slice(0, 10)}`.toLowerCase();

  const existingSlugName = await Review.findOne({
    user: userId,
    slugName: slugName,
  });
  if (existingSlugName) {
    return res.status(409).json({
      status: "Error",
      message: "You cannot review this booking again",
      error: "review already reviewed on this date",
    });
  }

  /*
    //   TODO: make a slugName for this review using booking id, user id and hotel id
    //   TODO: User should not be able to put review for Bookings/Stay more then once. compare them with booking id, hotel id, user id and date
    */

  let reviewBody = {
    user: userId,
    hotelBranch: hotelBranchId,
    bookingDetails: bookingId,
    review: review,
    slugName: slugName,
    rating: rating,
    images: image,
  };

  const create = await Review.create(reviewBody);

  if (!create) {
    return res.status(500).json({
      status: "Error",
      message: "Count not create review",
      error: "Something went wrong while creating review",
    });
  }

  try {
    await Promise.all([
      await HotelBranch.findOneAndUpdate(
        { _id: booking?.hotelBranch },
        { $inc: { reviewCount: 1 }, $push: { reviews: create._id } }
      ),
      // user.updateOne({ $push: { reviews: create._id } }),
    ]);
  } catch (error) {
    // abort the creation of review;
    await Review.deleteOne({ _id: create._id });
    return res.status(500).json({
      status: "Error",
      message: "Something went wrong while updating review to hotel",
      error: error.message,
    });
  }

  res.status(201).json({
    status: "OK",
    message: "Review created successfully",
    review: create,
  });
});

export const getReviewsForHotels = asyncHandler(async (req, res) => {
  if (!req.query.hotelBranchId) {
    return res.status(400).json({
      status: "Error",
      message: "Please provide hotel details",
      error: "hotelId not provided",
    });
  }
  const reviews = await Review.find({
    hotelBranch: req.query.hotelBranchId,
    deletedAt: null,
  })
    .populate("hotelBranch", null, "HotelBranch")
    .populate("user", null, "User");

  if (!reviews) {
    return res.status(400).json({
      status: "Error",
      message: "No reviews",
      error: "No reviews found for this hotel",
    });
  }

  res.status(200).json({
    status: "OK",
    message: "Reviews fetched successfully",
    reviews: reviews,
  });
});

export const getReviewsForUsers = asyncHandler(async (req, res) => {
  const { userId, hotelBranchId } = req.query;

  if (!userId || !hotelBranchId) {
    return res.status(400).json({
      status: "Error",
      message: "Please provide User and hotel details",
      error: "UserId or hotelId not provided",
    });
  }

  if (req.user._id.equals(userId) === false) {
    return res.status(401).json({
      status: "Error",
      message: "Unauthorized",
      error: "You are not authorized to view this review",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({
      status: "Error",
      message: "Seems like user not found",
      error: "The user your are looking for does not exist",
    });
  }

  const reviews = await Review.find({
    user: userId,
    deletedAt: null,
  }).populate("hotelBranch", null, "HotelBranch");
  if (!reviews)
    res.status(400).json({
      status: "ERROR",
      message: "No reviews",
      error: "No reviews found for this user",
    });

  const hotelBranchesForReviews = reviews.map((review) => review.hotelBranch);

  const bookingDetails = await Booking.findOne({
    user: userId,
    hotelBranch: { $in: hotelBranchesForReviews },
  }).populate({
    path: "hotelBranch",
    populate: {
      path: "reviews",
      strictPopulate: false,
    },
    strictPopulate: false,
  });

  res.status(200).json({
    status: "OK",
    message: "Reviews fetched successfully",
    reviewDetail: bookingDetails,
  });
});

export const updateReviews = asyncHandler(async (req, res) => {
  if (!req.query.reviewId) {
    return res.status(400).json({
      status: "Error",
      message: "Please provide review details",
      error: "reviewId not provided",
    });
  }

  const { reviewId, userId } = req.query;

  if (req.user._id.equals(userId) === false || req.user.role === "MODERATOR") {
    return res.status(401).json({
      status: "Error",
      message: "You are not authorized to update this review",
      error: "Unauthorized",
    });
  }

  if (!req.body) {
    return res.status(400).json({
      status: "Error",
      message: "Please provide review details",
      error: "review details not provided",
    });
  }

  const { review, rating, image, bookingId } = req.body;

  try {
    const validationErrors = [];
    if (!review || typeof review !== "string") {
      validationErrors.push({
        field: "review",
        message: "review must be a string",
      });
    }
    if (!rating || typeof rating !== "number") {
      validationErrors.push({
        field: "rating",
        message: "rating must be a number",
      });
    }
    if (!image || !Array.isArray(image)) {
      validationErrors.push({
        field: "image",
        message: "image must be an array",
      });
    } else if (image.length < 1) {
      validationErrors.push({
        field: "image",
        message: "image must not be empty",
      });
    } else if (!image[0].secure_url || image[0].secure_url.trim().length < 1) {
      validationErrors.push({
        field: "image[0].secure_url",
        message: "image[0].secure_url must not be empty",
      });
    }

    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json({ status: "Error", message: validationErrors });
    }

    // check if the booking exists
    const booking = await Booking.findOne({ _id: bookingId }).lean(true);
    if (!booking) {
      return res.status(404).json({
        status: "Error",
        message: "Booking not found",
        error: "booking Id given does not exist",
      });
    }

    const slugName = `${bookingId?.toString().slice(18)}-${userId
      ?.toString()
      .slice(18)}-${
      booking && booking?.createdAt?.toString().slice(0, 10)
    }-${new Date().toJSON().slice(0, 10)}`.toLowerCase();

    const existingSlugName = await Review.findOne({
      user: userId,
      deletedAt: null,
      review: review,
      slugName: slugName,
    });
    if (existingSlugName) {
      return res.status(409).json({
        status: "Error",
        message: "You cannot review this booking again",
        error: "review already reviewed on this date",
      });
    }

    const updateBody = {
      review: review,
      rating: rating,
      images: image,
      slugName: slugName,
      updatedOn: new Date(),
      updatedByUser: req.user._id,
    };

    const updatedReview = await Review.findOneAndUpdate(
      {
        _id: reviewId,
      },
      {
        $set: updateBody,
      },
      { new: true }
    );

    console.log(
      updatedReview,
      "updatedReview",
      existingSlugName,
      "ExistingSlugName"
    );

    if (!updatedReview) {
      return res.status(404).json({
        status: "Error",
        message: "Could not update",
        error: "Review not found.",
      });
    }

    res.status(200).json({
      status: "OK",
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: "Error while updating review",
      error: error.message,
    });
  }
});
