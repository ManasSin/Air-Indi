import mongoose from "mongoose";
import bcrypt from "bcrypt";
import AuthRoles from "../Utils/AuthRoles.js";
import Jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [50, "Name must be less the 50 chars"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 chars"],
      select: false,
    },
    phone: {
      type: Number,
      required: false,
      unique: true,
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

UserSchema.methods = {
  // generate JWT token
  getJWTtoken: function () {
    Jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  },
};

export default mongoose.model("User", UserSchema);
