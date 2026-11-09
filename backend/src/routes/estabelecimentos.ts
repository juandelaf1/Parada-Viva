import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { rateLimit } from "../utils/rateLimit.js";
import { haversineKm, bbox, maybeObfuscateLatLng } from "../utils/geo.js";

export const router = Router();

// GET /api/establecimientos - listar activos (array compat) + filtros/paginación opcionales
router.get(
  "/",
  rateLimit({ windowMs: 60_000, max: 120 }),
  asyncHandler(async (req: Request, res: Response) => {
    const q = z
      .object({
        limit: z.coerce.number().int().positive().max(200).default(200),
        offset: z.coerce.number().int().min(0).max(10000).default(0),
        servicios: z.string().optional(),
      })
      .safeParse(req.query);
    if (!q.success) {
      res.status(400).json({
        error: "validation_error",
        details: q.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        contract_version: "parada-viva-api/0.1",
      });
      return;
    }
    const { limit, offset, servicios } = q.data;
    const wanted = (servicios || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
      .map((s) => (s === "electricidad" ? "recarga" : s === "baño" || s === "ba\u00f1o" ? "bano" : s));

    const establecimientos = await prisma.establecimiento.findMany({
      where: { activo: true },
      include: {
        valoraciones: { select: { puntuacion: true } },
        _count: { select: { checkIns: true } },
      },
    });

    let resultado = establecimientos.map((e) => {
      const media =
        e.valoraciones.length > 0
          ? e.valoraciones.reduce((sum, v) => sum + v.puntuacion, 0) / e.valoraciones.length
          : null;
      const coords = maybeObfuscateLatLng(e.lat, e.lng);
      return {
        id: e.id,
        nombre: e.nombre,
        direccion: e.direccion,
        lat: coords.lat,
        lng: coords.lng,
        horario: e.horario,
        telefono: e.telefono,
        fotoUrl: e.fotoUrl,
        servicios: JSON.parse(e.servicios as string),
        valoracionMedia: media ? Math.round(media * 10) / 10 : null,
        totalVisitas: e._count.checkIns,
      };
    });
    if (wanted.length) {
      resultado = resultado.filter((e) => {
        const ids = new Set((e.servicios || []).map((s: any) => String(s.id || "").toLowerCase()));
        return wanted.every((w) => ids.has(w));
      });
    }
    const total = resultado.length;
    resultado = resultado.slice(offset, offset + limit);
    res.setHeader("X-Contract-Version", "parada-viva-api/0.1");
    res.setHeader("X-Total-Count", String(total));
    res.json(resultado);
  })
);

// GET /api/establecimientos/nearby?lat=&lng=&radiusKm=&limit= (MVP mapa; procedencia calculada)
router.get(
  "/nearby",
  rateLimit({ windowMs: 60_000, max: 120 }),
  asyncHandler(async (req: Request, res: Response) => {
    const q = z
      .object({
        lat: z.coerce.number().min(-90).max(90),
        lng: z.coerce.number().min(-180).max(180),
        radiusKm: z.coerce.number().positive().max(200).default(25),
        limit: z.coerce.number().int().positive().max(100).default(30),
        offset: z.coerce.number().int().min(0).max(10000).default(0),
        servicios: z.string().optional(), // csv ids: agua,bano,recarga (electricidad->recarga)
      })
      .safeParse(req.query);
    if (!q.success) {
      res.status(400).json({
        error: "validation_error",
        details: q.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        contract_version: "parada-viva-api/0.1",
      });
      return;
    }
    const { lat, lng, radiusKm, limit, offset, servicios } = q.data;
    const wanted = (servicios || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
      .map((s) => (s === "electricidad" ? "recarga" : s === "baño" || s === "ba\u00f1o" ? "bano" : s));
    const box = bbox(lat, lng, radiusKm);
    const rows = await prisma.establecimiento.findMany({
      where: {
        activo: true,
        lat: { gte: box.minLat, lte: box.maxLat },
        lng: { gte: box.minLng, lte: box.maxLng },
      },
      select: { id: true, nombre: true, direccion: true, lat: true, lng: true, servicios: true },
    });
    const items = rows
      .map((e) => {
        const distanceKm = haversineKm(lat, lng, e.lat, e.lng);
        const coords = maybeObfuscateLatLng(e.lat, e.lng);
        return {
          id: e.id,
          nombre: e.nombre,
          direccion: e.direccion,
          lat: coords.lat,
          lng: coords.lng,
          servicios: JSON.parse(e.servicios as string),
          distanceKm: Math.round(distanceKm * 100) / 100,
        };
      })
      .filter((e) => e.distanceKm <= radiusKm)
      .filter((e) => {
        if (!wanted.length) return true;
        const ids = new Set((e.servicios || []).map((s: any) => String(s.id || "").toLowerCase()));
        return wanted.every((w) => ids.has(w));
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(offset, offset + limit);
    res.json({
      items,
      count: items.length,
      center: { lat, lng },
      radiusKm,
      offset,
      filtros: { servicios: wanted },
      procedencia: "calculado_servidor (haversine sobre coords registradas; establecimientos=observado si son reales, demo si seed sintético)",
      contract_version: "parada-viva-api/0.1",
    });
  })
);

// GET /api/establecimientos/:id
router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const establecimiento = await prisma.establecimiento.findUnique({
    where: { id },
    include: {
      valoraciones: {
        include: {
          checkIn: {
            include: {
              usuario: { select: { nombre: true } },
            },
          },
        },
        orderBy: { creadoEn: "desc" },
        take: 20,
      },
    },
  });

  if (!establecimiento) {
    res.status(404).json({ error: "No encontrado" });
    return;
  }

  const resultado = {
    ...establecimiento,
    servicios: JSON.parse(establecimiento.servicios as string),
    valoraciones: establecimiento.valoraciones.map((v) => ({
      ...v,
      etiquetas: JSON.parse(v.etiquetas as string),
    })),
  };

  res.json(resultado);
}));
