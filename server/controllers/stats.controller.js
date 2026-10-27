import Material from "../models/material.model.js"

export const getAllStats = async(req, res, next) => {
    try {
        const [OlevelQp, AlevelQp, OlevelMs, AlevelMs] = await Promise.all([
            Material.countDocuments({level: "o-level", materialType: "past-paper"}),
            Material.countDocuments({level: "a-level", materialType: "past-paper"}),
            Material.countDocuments({level: "o-level", materialType: "marking-scheme"}),
            Material.countDocuments({level: "a-level", materialType: "marking-scheme"}),            
        ])

        res.status(200).json({
            success: true,
            data: {
                OlevelQp,
                AlevelQp,
                OlevelMs,
                AlevelMs
            }
        })
    } catch (error) {
        console.log("Error in the getAllStats controller: ", error.message)
        next(error)
    }
}