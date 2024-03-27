import { z } from 'zod';
import { PrismaClientConnectionSingleton } from '@/backend/db/prisma-client-connection-singleton';

type FunctionArgs = {
  limit: number;
};

export const lowStockProducts = async ({ limit }: FunctionArgs) => {
  const prisma = PrismaClientConnectionSingleton.getInstance();

  const products = await prisma.product.findMany({
    where: {
      stock: {
        lt: limit,
      },
    },
  });

  return JSON.stringify(products);
};

export const lowStockProductsSchema = z.object({
  role: z.enum(['administrator', 'user', 'guest']),
  limit: z.number(),
});
