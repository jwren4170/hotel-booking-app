import express, { type Express } from "express";

const app: Express = express();
const PORT = 3000;

app.listen(PORT, () => {
	console.log(`App listing on http://localhost:${PORT}`);
});
