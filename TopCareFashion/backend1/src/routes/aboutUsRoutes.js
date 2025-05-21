import express from 'express';
import AboutUs from '../models/AboutUs.js';
import protectRoute from '../middleware/auth.middleware.js';
import isAdmin from '../middleware/isAdmin.middleware.js';

const router = express.Router();

// Public route to get all About Us sections
router.get('/', async (req, res) => {
  try {
    const sections = await AboutUs.find({});
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch About Us sections', error: error.message });
  }
});

// Admin-only route to create a new About Us section
router.post('/', protectRoute, isAdmin, async (req, res) => {
  try {
    const { section, title, content } = req.body;

    if (!section || title || !content) {
      return res.status(400).json({ message: 'Section, title, and content are required' });
    }

    const newSection = new AboutUs({ section, title, content });
    const savedSection = await newSection.save();
    res.status(201).json(savedSection);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create About Us section', error: error.message });
  }
});

// Update About Us section by section
router.put('/:section', protectRoute, isAdmin, async (req, res) => {
  try {
    const { section } = req.params;
    const { title, content } = req.body;

    const updated = await AboutUs.findOneAndUpdate(
      { section },
      { title, content },
      { new: true, upsert: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update section', error: error.message });
  }
});


export default router;
