import { describe, it, expect } from "vitest";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./prisma/dev.db";

describe("health contract", () => {
  it("returns contract_version and capabilities", async () => {
    const mod = await import("./index.js");
    const app = mod.app;
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.contract_version).toBe("parada-viva-api/0.1");
    expect(res.body.capabilities).toBeTruthy();
  });
});
