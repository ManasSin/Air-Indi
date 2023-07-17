import mongoose from "mongoose";

const HotelsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minLength: [6, "title must be at least 10 chars"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    location: {
      type: { type: String },
      coordinates: [],
    }, // google map javascript api for latitute and longitude.
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HotelAddress",
    },
    discription: {
      type: String,
      required: [true, "discription is required"],
      minLength: [20, "discription must be at least 10 chars"],
    },
    images: [
      {
        secure_url: {
          type: String,
          required: [true, "image url is required"],
        },
      },
    ], //review need to be added
    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  },
  { timestamps: true }
);

HotelsSchema.index({
  location: "2dsphere",
});

export default mongoose.model("Hotel", HotelsSchema);

//ck editor
