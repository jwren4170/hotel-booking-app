import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			default:
				"https://i.pinimg.com/736x/b1/c2/07/b1c2076f5b5e3c1b4c9e518eb6db144d.jpg",
		},
	},
	{ timestamps: true },
);

export const User = mongoose.model("User", userSchema);
