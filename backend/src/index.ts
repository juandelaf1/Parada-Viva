import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { router as estabelecimentosRouter } from "./routes/estabelecimentos.js";
import { checkInsRouter } from "./routes/check-ins.js";
import { valoracionesRouter } from "./routes/valoraciones.js";

const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 3001;

const corsOrigins = (process.env.CORS_ORIGINS || "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({ origin: corsOrigins.includes("*") ? "*" : corsOrigins }));
app.use(express.json());
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  if (process.env.HSTS === "true") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "parada-viva-api",
    version: "0.1.0",
    contract_version: "parada-viva-api/0.1",
    capabilities: {
      places: true,
      check_ins: true,
      auth: true,
      openapi: null,
      ready: "/api/ready",
    },
  });
});

app.get("/api/ready", (_req, res) => {
  // Readiness básica (sin acoplar a Prisma aquí para no romper si DB no está configurada).
  res.json({ ready: true, service: "parada-viva-api", database: "unknown" });
});

app.use("/api/auth", authRouter);
app.use("/api/establecimientos", estabelecimentosRouter);
app.use("/api/check-ins", checkInsRouter);
app.use("/api/valoraciones", valoracionesRouter);

export { app };

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Parada Viva API en puerto ${PORT}`);
  });
}
