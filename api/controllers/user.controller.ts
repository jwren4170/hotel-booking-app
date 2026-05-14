import type { NextFunction, Response } from "express";
import { User } from "../models/user.model.ts";
import { errorHandler } from "../utils/error.ts";
import type { AuthedRequest } from "../utils/verifyToken.ts";

export const me = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await User.findById(req.user?.id).select("-password");
		if (!user) return next(errorHandler(404, "User not found!"));
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};
