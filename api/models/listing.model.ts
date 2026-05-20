import type { ObjectId } from "mongodb";
import { db } from "../auth.ts";

export interface Listing {
	_id: ObjectId;
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
	createdAt: Date;
	updatedAt: Date;
}

export const listings = db.collection<Listing>("listings");
