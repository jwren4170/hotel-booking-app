import express from "express";
import { index } from "../controllers/user.controller.ts";

const router = express.Router();

router.get("/", index);

export default router;
