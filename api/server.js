import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { router as AuthRoute } from "./Routes/Auth.route.js";
import { router as HotelsRoutes } from "./Routes/Hotel.route.js";
import { router as HotelAddressRoute } from "./Routes/HotelAddress.route.js";
import { errorHandler } from "./Middlewares/errorHandler.js";

const app = express();
dotenv.config();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // This allows any origin to access the API. We recommend limiting this to your specific domain in production.
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser());
app.use(errorHandler);

// routes
app.use("/api/user", AuthRoute);
app.use("/api/hotelAddress", HotelAddressRoute);
app.use("/api/hotel", HotelsRoutes);

//connecting with mongo
mongoose
  .connect(process.env.MONGO_DB_CONNECT_URL)
  .then(
    // listen to port
    app.listen(process.env.PORT || 8080, () => {
      console.log("Server is running on port 4000");
    })
  )
  .catch((err) => {
    console.log(err.message);
  });
