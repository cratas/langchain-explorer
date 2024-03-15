import { ChatOpenAICallOptions } from '@langchain/openai';
import zodToJsonSchema from 'zod-to-json-schema';
import {
  customerOfMonth,
  customerOfMonthSchema,
  latestOrderInfoSchema,
  latestOrderInfo,
  mostPopularProducts,
  mostPopularProductsSchema,
} from './functions';

export const FUNCTIONS: { [key: string]: Function } = {
  customerOfMonth,
  latestOrderInfo,
  mostPopularProducts,
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
  ],
};
