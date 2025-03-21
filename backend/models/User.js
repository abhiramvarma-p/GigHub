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
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'recruiter'],
        default: 'student'
    },
    profilePicture: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        trim: true,
        maxLength: 500
    },
    skills: [{
        id: Number,
        name: String,
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'expert']
        },
        children: [{
            id: Number,
            name: String,
            level: {
                type: String,
                enum: ['beginner', 'intermediate', 'advanced', 'expert']
            }
        }]
    }],
    experience: [{
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String
    }],
    education: [{
        school: String,
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String
    }],
    college: {
        type: String,
        required: function() { return this.role === 'student'; }
    },
    major: {
        type: String,
        required: function() { return this.role === 'student'; }
    },
    graduationYear: {
        type: Number,
        required: function() { return this.role === 'student'; }
    },
    company: {
        type: String,
        required: function() { return this.role === 'recruiter'; }
    },
    position: {
        type: String,
        required: function() { return this.role === 'recruiter'; }
    },
    companyWebsite: {
        type: String,
        required: function() { return this.role === 'recruiter'; }
    },
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
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model('User', userSchema); 