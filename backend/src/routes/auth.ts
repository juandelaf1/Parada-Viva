import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateBody } from "../utils/validate.js";
import { rateLimit } from "../utils/rateLimit.js";

const LoginBody = z.object({
  email: z.string().email(),
  nombre: z.string().min(1).max(120).optional(),
});

export const authRouter = Router();

authRouter.post(
  "/login",
  rateLimit({ windowMs: 60_000, max: 15 }),
  validateBody(LoginBody),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, nombre } = req.body as { email: string; nombre?: string };

    let usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: { email, nombre: nombre || email.split("@")[0] },
      });
    }

    res.json({ ...usuario, contract_version: "parada-viva-api/0.1" });
  })
);

authRouter.get("/me", asyncHandler(async (req: Request, res: Response) => {
  const email = req.headers["x-user-email"] as string;

  if (!email) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  res.json({ ...usuario, contract_version: "parada-viva-api/0.1" });
}));
