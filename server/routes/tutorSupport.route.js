import express from "express";
import { getTutorRequests, ReplyTutorRequest, Request } from "../controllers/tutorSupport.controller.js";

import { authenticated, restrictTo } from "../middleware/protectedRoute.middleware.js";

const   tutorSupportRouter = express.Router();

tutorSupportRouter.post("/request-support", Request);
tutorSupportRouter.get("/tutor-requests", authenticated, restrictTo("admin", "teacher"), getTutorRequests);
tutorSupportRouter.post("/reply-tutor-requests", authenticated, restrictTo("admin", "teacher"), ReplyTutorRequest)

export default tutorSupportRouter;