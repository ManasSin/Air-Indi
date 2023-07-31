import { Router } from "express";
import {
  Login,
  singUp,
  getProfile,
  updateProfile,
  logout,
} from "../Controllers/AuthController.js";

export const router = Router();

router.post("/signup", singUp);
router.post("/login", Login);
router.get("/profile", getProfile);
router.post("/logout", logout);
router.post("/update/:id", updateProfile);
