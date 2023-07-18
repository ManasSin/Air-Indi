import { Router } from "express";
import { isLoggedIn } from "../Middlewares/isLoggedIn";
import { createProduct } from "../Controllers/ProductController";

export const router = Router();

router.post("/create", isLoggedIn, createProduct);
