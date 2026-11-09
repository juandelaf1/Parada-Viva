import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { router as estabelecimentosRouter } from "./routes/estabelecimentos.js";
import { checkInsRouter } from "./routes/check-ins.js";
import { valoracionesRouter } from "./routes/valoraciones.js";

const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
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
    },
  });
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
