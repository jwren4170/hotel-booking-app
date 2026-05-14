import { compareSync, hashSync } from "bcrypt-ts";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.ts";
import { env } from "../utils/env.ts";
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

export const signin = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { email, password } = req.body;
	try {
		const validUser = await User.findOne({ email });
		if (!validUser) return next(errorHandler(404, "User not found!"));
		const validPassword = compareSync(password, validUser.password);
		if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
		const token = jwt.sign({ id: validUser._id }, env.JWT_SECRET, {
			expiresIn: "7d",
		});
		const { password: pass, ...rest } = validUser.toObject();
		res
			.cookie("access_token", token, {
				httpOnly: true,
				maxAge: 7 * 24 * 60 * 60 * 1000,
			})
			.status(200)
			.json(rest);
	} catch (error) {
		next(error);
	}
};

export const signout = (_req: Request, res: Response, next: NextFunction) => {
	try {
		res
			.clearCookie("access_token")
			.status(200)
			.json({ message: "Signed out successfully" });
	} catch (error) {
		next(error);
	}
};
