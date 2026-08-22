import mongoose, { Schema } from "mongoose";

const tripSectionSchema = new Schema({
  trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true, index: true }, city: { type: String, required: true }, cityRef: { type: Schema.Types.ObjectId, ref: "City" },
  startDate: Date, endDate: Date, title: { type: String, maxlength: 180 }, notes: { type: String, maxlength: 2000 },
  type: { type: String, enum: ["travel", "hotel", "activity", "sightseeing", "food", "transportation", "custom"], default: "custom" }, budget: { type: Number, default: 0, min: 0 }, orderIndex: { type: Number, default: 0 },
}, { timestamps: true });
tripSectionSchema.index({ trip: 1, orderIndex: 1 });
export const TripSection = mongoose.models.TripSection || mongoose.model("TripSection", tripSectionSchema);
