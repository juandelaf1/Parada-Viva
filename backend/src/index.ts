import express from "express";
import cors from "cors";
import { estabelecimentosRouter } from "./routes/estabelecimentos.js";
import { checkInsRouter } from "./routes/check-ins.js";
import { valoracionesRouter } from "./routes/valoraciones.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/establecimientos", estabelecimentosRouter);
app.use("/api/check-ins", checkInsRouter);
app.use("/api/valoraciones", valoracionesRouter);

app.listen(PORT, () => {
  console.log(`Parada Viva API en puerto ${PORT}`);
});
