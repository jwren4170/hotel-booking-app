import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import { useSession } from "./lib/authClient";
import About from "./pages/about";
import CreateListing from "./pages/create";
import Home from "./pages/home";
import Listing from "./pages/listing";
import Profile from "./pages/profile";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";

function App() {
	const { isPending } = useSession();
	if (isPending) return null;
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
				<Route path="/create" element={<CreateListing />} />
				<Route path="/listing/:id" element={<Listing />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
