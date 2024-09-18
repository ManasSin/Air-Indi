import { Router } from "express";
import { isLoggedIn } from "../../Middlewares/isLoggedIn.js";
import {
  createReview,
  getReviewsForHotels,
  getReviewsForUsers,
  updateReviews,
} from "../../Controllers/Hotels/ReviewController.js";

export const router = Router();

router.route("/create").post(isLoggedIn, createReview);

router
  .route("/")
  .get(getReviewsForHotels)
  .get(isLoggedIn, getReviewsForUsers)
  .put(isLoggedIn, updateReviews);
