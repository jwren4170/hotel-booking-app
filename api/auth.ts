import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { env } from "./utils/env.ts";

const client = new MongoClient(env.DATABASE_URI);
const db = client.db();

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,
	trustedOrigins: [env.CLIENT_URL],
	database: mongodbAdapter(db, { transaction: false }),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
	user: {
		additionalFields: {
			username: { type: "string", required: true, input: true },
		},
		deleteUser: {
			enabled: true,
		},
	},
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					const data = user as typeof user & { username?: string };
					if (!data.username) {
						const base =
							(data.name ?? data.email.split("@")[0] ?? "user")
								.toLowerCase()
								.replace(/[^a-z0-9]/g, "") || "user";
						const suffix = Math.random().toString(36).slice(2, 6);
						data.username = `${base}${suffix}`;
					}
					return { data };
				},
			},
		},
	},
});
