import mongoose from "mongoose";

const tutorSupportSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, "Subject is required"],
        trim: true,
        maxlength: [100, "Subject cannot exceed 100 characters"]
    },
    level: {
        type: String,
        required: [true, "Level is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
        maxlength: [200, "Message cannot exceed 200 characters"]
    },
    isReplied: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

tutorSupportSchema.index({ email: 1 });
tutorSupportSchema.index({ subject: 1, level: 1 });

const TutorSupport = mongoose.model("TutorSupport", tutorSupportSchema);

export default TutorSupport;