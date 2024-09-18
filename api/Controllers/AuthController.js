import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CustomError from "../Utils/CustomError.js";
import User from "../Modal/User/UserSchema.js";
import Vendor from "../Modal/User/VendorSchema.js";
import HotelBranch from "../Modal/Hotels/HotelBranchSchema.js";
import { asyncHandler } from "../Service/asyncHandler.js";
import { cookiesOptions, generateJWT } from "../Utils/JWT-helper.js";
import { AuthRoles } from "../Utils/AuthRoles.js";

// ? register/ signup
export const singUp = asyncHandler(async (req, res) => {
  const { name, email, password, phone = null } = req.body;

  if (!name) throw new CustomError("Name is required", 400);
  if (!email) throw new CustomError("email is required", 400);
  if (!password) throw new CustomError("password is required", 400);

  //check if the user already exists
  const existingUser = await User.find({ email });

  if (existingUser) {
    res.status(400).send("User already exists");
  }
  const user = await User.create({
    name,
    email,
    // password: bcrypt.hashSync(password, bcryptSalt),
    password,
    phone,
  });
  const token = generateJWT(user._id, user.role);

  res.cookie("token", token, cookiesOptions);
  res.send({
    token,
    user,
  });
});

// ? login
export const Login = asyncHandler(async (req, res) => {
  const { email, password, phone = null } = req.body;

  if (typeof password !== "string") {
    console.error("password is not correct type");
    return res.status(400).send("Password type is wrong");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user)
    return res
      .status(404)
      .send("User does not exist, please provide right credentials");

  if (!user.password) {
    console.error("User password is undefined");
    return res.status(500).send("Internal server error");
  }

  const passMatches = await bcrypt.compare(password, user.password);
  // const passMatches = await user.comparePassword(password);

  if (!passMatches) return res.status(401).send("wrong password");

  const token = generateJWT(user._id, user.role);
  return res
    .cookie("token", token, cookiesOptions)
    .send({ user, token, status: 200 });
});

// ? update profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const data = req.body;
  // console.log({ user: user, data: data });

  const updateUser = await User.findByIdAndUpdate(
    { _id: user._id },
    { $set: data },
    { new: true }
  );

  if (!updateUser) return res.status(404).send("User not found");

  const token = generateJWT(updateUser._id, updateUser.role);
  res.cookie("token", token, cookiesOptions);

  return res.status(200).send({
    user: updateUser,
    token,
  });
});

// ? get profile
export const getProfile = asyncHandler(async (req, res) => {
  const { user } = req;
  if (!user)
    return res
      .status(404)
      .send({
        status: "Error",
        message: "not logged in",
        error: "User not found",
      });

  return res
    .status(200)
    .send({ status: "OK", message: "user found", user: user });
});

// ? logout
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.send({ user: {} });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { _id: loggedInUser, role: loggedInRole } = req.user;
  const { ChangeRoleTo } = req.body;
  // console.log(
  //   loggedInUser.equals(new mongoose.Types.ObjectId(String(req.query.user))),
  //   true === false
  // );

  if (!ChangeRoleTo || AuthRoles[ChangeRoleTo] === false)
    return res.status(204).json({
      status: "Error",
      message: "Invalid request",
      error: "Invalid role",
    });

  // if (!loggedInUser.equals(new mongoose.Types.ObjectId(String(req.query.user))))
  //   return res.status(401).json({
  //     status: "Error",
  //     message: "Unauthorized access attempted",
  //     error: "Unauthorized",
  //   });

  // get the user details for the query user
  const queryUser = await User.findOne({ _id: req.query.user }).lean();
  if (!queryUser)
    return res.status(404).json({
      status: "Error",
      message: "User not found",
      error: "User not found",
    });

  let updatedDocs = [];

  // if the query and logged in user are same then go ahead and update the role
  if (
    (loggedInRole === queryUser.role) === "USER" &&
    ["OWNER", "MODERATOR"].includes(ChangeRoleTo)
  ) {
    let updatedUser;
    try {
      // Update the User
      updatedUser = await User.findByIdAndUpdate(
        { _id: queryUser._id.toString() },
        { $set: { role: ChangeRoleTo } },
        { new: true }
      );

      updatedDocs.push(updatedUser ? updatedUser : {});
    } catch (error) {
      return res.status(500).json({
        status: "Error",
        message: `Cannot update user role because - ${error.message}`,
        error: error.message,
      });
    }
    return res.status(202).send({
      status: "OK",
      message: "User updated",
      user: updatedUser,
      updatedDocs: updatedDocs,
    });
  } else if (
    // if the logged in user is the owner and the query user is the staff or manager then go ahead and update the role
    loggedInRole === "OWNER" &&
    (queryUser.role === "STAFF" || queryUser.role === "MODERATOR")
  ) {
    let updatedUser = undefined;

    // Update the User
    try {
      updatedUser = await User.findByIdAndUpdate(
        { _id: queryUser._id },
        { $set: { role: ChangeRoleTo } },
        { new: true }
      );

      // Update the HotelBranch and Vendor documents
      let hotelBranches = await HotelBranch.updateMany(
        { parentHotel: loggedInUser },
        {
          $push: {
            [ChangeRoleTo === "MODERATOR"
              ? "assignedModerators"
              : "assignedStaff"]: queryUser._id,
          },
        }
      );

      // Update the Vendor documents
      let vendors = await Vendor.updateMany(
        { userFor: loggedInUser },
        {
          $push: {
            [ChangeRoleTo === "MODERATOR"
              ? "assignedModerators"
              : "assignedStaff"]: queryUser._id,
          },
        }
      );

      updatedDocs = [...hotelBranches, ...vendors, updatedUser];
    } catch (error) {
      return res.status(500).json({
        status: "Error",
        message: `Cannot update user role because - ${error.message}`,
        error: error.message,
      });
    }
    return res.status(202).send({
      status: "OK",
      message: `User role updated to ${ChangeRoleTo}`,
      user: updatedUser,
      updatedDocs: updatedDocs,
    });
  } else if (loggedInRole === "OWNER" && queryUser.role === "OWNER") {
    return res.status(200).json({
      status: "OK",
      message: "Already owner",
      error: "Needless change",
      updateUser: queryUser,
      updatedDocs: updatedDocs,
    });
  } else {
    return res.status(403).json({
      status: "Error",
      message: "Role change not allowed",
      error: "Unauthorized",
      updateUser: null,
      updatedDocs: updatedDocs,
    });
  }
});
