import { Message } from 'ai';
import { ChatService } from './chat-service';
import {
  COMMON_TEMPLATE_WITH_CHAT_HISTORY,
  CREATE_ANSWER_FROM_FUNCTION_CALLS_TEMPLATE,
  REPEATE_MESSAGE_TEMPLATE,
} from '../constants/prompt-templates';
import { PrismaDatabaseService } from './prisma-database-service';
import { FunctionCallsNames, functionCallsDefinition } from '../types/function-calls';
import {
  FindOrderFunctionArgs,
  GetCustomerOfMonthFunctionArgs,
  GetLatestOrderInfoFunctionArgs,
  GetLowStockProductsFunctionArgs,
  GetMostPopularProductsFunctionArgs,
} from '../types/customer-support';
import { logger } from '../../../logger';
import { TokenUsageTrackerRegistry } from '../helpers/token-usage-tracker-registry';

interface CustomerSupportServiceOptions {
  tokensUsageTrackerKey?: string;
}

/**
 * Service class for handling customer support interactions using a language model.
 * Manages the logic for generating responses based on customer support queries,
 * involving conditional processing and execution of function calls as needed.
 */
export class CustomerSupportService {
  /**
   * The key for tracking token usage in the language model.
   * @private
   */
  private readonly _tokensUsageTrackerKey: string;

  /**
   * A ChatService instance configured for handling function calls in customer support scenarios.
   * @private
   */
  private readonly _functionCallChatService: ChatService;

  /**
   * A PrismaDatabaseService instance for executing function calls related to customer support.
   * @private
   */
  private readonly _prismaDatabaseService: PrismaDatabaseService;

  /**
   * Constructs a CustomerSupportService object.
   * Initializes the ChatService instance and the PrismaDatabaseService instance.
   */
  constructor({ tokensUsageTrackerKey }: CustomerSupportServiceOptions) {
    this._functionCallChatService = new ChatService({
      modelName: 'gpt-3.5-turbo',
      modelTemperature: 0,
      promptTemplate: COMMON_TEMPLATE_WITH_CHAT_HISTORY,
      functionCallsDefinition,
      tokensUsageTrackerKey,
      streaming: false,
    });

    this._tokensUsageTrackerKey = tokensUsageTrackerKey || '';

    this._prismaDatabaseService = new PrismaDatabaseService();
  }

  /**
   * Executes a function call by name with the provided arguments.
   *
   * @param {FunctionCallsNames} name - The name of the function call to execute.
   * @param {unknown} args - The arguments to pass to the function call.
   * @returns {Promise<unknown>} A promise resolving to the result of the function call.
   * @throws {Error} Throws an error if the function call name is not supported.
   */
  private execFunctionCallByName = async (
    name: FunctionCallsNames,
    args:
      | GetCustomerOfMonthFunctionArgs
      | GetLatestOrderInfoFunctionArgs
      | GetMostPopularProductsFunctionArgs
      | GetLowStockProductsFunctionArgs
      | FindOrderFunctionArgs
  ): Promise<unknown> => {
    logger.info(
      `CustomerSupportService - Executing function call: ${name} with args: ${JSON.stringify(args)}`
    );

    switch (name) {
      case FunctionCallsNames.getCustomerOfMonth:
        return this._prismaDatabaseService.getCustomerOfMonth(
          args as GetCustomerOfMonthFunctionArgs
        );
      case FunctionCallsNames.getLatestOrderInfo:
        return this._prismaDatabaseService.getLatestOrderInfo(
          args as GetLatestOrderInfoFunctionArgs
        );
      case FunctionCallsNames.getMostPopularProducts:
        return this._prismaDatabaseService.getMostPopularProducts(
          args as GetMostPopularProductsFunctionArgs
        );
      case FunctionCallsNames.getLowStockProducts:
        return this._prismaDatabaseService.getLowStockProducts(
          args as GetLowStockProductsFunctionArgs
        );
      case FunctionCallsNames.findOrder:
        return this._prismaDatabaseService.findOrder(args as FindOrderFunctionArgs);
      default:
        logger.error(`CustomerSupportService - Error while calling function with name: ${name}`);

        throw new Error(`Function call with name ${name} is not supported`);
    }
  };

  /**
   * Generates a response stream for a given set of customer support messages.
   * Processes the input messages, executes any necessary function calls, and generates responses
   * using a language model. Supports both direct language model responses and responses generated from function call results.
   *
   * @param {Message} messages - An array of messages in the customer support conversation.
   * @returns {Promise<Stream>} A promise resolving to a stream of responses.
   * @throws {Error} Throws an error if there is an issue in generating the response.
   */
  public getLLMResponseStream = async (messages: Message[]) => {
    try {
      const response = await this._functionCallChatService.getLLMResponse(messages);

      TokenUsageTrackerRegistry.getInstance()
        .getTokenUsageTracker(this._tokensUsageTrackerKey)
        ?.countTokensFromFunctionCallingResponse(response);

      let finalInput;

      // If the response contains content, use it as the input for the next message
      // Otherwise, execute the function calls and use the results as the input
      if (response.content) {
        finalInput = response.content;

        logger.info(`CustomerSupportService - Using response content as input: ${finalInput}`);
      } else {
        const fCalls =
          response.additional_kwargs.tool_calls?.map((call) => ({
            name: call.function.name as string,
            args: call.function.arguments as string,
          })) || [];

        const results = await Promise.all(
          fCalls.map(async ({ args, name }) => {
            const parserArgs = JSON.parse(args);

            const result = await this.execFunctionCallByName(
              name as FunctionCallsNames,
              parserArgs
            );

            return { result, call: name };
          })
        );

        finalInput = JSON.stringify(results);

        logger.info(`CustomerSupportService - Using function call results as input: ${finalInput}`);
      }

      // Create a new ChatService instance for getting final result based on function calls or previous response
      const chatServiceWithoutFunctionCalling = new ChatService({
        modelName: 'gpt-3.5-turbo',
        modelTemperature: 0,
        promptTemplate: response.content
          ? REPEATE_MESSAGE_TEMPLATE
          : CREATE_ANSWER_FROM_FUNCTION_CALLS_TEMPLATE,
        tokensUsageTrackerKey: this._tokensUsageTrackerKey,
      });

      const stream = await chatServiceWithoutFunctionCalling.getLLMResponseStreamWithoutChatHistory(
        finalInput as string
      );

      logger.info(
        `CustomerSupportService - Generated streaming response for customer support messages: ${JSON.stringify(messages)}`
      );

      return stream;
    } catch (error) {
      logger.error(`CustomerSupportService - Error in getting LLM response: ${error}`);

      throw new Error(`Error in getting LLM response: ${error}`);
    }
  };
}
