import mongoose from "mongoose";
import { AuthRoles } from "../../Utils/AuthRoles.js";
import jwt from "jsonwebtoken";
import { salt } from "../../Utils/Bycrpt-helper.js";
import bcrypt from "bcrypt";

// const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [50, "Name must be less the 50 chars"],
    },
    email: {
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
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 chars"],
      select: false,
    },
    phone: {
      type: Number,
      default: null,
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    address: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "UserAddress",
      default: null,
    },
    emergencyContact: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hashSync(this.password, salt);
  next();
});

UserSchema.methods = {
  // compare password
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  // generate jwt token
  getJWTtoken: function () {
    return jwt.sign(
      { _id: this._id, role: this.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
  },
};

const User = mongoose.model("User", UserSchema);

export default User;
