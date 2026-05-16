import { existsSync, mkdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { errorHandler } from "../utils/error.ts";
import type { AuthedRequest } from "../utils/verifyToken.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const AVATARS_DIR = resolve(__dirname, "..", "uploads", "avatars");

if (!existsSync(AVATARS_DIR)) {
	mkdirSync(AVATARS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, AVATARS_DIR),
	filename: (req, file, cb) => {
		const userId = (req as AuthedRequest).user?.id ?? "anon";
		const ext = extname(file.originalname).toLowerCase().slice(0, 5) || ".png";
		cb(null, `${userId}-${Date.now()}${ext}`);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 2 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		if (!file.mimetype.startsWith("image/")) {
			cb(new Error("Only image files are allowed"));
			return;
		}
		cb(null, true);
	},
});

export const uploadAvatarSingle = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	upload.single("avatar")(req, res, (err: unknown) => {
		if (!err) return next();
		if (err instanceof multer.MulterError) {
			const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
			return next(errorHandler(status, err.message));
		}
		const message = err instanceof Error ? err.message : "Upload failed";
		next(errorHandler(400, message));
	});
};
