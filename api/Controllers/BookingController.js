import { asyncHandler } from "../Service/asyncHandler";

export const createBooking = asyncHandler(async (req, res) => {
  const { name } = req.body;
});
