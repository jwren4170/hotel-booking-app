import { type SubmitEventHandler, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { authClient, useSession } from "../lib/authClient";

export default function Header() {
	const { data: session } = useSession();
	const currentUser = session?.user;
	const [searchTerm, setSearchTerm] = useState("");
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLLIElement>(null);
	const navigate = useNavigate();
	const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("searchTerm", searchTerm);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		if (searchTermFromUrl) {
			setSearchTerm(searchTermFromUrl);
		}
	}, []);

	useEffect(() => {
		if (!menuOpen) return;
		const handlePointer = (e: MouseEvent) => {
			if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
		};
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setMenuOpen(false);
		};
		document.addEventListener("mousedown", handlePointer);
		document.addEventListener("keydown", handleKey);
		return () => {
			document.removeEventListener("mousedown", handlePointer);
			document.removeEventListener("keydown", handleKey);
		};
	}, [menuOpen]);

	const handleSignOut = async () => {
		setMenuOpen(false);
		await authClient.signOut();
		navigate("/signin", { replace: true });
	};
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
						id="search"
						placeholder="Search..."
						className="bg-transparent focus:outline-none w-24 sm:w-64"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<button>
						<FaSearch className="text-slate-600" />
					</button>
				</form>
				<ul className="flex items-center gap-4 text-lg">
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
					{currentUser ? (
						<li className="relative" ref={menuRef}>
							<button
								type="button"
								onClick={() => setMenuOpen((v) => !v)}
								aria-haspopup="menu"
								aria-expanded={menuOpen}
								aria-label="Account menu"
								className="group relative rounded-full focus:outline-none ring-2 ring-transparent hover:ring-slate-400 focus:ring-slate-500 transition cursor-pointer"
							>
								<img
									referrerPolicy="no-referrer"
									className="rounded-full w-7 h-7 object-cover"
									src={currentUser.image ?? "/images/default-avatar.png"}
									alt="profile"
								/>
							</button>
							{menuOpen && (
								<div
									role="menu"
									className="right-0 z-20 absolute bg-white shadow-lg mt-2 py-1 border border-slate-200 rounded-md w-44 text-base"
								>
									<Link
										to="/profile"
										role="menuitem"
										onClick={() => setMenuOpen(false)}
										className="block hover:bg-slate-100 px-3 py-2 text-slate-700"
									>
										Profile
									</Link>
									<Link
										to="/profile?listings=1"
										role="menuitem"
										onClick={() => setMenuOpen(false)}
										className="block hover:bg-slate-100 px-3 py-2 text-slate-700"
									>
										My listings
									</Link>
									<button
										type="button"
										role="menuitem"
										onClick={handleSignOut}
										className="block hover:bg-slate-100 px-3 py-2 w-full text-red-700 text-left"
									>
										Sign out
									</button>
								</div>
							)}
						</li>
					) : (
						<Link to="/signin">
							<li className="text-slate-700 hover:underline"> Sign in</li>
						</Link>
					)}
				</ul>
			</div>
		</header>
	);
}
