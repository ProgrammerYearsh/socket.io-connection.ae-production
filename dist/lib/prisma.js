import { PrismaClient } from '@prisma/client';
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query'], // Optional: log SQL queries
    });
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
