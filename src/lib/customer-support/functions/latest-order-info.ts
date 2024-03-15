import { z } from 'zod';
import prisma from '../../../../lib/prisma';
import { BaseFunctionArgs } from '../types';

type FunctionArgs = BaseFunctionArgs & {
  username: string;
  loggedUserName: string;
};

export const latestOrderInfo = async ({ role, username, loggedUserName }: FunctionArgs) => {
  if (role === 'guest') {
    return 'NOT_AUTHORIZED';
  }

  if (role === 'user' && username !== loggedUserName) {
    return 'NOT_AUTHORIZED';
  }

  const customer = await prisma.customer.findFirst({
    where: {
      name: { equals: username, mode: 'insensitive' },
    },
  });

  if (!customer) {
    return 'Customer with this name does not found';
  }

  const order = await prisma.order.findFirst({
    where: {
      customerId: customer.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return JSON.stringify(order);
};

export const latestOrderInfoSchema = z.object({
  role: z.enum(['user', 'administrator', 'guest']),
  username: z.string(),
  loggedUserName: z.string(),
});
