const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'college', 'major', 'graduationYear', 'bio', 'contactInfo'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.json(req.user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update skills
router.patch('/skills', auth, async (req, res) => {
    try {
        req.user.skills = req.body.skills;
        await req.user.save();
        res.json(req.user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add portfolio item
router.post('/portfolio', auth, async (req, res) => {
    try {
        req.user.portfolio.push(req.body);
        await req.user.save();
        res.status(201).json(req.user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update portfolio item
router.patch('/portfolio/:id', auth, async (req, res) => {
    try {
        const portfolioItem = req.user.portfolio.id(req.params.id);
        if (!portfolioItem) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }
        Object.assign(portfolioItem, req.body);
        await req.user.save();
        res.json(req.user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete portfolio item
router.delete('/portfolio/:id', auth, async (req, res) => {
    try {
        req.user.portfolio = req.user.portfolio.filter(item => item._id.toString() !== req.params.id);
        await req.user.save();
        res.json(req.user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Upload resume (placeholder for future enhancement)
router.post('/resume', auth, async (req, res) => {
    try {
        // This is a placeholder for future resume parsing functionality
        req.user.resume = {
            url: req.body.url,
            skills: [] // Will be populated by resume parsing service
        };
        await req.user.save();
        res.status(201).json({
            message: 'Resume uploaded successfully. Skill extraction coming soon!',
            resume: req.user.resume
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get recommended jobs based on user skills
router.get('/recommended-jobs', auth, async (req, res) => {
    try {
        const userSkills = req.user.skills.map(skill => skill.name);
        const Job = require('../models/Job');
        const jobs = await Job.find({
            'requiredSkills.name': { $in: userSkills },
            status: 'Open'
        }).populate('employer', 'name email');
        
        res.json(jobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 