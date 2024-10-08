import { Router } from "express";
import {
  getHotels,
  getHotelsByIds,
  createHotel,
  updateHotel,
  deleteHotel,
  listHotelsByUser,
  listPublicHotels,
} from "../../Controllers/Hotels/HotelController.js";
import { isLoggedIn } from "../../Middlewares/isLoggedIn.js";

export const router = Router();

router.route("/").get(getHotels);
router
  .route("/user")
  // .get(isLoggedIn, getHotelsByIds)
  .get(listPublicHotels)
  .get(isLoggedIn, listHotelsByUser)
  .put(isLoggedIn, updateHotel)
  .delete(isLoggedIn, deleteHotel);
router.route("/add").post(isLoggedIn, createHotel);
