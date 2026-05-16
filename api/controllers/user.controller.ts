import { unlink } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { auth } from "../auth.ts";
import { AVATARS_DIR } from "../middleware/uploadAvatar.ts";
import { errorHandler } from "../utils/error.ts";

export const updateAvatar = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.file) return next(errorHandler(400, "No file uploaded"));

		const headers = fromNodeHeaders(req.headers);
		const session = await auth.api.getSession({ headers });
		if (!session) {
			await unlink(resolve(AVATARS_DIR, req.file.filename)).catch(
				() => undefined,
			);
			return next(errorHandler(401, "Unauthorized"));
		}

		const previousImage = session.user.image ?? null;
		const newAvatarUrl = `/api/uploads/avatars/${req.file.filename}`;

		const updated = await auth.api.updateUser({
			body: { image: newAvatarUrl },
			headers,
		});

		if (previousImage?.startsWith("/api/uploads/avatars/")) {
			const oldName = basename(previousImage);
			if (oldName !== req.file.filename) {
				await unlink(resolve(AVATARS_DIR, oldName)).catch(() => undefined);
			}
		}

		res.status(200).json(updated);
	} catch (error) {
		next(error);
	}
};
