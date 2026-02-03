import { PrismaClient } from "@prisma/client";
import { mockPrisma } from "./mock-db.js";

let prisma: any;

try {
  prisma = new PrismaClient();
  // Test connection
  prisma.$connect().catch(() => {
    console.warn("⚠️  PostgreSQL não disponível. Usando banco de dados mock em memória.");
    prisma = mockPrisma;
  });
} catch {
  console.warn("⚠️  PostgreSQL não disponível. Usando banco de dados mock em memória.");
  prisma = mockPrisma;
}

export { prisma };
