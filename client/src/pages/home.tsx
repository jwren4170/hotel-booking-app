import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import ErrorBoundary from "../components/ErrorBoundary";
import ListingItem from "../components/ListingItem";

const Home = () => {
	const [offerListings, setOfferListings] = useState<Listing[]>([]);
	const [saleListings, setSaleListings] = useState<Listing[]>([]);
	const [rentListings, setRentListings] = useState<Listing[]>([]);
	SwiperCore.use([Navigation]);
	useEffect(() => {
		const fetchOfferListings = async () => {
			try {
				const res = await fetch("/api/listing/get?offer=true&limit=4");
				const data = await res.json();
				setOfferListings(data);
				fetchRentListings();
			} catch (error) {
				console.log(error);
			}
		};
		const fetchRentListings = async () => {
			try {
				const res = await fetch("/api/listing/get?type=rent&limit=4");
				const data = await res.json();
				setRentListings(data);
				fetchSaleListings();
			} catch (error) {
				console.log(error);
			}
		};

		const fetchSaleListings = async () => {
			try {
				const res = await fetch("/api/listing/get?type=sale&limit=4");
				const data = await res.json();
				setSaleListings(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchOfferListings();
	}, []);
	return (
		<div>
			{/* top */}
			<div className="flex flex-col gap-6 mx-auto p-28 px-3 max-w-6xl">
				<h1 className="font-bold text-slate-700 text-3xl lg:text-6xl">
					Find your next <span className="text-slate-500">perfect</span>
					<br />
					place with ease
				</h1>
				<div className="text-gray-400 text-xs sm:text-sm">
					Sahand Estate is the best place to find your next perfect place to
					live.
					<br />
					We have a wide range of properties for you to choose from.
				</div>
				<Link
					to={"/search"}
					className="font-bold text-blue-800 text-xs sm:text-sm hover:underline"
				>
					Let's get started...
				</Link>
			</div>

			{/* swiper */}
			<ErrorBoundary fallback={<div>Couldn't load listings</div>}>
				<Swiper navigation>
					{offerListings &&
						offerListings.length > 0 &&
						offerListings.map((listing) => (
							<SwiperSlide>
								<div
									style={{
										background: `url(${listing.imageUrls[0]}) center no-repeat`,
										backgroundSize: "cover",
									}}
									className="h-125"
									key={listing._id}
								></div>
							</SwiperSlide>
						))}
				</Swiper>
			</ErrorBoundary>
			{/* listing results for offer, sale and rent */}

			<div className="flex flex-col gap-8 mx-auto my-10 p-3 max-w-6xl">
				{offerListings && offerListings.length > 0 && (
					<div className="">
						<div className="my-3">
							<h2 className="font-semibold text-slate-600 text-2xl">
								Recent offers
							</h2>
							<Link
								className="text-blue-800 text-sm hover:underline"
								to={"/search?offer=true"}
							>
								Show more offers
							</Link>
						</div>
						<div className="flex flex-wrap gap-4">
							{offerListings.map((listing) => (
								<ListingItem listing={listing} key={listing._id} />
							))}
						</div>
					</div>
				)}
				{rentListings && rentListings.length > 0 && (
					<div className="">
						<div className="my-3">
							<h2 className="font-semibold text-slate-600 text-2xl">
								Recent places for rent
							</h2>
							<Link
								className="text-blue-800 text-sm hover:underline"
								to={"/search?type=rent"}
							>
								Show more places for rent
							</Link>
						</div>
						<div className="flex flex-wrap gap-4">
							{rentListings.map((listing) => (
								<ListingItem listing={listing} key={listing._id} />
							))}
						</div>
					</div>
				)}
				{saleListings && saleListings.length > 0 && (
					<div className="">
						<div className="my-3">
							<h2 className="font-semibold text-slate-600 text-2xl">
								Recent places for sale
							</h2>
							<Link
								className="text-blue-800 text-sm hover:underline"
								to={"/search?type=sale"}
							>
								Show more places for sale
							</Link>
						</div>
						<div className="flex flex-wrap gap-4">
							{saleListings.map((listing) => (
								<ListingItem listing={listing} key={listing._id} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
