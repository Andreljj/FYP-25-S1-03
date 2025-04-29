import express from "express";
import fs from "fs";
import axios from "axios";
import path from "path";
import { spawn } from "child_process";
import cloudinary from "../lib/cloudinary.js";
import Listing from "../models/Listing.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();


//CREATE with AI integration
router.post("/", protectRoute, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      size,
      gender,
      image
    } = req.body;

    if (!title || !description || !price || !size || !gender || !image) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image);
    const imageUrl = uploadedImage.secure_url;

    // Download image temporarily
    const tempImagePath = path.join("src", "ai", "temp.jpg");
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(tempImagePath, Buffer.from(response.data, "binary"));

    // Run AI model
    const python = spawn("C:\\Users\\jhonl\\Downloads\\FYP-25-S1-03\\backend\\ai-env\\Scripts\\python.exe", [
      "src/ai/predict.py",
      tempImagePath
    ]);

    let aiOutput = "";
    python.stdout.on("data", (data) => {
      aiOutput += data.toString();
    });

    python.stderr.on("data", (err) => {
      console.error("🐍 Python Error:", err.toString());
    });

    python.on("close", async () => {
      let predictions;
      try {
        const jsonLine = aiOutput
          .split("\n")
          .find(line => line.trim().startsWith("{") && line.trim().endsWith("}"));

        if (!jsonLine) {
          return res.status(500).json({
            message: "AI did not return valid JSON",
            rawOutput: aiOutput
          });
        }

        // Normalize fields to match schema
        const raw = JSON.parse(jsonLine.trim());
        const category = raw.category.charAt(0).toUpperCase() + raw.category.slice(1).toLowerCase();
        const color = raw.color.toLowerCase();
        const condition = raw.condition.toLowerCase();

        // Save to DB
        const newListing = new Listing({
          title,
          description,
          price,
          size,
          gender,
          image: imageUrl,
          category,
          color,
          condition,
          user: req.user._id,
          datePosted: new Date()
        });

        await newListing.save();
        fs.unlinkSync(tempImagePath); // cleanup
        res.status(201).json(newListing);
      } catch (err) {
        return res.status(500).json({
          message: "Failed to parse AI model output",
          rawOutput: aiOutput
        });
      }
    });

  } catch (error) {
    console.error("🚨 Error in Create Listing:", error);
    res.status(500).json({ message: error.message });
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
    const updatableFields = ["title", "description", "price", "size", "gender"];

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

export default router;
