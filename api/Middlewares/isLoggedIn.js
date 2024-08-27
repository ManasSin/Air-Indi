import jwt from "jsonwebtoken";
import { asyncHandler } from "../Service/asyncHandler.js";
import CustomError from "../Utils/CustomError.js";
import User from "../Modal/UserSchema.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization
      ? req.headers.authorization.startsWith("Bearer")
      : req.cookies.token
  ) {
    token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : req.cookies.token;
  }

  if (!token) {
    throw new CustomError("Not authorized to access this resource", 401);
  }

  if (token) {
    try {
      const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decodedJwt._id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new CustomError("Token signature is invalid");
    }
  } else {
    throw new CustomError("Token signature is invalid", 401);
  }
});
