import { asyncHandler } from "../Service/asyncHandler.js";

export const createBooking = asyncHandler(async (req, res) => {
  const { name } = req.body;
  return res.send({ name: "hello ji" });
});
