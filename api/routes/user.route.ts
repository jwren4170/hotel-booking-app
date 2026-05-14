import express from "express";
import { me } from "../controllers/user.controller.ts";
import { verifyToken } from "../utils/verifyToken.ts";

const router = express.Router();

router.get("/me", verifyToken, me);

export default router;
