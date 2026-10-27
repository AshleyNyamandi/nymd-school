import express from "express";
import { getAllStats } from "../controllers/stats.controller.js";

const statsRouter = express.Router()

statsRouter.get("/all-stats", getAllStats);



export default statsRouter;