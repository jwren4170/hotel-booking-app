import {
	type ChangeEvent,
	type SubmitEventHandler,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authClient, useSession } from "../lib/authClient";

export default function Profile() {
	const fileRef = useRef<HTMLInputElement>(null);
	const { data: session, refetch } = useSession();
	const currentUser = session?.user;
	const [file, setFile] = useState<File | undefined>(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [showListingsError, setShowListingsError] = useState(false);
	const [userListings, setUserListings] = useState<Listing[]>([]);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const handleShowListings = useCallback(async () => {
		if (!currentUser) return;
		try {
			setShowListingsError(false);
			const res = await fetch(
				`/api/listing/get?userRef=${encodeURIComponent(currentUser.id)}`,
				{ credentials: "include" },
			);
			const data = await res.json();
			if (data.success === false) {
				setShowListingsError(true);
				return;
			}
			setUserListings(data);
		} catch {
			setShowListingsError(true);
		}
	}, [currentUser]);

	useEffect(() => {
		if (searchParams.get("listings") === "1") {
			handleShowListings();
		}
	}, [searchParams, handleShowListings]);

	useEffect(() => {
		if (!file) return;

		setFilePerc(0);
		setFileUploadError(false);

		const xhr = new XMLHttpRequest();
		xhr.open("POST", "/api/user/avatar");
		xhr.withCredentials = true;

		xhr.upload.addEventListener(
			"progress",
			(e: ProgressEvent<XMLHttpRequestEventTarget>) => {
				if (e.lengthComputable) {
					setFilePerc(Math.round((e.loaded / e.total) * 100));
				}
			},
		);

		xhr.addEventListener("load", () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				setFilePerc(100);
				refetch();
			} else {
				setFileUploadError(true);
			}
		});

		xhr.addEventListener("error", () => setFileUploadError(true));

		const body = new FormData();
		body.append("avatar", file);
		xhr.send(body);

		return () => xhr.abort();
	}, [file, refetch]);

	if (!currentUser) return null;

	const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};

	const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (!username || username === currentUser.username) return;
		setLoading(true);
		setError(null);
		setUpdateSuccess(false);
		const { error: updateError } = await authClient.updateUser({ username });
		setLoading(false);
		if (updateError) {
			setError(updateError.message ?? "Update failed");
			return;
		}
		setUpdateSuccess(true);
	};

	const handleDeleteUser = async () => {
		setError(null);
		const { error: deleteError } = await authClient.deleteUser();
		if (deleteError) {
			setError(deleteError.message ?? "Delete failed");
			return;
		}
		navigate("/signin", { replace: true });
	};

	const handleSignOut = async () => {
		setError(null);
		await authClient.signOut();
		navigate("/signin", { replace: true });
	};

	const handleListingDelete = async (listingId: string) => {
		try {
			const res = await fetch(`/api/listing/delete/${listingId}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				console.log(data.message);
				return;
			}

			setUserListings((prev) =>
				prev.filter((listing) => listing._id !== listingId),
			);
		} catch (error) {
			console.log(error instanceof Error ? error.message : String(error));
		}
	};
	return (
		<div className="mx-auto p-3 max-w-lg">
			<h1 className="my-7 font-semibold text-3xl text-center">Profile</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					onChange={(e) => setFile(e.target.files?.[0])}
					id="avatar"
					type="file"
					ref={fileRef}
					hidden
					accept="image/*"
				/>
				<img
					onClick={() => fileRef.current?.click()}
					src={currentUser.image ?? "/images/default-avatar.png"}
					alt="profile"
					className="self-center mt-2 rounded-full w-24 h-24 object-cover cursor-pointer"
				/>
				<p className="self-center text-sm">
					{fileUploadError ? (
						<span className="text-red-700">
							Error Image upload (image must be less than 2 mb)
						</span>
					) : filePerc > 0 && filePerc < 100 ? (
						<span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
					) : filePerc === 100 ? (
						<span className="text-green-700">Image successfully uploaded!</span>
					) : (
						""
					)}
				</p>
				<input
					type="text"
					placeholder="username"
					defaultValue={currentUser.username}
					id="username"
					className="p-3 border rounded-lg"
					onChange={handleUsernameChange}
					autoComplete="true"
				/>
				<input
					type="email"
					id="email"
					defaultValue={currentUser.email}
					disabled
					className="bg-slate-100 p-3 border rounded-lg text-slate-500"
					autoComplete="true"
				/>
				<button
					disabled={loading}
					className="bg-slate-700 hover:opacity-95 disabled:opacity-80 p-3 rounded-lg text-white uppercase"
				>
					{loading ? "Loading..." : "Update"}
				</button>
				<Link
					className="bg-green-700 hover:opacity-95 p-3 rounded-lg text-white text-center uppercase"
					to={"/create"}
				>
					Create Listing
				</Link>
			</form>
			<div className="flex justify-between mt-5">
				<span
					onClick={handleDeleteUser}
					className="text-red-700 cursor-pointer"
				>
					Delete account
				</span>
				<span onClick={handleSignOut} className="text-red-700 cursor-pointer">
					Sign out
				</span>
			</div>

			<p className="mt-5 text-red-700">{error ? error : ""}</p>
			<p className="mt-5 font-bold text-green-700 text-xl text-center">
				{updateSuccess ? "User is updated successfully!" : ""}
			</p>
			{/* <button onClick={handleShowListings} className="w-full text-green-700">
				Show Listings
			</button> */}
			<p className="mt-5 text-red-700">
				{showListingsError ? "Error showing listings" : ""}
			</p>

			{userListings && userListings.length > 0 && (
				<div className="flex flex-col gap-4">
					<h1 className="mt-7 font-semibold text-2xl text-center">
						Your Listings
					</h1>
					{userListings.map((listing) => (
						<div
							key={listing._id}
							className="flex justify-between items-center gap-4 p-3 border rounded-lg"
						>
							<Link to={`/listing/${listing._id}`}>
								<img
									src={listing.imageUrls[0]}
									alt="listing cover"
									className="w-16 h-16 object-contain"
								/>
							</Link>
							<Link
								className="flex-1 font-semibold text-slate-700 hover:underline truncate"
								to={`/listing/${listing._id}`}
							>
								<p>{listing.name}</p>
							</Link>

							<div className="flex flex-col item-center">
								<button
									onClick={() => handleListingDelete(listing._id)}
									className="text-red-700 uppercase"
								>
									Delete
								</button>
								<Link to={`/update/${listing._id}`}>
									<button className="text-green-700 uppercase">Edit</button>
								</Link>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
