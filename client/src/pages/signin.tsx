import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
	signInFailure,
	signInStart,
	signInSuccess,
} from "../redux/user/userSlice";

const SignIn = () => {
	const [formData, setFormData] = useState({});
	const { loading, error } = useAppSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const handleChange = (e: any) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			dispatch(signInStart());
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			console.log(data);
			if (data.success === false) {
				dispatch(signInFailure(data.message));
				return;
			}
			dispatch(signInSuccess(data));
			navigate("/");
		} catch (error: any) {
			dispatch(signInFailure(error.message));
		}
	};
	return (
		<div className="mx-auto p-3 max-w-lg">
			<h1 className="my-7 font-semibold text-3xl text-center">Sign In</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
					disabled={loading}
					className="bg-slate-700 hover:opacity-95 disabled:opacity-80 p-3 rounded-lg text-white uppercase"
				>
					{loading ? "Loading..." : "Sign In"}
				</button>
				<OAuth />
			</form>
			<div className="flex gap-2 mt-5">
				<p>Dont have an account?</p>
				<Link to={"/signup"}>
					<span className="text-blue-700">Sign up</span>
				</Link>
			</div>
			{error && <p className="mt-5 text-red-500">{error}</p>}
		</div>
	);
};

export default SignIn;
