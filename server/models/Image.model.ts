import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    category: {
      type: String,
      enum: ["trip", "city", "activity", "community", "avatar"],
      required: true,
      index: true,
    },
    entityId: { type: Schema.Types.ObjectId, required: false, index: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

imageSchema.index({ category: 1, createdAt: -1 });

export const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);
