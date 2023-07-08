import { Router } from "express";
import { singUp } from "../Controllers/userController.js";

export const router = Router();

router.post("/signup", singUp);
