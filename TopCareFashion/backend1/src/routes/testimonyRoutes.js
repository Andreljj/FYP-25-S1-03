import express from "express";
import Testimony from "../models/Testimony.js";
import protectRoute from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";

const router = express.Router();

// Create a testimony (registered users only)
router.post("/", protectRoute, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message is required" });
    }

    const newTestimony = new Testimony({
      user: req.user._id,
      message,
      featured: true,
    });

    const saved = await newTestimony.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all testimonies (admin only)
router.get("/", protectRoute, isAdmin, async (req, res) => {
  try {
    const testimonies = await Testimony.find()
      .populate("user", "username email profileImage")
      .sort({ createdAt: -1 });

    res.json(testimonies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get featured testimonies (public, e.g. for homepage)
router.get("/featured", async (req, res) => {
  try {
    const featured = await Testimony.find({ featured: true })
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 });

    res.json(featured);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feature/unfeature a testimony (admin only)
router.patch("/:id/feature", protectRoute, isAdmin, async (req, res) => {
  try {
    const testimony = await Testimony.findById(req.params.id);
    if (!testimony) return res.status(404).json({ message: "Testimony not found" });

    testimony.featured = !testimony.featured;
    await testimony.save();

    res.json({ message: `Testimony ${testimony.featured ? "featured" : "unfeatured"}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
