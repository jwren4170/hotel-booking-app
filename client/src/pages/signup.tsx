import { type ChangeEvent, type SubmitEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { authClient } from "../lib/authClient";

type SignUpFormData = {
	username?: string;
	email?: string;
	password?: string;
};

const SignUp = () => {
	const [formData, setFormData] = useState<SignUpFormData>({});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { username, email, password } = formData;
		if (!username || !email || !password) {
			setError("All fields are required");
			return;
		}
		setLoading(true);
		setError(null);
		const { error: signUpError } = await authClient.signUp.email({
			email,
			password,
			name: username,
			username,
		});
		setLoading(false);
		if (signUpError) {
			setError(signUpError.message ?? "Sign up failed");
			return;
		}
		navigate("/");
	};
	return (
		<div className="mx-auto p-3 max-w-lg">
			<h1 className="my-7 font-semibold text-3xl text-center">Sign Up</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					type="text"
					placeholder="username"
					className="p-3 border rounded-lg"
					id="username"
					onChange={handleChange}
				/>
				<input
					type="email"
					placeholder="email"
					className="p-3 border rounded-lg"
					id="email"
					onChange={handleChange}
				/>
				<input
					type="password"
					placeholder="password"
					className="p-3 border rounded-lg"
					id="password"
					onChange={handleChange}
				/>

				<button
					type="submit"
					disabled={loading}
					className="bg-slate-700 hover:opacity-95 disabled:opacity-80 p-3 rounded-lg text-white uppercase"
				>
					{loading ? "Loading..." : "Sign Up"}
				</button>
				<OAuth />
			</form>
			<div className="flex gap-2 mt-5">
				<p>Have an account?</p>
				<Link to={"/signin"}>
					<span className="text-blue-700">Sign in</span>
				</Link>
			</div>
			{error && <p className="mt-5 text-red-500">{error}</p>}
		</div>
	);
};

export default SignUp;
