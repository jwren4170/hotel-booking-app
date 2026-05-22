import { deleteUser, updateUser } from "better-auth/api";
import express from "express";
import {
	getUserListings,
	updateAvatar,
} from "../controllers/user.controller.ts";
import { uploadAvatarSingle } from "../middleware/uploadAvatar.ts";
import { verifyToken } from "../utils/verifyUser.ts";

const userRoutes = express.Router();

userRoutes.post("/avatar", uploadAvatarSingle, updateAvatar);
userRoutes.delete("/delete/:id", verifyToken, deleteUser);
userRoutes.post("/update/:id", verifyToken, updateUser);
userRoutes.get("/listings/:id", verifyToken, getUserListings);
// userRoutes.get("/:id", verifyToken, getUser);

export default userRoutes;
