import express from "express";
import Listing from "../models/Listing.js";
import User from "../models/User.js";

const router = express.Router();

// GET /api/search?query=top
router.get("/", async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const regex = new RegExp(query, "i"); // case-insensitive search

    // Find listings by title
    const listings = await Listing.find({ title: { $regex: regex } }).select("title price image");

    // Find users by name or username
    const users = await User.find({ name: { $regex: regex } }).select("name email");

    res.json({
      listings,
      users,
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error during search" });
  }
});

export default router;
