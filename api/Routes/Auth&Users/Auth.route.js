import { Router } from "express";
import {
  Login,
  singUp,
  getProfile,
  updateProfile,
  logout,
  updateUserRole,
} from "../../Controllers/AuthController.js";
import { isLoggedIn } from "../../Middlewares/isLoggedIn.js";

export const router = Router();

router.route("/signup").post(singUp);
router.route("/login").post(Login);
router.route("/profile").get(isLoggedIn, getProfile);
router.route("/logout").post(logout);
router.route("/update/:id").post(isLoggedIn, updateProfile);
router.route("/updateRole").put(isLoggedIn, updateUserRole);
