const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create a new job posting
router.post('/', auth, async (req, res) => {
    try {
        const job = new Job({
            ...req.body,
            employer: req.user._id
        });
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all job postings with optional filters
router.get('/', async (req, res) => {
    try {
        const { status, skills, budget } = req.query;
        const query = {};

        if (status) query.status = status;
        if (skills) query['requiredSkills.name'] = { $in: skills.split(',') };
        if (budget) query.budget = { $lte: parseInt(budget) };

        const jobs = await Job.find(query)
            .populate('employer', 'name email')
            .sort({ createdAt: -1 });
        
        res.json(jobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific job posting
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('employer', 'name email')
            .populate('applicants.student', 'name email skills');
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a job posting
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'requiredSkills', 'budget', 'duration', 'deadline'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        const job = await Job.findOne({ _id: req.params.id, employer: req.user._id });
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }

        updates.forEach(update => job[update] = req.body[update]);
        await job.save();
        res.json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a job posting
router.delete('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user._id });
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Apply for a job
router.post('/:id/apply', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.status !== 'Open') {
            return res.status(400).json({ message: 'This job is no longer accepting applications' });
        }

        // Check if already applied
        const alreadyApplied = job.applicants.some(
            applicant => applicant.student.toString() === req.user._id.toString()
        );

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        job.applicants.push({
            student: req.user._id,
            status: 'Pending'
        });

        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update application status (for employers)
router.patch('/:id/applications/:applicationId', auth, async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, employer: req.user._id });
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }

        const application = job.applicants.id(req.params.applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = req.body.status;
        await job.save();
        res.json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get recommended students for a job
router.get('/:id/recommended-students', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const requiredSkills = job.requiredSkills.map(skill => skill.name);
        const students = await User.find({
            'skills.name': { $in: requiredSkills },
            _id: { $ne: req.user._id }
        }).select('-password');

        // Sort students by skill match percentage
        const studentsWithMatch = students.map(student => {
            const studentSkills = student.skills.map(skill => skill.name);
            const matchingSkills = requiredSkills.filter(skill => studentSkills.includes(skill));
            const matchPercentage = (matchingSkills.length / requiredSkills.length) * 100;

            return {
                ...student.toObject(),
                matchPercentage
            };
        }).sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.json(studentsWithMatch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 