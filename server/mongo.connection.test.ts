import mongoose from "mongoose";
import { afterAll, describe, expect, it } from "vitest";

let connection: mongoose.Connection | undefined;

afterAll(async () => {
  await connection?.close();
});

describe("MongoDB configuration", () => {
  it("connects and responds to a lightweight ping without exposing the URI", async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri?.startsWith("mongodb")) throw new Error("MONGODB_URI must begin with mongodb:// or mongodb+srv://");
    if (uri.includes("MONGODB_URI=") || uri.includes("<")) throw new Error("MONGODB_URI contains a variable-name prefix or unresolved placeholders");

    connection = mongoose.createConnection(uri!, {
      serverSelectionTimeoutMS: 10_000,
      maxPoolSize: 1,
    });
    await connection.asPromise();
    const result = await connection.db?.admin().ping();
    expect(result?.ok).toBe(1);
  }, 15_000);
});
