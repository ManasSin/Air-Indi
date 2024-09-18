import { Router } from "express";
import {
  createHotelAddress,
  getAllHotelAddress,
  getHotelAddressByID,
  updateHotelAddress,
  deleteHotelAddress,
} from "../../Controllers/Hotels/HotelAddressController.js";
import { isLoggedIn } from "../../Middlewares/isLoggedIn.js";

export const router = Router();

router.route("/create").post(isLoggedIn, createHotelAddress);
router.route("/").get(getAllHotelAddress);
router
  .route("/")
  // .get(isLoggedIn, getHotelAddressByID)
  .put(isLoggedIn, updateHotelAddress)
  .delete(isLoggedIn, deleteHotelAddress);
