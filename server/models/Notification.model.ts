import mongoose, { Schema, type InferSchemaType } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, trim: true, maxlength: 1000, default: "" },
    type: { type: String, enum: ["trip", "community", "system", "reminder"], default: "system" },
    link: { type: String, default: "" },
    read: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    toJSON: { transform: (_doc, ret) => { delete (ret as Record<string, unknown>).__v; return ret; } },
  }
);

export type NotificationDocument = InferSchemaType<typeof notificationSchema>;
export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
