import express from "express";
import { updateAvatar } from "../controllers/user.controller.ts";
import { uploadAvatarSingle } from "../middleware/uploadAvatar.ts";

const router = express.Router();

router.post("/avatar", uploadAvatarSingle, updateAvatar);

export default router;
