import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/user.model.js";
import { 
    createAccessToken, 
    createRefreshToken, 
    generateAccessToken, 
    generateEmailVerificationToken, 
    generateRefreshToken, 
    sendPasswordResetEmail,
    sendVerificationEmail, 
    validateEmail } from "../lib/utils.js";
import { BCRYPT_SALT, CLIENT_URL, JWT_SECRET, NODE_ENV } from "../config/env.js";

export const SignIn = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const error = new Error("Email and password required");
            error.statusCode = 400
            throw error
        }

        if (!validateEmail(email)) {
            const error =  new Error("Please enter a valid email");
            error.statusCode = 400;
            throw error;        
        };

        const user = await User.findOne({email});

        if (!user) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401
            throw error
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401
            throw error
        }

        if (!user.isVerified) {
            const error = new Error("Please verify your email address before logging in");
            error.statusCode = 403;
            throw error;
        }

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: "lax",
            // path: "/api/v1/users/refresh",
            maxAge: 15 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Signed in successfully",

        });


    } catch (error) {
        next(error)
    }
};

export const SignOut = (req, res, next) => {
    try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    
    res.status(200).json({
       success: true,
       message: "Signed out successfully" 
    })

    } catch (error) {
        next(error)
    }
};

export const SignUp = async(req, res, next) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword || !fullName) {
            const error =  new Error("All input fields are required");
            error.statusCode = 400;
            throw error;
        }
        if (!validateEmail(email)) {
            const error =  new Error("Please enter a valid email");
            error.statusCode = 400;
            throw error;        
        };

        const existingUser = await User.findOne({email});

        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 400
            throw error
        }        

        if (password !== confirmPassword) {
            const error =  new Error("Password must match");
            error.statusCode = 400;
            throw error;              
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(BCRYPT_SALT, 10));
        const { 
            emailVerificationToken,
            hashedEmailVerificationToken,
            emailVerificationTokenExpiresAt } =  generateEmailVerificationToken();

        const user = await User.create({
            email,
            fullName,
            password: hashedPassword,
            emailVerificationToken: hashedEmailVerificationToken,
            emailVerificationTokenExpiresAt

        });

        const emailVerificationLink = `${CLIENT_URL}/verify-email?token=${emailVerificationToken}`;

        await sendVerificationEmail(user.email, emailVerificationLink);

        res.status(201).json({
            success: true,
            message: "User created successfully. Please check your email to verify your account."
        })
        
    } catch (error) {
        next(error)
    }
};

export const VerifyEmail = async(req, res, next) => {

    try {
        const { token } =  req.query;

        if (!token) {
            const error = new Error("No token provided");
            error.statusCode = 400
            throw error
        }

        const hashedToken  = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            emailVerificationToken:hashedToken,
            emailVerificationTokenExpiresAt: {$gt : Date.now()}
        })

        if (!user) {
            const error = new Error("Invalid or expired verification token");
            error.statusCode = 400;
            throw error;
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpiresAt = undefined;
        await user.save();

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 15 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Email verified successfully! You are now logged in."
        });        
        
    } catch (error) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");        
        next(error)
    }
};

export const ResendVerificationEmail = async(req, res, next) => {
    try {
        const { email } = req.body;

    if (!email) {
        const error = new Error("Email is required");
        error.statusCode = 400;
        throw error;
    }

    if (!validateEmail(email)) {
        const error = new Error("Please enter a valid email");
        error.statusCode = 400;
        throw error;
    }        
        const user = await User.findOne({email});
        
        if (!user) {
            const error = new Error("Invalid or expired verification token");
            error.statusCode = 400;
            throw error;
        }

        if (user.isVerified) {
            const error = new Error("This account has already been verified");
            error.statusCode = 400;
            throw error;
        }        
        
        const { 
            emailVerificationToken,
            hashedEmailVerificationToken,
            emailVerificationTokenExpiresAt } =  generateEmailVerificationToken();  
            
        user.emailVerificationToken =  hashedEmailVerificationToken;
        user.emailVerificationTokenExpiresAt = emailVerificationTokenExpiresAt
        await user.save();

        const emailVerificationLink = `${CLIENT_URL}/verify-email?token=${emailVerificationToken}`;

        await sendVerificationEmail(user.email, emailVerificationLink);

        res.status(200).json({
            success: true,
            message: "Verification link sent. Please check your email to verify your account."
        })        

    } catch (error) {
        next(error)
    }
};

export const RefreshToken = async(req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            const error = new Error("No refresh token provided");
            error.statusCode = 401;
            throw error;
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        
        // Check if user exists in database
        const user = await User.findOne({ 
            _id: decoded.userId, 
        });

        if (!user) {
            const error = new Error("Invalid refresh token");
            error.statusCode = 403;
            throw error;
        }

        // Generate new access token
        const newAccessToken = createAccessToken(user);
        const newRefreshToken = createRefreshToken(user);

        // Set new access token cookie
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: NODE_ENV === 'production',
            maxAge: 15 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Token refreshed successfully"
        });

    } catch (error) {
        console.error("Error in the refreshToken controller: ", error.message);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        next(error);
    }
};

export const ForgotPassword = async(req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            const error = new Error("Email is required");
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: "A password reset link has been sent."
            });
        }

        const { 
            emailVerificationToken,
            hashedEmailVerificationToken,
            emailVerificationTokenExpiresAt } =  generateEmailVerificationToken();

        user.resetPasswordToken = hashedEmailVerificationToken;
        user.resetPasswordExpiresAt = emailVerificationTokenExpiresAt;
        await user.save();

        const resetUrl = `${CLIENT_URL}/reset-password?token=${emailVerificationToken}`;

        await sendPasswordResetEmail(user.email, resetUrl);

        res.status(200).json({
            success: true,
            message: "A password reset link has been sent."
        });

    } catch (error) {
        next(error);
    }
};

export const ResetPassword = async(req, res, next) => {
    try {
        const { token } = req.query;
        const { newPassword, confirmPassword } = req.body;

        if (!token) {
            const error = new Error("Password reset token is required");
            error.statusCode = 400;
            throw error;
        }

        if (!newPassword || !confirmPassword) {
            const error = new Error("New password and confirm password are required");
            error.statusCode = 400;
            throw error;
        }

        if (newPassword !== confirmPassword) {
            const error = new Error("Passwords do not match");
            error.statusCode = 400;
            throw error;
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            const error = new Error("Invalid or expired password reset token");
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(newPassword, parseInt(BCRYPT_SALT, 10));

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful. You can now log in with your new password."
        });

    } catch (error) {
        next(error);
    }
};

export const DeleteAccount = async(req, res, next) => {
    try {
        const userId = req.user?._id;
        const { password } = req.body;

        if (!userId) {
            const error = new Error("Unauthorized");
            error.statusCode = 401;
            throw error;
        }

        if (!password) {
            const error = new Error("Password confirmation is required to delete account");
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findById(userId);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            const error = new Error("Incorrect password");
            error.statusCode = 401;
            throw error;
        }

        await User.findByIdAndDelete(userId);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

export const GetMe = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        next(error);
    }
};
