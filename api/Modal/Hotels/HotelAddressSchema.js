import mongoose from "mongoose";

const HotelAddressSchema = new mongoose.Schema(
  {
    plotName: {
      type: String,
      required: [true, "plotName is required"],
    },
    landmark: {
      type: String,
      required: [true, "landmark is required"],
    },
    latitude: {
      type: Number,
      required: false,
      default: null,
    },
    longitude: {
      type: Number,
      required: false,
      default: null,
    },
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
    deletedAt: {
      type: Date,
      default: null,
    },
    slugName: {
      type: String,
      // unique: true,
    },
    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotels",
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

const HotelAddress = mongoose.model("HotelAddress", HotelAddressSchema);
export default HotelAddress;
