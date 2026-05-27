import { Router, Request, Response } from "express";
import prisma from "../db.js";

export const checkInsRouter = Router();

// POST /api/check-ins - registrar visita
checkInsRouter.post("/", async (req: Request, res: Response) => {
  const { usuarioId, establecimientoId } = req.body;

  if (!usuarioId || !establecimientoId) {
    res.status(400).json({ error: "Faltan campos: usuarioId, establecimientoId" });
    return;
  }

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

  res.status(201).json(checkIn);
});

// GET /api/check-ins/mis-checkins?usuarioId=
checkInsRouter.get("/mis-checkins", async (req: Request, res: Response) => {
  const { usuarioId } = req.query;

  if (!usuarioId) {
    res.status(400).json({ error: "Falta usuarioId" });
    return;
  }

  const checkIns = await prisma.checkIn.findMany({
    where: { usuarioId: String(usuarioId) },
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

  res.json(checkIns);
});
