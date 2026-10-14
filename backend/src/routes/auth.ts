import { Router, Request, Response } from "express";
import prisma from "../db.js";

export const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, nombre } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email requerido" });
    return;
  }

  let usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) {
    usuario = await prisma.usuario.create({
      data: { email, nombre: nombre || email.split("@")[0] },
    });
  }

  res.json(usuario);
});

authRouter.get("/me", async (req: Request, res: Response) => {
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

  res.json(usuario);
});
