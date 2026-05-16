import "dotenv/config";

function required(name: string): string {
	const v = process.env[name];
	if (!v) throw new Error(`Missing required env var: ${name}`);
	return v;
}

export const env = {
	DATABASE_URI: required("DATABASE_URI"),
	BETTER_AUTH_SECRET: required("BETTER_AUTH_SECRET"),
	BETTER_AUTH_URL: required("BETTER_AUTH_URL"),
	CLIENT_URL: required("CLIENT_URL"),
	GOOGLE_CLIENT_ID: required("GOOGLE_CLIENT_ID"),
	GOOGLE_CLIENT_SECRET: required("GOOGLE_CLIENT_SECRET"),
};
