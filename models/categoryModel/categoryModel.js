import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'category is required'],
        trim: true,
        lowercase: true
    }

}, { timestamps: true })



const categoryModel = mongoose.model("category", categorySchema)

export default categoryModel