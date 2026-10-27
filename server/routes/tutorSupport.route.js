import express from "express";
import { getTutorRequests, ReplyTutorRequest, Request } from "../controllers/tutorSupport.controller.js";

const   tutorSupportRouter = express.Router();

tutorSupportRouter.post("/request-support", Request);
tutorSupportRouter.get("/tutor-requests", getTutorRequests);
tutorSupportRouter.post("/reply-tutor-requests", ReplyTutorRequest)

export default tutorSupportRouter;