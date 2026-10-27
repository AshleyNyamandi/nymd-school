import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
    name: String,
    urlSlug: String,   
}, {timestamps: true})

const Subject =  mongoose.model("subject", SubjectSchema);

export default Subject;