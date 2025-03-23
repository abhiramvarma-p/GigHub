const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { parse_resume } = require('../utils/resume_parser');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/profile-pictures';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image file.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Configure multer for resume uploads
const resumeStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const resumeUpload = multer({
    storage: resumeStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Get user profile by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user data based on role
        const userResponse = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            skills: user.skills || [],
            bio: user.bio,
            profilePicture: user.profilePicture,
            contactInfo: user.contactInfo || {}
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

        res.json(userResponse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        'name',
        'bio',
        'college',
        'major',
        'graduationYear',
        'company',
        'position',
        'companyWebsite',
        'contactInfo',
        'profilePicture'
    ];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        // Handle role-specific validation
        if (req.user.role === 'student') {
            if (req.body.college) req.user.college = req.body.college;
            if (req.body.major) req.user.major = req.body.major;
            if (req.body.graduationYear) req.user.graduationYear = req.body.graduationYear;
        } else if (req.user.role === 'recruiter') {
            if (req.body.company) req.user.company = req.body.company;
            if (req.body.position) req.user.position = req.body.position;
            if (req.body.companyWebsite) req.user.companyWebsite = req.body.companyWebsite;
        }

        // Handle common fields
        if (req.body.name) req.user.name = req.body.name;
        if (req.body.bio) req.user.bio = req.body.bio;
        if (req.body.profilePicture) req.user.profilePicture = req.body.profilePicture;
        if (req.body.contactInfo) {
            req.user.contactInfo = {
                ...req.user.contactInfo,
                ...req.body.contactInfo
            };
        }

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

// Upload and parse resume
router.post('/resume', auth, resumeUpload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can upload resumes' });
        }

        // Parse the resume and extract skills
        const filePath = path.join(__dirname, '..', req.file.path);
        const skills = await parse_resume(filePath);

        // Update user's resume information
        req.user.resume = {
            file: req.file.path,
            lastUpdated: new Date(),
            parsedSkills: skills
        };

        // Add any new skills to the user's skills array
        const existingSkillNames = new Set(req.user.skills.map(s => s.name.toLowerCase()));
        const newSkills = skills.filter(skill => !existingSkillNames.has(skill.toLowerCase()))
            .map(skill => ({
                name: skill,
                category: 'Other', // Default category
                level: 'beginner' // Default level
            }));

        if (newSkills.length > 0) {
            req.user.skills = [...req.user.skills, ...newSkills];
        }

        await req.user.save();

        res.json({
            message: 'Resume uploaded and parsed successfully',
            skills: skills,
            newSkillsAdded: newSkills.length
        });
    } catch (error) {
        console.error('Resume upload error:', error);
        res.status(500).json({ message: error.message });
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

// Upload profile picture
router.post('/profile-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Update user's profile picture URL
    req.user.profilePicture = req.file.path;
    await req.user.save();

    res.json({ profilePicture: req.file.path });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a single skill
router.post('/skills', auth, async (req, res) => {
    try {
        const { name, category, level } = req.body;
        
        // Validate the skill data
        if (!name || !category || !level) {
            return res.status(400).json({ message: 'Please provide name, category, and level for the skill' });
        }

        // Validate the level
        const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
        if (!validLevels.includes(level.toLowerCase())) {
            return res.status(400).json({ message: 'Invalid skill level' });
        }

        // Add the new skill to the user's skills array
        const newSkill = {
            name,
            category,
            level: level.toLowerCase()
        };

        req.user.skills.push(newSkill);
        await req.user.save();

        // Return the newly added skill
        res.status(201).json(newSkill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 