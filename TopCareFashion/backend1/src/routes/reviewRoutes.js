import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";
import Review from "../models/Review.js";
import Purchase from "../models/Purchase.js";
import Listing from "../models/Listing.js";

const router = express.Router();

// Buyer creates a review for a seller
router.post("/", protectRoute, async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;

    if (!listingId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const hasPurchased = await Purchase.exists({
      user: req.user._id,
      "items.listing": listingId
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: "You can only review listings you've purchased" });
    }

    const existingReview = await Review.findOne({
      buyer: req.user._id,
      listing: listingId
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this listing" });
    }

    const review = new Review({
      buyer: req.user._id,
      seller: listing.user,
      listing: listing._id,
      rating,
      comment
    });

    const reviews = await Review.find({ seller: listing.user })
  .populate({
    path: 'buyer',
    select: 'username profileImage'
  })
  .populate({
    path: 'listing',
    select: 'title image'
  })
  .sort({ createdAt: -1 });


    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Seller profile page: show all reviews received (regardless of being a buyer)
router.get("/seller/:sellerId", async (req, res) => {
  try {
    //const reviews = await Review.find({ seller: req.params.sellerId })
    const reviews = await Review.find({ seller: sellerId })
      .populate("buyer", "username profileImage")
      .populate("listing", "title image")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching seller reviews:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Admin can view all reviews on the platform
router.get("/all", protectRoute, isAdmin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("buyer", "username profileImage") // populate buyer username & image only
      .populate("listing", "title")               // populate listing title only
      .sort({ createdAt: -1 });                    // newest first

    res.json(reviews);
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
});

// Public: Get featured reviews (e.g. for homepage)
router.get("/featured", async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 }) // Sort most recent first
      .limit(5)                 // Limit to top 5
      .populate("buyer", "username profileImage") // Include profile image
      .populate("listing", "title image")     // Include listing details
      .select("comment buyer listing createdAt") // Only send what's needed
      .lean();                 // Return plain JS objects

    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching featured reviews:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
