import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "./env.ts";
import { errorHandler } from "./error.ts";

export interface AuthedRequest extends Request {
	user?: { id: string };
}

export const verifyToken = (
	req: AuthedRequest,
	_res: Response,
	next: NextFunction,
) => {
	const token = req.cookies?.access_token;
	if (!token) return next(errorHandler(401, "Unauthorized"));

	jwt.verify(
		token,
		env.JWT_SECRET,
		(
			err: jwt.VerifyErrors | null,
			decoded: string | jwt.JwtPayload | undefined,
		) => {
			if (err || !decoded || typeof decoded === "string") {
				return next(errorHandler(403, "Forbidden"));
			}
			req.user = { id: (decoded as jwt.JwtPayload).id as string };
			next();
		},
	);
};
