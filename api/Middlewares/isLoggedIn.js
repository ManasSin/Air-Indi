import JWT from "jsonwebtoken";
import { asyncHandler } from "../Service/asyncHandler.js";
import CustomError from "../Utils/CustomError.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.cookies.token ||
    (req.header.authorization && req.header.authorization.startsWith("Bearer"))
  ) {
    token = req.cookies.token || req.header.authorization.split(" ")[1];
  }

  if (!token) {
    throw new CustomError("Not authorized to access this resource", 401);
  }

  try {
    const decodedJwt = JWT.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedJwt.id, "name email role");
    next();
  } catch (error) {
    throw new CustomError("Not authorized to access this resource", 401);
  }
});
