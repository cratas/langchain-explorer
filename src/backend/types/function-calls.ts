import { ChatOpenAICallOptions } from '@langchain/openai';
import zodToJsonSchema from 'zod-to-json-schema';
import {
  findOrderSchema,
  getCustomerOfMonthSchema,
  getLatestOrderInfoSchema,
  getLowStockProductsSchema,
  getMostPopularProductsSchema,
} from './customer-support';

export enum FunctionCallsNames {
  getCustomerOfMonth = 'getCustomerOfMonth',
  getLatestOrderInfo = 'getLatestOrderInfo',
  getMostPopularProducts = 'getMostPopularProducts',
  getLowStockProducts = 'getLowStockProducts',
  findOrder = 'findOrder',
}

export const functionCallsDefinition: Partial<ChatOpenAICallOptions> = {
  tool_choice: 'auto',
  tools: [
    {
      type: 'function' as const,
      function: {
        name: FunctionCallsNames.getCustomerOfMonth,
        description: 'Get the customer of the month for a given month',
        parameters: zodToJsonSchema(getCustomerOfMonthSchema),
      },
    },
    {
      type: 'function' as const,
      function: {
        name: FunctionCallsNames.getLatestOrderInfo,
        description: 'Get the info about the latest order of the customer',
        parameters: zodToJsonSchema(getLatestOrderInfoSchema),
      },
    },
    {
      type: 'function' as const,
      function: {
        name: FunctionCallsNames.getMostPopularProducts,
        description:
          'Get the most popular product/s for a given category or all products if no category is provided',
        parameters: zodToJsonSchema(getMostPopularProductsSchema),
      },
    },
    {
      type: 'function' as const,
      function: {
        name: FunctionCallsNames.getLowStockProducts,
        description:
          'Get the products that are running low on stock, stock limit could be provided as parameter (default value is 10).',
        parameters: zodToJsonSchema(getLowStockProductsSchema),
      },
    },
    {
      type: 'function' as const,
      function: {
        name: FunctionCallsNames.findOrder,
        description: 'Find the specific order by id, username, order status or date range.',
        parameters: zodToJsonSchema(findOrderSchema),
      },
    },
  ],
};
