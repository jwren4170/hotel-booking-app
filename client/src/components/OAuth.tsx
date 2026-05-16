import { authClient } from "../lib/authClient";

const OAuth = () => {
	const handleGoogleClick = async () => {
		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: `${window.location.origin}/`,
			});
		} catch (error: unknown) {
			console.log("Could not sign in with google", error);
		}
	};
	return (
		<button
			onClick={handleGoogleClick}
			type="button"
			className="bg-red-700 hover:opacity-90 p-3 rounded-lg text-white uppercase"
		>
			Continue with google
		</button>
	);
};

export default OAuth;
