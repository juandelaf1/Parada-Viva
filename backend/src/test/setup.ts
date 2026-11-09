import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.NODE_ENV = "test";
// DB SQLite temporal aislada para suite (step 2). Se crea vía prisma db push.
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("dev.db")) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "parada-viva-test-"));
  const dbPath = path.join(dir, "test.db");
  process.env.DATABASE_URL = `file:${dbPath.replace(/\\/g, "/")}`;
}
try {
  execSync("npx prisma db push --schema=prisma/schema.prisma --skip-generate --accept-data-loss", {
    cwd: path.resolve(__dirname, "..", ".."),
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
  });
} catch (e: any) {
  console.warn("[test setup] prisma db push failed:", e?.message || e);
}
