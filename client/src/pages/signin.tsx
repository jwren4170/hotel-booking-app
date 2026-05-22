import {
	type ChangeEvent,
	type SubmitEventHandler,
	useEffect,
	useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { authClient, useSession } from "../lib/authClient";

const SignIn = () => {
	const [formData, setFormData] = useState<SignInFormData>({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { data: session } = useSession();

	useEffect(() => {
		if (session?.user) navigate("/profile", { replace: true });
	}, [session, navigate]);
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};
	const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const { email, password } = formData;
		if (!email || !password) {
			setError("Email and password are required");
			return;
		}
		setLoading(true);
		setError(null);
		const { error: signInError } = await authClient.signIn.email({
			email,
			password,
		});
		setLoading(false);
		if (signInError) {
			setError(signInError.message ?? "Sign in failed");
			return;
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
