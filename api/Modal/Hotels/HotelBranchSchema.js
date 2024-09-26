import mongoose from "mongoose";

const HotelBranchSchema = new mongoose.Schema(
  {
    parentHotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    address: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "HotelAddress",
      required: false,
      default: null,
    },
    bookings: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Booking",
      default: [],
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
    branchName: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
      required: true,
    },
    contactInfo: {
      type: {
        mobileNumber: {
          type: String,
          required: true,
          validate: {
            validator: function (value) {
              return /^\+\d{12}$/.test(value);
            },
            message: (props) => `${props.value} is not a valid phone number`,
          },
        },
        phoneNumber: {
          type: String,
          required: true,
          validate: {
            validator: function (value) {
              return /^\+\d{12}$/.test(value);
            },
            message: (props) => `${props.value} is not a valid phone number`,
          },
        },
        email: {
          type: String,
          required: true,
          validate: {
            validator: function (value) {
              return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                value
              );
            },
            message: (props) => `${props.value} is not a valid email`,
          },
        },
        website: {
          type: String,
          required: true,
          validate: {
            validator: function (value) {
              return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i.test(
                value
              );
            },
            message: (props) => `${props.value} is not a valid website`,
          },
        },
      },
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
    rooms: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Room",
      required: false,
      default: [],
    },
    suits: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Suits",
      required: false,
      default: [],
    },
    facilities: {
      type: [String],
      required: true,
      default: [],
    },
    services: {
      type: [String],
      required: true,
      default: [],
    },
    amenities: {
      type: [String],
      required: true,
      default: [],
    },
    tags: {
      type: [String],
      required: true,
      default: [],
    },
    priceRange: {
      type: String,
      required: true,
      enum: ["budget", "mid-range", "luxury", "ultra-luxury", "any"],
    },
    pricePerNight: {
      type: Number,
      required: [true, "Price is required"],
    },
    currency: {
      type: String,
      required: true,
      enum: [
        "USD",
        "EUR",
        "INR",
        "GBP",
        "JPY",
        "AUD",
        "CAD",
        "CHF",
        "CNY",
        "SEK",
        "NZD",
      ], // Add more as needed
    },
    slugName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      minLength: [10, "description must be at least 10 chars"],
    },
    longDescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LongDescription",
      required: false,
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Review",
      required: false,
      default: [],
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
    deletedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted", "pending"],
      default: "pending",
    },
    updatedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

const HotelBranch = mongoose.model("HotelBranch", HotelBranchSchema);
export default HotelBranch;
