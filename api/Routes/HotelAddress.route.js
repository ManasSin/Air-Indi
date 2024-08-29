import { Router } from "express";
import {
  createHotelAddress,
  getAllHotels,
  getHotelAddressByID,
  updateAddress,
  deleteAddress,
} from "../Controllers/HotelAddressController.js";
import { isLoggedIn } from "../Middlewares/isLoggedIn.js";

export const router = Router();

router.route("/create").post(isLoggedIn, createHotelAddress);
router.route("/").get(getAllHotels);
router.route("/:id").get(isLoggedIn, getHotelAddressByID);
router.route("/:id").put(isLoggedIn, updateAddress);
router.route("/:id").delete(isLoggedIn, deleteAddress);
