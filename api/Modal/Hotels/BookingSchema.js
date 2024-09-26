import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hotelBranch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HotelBranch",
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  guests: {
    adults: {
      type: Number,
      required: true,
    },
    children: {
      type: Number,
      default: 0,
    },
    infants: {
      type: Number,
      default: 0,
    },
  },
  paymentMethod: {
    type: String,
    enum: ["credit card", "debit card", "paypal"],
    required: true,
  },
  listingPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  serviceCharge: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  slugName: {
    type: String,
    required: true,
    unique: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  specialRequest: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  invoiceStatus: {
    type: String,
    enum: ["pending", "sent", "paid"],
    default: "pending",
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    default: null,
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },
  cancellationReason: {
    type: String,
    default: "",
    required: function () {
      return this.status === true;
    },
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    required: function () {
      return this.status === true;
    },
  },
  cancellationDate: {
    type: Date,
    default: Date.now,
    required: function () {
      return this.status === true;
    },
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
