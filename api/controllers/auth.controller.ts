import { hashSync } from "bcrypt-ts";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import { User } from "../models/user.model.ts";
import { errorHandler } from "../utils/error.ts";

const router = express.Router();

export const signup = router.post(
	"/signup",
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password, username } = req.body;
		const hashedPassword = hashSync(password, 10);
		const newUser = new User({ email, password: hashedPassword, username });
		try {
			await newUser.save();
			res.status(201).json("User created successfully!");
		} catch (error: any) {
			next(error);
		}
	},
);

export const signin = router.post("/signin", (req: Request, res: Response) => {
	console.log(req.body);
	res.json({ message: "Sign in successfull" });
});
