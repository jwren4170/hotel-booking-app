declare interface ListingFormData {
	imageUrls: string[];
	name: string;
	description: string;
	address: string;
	type: "sale" | "rent";
	bedrooms: number;
	bathrooms: number;
	regularPrice: number;
	discountPrice: number;
	offer: boolean;
	parking: boolean;
	furnished: boolean;
}

declare interface Listing extends ListingFormData {
	_id: string;
	userRef: string;
}

declare interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback: React.ReactNode;
}

declare interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}
