import mongoose, { Schema } from "mongoose";
const communityPostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }, trip: { type: Schema.Types.ObjectId, ref: "Trip" }, activity: { type: Schema.Types.ObjectId, ref: "Activity" },
  title: { type: String, required: true, maxlength: 180 }, content: { type: String, required: true, maxlength: 5000 }, destination: String, country: String, images: [String], imageKeys: [String], tags: [{ type: String, trim: true }], likesCount: { type: Number, default: 0 }, commentsCount: { type: Number, default: 0 },
}, { timestamps: true });
communityPostSchema.index({ title: "text", content: "text", destination: "text" });
export const CommunityPost = mongoose.models.CommunityPost || mongoose.model("CommunityPost", communityPostSchema);
