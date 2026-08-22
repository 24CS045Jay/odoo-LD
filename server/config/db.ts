import mongoose from "mongoose";
import { env } from "./env";

let connecting: Promise<typeof mongoose> | undefined;

export function connectMongo() {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose);
  if (!connecting) {
    connecting = mongoose.connect(env.MONGODB_URI, { maxPoolSize: 10, serverSelectionTimeoutMS: 10_000 });
    mongoose.connection.on("error", error => console.error("[MongoDB] connection error", error.message));
  }
  return connecting;
}

export async function disconnectMongo() {
  connecting = undefined;
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
}
