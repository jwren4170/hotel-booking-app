import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import {
	type ChangeEvent,
	type SubmitEventHandler,
	useEffect,
	useRef,
	useState,
} from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { useAppSelector } from "../redux/hooks";
import {
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	signOutUserFailure,
	signOutUserStart,
	signOutUserSuccess,
	updateUserFailure,
	updateUserStart,
	updateUserSuccess,
} from "../redux/user/userSlice";

interface Listing {
	_id: string;
	name: string;
	imageUrls: string[];
}

type ProfileFormData = Partial<
	Record<"username" | "email" | "password" | "avatar", string>
>;

export default function Profile() {
	const fileRef = useRef<HTMLInputElement>(null);
	const { currentUser, loading, error } = useAppSelector((state) => state.user);
	const [file, setFile] = useState<File | undefined>(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [formData, setFormData] = useState<ProfileFormData>({});
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [showListingsError, setShowListingsError] = useState(false);
	const [userListings, setUserListings] = useState<Listing[]>([]);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// firebase storage
	// allow read;
	// allow write: if
	// request.resource.size < 2 * 1024 * 1024 &&
	// request.resource.contentType.matches('image/.*')

	useEffect(() => {
		if (!file) return;

		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePerc(Math.round(progress));
			},
			() => {
				setFileUploadError(true);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
					setFormData((prev) => ({ ...prev, avatar: downloadURL })),
				);
			},
		);
	}, [file]);

	if (!currentUser) return null;

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.id as keyof ProfileFormData]: e.target.value,
		});
	};

	const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		try {
			dispatch(updateUserStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(updateUserFailure(data.message));
				return;
			}

			dispatch(updateUserSuccess(data));
			setUpdateSuccess(true);
		} catch (error) {
			dispatch(
				updateUserFailure(
					error instanceof Error ? error.message : String(error),
				),
			);
		}
	};

	const handleDeleteUser = async () => {
		try {
			dispatch(deleteUserStart());
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}
			dispatch(deleteUserSuccess(data));
		} catch (error) {
			dispatch(
				deleteUserFailure(
					error instanceof Error ? error.message : String(error),
				),
			);
		}
	};

	const handleSignOut = async () => {
		try {
			dispatch(signOutUserStart());
			const res = await fetch("/api/auth/signout");
			const data = await res.json();
			if (data.success === false) {
				dispatch(signOutUserFailure(data.message));
				return;
			}
			navigate("/signin", { replace: true });
			dispatch(signOutUserSuccess());
		} catch (error) {
			dispatch(
				signOutUserFailure(
					error instanceof Error ? error.message : String(error),
				),
			);
		}
	};

	const handleShowListings = async () => {
		try {
			setShowListingsError(false);
			const res = await fetch(`/api/user/listings/${currentUser._id}`);
			const data = await res.json();
			if (data.success === false) {
				setShowListingsError(true);
				return;
			}

			setUserListings(data);
		} catch {
			setShowListingsError(true);
		}
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
					type="file"
					ref={fileRef}
					hidden
					accept="image/*"
				/>
				<img
					onClick={() => fileRef.current?.click()}
					src={formData.avatar || currentUser.avatar}
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
					onChange={handleChange}
				/>
				<input
					type="email"
					placeholder="email"
					id="email"
					defaultValue={currentUser.email}
					className="p-3 border rounded-lg"
					onChange={handleChange}
				/>
				<input
					type="password"
					placeholder="password"
					onChange={handleChange}
					id="password"
					className="p-3 border rounded-lg"
				/>
				<button
					disabled={loading}
					className="bg-slate-700 hover:opacity-95 disabled:opacity-80 p-3 rounded-lg text-white uppercase"
				>
					{loading ? "Loading..." : "Update"}
				</button>
				<Link
					className="bg-green-700 hover:opacity-95 p-3 rounded-lg text-white text-center uppercase"
					to={"/create-listing"}
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
			<p className="mt-5 text-green-700">
				{updateSuccess ? "User is updated successfully!" : ""}
			</p>
			<button onClick={handleShowListings} className="w-full text-green-700">
				Show Listings
			</button>
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
								<Link to={`/update-listing/${listing._id}`}>
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
