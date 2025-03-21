const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    major: String,
    graduationYear: Number,
    bio: String,
    skills: [{
        name: String,
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
        },
        subSkills: [String]
    }],
    previousGigs: [{
        title: String,
        description: String,
        completedDate: Date,
        employer: String,
        rating: Number,
        review: String
    }],
    portfolio: [{
        title: String,
        description: String,
        imageUrl: String,
        projectUrl: String,
        technologies: [String]
    }],
    contactInfo: {
        phone: String,
        linkedin: String,
        github: String,
        website: String
    },
    resume: {
        url: String,
        skills: [String] // Extracted skills from resume (placeholder for future enhancement)
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 