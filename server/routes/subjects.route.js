import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { getSubjectMaterials, uploadMaterial } from "../controllers/subject.controller.js";

const subjectsRouter = express.Router();

subjectsRouter.post("/upload-material", upload, uploadMaterial);
subjectsRouter.get("/subject/level/:level/subject/:subject/year/:year", getSubjectMaterials);


export default subjectsRouter;