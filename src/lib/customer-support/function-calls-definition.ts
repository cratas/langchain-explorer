import { ChatOpenAICallOptions } from '@langchain/openai';
import zodToJsonSchema from 'zod-to-json-schema';
import {
  customerOfMonth,
  customerOfMonthSchema,
  latestOrderInfoSchema,
  latestOrderInfo,
  mostPopularProducts,
  mostPopularProductsSchema,
  lowStockProductsSchema,
  lowStockProducts,
  findOrderSchema,
  findOrder,
} from './functions';

export const FUNCTIONS: { [key: string]: Function } = {
  customerOfMonth,
  latestOrderInfo,
  mostPopularProducts,
  lowStockProducts,
  findOrder,
};

export const functionCallsDefinition: Partial<ChatOpenAICallOptions> = {
  tool_choice: 'auto',
  tools: [
    {
      type: 'function' as const,
      function: {
        name: 'customerOfMonth',
        description: 'Get the customer of the month for a given month',
        parameters: zodToJsonSchema(customerOfMonthSchema),
      },
    },
    {
      type: 'function' as const,
      function: {
        name: 'latestOrderInfo',
        description: 'Get the info about the latest order of the customer',
        parameters: zodToJsonSchema(latestOrderInfoSchema),
      },
    },
    {
      type: 'function' as const,
      function: {
        name: 'mostPopularProducts',
        description:
          'Get the most popular product/s for a given category or all products if no category is provided',
        parameters: zodToJsonSchema(mostPopularProductsSchema),
      },
    },
    {
      type: 'function' as const,
      function: {
        name: 'lowStockProducts',
        description:
          'Get the products that are running low on stock, stock limit could be provided as parameter (default value is 10).',
        parameters: zodToJsonSchema(lowStockProductsSchema),
      },
    },
    {
      type: 'function' as const,
      function: {
        name: 'findOrder',
        description: 'Find the order by username, order status, date range or order id.',
        parameters: zodToJsonSchema(findOrderSchema),
      },
    },
  ],
};
