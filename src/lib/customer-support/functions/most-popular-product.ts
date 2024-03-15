import { z } from 'zod';
import prisma from '../../../../lib/prisma';

type FunctionArgs = {
  count: number;
  categoryName?:
    | 'Toys'
    | 'Health'
    | 'Industrial'
    | 'Grocery'
    | 'Garden'
    | 'Movies'
    | 'Bikes'
    | 'Home';
};

export const mostPopularProducts = async ({ categoryName, count }: FunctionArgs) => {
  let products;

  if (categoryName) {
    const category = await prisma.category.findFirst({
      where: {
        name: categoryName,
      },
    });

    products = await prisma.product.findMany({
      where: {
        categoryId: category?.id,
      },
      include: {
        orders: true,
      },
    });
  } else {
    products = await prisma.product.findMany({
      include: {
        orders: true,
      },
    });
  }

  const popularProducts = products
    .sort((a, b) => b.orders.length - a.orders.length)
    .slice(0, count);

  return JSON.stringify(popularProducts);
};

export const mostPopularProductsSchema = z.object({
  categoryName: z
    .enum(['Toys', 'Health', 'Industrial', 'Grocery', 'Garden', 'Movies', 'Bikes', 'Home'])
    .optional(),
  count: z.number(),
});
