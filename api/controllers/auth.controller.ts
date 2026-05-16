import { compareSync, hashSync } from "bcrypt-ts";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.ts";
import { env } from "../utils/env.ts";
import { errorHandler } from "../utils/error.ts";

export const signup = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { email, password, username } = req.body;
	try {
		const hashedPassword = hashSync(password, 10);
		const newUser = new User({ email, password: hashedPassword, username });
		await newUser.save();
		const token = jwt.sign({ id: newUser._id }, env.JWT_SECRET, {
			expiresIn: "7d",
		});
		const { password: pass, ...rest } = newUser.toObject();
		res
			.cookie("access_token", token, {
				httpOnly: true,
				maxAge: 7 * 24 * 60 * 60 * 1000,
			})
			.status(201)
			.json(rest);
	} catch (error) {
		next(error);
	}
};

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

export const google = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			const token = jwt.sign({ id: user._id }, env.JWT_SECRET);
			const { password: pass, ...rest } = user.toObject();
			res
				.cookie("access_token", token, { httpOnly: true })
				.status(200)
				.json(rest);
		} else {
			const generatedPassword =
				Math.random().toString(36).slice(-8) +
				Math.random().toString(36).slice(-8);
			const hashedPassword = hashSync(generatedPassword, 10);
			const newUser = new User({
				username:
					req.body.name.split(" ").join("").toLowerCase() +
					Math.random().toString(36).slice(-4),
				email: req.body.email,
				password: hashedPassword,
			});
			await newUser.save();
			const token = jwt.sign({ id: newUser._id }, env.JWT_SECRET);
			const { password: pass, ...rest } = newUser.toObject();
			res
				.cookie("access_token", token, { httpOnly: true })
				.status(200)
				.json(rest);
		}
	} catch (error) {
		next(error);
	}
};
