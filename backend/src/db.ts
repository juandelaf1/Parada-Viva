import { PrismaClient } from "@prisma/client";

// Permite override por DATABASE_URL (tests/tmp, entornos).
const url = process.env.DATABASE_URL || "file:./prisma/dev.db";
process.env.DATABASE_URL = process.env.DATABASE_URL || url;
const prisma = new PrismaClient({ datasources: { db: { url } } });

export default prisma;
