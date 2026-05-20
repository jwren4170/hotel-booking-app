import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Listing {
	_id: string;
	name: string;
	description: string;
	address: string;
	regularPrice: number;
	discountPrice: number;
	bathrooms: number;
	bedrooms: number;
	furnished: boolean;
	parking: boolean;
	type: "sale" | "rent";
	offer: boolean;
	imageUrls: string[];
	userRef: string;
}

export default function Listing() {
	const { id } = useParams<{ id: string }>();
	const [listing, setListing] = useState<Listing | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		let cancelled = false;
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch(`/api/listing/get/${id}`, {
					credentials: "include",
				});
				const data = await res.json();
				if (cancelled) return;
				if (!res.ok || data.success === false) {
					setError(data.message ?? "Failed to load listing");
					setListing(null);
				} else {
					setListing(data);
				}
			} catch (err) {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : "Failed to load listing");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [id]);

	if (loading) {
		return <p className="my-7 text-2xl text-center">Loading...</p>;
	}
	if (error) {
		return <p className="my-7 text-red-700 text-2xl text-center">{error}</p>;
	}
	if (!listing) {
		return null;
	}

	const price = listing.offer ? listing.discountPrice : listing.regularPrice;

	return (
		<main className="mx-auto p-3 max-w-4xl">
			{listing.imageUrls.length > 0 && (
				<div className="gap-2 grid grid-cols-1 sm:grid-cols-2">
					{listing.imageUrls.map((url) => (
						<img
							key={url}
							src={url}
							alt={listing.name}
							className="rounded-lg w-full h-72 object-cover"
						/>
					))}
				</div>
			)}
			<div className="flex flex-col gap-4 mt-6">
				<h1 className="font-semibold text-2xl">
					{listing.name} - ${price.toLocaleString("en-US")}
					{listing.type === "rent" && " / month"}
				</h1>
				<p className="text-slate-700">{listing.address}</p>
				<div className="flex gap-4">
					<span className="bg-red-900 px-4 py-1 rounded-md w-full max-w-50 text-white text-center">
						{listing.type === "rent" ? "For Rent" : "For Sale"}
					</span>
					{listing.offer && (
						<span className="bg-green-900 px-4 py-1 rounded-md w-full max-w-50 text-white text-center">
							$
							{(listing.regularPrice - listing.discountPrice).toLocaleString(
								"en-US",
							)}{" "}
							off
						</span>
					)}
				</div>
				<p className="text-slate-800">
					<span className="font-semibold">Description - </span>
					{listing.description}
				</p>
				<ul className="flex flex-wrap items-center gap-4 sm:gap-6 font-semibold text-green-900 text-sm">
					<li>
						{listing.bedrooms} {listing.bedrooms > 1 ? "beds" : "bed"}
					</li>
					<li>
						{listing.bathrooms} {listing.bathrooms > 1 ? "baths" : "bath"}
					</li>
					<li>{listing.parking ? "Parking spot" : "No parking"}</li>
					<li>{listing.furnished ? "Furnished" : "Unfurnished"}</li>
				</ul>
			</div>
		</main>
	);
}
