import { PrismaClient } from '@prisma/client';
import { logger } from '../../../logger';

/**
 * Singleton class for managing a connection to the Prisma client.
 * This class ensures that only one instance of the Prisma client is created and reused throughout
 * the application. It uses the Singleton design pattern and provides additional handling for
 * different environments such as production and development.
 */
export class PrismaClientConnectionSingleton {
  /**
   * Holds the singleton instance of the Prisma client.
   * @private
   */
  private static instance: PrismaClient;

  /**
   * Provides the singleton instance of the Prisma client.
   * In a production environment, it maintains a single instance within the class.
   * In other environments, it attaches the instance to the global object to ensure a single instance across the application.
   * This helps in maintaining a single connection pool in development environments where module hot-reloading might otherwise create multiple connections.
   *
   * @returns {PrismaClient} The singleton instance of the Prisma client.
   */
  public static getInstance(): PrismaClient {
    if (process.env.NODE_ENV === 'production') {
      if (!PrismaClientConnectionSingleton.instance) {
        logger.info('PrismaClientConnectionSingleton - Creating Prisma client instance');

        PrismaClientConnectionSingleton.instance = new PrismaClient();
      }

      return PrismaClientConnectionSingleton.instance;
    }

    // In non-production environments (development), use a global variable to ensure singleton behavior across hot-reloads.
    const globalWithPrisma = global as typeof globalThis & {
      prisma: PrismaClient;
    };

    if (!globalWithPrisma.prisma) {
      logger.info('PrismaClientConnectionSingleton - Creating Prisma client instance');

      globalWithPrisma.prisma = new PrismaClient();
    }

    return globalWithPrisma.prisma;
  }
}
