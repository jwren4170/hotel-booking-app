import express from "express";
import { me, update, updateAvatar } from "../controllers/user.controller.ts";
import { uploadAvatarSingle } from "../middleware/uploadAvatar.ts";
import { verifyToken } from "../utils/verifyToken.ts";

const router = express.Router();

router.get("/me", verifyToken, me);
router.post("/avatar", verifyToken, uploadAvatarSingle, updateAvatar);
router.post("/update/:id", verifyToken, update);

export default router;
