import express from 'express';
import FAQ from '../models/FAQ.js';  // Importing the FAQ model correctly
import protectRoute from '../middleware/auth.middleware.js';  // Authentication middleware
import isAdmin from '../middleware/isAdmin.middleware.js';  // Admin check middleware

const router = express.Router();

// Create FAQ (only accessible by admin)
router.post('/', protectRoute, isAdmin, async (req, res) => {
  try {
    const { question, answer } = req.body;

    // Check if question and answer are provided
    if (!question || !answer) {
      return res.status(400).json({ message: "Both question and answer are required" });
    }

    // Create new FAQ instance
    const newFaq = new FAQ({
      question,
      answer,
    });

    // Save FAQ to the database
    const savedFaq = await newFaq.save();
    res.status(201).json(savedFaq);  // Respond with created FAQ
  } catch (error) {
    res.status(500).json({ message: "Failed to create FAQ", error: error.message });
  }
});

// Update FAQ (only accessible by admin)
router.put('/:id', protectRoute, isAdmin, async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);  // Find FAQ by ID
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });  // FAQ not found
    }

    const { question, answer } = req.body;

    // Update FAQ fields if provided
    if (question) faq.question = question;
    if (answer) faq.answer = answer;

    // Save the updated FAQ
    const updatedFaq = await faq.save();
    res.status(200).json(updatedFaq);  // Respond with updated FAQ
  } catch (error) {
    res.status(500).json({ message: "Failed to update FAQ", error: error.message });
  }
});

// Delete FAQ (only accessible by admin)
router.delete('/:id', protectRoute, isAdmin, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);  // Find and delete FAQ by ID
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });  // FAQ not found
    }

    res.status(200).json({ message: "FAQ deleted" });  // Successfully deleted FAQ
  } catch (error) {
    res.status(500).json({ message: "Failed to delete FAQ", error: error.message });
  }
});

// Get all FAQs (accessible by everyone, including guests)
router.get('/', async (req, res) => {
    try {
      const faqs = await FAQ.find().sort({ createdAt: -1 });  // Get all FAQs, sorted by creation date
      res.status(200).json(faqs);  // Return the list of FAQs to the client
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQs", error: error.message });
    }
  });  

export default router;
