import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import { EMAIL, EMAIL_PASSWORD, JWT_SECRET } from "../config/env.js";

export const generateAccessToken = () => {

};

export const generateRefreshToken = () => {

};

export const validateEmail = (email) =>  {
    if (typeof email !== 'string') return false;
    const trimmed = email.trim();
    if (trimmed.length === 0) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(trimmed);
};

export const generateEmailVerificationToken = () => {
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    const hashedEmailVerificationToken = crypto.createHash("sha256").update(emailVerificationToken).digest("hex");

    const emailVerificationTokenExpiresAt = Date.now() +  + (60 * 60 * 1000);

    return {
        emailVerificationToken,
        hashedEmailVerificationToken,
        emailVerificationTokenExpiresAt
    }
};

export const sendVerificationEmail = async(toEmail, verificationUrl) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        host: "smtp.gmail.com",
        secure: false,
        auth: {
            user: EMAIL,
            pass: EMAIL_PASSWORD
        }        
    })

    const mailOptions = {
        from: "Nymd Team",
        to: toEmail,
        subject: "Verify your email address",
        html: `
            <h2>Welcome!</h2>
            <p>Please click the button below to verify your email</p>
            <a href="${verificationUrl}" style="background-color: #4CAF50; color:white; padding: 10px 20px;  text-decoration:none; display:inline-block; border-radius: 4px;">Verify Email</a>
            <p>If you didn't create an account, you can safely ignore this email.</p>            
          `
    };

    await transporter.sendMail(mailOptions)
}

export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        host: "smtp.gmail.com",
        secure: false,
        auth: {
            user: EMAIL,
            pass: EMAIL_PASSWORD
        }
    });

    await transporter.sendMail({
        from: "Nymd Team",
        to: toEmail,
        subject: "Reset your password",
        html: `
            <h2>Password reset</h2>
            <p>Click the link below to choose a new password.</p>
            <a href="${resetUrl}">Reset password</a>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
        `
    });
};

export const createAccessToken = (user) => {
    return jwt.sign({userId: user._id, email: user.email}, JWT_SECRET, {
        expiresIn: "15m"
    })
};

export const createRefreshToken = (user) => {
    return jwt.sign({userId: user._id, email: user.email}, JWT_SECRET, {
        expiresIn: "15d"
    })
};


export const sendReplyTutorRequest = async (toEmail, message) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        host: "smtp.gmail.com",
        secure: false,
        auth: {
            user: EMAIL,
            pass: EMAIL_PASSWORD
        }        
    })

    const mailOptions = {
        from: "Nymd Team",
        to: toEmail,
        subject: "Tutor request Reply",
        html: `
            <p>${message}</p>            
          `
    };

    await transporter.sendMail(mailOptions)    
}