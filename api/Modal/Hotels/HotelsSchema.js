import mongoose from "mongoose";

const HotelsSchema = new mongoose.Schema(
  {
    publicInfo: {
      title: {
        type: String,
        required: [true, "title is required"],
        minLength: [6, "title must be at least 6 chars"],
      },
      address: {
        type: String,
        required: [true, "address is required"],
        minLength: [1, "address must be at least 1 chars"],
      },
      nearBy: {
        type: String,
        required: [true, "nearBy is required"],
        minLength: [1, "nearBy must be at least 1 chars"],
      },
      publicRating: {
        type: Number,
        default: 0,
        validate: {
          validator: (v) => v >= 0 && v <= 5 && /^\d*(\.\d{1,2})?$/.test(v),
          message:
            "publicRating must be between 0 and 5 with up to 2 decimal places",
        },
      },
      publicRatingCount: {
        type: Number,
        default: 0,
      },
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
    branches: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "HotelBranch",
      required: false,
      default: null,
    },
    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: false,
      default: null,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
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
          validate: {
            validator: (v) => {
              return (
                v.match(
                  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
                ) !== null
              );
            },
          },
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
  },
  { timestamps: true }
);

HotelsSchema.index({
  location: "2dsphere",
});

const Hotels = mongoose.model("Hotels", HotelsSchema);
export default Hotels;

//ck editor
