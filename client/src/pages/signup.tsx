import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
	const [formData, setFormData] = useState({});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e: any) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			setLoading(true);
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			console.log(data);
			if (data.success === false) {
				setLoading(false);
				setError(data.message);
				return;
			}
			setLoading(false);
			setError(null);
			navigate("/sign-in");
		} catch (error: any) {
			setLoading(false);
			setError(error.message);
		}
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
