import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { rateLimit } from "../utils/rateLimit.js";
import { haversineKm, bbox } from "../utils/geo.js";

export const router = Router();

// GET /api/establecimientos - listar todos los activos
router.get("/", asyncHandler(async (_req: Request, res: Response) => {
  const establecimientos = await prisma.establecimiento.findMany({
    where: { activo: true },
    include: {
      valoraciones: {
        select: { puntuacion: true },
      },
      _count: { select: { checkIns: true } },
    },
  });

  const resultado = establecimientos.map((e) => {
    const media =
      e.valoraciones.length > 0
        ? e.valoraciones.reduce((sum, v) => sum + v.puntuacion, 0) /
          e.valoraciones.length
        : null;

    return {
      id: e.id,
      nombre: e.nombre,
      direccion: e.direccion,
      lat: e.lat,
      lng: e.lng,
      horario: e.horario,
      telefono: e.telefono,
      fotoUrl: e.fotoUrl,
      servicios: JSON.parse(e.servicios as string),
      valoracionMedia: media ? Math.round(media * 10) / 10 : null,
      totalVisitas: e._count.checkIns,
    };
  });

  res.json(resultado);
}));

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
    const { lat, lng, radiusKm, limit } = q.data;
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
        return {
          id: e.id,
          nombre: e.nombre,
          direccion: e.direccion,
          lat: e.lat,
          lng: e.lng,
          servicios: JSON.parse(e.servicios as string),
          distanceKm: Math.round(distanceKm * 100) / 100,
        };
      })
      .filter((e) => e.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, limit);
    res.json({
      items,
      count: items.length,
      center: { lat, lng },
      radiusKm,
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
