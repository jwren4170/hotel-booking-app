import "dotenv/config";

function required(name: string): string {
	const v = process.env[name];
	if (!v) throw new Error(`Missing required env var: ${name}`);
	return v;
}

export const env = {
	JWT_SECRET: required("JWT_SECRET"),
	DATABASE_URI: required("DATABASE_URI"),
};
