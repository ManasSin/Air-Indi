import { Router } from "express";
import {
  Login,
  singUp,
  getProfile,
  updateProfile,
} from "../Controllers/AuthController.js";

export const router = Router();

router.post("/signup", singUp);
router.post("/login", Login);
router.get("/profile", getProfile);
router.post("/update/:id", updateProfile);
