import express from "express";
import {
	createListing,
	deleteListing,
	getListing,
	getListings,
	updateListing,
	uploadListingImages,
} from "../controllers/listing.controller.ts";
import { uploadListingImagesArray } from "../middleware/uploadListingImages.ts";
import { verifyToken } from "../utils/verifyUser.ts";

const listingRoutes = express.Router();

listingRoutes.post("/create", verifyToken, createListing);
listingRoutes.post(
	"/upload-images",
	verifyToken,
	uploadListingImagesArray,
	uploadListingImages,
);
// listingRoutes.delete("/delete/:id", verifyToken, deleteListing);
// listingRoutes.post("/update/:id", verifyToken, updateListing);
listingRoutes.get("/get/:id", getListing);
// listingRoutes.get("/get", getListings);

export default listingRoutes;
