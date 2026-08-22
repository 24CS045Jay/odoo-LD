import mongoose, { Schema } from "mongoose";

const itineraryActivitySchema = new Schema({
  tripSection: { type: Schema.Types.ObjectId, ref: "TripSection", required: true, index: true }, catalogActivity: { type: Schema.Types.ObjectId, ref: "Activity" },
  title: { type: String, required: true, maxlength: 180 }, time: String, duration: String, cost: { type: Number, default: 0, min: 0 }, category: String, notes: { type: String, maxlength: 2000 }, orderIndex: { type: Number, default: 0 },
}, { timestamps: true });
itineraryActivitySchema.index({ tripSection: 1, orderIndex: 1 });
export const ItineraryActivity = mongoose.models.ItineraryActivity || mongoose.model("ItineraryActivity", itineraryActivitySchema);
