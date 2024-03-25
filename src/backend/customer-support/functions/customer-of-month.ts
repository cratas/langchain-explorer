import { Customer } from '@prisma/client';
import { z } from 'zod';
import prisma from '../../../../lib/prisma';
import { BaseFunctionArgs } from '../types';

type FunctionArgs = BaseFunctionArgs & {
  month:
    | 'january'
    | 'february'
    | 'march'
    | 'april'
    | 'may'
    | 'june'
    | 'july'
    | 'august'
    | 'september'
    | 'october'
    | 'november'
    | 'december';
  year?: number;
};

export const customerOfMonth = async ({ role, month, year = 2024 }: FunctionArgs) => {
  if (role !== 'administrator') {
    return 'NOT_AUTHORIZED';
  }

  const monthNumber = new Map<string, number>([
    ['january', 0],
    ['february', 1],
    ['march', 2],
    ['april', 3],
    ['may', 4],
    ['june', 5],
    ['july', 6],
    ['august', 7],
    ['september', 8],
    ['october', 9],
    ['november', 10],
    ['december', 11],
  ]).get(month);

  const startOfMonth = new Date(year, monthNumber!, 1);
  const endOfMonth = new Date(year, monthNumber! + 1, 0);

  const customers = await prisma.customer.findMany({
    where: {
      orders: {
        some: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      },
    },
    include: {
      orders: {
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        select: {
          total: true,
        },
      },
    },
  });

  let maxTotal = 0;
  let customerOfTheMonth: Customer | null = null;

  customers.forEach((customer) => {
    const totalOrderAmount = customer.orders.reduce((sum, order) => sum + order.total, 0);
    if (totalOrderAmount > maxTotal) {
      maxTotal = totalOrderAmount;
      customerOfTheMonth = customer;
    }
  });

  return customerOfTheMonth
    ? (customerOfTheMonth as Customer).name
    : 'No customer of the month found.';
};

export const customerOfMonthSchema = z.object({
  role: z.enum(['user', 'administrator', 'guest']),
  month: z.enum([
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ]),
  year: z.number().optional(),
});
