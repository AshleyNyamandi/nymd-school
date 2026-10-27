import { supabase } from "../config/supabase.js";
import Material from "../models/material.model.js";

export const uploadMaterial = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file provided." });
        }

        const { level, subject, type, year, topic, paper, session } = req.body;

        // unique file path for Supabase bucket to avoid overwriting files
        const fileExtension = req.file.originalname.split(".").pop();
        const fileName = type === "marking-scheme" || type === "past-paper" ? (
            `${level}_${subject}_${year}_${session}_${paper}_${type}_${Math.random().toString(36).substring(2, 7)}.${fileExtension}`
        ) : `${level}_${subject}_${topic}_${Math.random().toString(36).substring(2, 7)}.${fileExtension}`

        const filePath = `${level}/${subject}/${fileName}`;

        // Upload the raw buffer to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from("online-school-documents")
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                cacheControl: "3600",
                upsert: false
            });

        if (uploadError) {
            console.log(uploadError)
            return res.status(500).json({ message: "Document upload failed", error: uploadError.message });
        }

        // Public URL of the uploaded asset
        const { data: urlData } = supabase.storage
            .from("online-school-documents")
            .getPublicUrl(filePath);

        const publicFileUrl = urlData.publicUrl;

        // Saving file metadata and public URL string to MongoDB
        const newDocument = await Material.create({
            level,
            subject,
            materialType: type,
            year,
            topic,
            paper,
            session,
            fileUrl: publicFileUrl,
        });

        return res.status(201).json({
            message: "Document successfully processed and saved.",
            data: newDocument
        });

    } catch (error) {
      console.log(error)
        next(error);
    }
};

export const getSubjectMaterials = async (req, res, next) => {
  try { 
    const { level, subject, year } = req.params
    const escapedSubject = subject.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const data = await Material.find({
      level,  
      subject: new RegExp(`^${escapedSubject}$`, 'i'),
      year
    })
  
    res.status(200).json({
      data
    })
  } catch (error) {
    console.log("Error in the getSubjectMaterials controller: ", error.message)
    next(error)
  }
}