import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import About from "./pages/about";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Signin from "./pages/sign-in";
import SignOut from "./pages/sign-out";

function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/sign-in" element={<Signin />} />
				<Route path="/sign-out" element={<SignOut />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
