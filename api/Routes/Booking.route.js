import { Router } from "express";
import { isLoggedIn } from "../Middlewares/isLoggedIn.js";
import { createBooking } from "../Controllers/BookingController.js";

export const router = Router();

router.post("/create", isLoggedIn, createBooking);
