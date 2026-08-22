import mongoose, { Schema } from "mongoose";
const activitySchema = new Schema({
  name: { type: String, required: true, trim: true }, city: { type: Schema.Types.ObjectId, ref: "City", required: true, index: true }, category: { type: String, index: true }, cost: { type: Number, default: 0, min: 0 }, duration: String,
  images: [String], imageKeys: [String], description: String, popularityScore: { type: Number, default: 0 },
}, { timestamps: true });
activitySchema.index({ name: "text", description: "text" });
export const Activity = mongoose.models.Activity || mongoose.model("Activity", activitySchema);
