// theme.js
const express = require('express');
const router = express.Router();
const UserTheme = require('../models/UserTheme');
const auth = require('../middleware/auth'); // Assumes you have JWT auth middleware

// Get theme options for current user
router.get('/', auth, async (req, res) => {
  try {
    const theme = await UserTheme.findOne({ userId: req.user._id });
    res.json(theme || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch theme options.' });
  }
});

// Update theme options for current user
router.put('/', auth, async (req, res) => {
  try {
    const { darkMode, bgColors } = req.body;
    const theme = await UserTheme.findOneAndUpdate(
      { userId: req.user._id },
      { darkMode, bgColors },
      { new: true, upsert: true }
    );
    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update theme options.' });
  }
});

module.exports = router;
