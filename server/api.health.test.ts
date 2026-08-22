import { describe, expect, it } from "vitest";
import { connectMongo, disconnectMongo } from "./config/db";

describe("World Trotter backend foundation", () => {
  it("connects to MongoDB and exposes an active connection state", async () => {
    const mongoose = await connectMongo();
    expect(mongoose.connection.readyState).toBe(1);
    await disconnectMongo();
  }, 15_000);
});

