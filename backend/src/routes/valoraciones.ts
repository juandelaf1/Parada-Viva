import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateBody } from "../utils/validate.js";
import { rateLimit } from "../utils/rateLimit.js";

const ValoracionCreate = z.object({
  checkInId: z.string().min(1),
  establecimientoId: z.string().min(1),
  puntuacion: z.number().int().min(1).max(5),
  etiquetas: z.array(z.string().max(40)).max(12).optional().default([]),
  comentario: z.string().max(1000).optional().nullable(),
});

export const valoracionesRouter = Router();

// POST /api/valoraciones - dejar valoración
valoracionesRouter.post(
  "/",
  rateLimit({ windowMs: 60_000, max: 30 }),
  validateBody(ValoracionCreate),
  asyncHandler(async (req: Request, res: Response) => {
    const { checkInId, puntuacion, etiquetas, comentario, establecimientoId } = req.body;

  const checkIn = await prisma.checkIn.findUnique({
    where: { id: checkInId },
  });

  if (!checkIn) {
    res.status(404).json({ error: "Check-in no encontrado" });
    return;
  }

  const valoracionExistente = await prisma.valoracion.findUnique({
    where: { checkInId },
  });

  if (valoracionExistente) {
    res.status(409).json({ error: "Este check-in ya tiene valoración" });
    return;
  }

  const valoracion = await prisma.valoracion.create({
    data: {
      checkInId,
      establecimientoId,
      puntuacion,
      etiquetas: JSON.stringify(etiquetas || []),
      comentario: comentario || null,
    },
  });

  res.status(201).json({ ...valoracion, contract_version: "parada-viva-api/0.1" });
}));

// GET /api/valoraciones/establecimiento/:id
valoracionesRouter.get("/establecimiento/:id", asyncHandler(async (req: Request, res: Response) => {
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

  const resultado = valoraciones.map((v) => ({
    ...v,
    etiquetas: JSON.parse(v.etiquetas as string),
  }));
  res.json(resultado);
}));
