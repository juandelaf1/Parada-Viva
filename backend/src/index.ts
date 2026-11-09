import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import prisma from "./db.js";
import { authRouter } from "./routes/auth.js";
import { router as estabelecimentosRouter } from "./routes/estabelecimentos.js";
import { checkInsRouter } from "./routes/check-ins.js";
import { valoracionesRouter } from "./routes/valoraciones.js";
import { reportsRouter } from "./routes/reports.js";

const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 3001;

const corsOrigins = (process.env.CORS_ORIGINS || "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({ origin: corsOrigins.includes("*") ? "*" : corsOrigins }));
app.use(express.json());
app.use((req, res, next) => {
  const cid = (req.headers["x-correlation-id"] as string) || randomUUID();
  res.setHeader("X-Correlation-Id", cid);
  (req as any).correlationId = cid;
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
      nearby: "/api/establecimientos/nearby",
      check_ins: true,
      qr_signed: true,
      auth: "stub (D8)",
      reports: "/api/reports/* (x-report-key, agregado sin PII)",
      openapi: null,
      ready: "/api/ready",
    },
  });
});

app.get("/api/ready", async (_req, res) => {
  let database: "ok" | "unavailable" | "skipped" = "skipped";
  // En test o si se pide omitir, no forzar conexión (evita romper entornos sin esquema).
  if (process.env.READY_CHECK_DB === "false" || process.env.NODE_ENV === "test") {
    database = "skipped";
  } else {
    try {
      await prisma.$queryRaw`SELECT 1`;
      database = "ok";
    } catch {
      database = "unavailable";
    }
  }
  res.json({
    ready: true, // proceso vivo; database indica dependencia
    service: "parada-viva-api",
    database,
    contract_version: "parada-viva-api/0.1",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/establecimientos", estabelecimentosRouter);
app.use("/api/check-ins", checkInsRouter);
app.use("/api/valoraciones", valoracionesRouter);
app.use("/api/reports", reportsRouter);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "not_found", contract_version: "parada-viva-api/0.1" });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = typeof err?.status === "number" ? err.status : 500;
  const message = status >= 500 && process.env.NODE_ENV === "production" ? "internal_error" : (err?.message || "error");
  if (status >= 500) console.error("[api_error]", err?.stack || err);
  res.status(status).json({ error: message, contract_version: "parada-viva-api/0.1" });
});

export { app };

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Parada Viva API en puerto ${PORT}`);
  });
}
