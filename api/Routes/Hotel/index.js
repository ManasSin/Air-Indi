import { Router } from "express";
import { router as HotelListingRoute } from "./HotelListing.route.js";
import { router as HotelAddressRoute } from "./HotelAddress.route.js";
import { router as HotelBranchRoute } from "./HotelBranch.route.js";
import { router as ReviewRoute } from "../Reviews/Review.route.js";

export const router = Router();

// hotelListing
router.use(HotelListingRoute);

// hotelAddress
router.use("/hotelAddress", HotelAddressRoute);

// hotelBranches
router.use("/hotelBranch", HotelBranchRoute);

// reviews
router.use("/review", ReviewRoute);
