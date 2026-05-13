import express, { type Express } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "./routes/user.route.ts";

mongoose
	.connect(process.env.DATABASE_URI as string)
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

app.use("/api/user", userRoutes);

app.listen(PORT, () => {
	console.log(`App listing on http://localhost:${PORT}`);
});
