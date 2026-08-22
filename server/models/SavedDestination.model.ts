import mongoose, { Schema } from "mongoose";
const savedDestinationSchema = new Schema({ user: { type: Schema.Types.ObjectId, ref: "User", required: true }, city: { type: Schema.Types.ObjectId, ref: "City" }, activity: { type: Schema.Types.ObjectId, ref: "Activity" } }, { timestamps: true });
savedDestinationSchema.index({ user: 1, city: 1 }, { unique: true, sparse: true }); savedDestinationSchema.index({ user: 1, activity: 1 }, { unique: true, sparse: true });
export const SavedDestination = mongoose.models.SavedDestination || mongoose.model("SavedDestination", savedDestinationSchema);
