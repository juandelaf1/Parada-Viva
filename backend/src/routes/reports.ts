import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { rateLimit } from "../utils/rateLimit.js";

export const reportsRouter = Router();

// Stopgap (D8): protege exportes agregados. No sustituye auth real.
function requireReportKey(req: Request, res: Response): boolean {
  const expected = process.env.REPORT_API_KEY;
  if (!expected) {
    res.status(503).json({ error: "reports_not_configured", hint: "set REPORT_API_KEY", contract_version: "parada-viva-api/0.1" });
    return false;
  }
  const got = req.headers["x-report-key"];
  if (got !== expected) {
    res.status(401).json({ error: "unauthorized", contract_version: "parada-viva-api/0.1" });
    return false;
  }
  return true;
}

function toCsv(rows: Record<string, any>[]): string {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const esc = (v: any) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

// GET /api/reports/summary — KPIs agregados (sin PII)
reportsRouter.get(
  "/summary",
  rateLimit({ windowMs: 60_000, max: 30 }),
  asyncHandler(async (req: Request, res: Response) => {
    if (!requireReportKey(req, res)) return;
    const [establecimientos, checkIns, valoraciones, rating] = await Promise.all([
      prisma.establecimiento.count({ where: { activo: true } }),
      prisma.checkIn.count(),
      prisma.valoracion.count(),
      prisma.valoracion.aggregate({ _avg: { puntuacion: true } }),
    ]);
    res.json({
      contract_version: "parada-viva-api/0.1",
      procedencia: "agregado_servidor (conteos BD; puede incluir datos sintéticos/demo si seed)",
      pii: "none",
      summary: {
        establecimientos_activos: establecimientos,
        check_ins_total: checkIns,
        valoraciones_total: valoraciones,
        puntuacion_media_global: rating._avg.puntuacion ? Math.round(rating._avg.puntuacion * 100) / 100 : null,
      },
    });
  })
);

// GET /api/reports/establishments?format=json|csv — agregado por establecimiento (sin PII)
reportsRouter.get(
  "/establishments",
  rateLimit({ windowMs: 60_000, max: 30 }),
  asyncHandler(async (req: Request, res: Response) => {
    if (!requireReportKey(req, res)) return;
    const format = z.enum(["json", "csv"]).default("json").safeParse(req.query.format);
    const fmt = format.success ? format.data : "json";
    const rows = await prisma.establecimiento.findMany({
      where: { activo: true },
      select: {
        id: true, nombre: true, direccion: true,
        _count: { select: { checkIns: true, valoraciones: true } },
        valoraciones: { select: { puntuacion: true } },
      },
    });
    const items = rows.map((e) => ({
      establecimiento_id: e.id,
      nombre: e.nombre,
      direccion: e.direccion,
      check_ins: e._count.checkIns,
      valoraciones: e._count.valoraciones,
      puntuacion_media: e.valoraciones.length
        ? Math.round((e.valoraciones.reduce((s, v) => s + v.puntuacion, 0) / e.valoraciones.length) * 100) / 100
        : null,
    }));
    if (fmt === "csv") {
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", "attachment; filename=parada-viva-establishments-report.csv");
      res.send(toCsv(items));
      return;
    }
    res.json({
      contract_version: "parada-viva-api/0.1",
      procedencia: "agregado_servidor (sin PII; puede incluir datos sintéticos/demo)",
      pii: "none",
      count: items.length,
      items,
    });
  })
);
