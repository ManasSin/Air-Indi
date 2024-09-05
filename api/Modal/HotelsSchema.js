import mongoose from "mongoose";

const HotelsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minLength: [6, "title must be at least 6 chars"],
      // required: [true, "title is required"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (v) => v.length === 2,
          message: "location coordinates must have two values",
        },
      },
    }, // google map javascript api for latitude and longitude.
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
      default: null,
    },
    // address: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "HotelAddress",
    //   required: false,
    // },
    description: {
      type: String,
      required: [true, "description is required"],
      minLength: [10, "description must be at least 10 chars"],
    },
    priceRange: {
      type: String,
      required: true,
      enum: ["budget", "mid-range", "luxury", "ultra-luxury", "any"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    amenities: {
      type: [String],
      required: true,
    },
    services: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    images: [
      {
        secure_url: {
          type: String,
          required: false,
        },
      },
    ],
    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    slugName: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

HotelsSchema.index({
  location: "2dsphere",
});

const Hotels = mongoose.model("Hotels", HotelsSchema);
export default Hotels;

//ck editor
