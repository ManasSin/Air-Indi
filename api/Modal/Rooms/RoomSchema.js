const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "roomNumber is required"],
      unique: true,
      trim: true,
      minLength: [1, "roomNumber must be at least 1 chars"],
      maxLength: [10, "roomNumber must be at most 10 chars"],
      validate: [
        {
          validator: function (v) {
            return /^[a-zA-Z0-9]+$/.test(v);
          },
          message: "roomNumber must be alphanumeric",
        },
      ],
    },
    roomType: {
      type: String,
      required: [true, "roomType is required"],
      enum: [
        "single",
        "double",
        "twin",
        "suite",
        "studio",
        "family",
        "king",
        "queen",
        "deluxe",
        "executive",
        "presidential",
        "other",
      ],
      trim: true,
    },
    bedType: {
      type: String,
      required: [true, "bedType is required"],
      enum: [
        "single",
        "double",
        "twin",
        "king",
        "queen",
        "sofa",
        "murphy",
        "bunk",
        "other",
      ],
      trim: true,
    },
    bedCount: {
      type: Number,
      required: [true, "bedCount is required"],
      min: [1, "bedCount must be at least 1"],
      max: [10, "bedCount must be at most 10"],
    },
    floorNumber: {
      type: Number,
      required: [true, "floorNumber is required"],
      min: [1, "floorNumber must be at least 1"],
      max: [50, "floorNumber must be at most 50"],
    },
    roomSize: {
      type: Number,
      required: [true, "roomSize is required"],
      min: [1, "roomSize must be at least 1"],
      max: [1000, "roomSize must be at most 1000"],
    },
    roomView: {
      type: String,
      required: [true, "roomView is required"],
      enum: [
        "city",
        "garden",
        "park",
        "ocean",
        "mountain",
        "lake",
        "river",
        "other",
      ],
      trim: true,
    },
    amenities: {
      type: [String],
      required: [true, "amenities is required"],
      enum: [
        "airConditioning",
        "heating",
        "tv",
        "cable",
        "satellite",
        "freeWiFi",
        "coffeeMaker",
        "miniBar",
        "inRoomDining",
        "hairDryer",
        "iron",
        "ironingBoard",
        "safe",
        "workDesk",
        "bathrobe",
        "slippers",
        "toiletries",
        "other",
      ],
      validate: [
        {
          validator: function (v) {
            return v.length > 0;
          },
          message: "amenities must be at least one",
        },
      ],
    },
    rate: {
      type: Number,
      required: [true, "rate is required"],
      min: [1, "rate must be at least 1"],
      max: [10000, "rate must be at most 10000"],
    },
    currency: {
      type: String,
      required: [true, "currency is required"],
      enum: ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "CNY", "JPY", "other"],
      trim: true,
    },
    images: [
      {
        secure_url: {
          type: String,
          required: [true, "secure_url is required"],
          validate: [
            {
              validator: function (v) {
                return /(http(s?):\/\/(www\.)?)|(ftp:\/\/(www\.)?)/.test(v);
              },
              message: "secure_url must be a valid url",
            },
          ],
        },
      },
    ],
    description: {
      type: String,
      required: [true, "description is required"],
      minLength: [10, "description must be at least 10 chars"],
      maxLength: [1000, "description must be at most 1000 chars"],
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: [true, "hotel is required"],
    },
    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
  },
  { timestamps: true }
);
