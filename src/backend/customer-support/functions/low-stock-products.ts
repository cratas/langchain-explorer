import { z } from 'zod';
import prisma from '../../../../lib/prisma';

type FunctionArgs = {
  limit: number;
};

export const lowStockProducts = async ({ limit }: FunctionArgs) => {
  const products = await prisma.product.findMany({
    where: {
      stock: {
        lt: limit,
      },
    },
  });

  console.log('products', products);

  return JSON.stringify(products);
};

export const lowStockProductsSchema = z.object({
  role: z.enum(['administrator', 'user', 'guest']),
  limit: z.number(),
});
