const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create user object with common fields
        const userData = {
            email,
            password,
            name,
            role
        };

        // Add role-specific fields
        if (role === 'student') {
            const { college, major, graduationYear } = req.body;
            Object.assign(userData, {
                college,
                major,
                graduationYear
            });
        } else if (role === 'recruiter') {
            const { company, position, companyWebsite } = req.body;
            Object.assign(userData, {
                company,
                position,
                companyWebsite
            });
        }

        // Create and save new user
        const user = new User(userData);
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user data based on role
        const userResponse = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            skills: user.skills || [],
            bio: user.bio,
            profilePicture: user.profilePicture,
            contactInfo: user.contactInfo
        };

        if (role === 'student') {
            userResponse.college = user.college;
            userResponse.major = user.major;
            userResponse.graduationYear = user.graduationYear;
        } else if (role === 'recruiter') {
            userResponse.company = user.company;
            userResponse.position = user.position;
            userResponse.companyWebsite = user.companyWebsite;
        }

        res.status(201).json({
            token,
            user: userResponse
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user data based on role
        const userResponse = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            skills: user.skills || [],
            bio: user.bio,
            profilePicture: user.profilePicture,
            contactInfo: user.contactInfo
        };

        if (user.role === 'student') {
            userResponse.college = user.college;
            userResponse.major = user.major;
            userResponse.graduationYear = user.graduationYear;
        } else if (user.role === 'recruiter') {
            userResponse.company = user.company;
            userResponse.position = user.position;
            userResponse.companyWebsite = user.companyWebsite;
        }

        res.json({
            token,
            user: userResponse
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 