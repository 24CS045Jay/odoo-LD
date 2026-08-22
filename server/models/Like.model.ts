import mongoose, { Schema } from "mongoose";
const likeSchema = new Schema({ post: { type: Schema.Types.ObjectId, ref: "CommunityPost", required: true }, user: { type: Schema.Types.ObjectId, ref: "User", required: true } }, { timestamps: true });
likeSchema.index({ post: 1, user: 1 }, { unique: true });
export const Like = mongoose.models.Like || mongoose.model("Like", likeSchema);
