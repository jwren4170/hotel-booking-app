import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { auth } from "../auth.ts";
import { errorHandler } from "./error.ts";

type SessionUser =
	Awaited<ReturnType<typeof auth.api.getSession>> extends infer S
		? S extends { user: infer U }
			? U
			: never
		: never;

declare global {
	// biome-ignore lint/style/noNamespace: Express type augmentation requires namespace merging.
	namespace Express {
		interface Request {
			user?: SessionUser;
		}
	}
}

export const verifyToken = async (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	try {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		});
		if (!session) return next(errorHandler(401, "Unauthorized"));
		req.user = session.user;
		next();
	} catch {
		next(errorHandler(401, "Unauthorized"));
	}
};
