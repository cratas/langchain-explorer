import { CustomerSupportRoles } from '@/shared/constants/customer-support';
import { z } from 'zod';

export type BaseFunctionArgs = {
  role: CustomerSupportRoles;
};

export type GetLatestOrderInfoFunctionArgs = BaseFunctionArgs & {
  username: string;
  loggedUserName: string;
};

export type GetLowStockProductsFunctionArgs = { limit: number };

export type GetMostPopularProductsFunctionArgs = { count: number; categoryName?: string };

export type FindOrderFunctionArgs = BaseFunctionArgs & {
  username?: string;
  loggedUserName: string;
  startDate?: Date;
  endDate?: Date;
  orderStatus?: string;
  orderId?: string;
};

export type GetCustomerOfMonthFunctionArgs = BaseFunctionArgs & {
  month: string;
  year?: number;
};

export const getCustomerOfMonthSchema = z.object({
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

export const getMostPopularProductsSchema = z.object({
  categoryName: z
    .enum(['Toys', 'Health', 'Industrial', 'Grocery', 'Garden', 'Movies', 'Bikes', 'Home'])
    .optional(),
  count: z.number(),
});

export const getLowStockProductsSchema = z.object({
  role: z.enum(['administrator', 'user', 'guest']),
  limit: z.number(),
});

export const getLatestOrderInfoSchema = z.object({
  role: z.enum(['user', 'administrator', 'guest']),
  username: z.string(),
  loggedUserName: z.string(),
});

export const findOrderSchema = z.object({
  role: z.enum(['user', 'administrator', 'guest']),
  username: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  orderStatus: z.enum(['processing', 'shipped', 'delivered']).optional(),
  orderId: z.string().optional(),
  loggedUserName: z.string(),
});
