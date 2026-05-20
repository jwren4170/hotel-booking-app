import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, {
	type Express,
	type NextFunction,
	type Request,
	type Response,
} from "express";
import { auth } from "./auth.ts";
import listingRoutes from "./routes/listing.route.ts";
import userRoutes from "./routes/user.route.ts";
import { env } from "./utils/env.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app: Express = express();
const PORT = 3000;

app.use(
	cors({
		origin: env.CLIENT_URL,
		credentials: true,
	}),
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.use("/api/uploads", express.static(resolve(__dirname, "uploads")));
app.use("/api/user", userRoutes);
app.use("/api/listing", listingRoutes);

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
	console.log(`App listening on http://localhost:${PORT}`);
});
