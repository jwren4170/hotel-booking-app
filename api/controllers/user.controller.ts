import { unlink } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { hashSync } from "bcrypt-ts";
import type { NextFunction, Response } from "express";
import { AVATARS_DIR } from "../middleware/uploadAvatar.ts";
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

export const update = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (req.user?.id !== req.params.id) {
			return next(errorHandler(403, "You can only update your own account!"));
		}

		const { username, email, password } = req.body as {
			username?: string;
			email?: string;
			password?: string;
		};
		const updates: { username?: string; email?: string; password?: string } =
			{};
		if (username !== undefined) updates.username = username;
		if (email !== undefined) updates.email = email;
		if (password) updates.password = hashSync(password, 10);

		const updated = await User.findByIdAndUpdate(req.params.id, updates, {
			new: true,
			runValidators: true,
		}).select("-password");
		if (!updated) return next(errorHandler(404, "User not found!"));

		res.status(200).json(updated);
	} catch (error) {
		next(error);
	}
};

export const updateAvatar = async (
	req: AuthedRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.file) return next(errorHandler(400, "No file uploaded"));
		const userId = req.user?.id;
		if (!userId) return next(errorHandler(401, "Unauthorized"));

		const previous = await User.findById(userId).select("avatar");
		const newAvatarUrl = `/api/uploads/avatars/${req.file.filename}`;

		const updated = await User.findByIdAndUpdate(
			userId,
			{ avatar: newAvatarUrl },
			{ new: true },
		).select("-password");
		if (!updated) return next(errorHandler(404, "User not found!"));

		if (previous?.avatar?.startsWith("/api/uploads/avatars/")) {
			const oldName = basename(previous.avatar);
			if (oldName !== req.file.filename) {
				await unlink(resolve(AVATARS_DIR, oldName)).catch(() => undefined);
			}
		}

		res.status(200).json(updated);
	} catch (error) {
		next(error);
	}
};
