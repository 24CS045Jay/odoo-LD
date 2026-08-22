import mongoose, { Schema } from "mongoose";
const commentSchema = new Schema({ post: { type: Schema.Types.ObjectId, ref: "CommunityPost", required: true, index: true }, author: { type: Schema.Types.ObjectId, ref: "User", required: true }, content: { type: String, required: true, maxlength: 1200 } }, { timestamps: true });
export const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
