import mongoose, { Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, trim: true, maxlength: 80 },
  lastName: { type: String, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  passwordResetTokenHash: { type: String, select: false }, passwordResetExpiresAt: { type: Date, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user", index: true },
  status: { type: String, enum: ["active", "deactivated"], default: "active", index: true },
  phone: { type: String, maxlength: 40 }, city: { type: String, maxlength: 100 }, country: { type: String, maxlength: 100 }, bio: { type: String, maxlength: 800 },
  avatarUrl: String, avatarKey: String, language: { type: String, default: "English" }, currencyPreference: { type: String, default: "EUR" },
  notificationPreferences: { email: { type: Boolean, default: true }, product: { type: Boolean, default: true } },
}, { timestamps: true, toJSON: { transform: (_doc, ret) => { delete (ret as Record<string, unknown>).passwordHash; delete (ret as Record<string, unknown>).__v; return ret; } } });

export type UserDocument = InferSchemaType<typeof userSchema>;
export const User = mongoose.models.User || mongoose.model("User", userSchema);
