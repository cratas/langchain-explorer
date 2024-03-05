import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export const GET = async (request: Request) => {
  const created = await prisma.product.create({
    data: {
      description: 'Specialized Tarmac SL7 Expert Ultegra Di2 2021 Road Bike',
      name: 'Specialized Tarmac SL7',
      price: 200000,
      stock: 100,
      category: {
        create: {
          name: 'Bikes',
          description: 'Bikes for all ages and skill levels.',
        },
      },
    },
  });

  return NextResponse.json({ created }, { status: 200 });
};
