import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import express, {
	type Express,
	type NextFunction,
	type Request,
	type Response,
} from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.ts";
import userRoutes from "./routes/user.route.ts";
import { env } from "./utils/env.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

mongoose
	.connect(env.DATABASE_URI)
	.then(() => {
		console.log("DB connected successfully");
	})
	.catch((e) => {
		console.log(`Something went wrong ${e.message}`);
	})
	.finally(() => {
		console.log("Nodemon is listening for changes");
	});

const app: Express = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/uploads", express.static(resolve(__dirname, "uploads")));
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use(
	(
		err: { statusCode: number; message: string },
		_req: Request,
		res: Response,
		_next: NextFunction,
	) => {
		const statusCode = err.statusCode || 500;
		const message = err.message || "Internal Server Error";
		return res.status(statusCode).json({
			success: false,
			statusCode,
			message,
		});
	},
);

app.listen(PORT, () => {
	console.log(`App listing on http://localhost:${PORT}`);
});
