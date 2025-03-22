const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Rating = require('../models/Rating');

// Get all ratings for a user
router.get('/:userId', async (req, res) => {
  try {
    const ratings = await Rating.find({ ratedUser: req.params.userId })
      .populate('rater', 'name')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new rating
router.post('/', auth, async (req, res) => {
  try {
    const { ratedUser, rating, comment } = req.body;
    
    // Check if user has already rated this person
    const existingRating = await Rating.findOne({
      rater: req.user._id,
      ratedUser,
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this user' });
    }

    const newRating = new Rating({
      rater: req.user._id,
      ratedUser,
      rating,
      comment,
    });

    const savedRating = await newRating.save();
    res.status(201).json(savedRating);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a rating
router.patch('/:id', auth, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    if (rating.rater.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this rating' });
    }

    const { rating: newRating, comment } = req.body;
    rating.rating = newRating;
    rating.comment = comment;

    const updatedRating = await rating.save();
    res.json(updatedRating);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a rating
router.delete('/:id', auth, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    if (rating.rater.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this rating' });
    }

    await rating.remove();
    res.json({ message: 'Rating deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 