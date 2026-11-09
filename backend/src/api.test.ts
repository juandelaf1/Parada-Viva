import { describe, it, expect } from "vitest";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./prisma/dev.db";

async function getApp() {
  const mod = await import("./index.js");
  return mod.app;
}

describe("contratos API (sin dependencia de BD)", () => {
  it("nearby: valida parámetros (400)", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/establecimientos/nearby");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("validation_error");
    expect(res.body.contract_version).toBe("parada-viva-api/0.1");
  });

  it("mis-checkins: exige identidad (401) sin x-user-email ni usuarioId", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/check-ins/mis-checkins");
    expect(res.status).toBe(401);
    expect(res.body.contract_version).toBe("parada-viva-api/0.1");
  });

  it("reports: sin REPORT_API_KEY configurada devuelve 503", async () => {
    const prev = process.env.REPORT_API_KEY;
    delete process.env.REPORT_API_KEY;
    const app = await getApp();
    const res = await request(app).get("/api/reports/summary");
    expect(res.status).toBe(503);
    expect(res.body.error).toBe("reports_not_configured");
    if (prev) process.env.REPORT_API_KEY = prev;
  });

  it("reports: con clave incorrecta devuelve 401", async () => {
    const prev = process.env.REPORT_API_KEY;
    process.env.REPORT_API_KEY = "test-key";
    const app = await getApp();
    const res = await request(app)
      .get("/api/reports/summary")
      .set("x-report-key", "wrong");
    expect(res.status).toBe(401);
    if (prev) process.env.REPORT_API_KEY = prev; else delete process.env.REPORT_API_KEY;
  });

  it("404 JSON en rutas API desconocidas", async () => {
    const app = await getApp();
    const res = await request(app).get("/api/no-existe");
    expect(res.status).toBe(404);
    expect(res.body.contract_version).toBe("parada-viva-api/0.1");
  });

  it("429 rate limit (reports summary, sin acceso BD)", async () => {
    const prev = process.env.REPORT_API_KEY;
    process.env.REPORT_API_KEY = "test-key";
    const app = await getApp();
    let last = 401;
    for (let i = 0; i < 35; i++) {
      const res = await request(app).get("/api/reports/summary").set("x-report-key", "wrong");
      last = res.status;
      if (last === 429) break;
    }
    expect(last).toBe(429);
    if (prev) process.env.REPORT_API_KEY = prev; else delete process.env.REPORT_API_KEY;
  });
});
