import express, { type Request, type Response } from "express";

const router = express.Router();

export const index = router.get("/", (req: Request, res: Response) => {
	res.json({ message: "Hello World!" });
});
