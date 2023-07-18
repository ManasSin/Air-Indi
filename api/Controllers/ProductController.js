import { asyncHandler } from "../Service/asyncHandler";

export const createProduct = asyncHandler(async (req, res) => {
  const { name } = req.body;
});
