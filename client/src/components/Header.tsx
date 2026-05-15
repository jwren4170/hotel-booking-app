import { type SubmitEvent, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
	const { currentUser } = useSelector(
		(state: { user: { currentUser: { avatar: string } | null } }) => state.user,
	);
	const [searchTerm, setSearchTerm] = useState("");
	const navigate = useNavigate();
	const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("searchTerm", searchTerm);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		if (searchTermFromUrl) {
			setSearchTerm(searchTermFromUrl);
		}
	}, []);
	return (
		<header className="bg-slate-200 shadow-md">
			<div className="flex justify-between items-center mx-auto p-3 max-w-6xl">
				<Link to="/">
					<h1 className="flex flex-wrap font-bold text-sm sm:text-xl">
						<span className="text-slate-500">Sahand</span>
						<span className="text-slate-700">Estate</span>
					</h1>
				</Link>
				<form
					onSubmit={handleSubmit}
					className="flex items-center bg-slate-100 p-3 rounded-lg"
				>
					<input
						type="text"
						placeholder="Search..."
						className="bg-transparent focus:outline-none w-24 sm:w-64"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<button>
						<FaSearch className="text-slate-600" />
					</button>
				</form>
				<ul className="flex gap-4 text-lg">
					<Link to="/">
						<li className="hidden sm:inline text-slate-700 hover:underline">
							Home
						</li>
					</Link>
					<Link to="/about">
						<li className="hidden sm:inline text-slate-700 hover:underline">
							About
						</li>
					</Link>
					<Link to="/profile">
						{currentUser ? (
							<div className="flex gap-2">
								<img
									referrerPolicy="no-referrer"
									className="rounded-full w-7 h-7 object-cover"
									src={currentUser.avatar}
									alt="profile"
								/>
							</div>
						) : (
							<li className="text-slate-700 hover:underline"> Sign in</li>
						)}
					</Link>
				</ul>
			</div>
		</header>
	);
}
