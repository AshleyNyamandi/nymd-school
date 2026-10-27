import mongoose from "mongoose";

const userSchema =  new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "User name is required"]
    },
    email: {
        type: String,
        required: [true, "Email address is required"],
        unique: true,
    },
    role: {
        type: String,
        default: "student",
        enum: ["teacher", "student", "admin"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    bio: String,
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationTokenExpiresAt: {
        type: Date,
        default: null
    },
    resetPasswordToken: {
    type: String,
    default: null
    },
    resetPasswordExpiresAt: {
        type: Date,
        default: null
    },
    password: {
        type: String,
        required: [true, "Password required"]
    }   

}, {timestamps: true})

const User = mongoose.model("user", userSchema)

export default User;