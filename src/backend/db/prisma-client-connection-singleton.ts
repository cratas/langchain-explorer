import { PrismaClient } from '@prisma/client';

export class PrismaClientConnectionSingleton {
  private static instance: PrismaClient;

  // Prevent direct instantiation
  private constructor() {
    throw new Error('Use PrismaClientConnectionSingleton.getInstance()');
  }

  public static getInstance(): PrismaClient {
    if (process.env.NODE_ENV === 'production') {
      if (!PrismaClientConnectionSingleton.instance) {
        PrismaClientConnectionSingleton.instance = new PrismaClient();
      }

      return PrismaClientConnectionSingleton.instance;
    }

    const globalWithPrisma = global as typeof globalThis & {
      prisma: PrismaClient;
    };

    if (!globalWithPrisma.prisma) {
      globalWithPrisma.prisma = new PrismaClient();
    }

    return globalWithPrisma.prisma;
  }
}
