import mongoose, { Schema } from "mongoose";

const tripSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 140 }, description: { type: String, maxlength: 2000 },
  destinations: [{ city: { type: String, required: true }, country: String, image: String, cityRef: { type: Schema.Types.ObjectId, ref: "City" } }],
  startDate: Date, endDate: Date, status: { type: String, enum: ["planning", "upcoming", "ongoing", "completed", "dreaming"], default: "planning", index: true },
  coverImageUrl: String, coverImageKey: String, budget: { type: Number, default: 0, min: 0 }, currency: { type: String, default: "EUR", maxlength: 8 }, isPublic: { type: Boolean, default: false },
}, { timestamps: true });
tripSchema.index({ owner: 1, startDate: 1 });
export const Trip = mongoose.models.Trip || mongoose.model("Trip", tripSchema);
