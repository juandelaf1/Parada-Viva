import { Router, Request, Response } from "express";
import prisma from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
