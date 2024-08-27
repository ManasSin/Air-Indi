import { Router } from "express";
import {
  Login,
  singUp,
  getProfile,
  updateProfile,
  logout,
} from "../Controllers/AuthController.js";
import { isLoggedIn } from "../Middlewares/isLoggedIn.js";

export const router = Router();

router.route("/signup").post(singUp);
router.route("/login").post(Login);
router.route("/profile").get(getProfile);
router.route("/logout").post(logout);
router.route("/update/:id").post(isLoggedIn, updateProfile);
