import { Router } from "express";
import { router as AuthRoute } from "./Auth.route.js";

export const router = Router();

router.use("/", AuthRoute);
