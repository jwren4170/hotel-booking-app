import express from "express";
import { updateAvatar } from "../controllers/user.controller.ts";
import { uploadAvatarSingle } from "../middleware/uploadAvatar.ts";

const userRoutes = express.Router();

userRoutes.post("/avatar", uploadAvatarSingle, updateAvatar);

export default userRoutes;
