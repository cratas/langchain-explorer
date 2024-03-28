import { Customer, PrismaClient } from '@prisma/client';
import { PrismaClientConnectionSingleton } from '../db/prisma-client-connection-singleton';
import {
  FindOrderFunctionArgs,
  GetCustomerOfMonthFunctionArgs,
  GetLatestOrderInfoFunctionArgs,
  GetLowStockProductsFunctionArgs,
  GetMostPopularProductsFunctionArgs,
} from '../types/customer-support';
import { logger } from '../../../logger';

/**
 * Service class for interacting with the Prisma database.
 * Provides functionality to retrieve data from the database, such as fetching the latest order
 * information, finding low stock products, and getting the most popular products.
 */
export class PrismaDatabaseService {
  /**
   * A PrismaClient instance for interacting with the database.
   */
  private readonly _prismaClient: PrismaClient;

  /**
   * Constructs a PrismaDatabaseService object.
   * Initializes a connection to the Prisma database using PrismaClientConnectionSingleton.
   */
  constructor() {
    this._prismaClient = PrismaClientConnectionSingleton.getInstance();
  }

  /**
   * Retrieves the information about the latest order of the customer.
   *
   * @param {GetLatestOrderInfoFunctionArgs} args - The arguments for the function call.
   * @returns {Promise<string>} A promise that resolves with the latest order information as a JSON string.
   * @throws {Error} Throws an error if the operation fails.
   */
  public async getLatestOrderInfo({
    role,
    username,
    loggedUserName,
  }: GetLatestOrderInfoFunctionArgs): Promise<string> {
    if (role === 'guest' || (role === 'user' && username !== loggedUserName)) {
      logger.info(
        `CustomerSupportService - User ${loggedUserName} is not authorized to get latest order info for ${username}`
      );

      return 'NOT_AUTHORIZED';
    }

    try {
      const customer = await this._prismaClient.customer.findFirst({
        where: {
          name: { equals: username, mode: 'insensitive' },
        },
      });

      if (!customer) {
        return 'Customer with this name does not found';
      }

      const order = await this._prismaClient.order.findFirst({
        where: {
          customerId: customer.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      logger.info(
        `CustomerSupportService - Retrieved latest order info for customer ${username}: ${JSON.stringify(
          order
        )}`
      );

      return JSON.stringify(order);
    } catch (error) {
      logger.error(`CustomerSupportService - Failed to get latest order info: ${error}`);

      throw new Error('Failed to get latest order info');
    }
  }

  /**
   * Retrieves the products with stock below the specified limit.
   *
   * @param {GetLowStockProductsFunctionArgs} args - The arguments for the function call.
   * @returns {Promise<string>} A promise that resolves with the low stock products as a JSON string.
   * @throws {Error} Throws an error if the operation fails.
   */
  public async getLowStockProducts({ limit }: GetLowStockProductsFunctionArgs) {
    try {
      const products = await this._prismaClient.product.findMany({
        where: {
          stock: {
            lt: limit,
          },
        },
      });

      logger.info(
        `CustomerSupportService - Retrieved low stock products with limit ${limit}: ${JSON.stringify(
          products
        )}`
      );

      return JSON.stringify(products);
    } catch (error) {
      logger.error(`CustomerSupportService - Failed to get low stock products: ${error}`);

      throw new Error('Failed to get low stock products');
    }
  }

  /**
   * Retrieves the most popular products based on the number of orders.
   *
   * @param {GetMostPopularProductsFunctionArgs} args - The arguments for the function call.
   * @returns {Promise<string>} A promise that resolves with the most popular products as a JSON string.
   * @throws {Error} Throws an error if the operation fails.
   */
  public async getMostPopularProducts({
    count,
    categoryName,
  }: GetMostPopularProductsFunctionArgs): Promise<string> {
    let products;

    try {
      if (categoryName) {
        const category = await this._prismaClient.category.findFirst({
          where: {
            name: categoryName,
          },
        });

        products = await this._prismaClient.product.findMany({
          where: {
            categoryId: category?.id,
          },
          include: {
            orders: true,
          },
        });
      } else {
        products = await this._prismaClient.product.findMany({
          include: {
            orders: true,
          },
        });
      }

      const popularProducts = products
        .sort((a, b) => b.orders.length - a.orders.length)
        .slice(0, count);

      logger.info(
        `CustomerSupportService - Retrieved most popular products with count ${count}: ${JSON.stringify(
          popularProducts
        )}`
      );

      return JSON.stringify(popularProducts);
    } catch (error) {
      logger.error(`CustomerSupportService - Failed to get most popular products: ${error}`);

      throw new Error('Failed to get most popular products');
    }
  }

  /**
   * Finds the orders based on the specified criteria.
   *
   * @param {FindOrderFunctionArgs} args - The arguments for the function call.
   * @returns {Promise<string>} A promise that resolves with the orders as a JSON string.
   * @throws {Error} Throws an error if the operation fails.
   */
  public async findOrder({
    role,
    username,
    loggedUserName,
    startDate,
    endDate,
    orderStatus,
    orderId,
  }: FindOrderFunctionArgs): Promise<string> {
    if (role === 'guest' || (role === 'user' && username && username !== loggedUserName)) {
      logger.info(
        `CustomerSupportService - User ${loggedUserName} is not authorized to find orders for ${username}`
      );

      return 'NOT_AUTHORIZED';
    }

    const customerName = role === 'user' ? loggedUserName : username;

    try {
      const customer = await this._prismaClient.customer.findFirst({
        where: { name: { equals: customerName, mode: 'insensitive' } },
      });

      if (!customer) {
        logger.info(`Customer with name ${customerName} not found`);

        throw new Error('User not found');
      }

      const orderConditions: any = {};

      if (role === 'administrator' && username) orderConditions.customerId = customer.id;
      if (role === 'user' && loggedUserName) orderConditions.customerId = customer.id;
      if (startDate) orderConditions.createdAt = { gte: startDate };
      if (endDate) orderConditions.createdAt = { ...orderConditions.createdAt, lte: endDate };
      if (orderStatus) orderConditions.status = orderStatus;
      if (orderId) orderConditions.id = orderId;

      const orders = await this._prismaClient.order.findMany({ where: orderConditions });

      logger.info(
        `CustomerSupportService - Found orders for customer ${customerName}: ${JSON.stringify(
          orders
        )}`
      );

      return orders.length > 0 ? JSON.stringify(orders) : 'No orders found';
    } catch (error) {
      logger.error(`CustomerSupportService - Failed to find orders: ${error}`);

      throw new Error('Failed to find orders');
    }
  }

  /**
   * Determines the customer of the month based on the total order amount within the specified month and year.
   * Accessible only by non-guest users.
   *
   * @param {GetCustomerOfMonthFunctionArgs} params - Month and year for which to find the customer of the month.
   * @returns {Promise<string>} A promise that resolves to the name of the customer of the month, or a not found/error message.
   */
  public async getCustomerOfMonth({
    role,
    month,
    year,
  }: GetCustomerOfMonthFunctionArgs): Promise<string> {
    if (role === 'guest') {
      logger.info(
        'CustomerSupportService - Guest user is not authorized to get customer of the month'
      );

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

    if (monthNumber === undefined) {
      logger.error(`Invalid month: ${month}`);

      throw new Error('Invalid month');
    }

    const currentYear = year || new Date().getFullYear();

    const startOfMonth = new Date(currentYear, monthNumber!, 1);
    const endOfMonth = new Date(currentYear, monthNumber! + 1, 0);

    try {
      const customers = await this._prismaClient.customer.findMany({
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

      logger.info(
        `CustomerSupportService - Retrieved customer of the month for ${month} ${currentYear}: ${JSON.stringify(
          customerOfTheMonth
        )}`
      );

      return customerOfTheMonth
        ? (customerOfTheMonth as Customer).name
        : 'No customer of the month found.';
    } catch (error) {
      logger.error(`CustomerSupportService - Failed to get customer of the month: ${error}`);

      throw new Error(`Failed to get customer of the month ${error}`);
    }
  }
}
