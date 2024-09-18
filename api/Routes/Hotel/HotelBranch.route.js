import { Router } from "express";
import { isLoggedIn } from "../../Middlewares/isLoggedIn.js";
import {
  createHotelBranch,
  getAllHotelBranchForHotel,
  updateHotelBranch,
} from "../../Controllers/Hotels/HotelBranchController.js";

export const router = Router();

router.route("/create").post(isLoggedIn, createHotelBranch);

router
  .route("/")
  .get(isLoggedIn, getAllHotelBranchForHotel)
  //   .get(publicGetAllHotelBranchForHotel)
  .put(isLoggedIn, updateHotelBranch);
