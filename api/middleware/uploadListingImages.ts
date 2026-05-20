import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { errorHandler } from "../utils/error.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const LISTING_IMAGES_DIR = resolve(
	__dirname,
	"..",
	"uploads",
	"listings",
);

if (!existsSync(LISTING_IMAGES_DIR)) {
	mkdirSync(LISTING_IMAGES_DIR, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, LISTING_IMAGES_DIR),
	filename: (_req, file, cb) => {
		const ext = extname(file.originalname).toLowerCase().slice(0, 5) || ".png";
		cb(null, `${randomUUID()}${ext}`);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 2 * 1024 * 1024, files: 6 },
	fileFilter: (_req, file, cb) => {
		if (!file.mimetype.startsWith("image/")) {
			cb(new Error("Only image files are allowed"));
			return;
		}
		cb(null, true);
	},
});

export const uploadListingImagesArray = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	upload.array("images", 6)(req, res, (err: unknown) => {
		if (!err) return next();
		if (err instanceof multer.MulterError) {
			const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
			return next(errorHandler(status, err.message));
		}
		const message = err instanceof Error ? err.message : "Upload failed";
		next(errorHandler(400, message));
	});
};
