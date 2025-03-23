const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Web Development',
            'Game Development',
            'App Development',
            'Data Science & Analytics',
            'UI/UX & Graphic Design',
            'Software Engineering',
            'Cybersecurity',
            'Cloud Computing & DevOps',
            'Digital Marketing',
            'Content Creation',
            'Product Management',
            'Quality Assurance & Testing',
            'Business Analysis',
            'Customer & Technical Support',
            'E-commerce & Retail Tech',
            'AI & Machine Learning',
            'IoT & Embedded Systems',
            'Blockchain & Cryptocurrency',
            'AR/VR Development',
            'Networking & System Administration'
        ]
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['remote', 'hybrid', 'onsite']
    },
    experience: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Open', 'Closed', 'Draft'],
        default: 'Open'
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requiredSkills: [{
        name: {
            type: String,
            required: true
        },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            required: true
        }
    }],
    pay: {
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ['hourly', 'fixed'],
            required: true
        }
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    applicants: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Rejected'],
            default: 'Pending'
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date,
        required: true
    }
});

// Index for text search
jobSchema.index({ title: 'text', description: 'text' });

// Update the updatedAt timestamp before saving
jobSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Job', jobSchema); 