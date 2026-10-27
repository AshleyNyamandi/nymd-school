import mongoose from "mongoose";
import { MONGO_URI, NODE_ENV } from "./env.js";

if (!MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable inside the .env<development/production>.local")
}


const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, { autoIndex: false, autoSelectFamily: false })
        console.log("Connected to database")
    } catch (error) {
        console.error("Error connecting to database:", error.message);
        process.exit(1)
    }
}

export default connectDB;