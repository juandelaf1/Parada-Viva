import { Router, Request, Response } from "express";
import prisma from "../db.js";

export const estabelecimentosRouter = Router();

// GET /api/establecimientos - listar todos los activos
estabelecimentosRouter.get("/", async (_req: Request, res: Response) => {
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
      servicios: {
        bano: e.tieneBano,
        agua: e.tieneAgua,
        recarga: e.tieneRecarga,
      },
      valoracionMedia: media ? Math.round(media * 10) / 10 : null,
      totalVisitas: e._count.checkIns,
    };
  });

  res.json(resultado);
});

// GET /api/establecimientos/:id
estabelecimientosRouter.get("/:id", async (req: Request, res: Response) => {
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

  res.json(establecimiento);
});
