import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

export default function ListingItem({ listing }: { listing: Listing }) {
	return (
		<div className="bg-white shadow-md hover:shadow-lg rounded-lg w-full sm:w-82.5 overflow-hidden transition-shadow">
			<Link to={`/listing/${listing._id}`}>
				<img
					src={
						listing.imageUrls[0] ||
						"https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
					}
					alt="listing cover"
					className="w-full h-80 sm:h-55 object-cover hover:scale-105 transition-scale duration-300"
				/>
				<div className="flex flex-col gap-2 p-3 w-full">
					<p className="font-semibold text-slate-700 text-lg truncate">
						{listing.name}
					</p>
					<div className="flex items-center gap-1">
						<MdLocationOn className="w-4 h-4 text-green-700" />
						<p className="w-full text-gray-600 text-sm truncate">
							{listing.address}
						</p>
					</div>
					<p className="text-gray-600 text-sm line-clamp-2">
						{listing.description}
					</p>
					<p className="mt-2 font-semibold text-slate-500">
						$
						{listing.offer
							? listing.discountPrice.toLocaleString("en-US")
							: listing.regularPrice.toLocaleString("en-US")}
						{listing.type === "rent" && " / month"}
					</p>
					<div className="flex gap-4 text-slate-700">
						<div className="font-bold text-xs">
							{listing.bedrooms > 1
								? `${listing.bedrooms} beds `
								: `${listing.bedrooms} bed `}
						</div>
						<div className="font-bold text-xs">
							{listing.bathrooms > 1
								? `${listing.bathrooms} baths `
								: `${listing.bathrooms} bath `}
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
}
