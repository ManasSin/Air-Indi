import User from "../Modal/UserSchema.js";
import bcrypt from "bcryptjs";
import CustomError from "../Utils/CustomError.js";
import jwt from "jsonwebtoken";

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

export const singUp = async (req, res) => {
  const { name, email, password, phone = null } = req.body;

  if (!name) throw new CustomError("Name is required", 400);
  if (!email) throw new CustomError("email is required", 400);
  if (!password) throw new CustomError("password is required", 400);

  //check if the user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }

  try {
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcyrptSalt),
      phone,
    });
    const token = generateJWT(user._id, user.role);

    res.cookies("token", token, cokiesOptions);
    res.send({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};

export const Login = async (req, res) => {
  const { email, password, phone = null } = req.body;

  if (!email || !password)
    throw new CustomError("Please fill required fields", 400);

  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new CustomError("Credentials not valid", 400);
  // console.log("user is fine");
  try {
    const passMatches = await User.comparePassword(password);

    if (passMatches) {
      user.password = undefined;
      const token = generateJWT(user._id, user.role);
      res.cookie("token", token, cokiesOptions);

      return res.send(user, token);
    }
  } catch (err) {
    res.send(err.message);
  }
};
