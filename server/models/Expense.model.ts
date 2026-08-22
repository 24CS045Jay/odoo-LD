import mongoose, { Schema } from "mongoose";
const expenseSchema = new Schema({
  trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true, index: true }, tripSection: { type: Schema.Types.ObjectId, ref: "TripSection" },
  title: { type: String, required: true, maxlength: 180 }, category: { type: String, enum: ["stay", "transport", "food", "activities", "other"], default: "other" }, amount: { type: Number, required: true, min: 0 }, date: { type: Date, default: Date.now }, notes: String,
}, { timestamps: true });
export const Expense = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);
