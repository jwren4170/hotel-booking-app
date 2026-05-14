// client/src/env.ts
function required(name: string, value: string | undefined): string {
	if (!value) throw new Error(`Missing required env var: ${name}`);
	return value;
}

export const env = {
	FIREBASE_API_KEY: required(
		"VITE_FIREBASE_API_KEY",
		import.meta.env.VITE_FIREBASE_API_KEY,
	),
	FIREBASE_AUTHDOMAIN: required(
		"VITE_FIREBASE_AUTHDOMAIN",
		import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
	),
	FIREBASE_PROJECT_ID: required(
		"VITE_PROJECT_ID",
		import.meta.env.VITE_FIREBASE_PROJECT_ID,
	),
	FIREBASE_STORAGE_BUCKET: required(
		"VITE_PROJECT_ID",
		import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	),
	FIREBASE_MESSAGING_SENDER_ID: required(
		"VITE_PROJECT_ID",
		import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	),
	FIREBASE_APP_ID: required(
		"VITE_PROJECT_ID",
		import.meta.env.VITE_FIREBASE_APP_ID,
	),
	FIREBASE_MEASUREMENT_ID: required(
		"VITE_PROJECT_ID",
		import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
	),
};
