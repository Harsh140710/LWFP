import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, lowercase: true, unique: true }
}, { timestamps: true });

export const Brand = mongoose.model("Brand", brandSchema);