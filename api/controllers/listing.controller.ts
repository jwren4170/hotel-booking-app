import type { NextFunction, Request, Response } from "express";
import { ObjectId, type SortDirection } from "mongodb";
import { listings } from "../models/listing.model.ts";
import { errorHandler } from "../utils/error.ts";

const firstString = (v: unknown, fallback: string = ""): string =>
	typeof v === "string" ? v : fallback;

const toObjectId = (id: unknown): ObjectId | null => {
	if (typeof id !== "string") return null;
	try {
		return new ObjectId(id);
	} catch {
		return null;
	}
};

export const createListing = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const now = new Date();
		const doc = { ...req.body, createdAt: now, updatedAt: now };
		const result = await listings.insertOne(doc);
		return res.status(201).json({ ...doc, _id: result.insertedId });
	} catch (error) {
		next(error);
	}
};

export const uploadListingImages = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const files = (req.files ?? []) as Express.Multer.File[];
		if (files.length === 0) {
			return next(errorHandler(400, "No files uploaded"));
		}
		const urls = files.map((f) => `/api/uploads/listings/${f.filename}`);
		res.status(200).json({ urls });
	} catch (error) {
		next(error);
	}
};

export const deleteListing = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const oid = toObjectId(req.params.id);
	if (!oid) return next(errorHandler(400, "Invalid listing id"));

	const listing = await listings.findOne({ _id: oid });
	if (!listing) {
		return next(errorHandler(404, "Listing not found!"));
	}

	if (!req.user) {
		return next(errorHandler(401, "Unauthorized"));
	}

	if (req.user.id !== listing.userRef) {
		return next(errorHandler(401, "You can only delete your own listings!"));
	}

	try {
		await listings.deleteOne({ _id: oid });
		res.status(200).json("Listing has been deleted!");
	} catch (error) {
		next(error);
	}
};

export const updateListing = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const oid = toObjectId(req.params.id);
	if (!oid) return next(errorHandler(400, "Invalid listing id"));

	const listing = await listings.findOne({ _id: oid });
	if (!listing) {
		return next(errorHandler(404, "Listing not found!"));
	}

	if (!req.user) {
		return next(errorHandler(401, "Unauthorized"));
	}

	if (req.user.id !== listing.userRef) {
		return next(errorHandler(401, "You can only update your own listings!"));
	}

	try {
		const {
			_id: _ignoredId,
			createdAt: _ignoredCreatedAt,
			...patch
		} = req.body ?? {};
		const result = await listings.findOneAndUpdate(
			{ _id: oid },
			{ $set: { ...patch, updatedAt: new Date() } },
			{ returnDocument: "after" },
		);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const getListing = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const oid = toObjectId(req.params.id);
		if (!oid) return next(errorHandler(400, "Invalid listing id"));

		const listing = await listings.findOne({ _id: oid });
		if (!listing) {
			return next(errorHandler(404, "Listing not found!"));
		}
		res.status(200).json(listing);
	} catch (error) {
		next(error);
	}
};

export const getListings = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const limit = parseInt(firstString(req.query.limit), 10) || 9;
		const startIndex = parseInt(firstString(req.query.startIndex), 10) || 0;

		const offerParam = firstString(req.query.offer);
		const furnishedParam = firstString(req.query.furnished);
		const parkingParam = firstString(req.query.parking);
		const typeParam = firstString(req.query.type);
		const searchTerm = firstString(req.query.searchTerm);
		const sort = firstString(req.query.sort, "createdAt");
		const order: SortDirection =
			firstString(req.query.order, "desc") === "asc" ? 1 : -1;

		const filter: Record<string, unknown> = {
			name: { $regex: searchTerm, $options: "i" },
			offer:
				offerParam === "" || offerParam === "false"
					? { $in: [false, true] }
					: offerParam === "true",
			furnished:
				furnishedParam === "" || furnishedParam === "false"
					? { $in: [false, true] }
					: furnishedParam === "true",
			parking:
				parkingParam === "" || parkingParam === "false"
					? { $in: [false, true] }
					: parkingParam === "true",
			type:
				typeParam === "" || typeParam === "all"
					? { $in: ["sale", "rent"] }
					: typeParam,
		};

		const results = await listings
			.find(filter)
			.sort({ [sort]: order })
			.skip(startIndex)
			.limit(limit)
			.toArray();

		return res.status(200).json(results);
	} catch (error) {
		next(error);
	}
};
