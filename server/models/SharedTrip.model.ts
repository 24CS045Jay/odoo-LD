import mongoose, { Schema } from "mongoose";
const sharedTripSchema = new Schema({ trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true, unique: true }, shareToken: { type: String, required: true, unique: true, index: true }, isPublic: { type: Boolean, default: true }, viewCount: { type: Number, default: 0 } }, { timestamps: true });
export const SharedTrip = mongoose.models.SharedTrip || mongoose.model("SharedTrip", sharedTripSchema);
