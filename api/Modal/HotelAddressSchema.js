import mongoose from "mongoose";

const HotelAddressSchema = new mongoose.Schema(
  {
    localArea: {
      type: String,
      required: [true, "localArea is required"],
    },
    pinCode: {
      type: Number,
      required: [true, "pinCode is required"],
    },
    city: {
      type: String,
      required: [true, "city is required"],
    },
    state: {
      type: String,
      required: [true, "state is required"],
    },
    country: {
      type: String,
      required: [true, "country is required"],
    },
    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: false,
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

export default mongoose.model("HotelAddress", HotelAddressSchema);
