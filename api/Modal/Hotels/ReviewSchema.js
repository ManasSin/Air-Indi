import mongoose from "mongoose";

export const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    hotelBranch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    bookingDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookingDetails",
      required: [true, "bookingDetails is required"],
    },
    review: {
      type: String,
      maxLength: [600, "review must be at least 200 chars"],
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
      min: [1, "rating must be at least 1"],
      max: [5, "rating must be at least 5"],
    },
    images: [
      {
        secure_url: {
          type: String,
          required: false,
          validate: [
            {
              validator: function (v) {
                return (
                  v.match(
                    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
                  ) !== null
                );
              },
              message: "secure_url must be a valid url",
            },
          ],
        },
      },
    ],
    slugName: {
      type: String,
      unique: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
