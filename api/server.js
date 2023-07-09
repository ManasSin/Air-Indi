import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router as AuthRoute } from "./Routes/Auth.route.js";

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
app.use("/api/user", AuthRoute);

// app.post("/api/user/signup", async (req, res) => {
//   const { name, email, password, phone } = req.body;
//   try {
//     const user = await User.create({
//       name,
//       email,
//       password: bcrypt.hashSync(password, bcyrptSalt),
//       phone,
//     });

//     res.status(201).json(user);
//   } catch (err) {
//     res.status(422).json(err.messge);
//   }
// });

// app.post("/api/user/login", async (req, res) => {
//   const { email, password } = req.body;

//   //check if the email exist
//   const user = await User.findOne({ email });
//   console.log("got user");
//   if (user) {
//     // bcrypt pass compare
//     const passwordCompare = bcrypt.compare(password, user.password);
//     // console.log("got password");
//     if (passwordCompare) {
//       const token = createToken(user._id);
//       // console.log(token);
//       res.send(`user ${user} \n token ${token}`);
//     }
//     // console.log(user);
//     res.send({ message: "password is wrong" });
//   }
//   res.send({ message: "user not found" });
// });

// booking-app

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
