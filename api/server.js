import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Jwt from "jsonwebtoken";
import { router as AuthRoute } from "./Routes/Auth.route.js";
import User from "./Modal/UserSchema.js";
import bcrypt from "bcrypt";

const bcyrptSalt = bcrypt.genSaltSync(10);

const app = express();
dotenv.config();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// routes
// app.post("/user", AuthRoute);

app.post("/user/signup", async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcyrptSalt),
      phone,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(422).json(err.messge);
  }
});

app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  //check if the email exist
  const user = await User.findOne({ email });
  if (user) {
    // bcrypt pass compare
    const passwordCompare = bcrypt.compareSync(password, user.password);
    if (passwordCompare) {
      const token = Jwt.sign(user._id, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });
      res.status(200).json(user, token);
    }
    // console.log(user);
  }
  res.status(433).json({ err: "password didn't match" });
});

// app.get("/login", (req, res) => {
//   res.status(200).json({ message: "Login route" });
// });
// booking-app

//connecting with mongo
mongoose
  .connect(process.env.MONGO_DB_CONNECT_URL)
  .then(
    // listen to port
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    })
  )
  .catch((err) => {
    console.log(err.message);
  });
