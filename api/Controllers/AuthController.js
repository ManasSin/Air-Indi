import User from "../Modal/UserSchema.js";
import bcrypt from "bcryptjs";
import CustomError from "../Utils/CustomError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../Service/asyncHandler.js";

export const cokiesOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

const generateJWT = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const bcyrptSalt = bcrypt.genSaltSync(10);

export const singUp = asyncHandler(async (req, res) => {
  const { name, email, password, phone = null } = req.body;

  if (!name) throw new CustomError("Name is required", 400);
  if (!email) throw new CustomError("email is required", 400);
  if (!password) throw new CustomError("password is required", 400);

  //check if the user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

  if (existingUser) {
    res.status(400).send("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password: bcrypt.hashSync(password, bcyrptSalt),
    phone,
  });
  const token = generateJWT(user._id, user.role);

  res.cookie("token", token, cokiesOptions);
  res.send({
    success: true,
    token,
    user,
  });
});

export const Login = asyncHandler(async (req, res) => {
  const { email = null, password, phone = null } = req.body;

  if (!password) res.status(400).send("required fields must be filled");

  const user =
    (await User.findOne({ email }).select("+password")) ||
    (await User.findOne({ phone }));

  if (!user)
    res
      .status(422)
      .send("User does not exist, please provide right crendentials");

  const passMatches = bcrypt.compare(password, user.password);
  // todo : perform actuall bcrypt check

  if (!passMatches) res.status(422).send("worng password");

  const token = generateJWT(user._id, user.role);
  res.cookie("token", token, cokiesOptions);

  return res.send({ user, token });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const updatedUser = await User.findByIdAndUpdate({ _id: id }, data, {
    new: true,
  });
  const token = generateJWT(user._id, user.role);
  res.cookie("token", token, cokiesOptions);

  setTimeout(() => {
    return res.send({
      success: true,
      user: updatedUser,
      token,
    });
  }, 2000);
});

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

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  return res.send("logged out");
});
