import mongoose from "mongoose";

const HotelAddressSchema = new mongoose.Schema(
  {
    localArea: {
      type: String,
      required: [true, "localArea is required"],
    },
    pincode: {
      type: Number,
      required: [true, "pincode is required"],
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HotelAddress", HotelAddressSchema);
