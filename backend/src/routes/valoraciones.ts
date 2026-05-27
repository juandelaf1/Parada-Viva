import { Router, Request, Response } from "express";
import prisma from "../db.js";

export const valoracionesRouter = Router();

// POST /api/valoraciones - dejar valoración
valoracionesRouter.post("/", async (req: Request, res: Response) => {
  const { checkInId, puntuacion, etiquetas, comentario, establecimientoId } = req.body;

  if (!checkInId || !puntuacion || !establecimientoId) {
    res.status(400).json({ error: "Faltan campos requeridos" });
    return;
  }

  if (puntuacion < 1 || puntuacion > 5) {
    res.status(400).json({ error: "Puntuación debe ser entre 1 y 5" });
    return;
  }

  // Verificar que el check-in existe
  const checkIn = await prisma.checkIn.findUnique({
    where: { id: checkInId },
  });

  if (!checkIn) {
    res.status(404).json({ error: "Check-in no encontrado" });
    return;
  }

  // Verificar que no tenga ya valoración
  if (checkIn.valoracionId) {
    res.status(409).json({ error: "Este check-in ya tiene valoración" });
    return;
  }

  const valoracion = await prisma.valoracion.create({
    data: {
      checkInId,
      establecimientoId,
      puntuacion,
      etiquetas: etiquetas || [],
      comentario: comentario || null,
    },
  });

  // Actualizar check-in con id de valoracion
  await prisma.checkIn.update({
    where: { id: checkInId },
    data: { valoracionId: valoracion.id },
  });

  res.status(201).json(valoracion);
});

// GET /api/valoraciones/establecimiento/:id
valoracionesRouter.get("/establecimiento/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const valoraciones = await prisma.valoracion.findMany({
    where: { establecimientoId: id },
    include: {
      checkIn: {
        include: {
          usuario: { select: { nombre: true } },
        },
      },
    },
    orderBy: { creadoEn: "desc" },
    take: 20,
  });

  res.json(valoraciones);
});
