
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide a company name'],
        trim: true,
        maxlength: [100, 'Company name cannot be more than 100 characters'],
    },
    position: {
        type: String,
        required: [true, 'Please provide a position title'],
        trim: true,
        maxlength: [100, 'Position cannot be more than 100 characters'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Interview', 'Declined'],
        default: 'Pending',
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'remote', 'internship'],
        default: 'full-time',
    },
    jobLocation: {
        type: String,
        required: [true, 'Please provide job location'],
        trim: true,
    },
    notes: [
        {
            text: String,
            createdAt: { type: Date, default: Date.now },
        }
    ],
    attachments: [
        {
            filename: String,
            fileUrl: String,
            uploadedAt: { type: Date, default: Date.now },
        }
    ],
    timeline: [
        {
            status: String,
            date: { type: Date, default: Date.now },
        }
    ],
    resumeData: {
        rawText: String,
        parsedSkills: [String],
        parsedExperience: String,
        parsedEducation: String,
        parsedContact: {
            email: String,
            phone: String,
        }
    },
    source: {
        type: String, // 'manual', 'scraped', 'resume'
        url: String, // for scraped jobs
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
    },
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
