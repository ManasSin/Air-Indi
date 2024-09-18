import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    hotelBranch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HotelBranch",
      required: true,
    },
    roomDetails: {
      type: String,
      required: true,
    },
    invoiceDateTime: {
      type: Date,
      default: Date.now,
      // create a buffer time of 30 mins
      validate: [
        {
          validator: function (v) {
            return (
              v.getTime() - this.Booking.checkInDateTime.getTime() >= 3600000
            );
          },
          message:
            "Invoice time should be at least 60 minutes after booking time",
        },
      ],
    },
    paymentMethod: {
      type: String,
      enum: ["credit card", "debit card", "online", "cash"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
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
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

InvoiceSchema.index({ invoiceDateTime: 1, user: 1 }, { unique: true });

const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;
