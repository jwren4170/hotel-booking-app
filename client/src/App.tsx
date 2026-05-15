import "./index.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import About from "./pages/about";
import Home from "./pages/home";
import Profile from "./pages/profile";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import { useAppDispatch } from "./redux/hooks";
import { signInSuccess } from "./redux/user/userSlice";

function App() {
	const dispatch = useAppDispatch();
	const [check, setCheck] = useState(false);

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const res = await fetch("/api/user/me");
				if (res.ok) dispatch(signInSuccess(await res.json()));
			} catch {
				// not signed in — leave currentUser as null
			} finally {
				setCheck(true);
			}
		};
		fetchMe();
	}, [dispatch]);

	if (!check) return null;
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route element={<PrivateRoute />}>
					<Route path="/profile" element={<Profile />} />
				</Route>
				<Route path="/signup" element={<SignUp />} />
				<Route path="/signin" element={<SignIn />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
