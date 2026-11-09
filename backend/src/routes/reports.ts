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

// GET /api/reports/checkins?from=&to=&format=json|csv — agregado temporal/por establecimiento (sin PII)
reportsRouter.get(
  "/checkins",
  rateLimit({ windowMs: 60_000, max: 30 }),
  asyncHandler(async (req: Request, res: Response) => {
    if (!requireReportKey(req, res)) return;
    const q = z.object({
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
      format: z.enum(["json", "csv"]).default("json"),
    }).safeParse(req.query);
    if (!q.success) {
      res.status(400).json({ error: "validation_error", details: q.error.issues, contract_version: "parada-viva-api/0.1" });
      return;
    }
    const { from, to, format } = q.data;
    const where: any = {};
    if (from || to) {
      where.creadoEn = {};
      if (from) where.creadoEn.gte = new Date(from);
      if (to) where.creadoEn.lte = new Date(to);
    }
    // Agregado por establecimiento (sin IDs/PII de usuario)
    const grouped = await prisma.checkIn.groupBy({
      by: ["establecimientoId"],
      where,
      _count: { _all: true },
    });
    const ids = grouped.map((g) => g.establecimientoId);
    const ests = ids.length ? await prisma.establecimiento.findMany({ where: { id: { in: ids } }, select: { id: true, nombre: true } }) : [];
    const nameById = new Map(ests.map((e) => [e.id, e.nombre]));
    const items = grouped.map((g) => ({
      establecimiento_id: g.establecimientoId,
      nombre: nameById.get(g.establecimientoId) || null,
      check_ins: g._count._all,
    })).sort((a, b) => b.check_ins - a.check_ins);
    if (format === "csv") {
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", "attachment; filename=parada-viva-checkins-report.csv");
      res.send(toCsv(items));
      return;
    }
    res.json({
      contract_version: "parada-viva-api/0.1",
      procedencia: "agregado_servidor (por establecimiento; sin PII; puede incluir sintético/demo)",
      pii: "none",
      range: { from: from || null, to: to || null },
      count: items.length,
      total_check_ins: items.reduce((s, i) => s + i.check_ins, 0),
      items,
    });
  })
);

// GET /api/reports/ratings?format=json|csv — valoraciones agregadas por establecimiento (sin PII, sin comentarios)
reportsRouter.get(
  "/ratings",
  rateLimit({ windowMs: 60_000, max: 30 }),
  asyncHandler(async (req: Request, res: Response) => {
    if (!requireReportKey(req, res)) return;
    const q = z.object({ format: z.enum(["json", "csv"]).default("json") }).safeParse(req.query);
    const fmt = q.success ? q.data.format : "json";
    const rows = await prisma.establecimiento.findMany({
      where: { activo: true },
      select: {
        id: true,
        nombre: true,
        valoraciones: { select: { puntuacion: true } },
      },
    });
    const items = rows.map((e) => {
      const vals = e.valoraciones.map((v) => v.puntuacion);
      const n = vals.length;
      const avg = n ? vals.reduce((s, v) => s + v, 0) / n : null;
      const dist: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
      for (const v of vals) dist[String(v)] = (dist[String(v)] || 0) + 1;
      return {
        establecimiento_id: e.id,
        nombre: e.nombre,
        valoraciones: n,
        puntuacion_media: avg ? Math.round(avg * 100) / 100 : null,
        dist_1: dist["1"], dist_2: dist["2"], dist_3: dist["3"], dist_4: dist["4"], dist_5: dist["5"],
      };
    }).sort((a, b) => b.valoraciones - a.valoraciones || (b.puntuacion_media ?? 0) - (a.puntuacion_media ?? 0));
    if (fmt === "csv") {
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", "attachment; filename=parada-viva-ratings-report.csv");
      res.send(toCsv(items));
      return;
    }
    res.json({
      contract_version: "parada-viva-api/0.1",
      procedencia: "agregado_servidor (sin PII ni comentarios; puede incluir sintético/demo)",
      pii: "none",
      count: items.length,
      items,
    });
  })
);

// GET /api/reports/establishments?format=json|csv — agregado por establecimiento (sin PII)
reportsRouter.get(
  "/establishments",
  rateLimit({ windowMs: 60_000, max: 30 }),
  asyncHandler(async (req: Request, res: Response) => {
    if (!requireReportKey(req, res)) return;
    const q = z.object({
      format: z.enum(["json", "csv"]).default("json"),
      minCheckIns: z.coerce.number().int().min(0).default(0),
    }).safeParse(req.query);
    const fmt = q.success ? q.data.format : "json";
    const minCheckIns = q.success ? q.data.minCheckIns : 0;
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
    })).sort((a, b) => b.check_ins - a.check_ins || (b.puntuacion_media ?? 0) - (a.puntuacion_media ?? 0))
      .filter((e) => e.check_ins >= minCheckIns);
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
