import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import prisma from "./db.js";

process.env.NODE_ENV = "test";
process.env.REPORT_API_KEY = "test-report-key";
process.env.QR_SIGNING_SECRET = "test-qr-secret";

async function getApp() {
  const mod = await import("./index.js");
  return mod.app;
}

const EID = "seed-demo-est-1";
const E2 = "seed-demo-est-2";

beforeAll(async () => {
  // Seed sintético/demo mínimo para tests (aislado por DB temporal del harness)
  await prisma.valoracion.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.establecimiento.deleteMany({ where: { id: { in: [EID, E2] } } });
  await prisma.establecimiento.create({
    data: {
      id: EID,
      nombre: "Bar Demo (sintético)",
      direccion: "Demo 1",
      lat: 43.0923,
      lng: -6.2175,
      activo: true,
      servicios: JSON.stringify([
        { id: "agua", nombre: "Agua" },
        { id: "bano", nombre: "Baño" },
        { id: "recarga", nombre: "Recarga" },
      ]),
    },
  });
  await prisma.establecimiento.create({
    data: {
      id: E2,
      nombre: "Tienda Demo (sintético)",
      direccion: "Demo 2",
      lat: 43.5, // lejos
      lng: -5.7,
      activo: true,
      servicios: JSON.stringify([{ id: "agua", nombre: "Agua" }]),
    },
  });
});

describe("API con BD de test (happy paths)", () => {
  it("nearby: devuelve resultados, filtra por radio y servicios", async () => {
    const app = await getApp();
    const res = await request(app).get(
      "/api/establecimientos/nearby?lat=43.0923&lng=-6.2175&radiusKm=5&servicios=agua,bano"
    );
    expect(res.status).toBe(200);
    expect(res.body.contract_version).toBe("parada-viva-api/0.1");
    expect(res.body.count).toBeGreaterThanOrEqual(1);
    expect(res.body.items[0].id).toBe(EID);
    expect(res.body.filtros.servicios).toContain("agua");
  });

  it("nearby: respeta filtro de servicios excluyente", async () => {
    const app = await getApp();
    const res = await request(app).get(
      "/api/establecimientos/nearby?lat=43.0923&lng=-6.2175&radiusKm=5&servicios=recarga"
    );
    expect(res.status).toBe(200);
    // EID tiene recarga, debe aparecer; E2 lejos
    expect(res.body.items.some((i: any) => i.id === EID)).toBe(true);
  });

  it("QR: genera token firmado + data URL para establecimiento activo", async () => {
    const app = await getApp();
    const res = await request(app).get(`/api/check-ins/qr/${EID}`);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    expect(String(res.body.qr_data_url)).toMatch(/^data:image\/png;base64,/);
    expect(res.body.contract_version).toBe("parada-viva-api/0.1");
  });

  it("QR: 404 para establecimiento inexistente", async () => {
    const app = await getApp();
    const res = await request(app).get(`/api/check-ins/qr/no-existe`);
    expect(res.status).toBe(404);
  });

  it("reports summary: con clave válida devuelve KPIs agregados sin PII", async () => {
    const app = await getApp();
    const res = await request(app)
      .get("/api/reports/summary")
      .set("x-report-key", "test-report-key");
    expect(res.status).toBe(200);
    expect(res.body.pii).toBe("none");
    expect(res.body.summary.establecimientos_activos).toBeGreaterThanOrEqual(2);
    expect(res.body.contract_version).toBe("parada-viva-api/0.1");
  });

  it("reports establishments CSV: con clave válida devuelve attachment", async () => {
    const app = await getApp();
    const res = await request(app)
      .get("/api/reports/establishments?format=csv")
      .set("x-report-key", "test-report-key");
    expect(res.status).toBe(200);
    expect(String(res.headers["content-type"])).toContain("text/csv");
    expect(String(res.headers["content-disposition"])).toContain("attachment");
    expect(res.text).toContain("establecimiento_id");
    expect(res.text).not.toContain("@"); // heurística: sin emails/PII obvia
  });

  it("reports checkins (agregado, sin PII): con clave válida", async () => {
    const app = await getApp();
    const res = await request(app)
      .get("/api/reports/checkins")
      .set("x-report-key", "test-report-key");
    expect(res.status).toBe(200);
    expect(res.body.pii).toBe("none");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.contract_version).toBe("parada-viva-api/0.1");
  });
});
