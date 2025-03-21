const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Get all jobs with filters
router.get('/', async (req, res) => {
  try {
    const { status, skills, minSalary, maxSalary } = req.query;
    const query = {};

    if (status) query.status = status;
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = Number(minSalary);
      if (maxSalary) query.salary.$lte = Number(maxSalary);
    }
    if (skills) {
      query['requiredSkills.name'] = { $in: skills.split(',') };
    }

    const jobs = await Job.find(query)
      .populate('recruiter', 'name company')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiter', 'name company')
      .populate('applicants.student', 'name college');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new job (recruiter only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is a recruiter
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can post jobs' });
    }

    const job = new Job({
      ...req.body,
      recruiter: req.user._id
    });

    await job.save();
    
    // Populate recruiter details in response
    const populatedJob = await Job.findById(job._id)
      .populate('recruiter', 'name company');
      
    res.status(201).json(populatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a job
router.patch('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the recruiter who posted the job
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    // Store previous applicants before clearing
    const previousApplicants = [...job.applicants];
    
    // Don't allow updating applicants through this route
    const { applicants, ...updateData } = req.body;
    
    // Delete all previous applications when job is edited
    job.applicants = [];
    
    // Update job fields
    Object.assign(job, updateData);
    job.updatedAt = new Date();

    await job.save();

    // Create notifications for all previous applicants
    for (const applicant of previousApplicants) {
      await new Notification({
        recipient: applicant.student,
        type: 'application_deleted',
        job: job._id,
        message: `Your application for ${job.title} was deleted due to job updates. Please apply again if interested.`
      }).save();
    }

    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a job (recruiter only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the recruiter who posted the job
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply for a job (student only)
router.post('/:id/apply', auth, async (req, res) => {
  try {
    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can apply for jobs' });
    }

    const job = await Job.findById(req.params.id).populate('recruiter');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'Open') {
      return res.status(400).json({ message: 'This job is no longer accepting applications' });
    }

    // Check if student has already applied
    if (job.applicants.some(applicant => applicant.student.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    job.applicants.push({
      student: req.user._id,
      status: 'Pending'
    });

    await job.save();

    // Create notification for recruiter
    await new Notification({
      recipient: job.recruiter._id,
      type: 'application',
      job: job._id,
      message: `New application for ${job.title} from ${req.user.name}`
    }).save();

    // Populate the job with recruiter and applicant details
    const populatedJob = await Job.findById(job._id)
      .populate('recruiter', 'name company')
      .populate('applicants.student', 'name college');

    res.status(201).json(populatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update application status (recruiter only)
router.patch('/:id/applications/:applicationId', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the recruiter who posted the job
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update applications' });
    }

    const application = job.applicants.id(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await job.save();

    // Create notification for student
    await new Notification({
      recipient: application.student,
      type: status === 'Accepted' ? 'application_accepted' : 'application_rejected',
      job: job._id,
      message: `Your application for ${job.title} has been ${status.toLowerCase()}`
    }).save();

    // Populate the job with recruiter details
    const populatedJob = await Job.findById(job._id)
      .populate('recruiter', 'name company')
      .populate('applicants.student', 'name college');

    res.json(populatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get jobs posted by the recruiter
router.get('/recruiter/:id?', auth, async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // If no ID is provided, verify the user is a recruiter
    if (!req.params.id && req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If viewing another user's jobs, verify the user exists and is a recruiter
    if (req.params.id) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.role !== 'recruiter') {
        return res.status(403).json({ message: 'User is not a recruiter' });
      }
    }

    const jobs = await Job.find({ recruiter: userId })
      .populate('applicants.student', 'name college')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get jobs applied to by the student
router.get('/student/my-applications', auth, async (req, res) => {
  try {
    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const jobs = await Job.find({
      'applicants.student': req.user._id
    })
      .populate('recruiter', 'name company')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
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