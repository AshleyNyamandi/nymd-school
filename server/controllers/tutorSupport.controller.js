import mongoose from "mongoose";
import { sendReplyTutorRequest, validateEmail } from "../lib/utils.js";
import TutorSupport from "../models/tutorRequest.model.js";

export const Request = async (req, res, next) => {

    try {
        const { subject, level, email, message } = req.body;

        if (!subject || !level || !email || !message) {
            const error = new Error("All input fields are required");
            error.statusCode = 400;
            throw error;
        }

        if (!validateEmail(email)) {
            const error = new Error("Please enter a valid email");
            error.statusCode = 400;
            throw error; 
        }

        const request = await TutorSupport.create(
            { subject, level, email, message });
        
        res.status(200).json({
            success: true,
            message: "Request sent successfully",
            data: request
        });

    } catch (error) {
        next(error);
    } 
};

export const getTutorRequests = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const number = parseInt(req.query.number) || 10;
        const skip = (page - 1) * number;
        const { period, from, to } = req.query;

        const filter = {};

        if (period || from || to) {
            const now = new Date();
            let startDate;
            let endDate = now;

            if (from || to) {
                
                if (from) startDate = new Date(from);
                if (to) endDate = new Date(to);
            } else {
                switch (period) {
                    case 'today': {
                        startDate = new Date();
                        startDate.setHours(0, 0, 0, 0);
                        break;
                    }
                    case 'yesterday': {
                        startDate = new Date();
                        startDate.setDate(startDate.getDate() - 1);
                        startDate.setHours(0, 0, 0, 0);
                        endDate = new Date(startDate);
                        endDate.setHours(23, 59, 59, 999);
                        break;
                    }
                    case 'last7days': {
                        startDate = new Date();
                        startDate.setDate(startDate.getDate() - 7);
                        break;
                    }
                    case 'last30days': {
                        startDate = new Date();
                        startDate.setDate(startDate.getDate() - 30);
                        break;
                    }
                    case 'lastMonth': {
                        startDate = new Date();
                        startDate.setMonth(startDate.getMonth() - 1);
                        break;
                    }
                    case 'last3Months': {
                        startDate = new Date();
                        startDate.setMonth(startDate.getMonth() - 3);
                        break;
                    }
                    case 'last6Months': {
                        startDate = new Date();
                        startDate.setMonth(startDate.getMonth() - 6);
                        break;
                    }
                    case 'lastYear': {
                        startDate = new Date();
                        startDate.setFullYear(startDate.getFullYear() - 1);
                        break;
                    }
                    case 'all':
                    default:
                        // no date filter
                        break;
                }
            }

            if (startDate || endDate) {
                filter.createdAt = {};
                if (startDate) filter.createdAt.$gte = startDate;
                if (endDate) filter.createdAt.$lte = endDate;
            }
        }

        const [requests, total] = await Promise.all([
            TutorSupport.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(number),
            TutorSupport.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            data: requests,
            pagination: {
                total,
                page,
                number,
                totalPages: Math.ceil(total / number),
                hasNextPage: page * number < total,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        next(error);
    }
};

export const ReplyTutorRequest = async (req, res, next) => {
    const { message, _id, email } =  req.body;

    try {
        await sendReplyTutorRequest(email, message)
        const request = await TutorSupport.findByIdAndUpdate({
            _id,
            isReplied: true 
        }) 
    } catch (error) {
        next(error)
    }
};
