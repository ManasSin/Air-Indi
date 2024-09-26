import { Router } from "express";
import { isLoggedIn } from "../../Middlewares/isLoggedIn.js";
import {
  createBooking,
  getBooking,
} from "../../Controllers/BookingController.js";

export const router = Router();

router.post("/create", isLoggedIn, createBooking);

router.route("/").get(isLoggedIn, getBooking);
