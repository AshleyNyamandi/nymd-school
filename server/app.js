import express from "express";
import cookieParser from "cookie-parser";
import { CLIENT_URL, PORT } from "./config/env.js";
import connectDB from "./config/db.js";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import tutorSupportRouter from "./routes/tutorSupport.route.js";
import subjectsRouter from "./routes/subjects.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import statsRouter from "./routes/stats.route.js";
import userRouter from "./routes/user.route.js";

const app = express()


app.use(cors({
    origin: CLIENT_URL,
    credentials: true    
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tutor-support", tutorSupportRouter);
app.use("/api/v1/subjects", subjectsRouter);
app.use("/api/v1/stats", statsRouter)
app.use("/api/v1/users", userRouter)
app.use(errorMiddleware);



app.listen(PORT, async() => {
  console.log(`Server started on port ${PORT}`)  
  await connectDB()
})