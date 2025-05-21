import express from "express";
import fs from "fs";
import axios from "axios";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import cloudinary from "../lib/cloudinary.js";
import Listing from "../models/Listing.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();


// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POST /api/listings/predict
router.post("/predict", protectRoute, async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: "Image is required" });

    // Upload to Cloudinary
    const uploaded = await cloudinary.uploader.upload(image);
    const imageUrl = uploaded.secure_url;

    // Save image temporarily
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const tempImagePath = path.join(tempDir, `temp-${Date.now()}.jpg`);
    const writer = fs.createWriteStream(tempImagePath);
    const response = await axios({ url: imageUrl, method: "GET", responseType: "stream" });
    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Run AI
    const pythonProcess = spawn("python", [path.join(__dirname, "../ai/predict.py"), tempImagePath]);
    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => (output += data.toString()));
    pythonProcess.stderr.on("data", (data) => (errorOutput += data.toString()));

    pythonProcess.on("close", () => {
      fs.unlink(tempImagePath, () => {});

      const categoryMatch = output.match(/Predicted Category:\s*(.*)/);
      const colorMatch = output.match(/Predicted Color:\s*(.*)/);
      const conditionMatch = output.match(/Predicted Condition:\s*(.*)/);

      if (!categoryMatch || !colorMatch || !conditionMatch) {
        console.error("AI output:", output);
        return res.status(500).json({ message: "Failed to parse AI output" });
      }

      const category = categoryMatch[1].trim();
      const color = colorMatch[1].trim();
      const condition = conditionMatch[1].trim();

      res.json({ imageUrl, category, color, condition });
    });
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", protectRoute, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      size,
      gender,
      image,
      category,
      color,
      condition,
    } = req.body;

    if (!title || !description || !price || !size || !gender || !image || !category || !color || !condition) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newListing = new Listing({
      title,
      description,
      price,
      size,
      gender,
      image, // ✅ this is the Cloudinary URL returned from /predict
      category,
      color,
      condition,
      user: req.user._id, // From protectRoute middleware
      datePosted: new Date(),
    });

    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    console.error("Create listing error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//DELETE listing (owner only)
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found!" });

    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "You are not the owner of this listing" });
    }

    // Delete from Cloudinary
    if (listing.image && listing.image.includes("cloudinary")) {
      try {
        const publicID = listing.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicID);
      } catch (err) {
        console.error("Error deleting from Cloudinary", err);
      }
    }

    await listing.deleteOne();
    res.json({ message: "Listing successfully deleted" });

  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//UPDATE listing route
router.patch("/:id", protectRoute, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Check ownership
    if (listing.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "You are not authorized to update this listing" });

    // Updatable fields
    const updatableFields = ["title", "description", "price", "size", "gender", "category", "color", "condition", "image", "status"];

    updatableFields.forEach(field => {
      if (req.body[field]) {
        listing[field] = req.body[field];
      }
    });

    await listing.save();
    res.status(200).json(listing);

  } catch (error) {
    console.log("Error updating listing:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//GET listing from buyer POV 
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(listings);
  } catch (error) {
    console.log("Error fetching all listings:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET my own listings for the profile page
router.get("/mine", protectRoute, async (req, res) => {
  try {
    const myListings = await Listing.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(myListings);
  } catch (error) {
    console.log("Error fetching my listings:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get listings by category (Top, Bottom, Footwear)
router.get("/category/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const validCategories = ["Top", "Bottom", "Footwear"];

    if (!validCategories.includes(name)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const listings = await Listing.find({ category: name }).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching category listings:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single listing by ID
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("user", "username profileImage"); // Include seller details
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(200).json(listing);
  } catch (error) {
    console.error("Error fetching single listing:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;