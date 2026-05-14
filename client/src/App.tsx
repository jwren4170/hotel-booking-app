import "./index.css";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import About from "./pages/about";
import Home from "./pages/home";
import Profile from "./pages/profile";
import SignIn from "./pages/signin";
import SignOut from "./pages/signout";
import SignUp from "./pages/signup";
import { useAppDispatch } from "./redux/hooks";
import { signInSuccess } from "./redux/user/userSlice";

function App() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const res = await fetch("/api/user/me");
				if (!res.ok) return;
				const user = await res.json();
				dispatch(signInSuccess(user));
			} catch {
				// not signed in — leave currentUser as null
			}
		};
		fetchMe();
	}, [dispatch]);

	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/signin" element={<SignIn />} />
				<Route path="/signout" element={<SignOut />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
