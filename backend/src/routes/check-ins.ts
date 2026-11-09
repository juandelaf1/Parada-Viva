import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateBody } from "../utils/validate.js";
import { rateLimit } from "../utils/rateLimit.js";

const CheckInCreate = z.object({
  usuarioId: z.string().min(1),
  establecimientoId: z.string().min(1),
});

export const checkInsRouter = Router();

// POST /api/check-ins - registrar visita
checkInsRouter.post(
  "/",
  rateLimit({ windowMs: 60_000, max: 30 }),
  validateBody(CheckInCreate),
  asyncHandler(async (req: Request, res: Response) => {
    const { usuarioId, establecimientoId } = req.body;

  // Verificar que el establecimiento existe y está activo
  const establecimiento = await prisma.establecimiento.findUnique({
    where: { id: establecimientoId },
  });

  if (!establecimiento || !establecimiento.activo) {
    res.status(404).json({ error: "Establecimiento no encontrado o inactivo" });
    return;
  }

  // Verificar que el usuario no haya hecho check-in hoy en el mismo sitio
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const existente = await prisma.checkIn.findFirst({
    where: {
      usuarioId,
      establecimientoId,
      creadoEn: { gte: hoy },
    },
  });

  if (existente) {
    res.status(409).json({ error: "Ya has hecho check-in aquí hoy" });
    return;
  }

  const checkIn = await prisma.checkIn.create({
    data: { usuarioId, establecimientoId },
  });

    res.status(201).json({ ...checkIn, contract_version: "parada-viva-api/0.1" });
  })
);

// GET /api/check-ins/mis-checkins (privacidad: solo el propio usuario vía x-user-email)
checkInsRouter.get(
  "/mis-checkins",
  rateLimit({ windowMs: 60_000, max: 60 }),
  asyncHandler(async (req: Request, res: Response) => {
    const email = req.headers["x-user-email"] as string;
    let usuarioId: string | null = null;
    if (email) {
      const usuario = await prisma.usuario.findUnique({ where: { email } });
      if (!usuario) {
        res.status(404).json({ error: "Usuario no encontrado", contract_version: "parada-viva-api/0.1" });
        return;
      }
      usuarioId = usuario.id;
    } else if (req.query.usuarioId) {
      // Compatibilidad legacy (menos seguro); preferir x-user-email
      usuarioId = String(req.query.usuarioId);
    } else {
      res.status(401).json({ error: "No autenticado", contract_version: "parada-viva-api/0.1" });
      return;
    }

    const checkIns = await prisma.checkIn.findMany({
      where: { usuarioId },
    include: {
      establecimiento: {
        select: { id: true, nombre: true, direccion: true },
      },
      valoracion: {
        select: { puntuacion: true, comentario: true },
      },
    },
    orderBy: { creadoEn: "desc" },
    take: 50,
  });

    res.setHeader("X-Contract-Version", "parada-viva-api/0.1");
    res.json(checkIns);
  })
);
