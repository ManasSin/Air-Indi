import User from "../Modal/UserSchema.js";
import CustomError from "../Utils/CustomError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../Service/asyncHandler.js";
import bcrypt from "bcrypt";
// const bcrypt = require("bcryptjs");

export const cookiesOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

const generateJWT = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const bcryptSalt = bcrypt.genSaltSync(10);

// ? register/ signup
export const singUp = asyncHandler(async (req, res) => {
  const { name, email, password, phone = null } = req.body;

  if (!name) throw new CustomError("Name is required", 400);
  if (!email) throw new CustomError("email is required", 400);
  if (!password) throw new CustomError("password is required", 400);

  //check if the user already exists
  const existingUser = await User.findOne({ email });

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
  const { id } = req.params;
  const data = req.body;
  // console.log(id);

  try {
    if (!id) throw new CustomError("user id is required", 400);

    const user = await User.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });
    const token = generateJWT(user._id, user.role);
    res.cookie("token", token, cookiesOptions);

    // setTimeout(() => {
    return res.status(200).send({
      user,
      token,
    });
    // }, 2000);
  } catch (error) {
    res.status(401).send(error);
  }
});

// ? get profile
export const getProfile = asyncHandler(async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const user = await User.findById({ _id });

    return res.send({ user });
  }
});

// ? logout
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.send({ user: {} });
});
