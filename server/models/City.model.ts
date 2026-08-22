import mongoose, { Schema } from "mongoose";
const citySchema = new Schema({
  name: { type: String, required: true, trim: true }, country: { type: String, required: true, trim: true }, region: { type: String, index: true }, tag: String, description: String,
  costIndex: { type: Number, default: 0 }, popularityScore: { type: Number, default: 0 }, imageUrl: String, imageKey: String,
}, { timestamps: true });
citySchema.index({ name: 1, country: 1 }, { unique: true }); citySchema.index({ name: "text", country: "text", description: "text" });
export const City = mongoose.models.City || mongoose.model("City", citySchema);
