import { Router } from "express";
import { isLoggedIn } from "../../Middlewares/isLoggedIn.js";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  updateRoomStatus,
} from "../../Controllers/Rooms/RoomController.js";

export const router = Router();

// create a new room
router.route("/create").post(isLoggedIn, createRoom);
router.route("/").get(getAllRooms).get(isLoggedIn, getRoomById);

router.route("/updateStatus").put(isLoggedIn, updateRoomStatus);

router.route("/").delete(isLoggedIn, deleteRoom);
