import mongoose from "mongoose";
import { AuthRoles } from "../../Utils/AuthRoles.js";

const VendorSchema = new mongoose.Schema(
  {
    userFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ownerEmail: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      validate: {
        validator: (v) => {
          const emailRegex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return emailRegex.test(v);
        },
        message: (prop) => `${prop.value} is not a valid email address`,
      },
    },
    role: {
      type: String,
      required: [true, "role is required"],
      Object: Object.values(AuthRoles),
      default: AuthRoles.OWNER,
    },
    assignedModerators: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: null,
    },
    assignedStaff: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: null,
    },
    hotels: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Hotels",
      default: null,
    },
    hotelAddress: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "HotelAddress",
      default: null,
    },
    hotelBranches: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "HotelBranch",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("Vendor", VendorSchema);
export default Vendor;
