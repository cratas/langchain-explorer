import { z } from 'zod';
import prisma from '../../../../lib/prisma';
import { BaseFunctionArgs } from '../types';

type FunctionArgs = BaseFunctionArgs & {
  username?: string;
  loggedUserName: string;
  startDate?: Date;
  endDate?: Date;
  orderStatus?: string;
  orderId?: string;
};

export const findOrder = async ({
  role,
  username,
  loggedUserName,
  startDate,
  endDate,
  orderStatus,
  orderId,
}: FunctionArgs) => {
  if (role === 'guest') {
    return 'NOT_AUTHORIZED';
  }

  if (role === 'user' && username && username !== loggedUserName) {
    return 'NOT_AUTHORIZED';
  }

  const customerName = role === 'user' ? loggedUserName : username;

  const customer = await prisma.customer.findFirst({
    where: { name: { equals: customerName, mode: 'insensitive' } },
  });

  if (!customer) {
    return 'User not found';
  }

  const orderConditions: any = {};

  if (role === 'administrator' && username) orderConditions.customerId = customer.id;
  if (role === 'user' && loggedUserName) orderConditions.customerId = customer.id;
  if (startDate) orderConditions.createdAt = { gte: startDate };
  if (endDate) orderConditions.createdAt = { ...orderConditions.createdAt, lte: endDate };
  if (orderStatus) orderConditions.status = orderStatus;
  if (orderId) orderConditions.id = orderId;

  const orders = await prisma.order.findMany({
    where: orderConditions,
  });

  return orders.length > 0 ? orders : 'No orders found';
};

export const findOrderSchema = z.object({
  role: z.enum(['user', 'administrator', 'guest']),
  username: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  orderStatus: z.enum(['processing', 'shipped', 'delivered']).optional(),
  orderId: z.string().optional(),
  loggedUserName: z.string(),
});
