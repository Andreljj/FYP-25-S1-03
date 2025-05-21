import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import protectRoute from "../middleware/auth.middleware.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Inside your POST /request-reset route:
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


function generateRandomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric code
}


// Helper to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userID: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Test route
router.post("/test", (req, res) => {
  console.log("req.body in /test:", req.body);
  res.json({ status: "Received", body: req.body });
});

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, dob, gender } = req.body;

    // Check if email or username already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const profileImage = `https://api.dicebear.com/7.x/avataaars/png?seed=${username}`;

    const user = new User({
      username,
      email,
      password,
      dob,
      gender,
      profileImage,
      // bio will default to "Hello Fashion enthusiast"
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        dob: user.dob,
        gender: user.gender,
        bio: user.bio,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile (partial update)
router.patch("/profile", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Only update fields if they are sent in the request body
    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;
    if (req.body.gender) user.gender = req.body.gender;
    if (req.body.dob) user.dob = req.body.dob;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.profileImage) user.profileImage = req.body.profileImage;

    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        dob: user.dob,
        gender: user.gender,
        bio: user.bio,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//get profile data
router.get("/profile", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});


// Login route using username
router.post("/login", async (req, res) => {

  console.log("Incoming registration request:", req.body);

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete own account
router.delete("/me", protectRoute, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: "Your account has been deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete account", error: err.message });
  }
});


// Check if email exists
router.post('/check-email', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.status(200).json({ message: 'Email exists' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Send reset code to email
router.post('/request-reset', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'Email not found in our records' });
  }

  const resetCode = generateRandomCode(); // Your code function
  user.resetCode = resetCode;
  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Code',
    text: `Your reset code is: ${resetCode}`
  });

  res.json({ message: 'Reset code sent' });
});


// Reset password with code
router.post('/reset-password', async (req, res) => {
  const { email, resetCode, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.resetCode !== resetCode) {
      return res.status(400).json({ message: 'Invalid email or reset code' });
    }

    user.password = newPassword;
    user.resetCode = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;