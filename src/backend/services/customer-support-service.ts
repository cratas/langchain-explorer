import { ChatOpenAICallOptions } from '@langchain/openai';
import { ChatService } from './chat-service';
import { FUNCTIONS } from '../customer-support/function-calls-definition';
import {
  COMMON_TEMPLATE_WITH_CHAT_HISTORY,
  CREATE_ANSWER_FROM_FUNCTION_CALLS_TEMPLATE,
  REPEATE_MESSAGE_TEMPLATE,
} from '../constants/prompt-templates';

interface CustomerSupportServiceOptions {
  functionCallsDefinition: Partial<ChatOpenAICallOptions>;
}

export class CustomerSupportService {
  private readonly _functionCallChatService: ChatService;

  constructor({ functionCallsDefinition }: CustomerSupportServiceOptions) {
    this._functionCallChatService = new ChatService({
      modelName: 'gpt-3.5-turbo-0125',
      modelTemperature: 0,
      promptTemplate: COMMON_TEMPLATE_WITH_CHAT_HISTORY,
      functionCallsDefinition,
    });
  }

  public getLLMResponseStream = async (messages: any[]) => {
    try {
      const response = await this._functionCallChatService.getLLMResponse(messages);

      let finalInput;

      if (response.content) {
        finalInput = response.content;
      } else {
        const fCalls =
          response.additional_kwargs.tool_calls?.map((call) => ({
            name: call.function.name,
            args: call.function.arguments,
          })) || [];

        const results = await Promise.all(
          fCalls.map(async (call) => {
            const funcToExec = FUNCTIONS[call.name];

            const result = await funcToExec(JSON.parse(call.args));

            return { result, call: call.name };
          })
        );

        finalInput = JSON.stringify(results);
      }

      const chatServiceWithoutFunctionCalling = new ChatService({
        modelName: 'gpt-3.5-turbo-0125',
        modelTemperature: 0,
        promptTemplate: response.content
          ? REPEATE_MESSAGE_TEMPLATE
          : CREATE_ANSWER_FROM_FUNCTION_CALLS_TEMPLATE,
      });

      const stream = await chatServiceWithoutFunctionCalling.getLLMResponseStreamWithoutChatHistory(
        finalInput as string
      );

      return stream;
    } catch (error) {
      throw new Error(`Error in getting LLM response: ${error}`);
    }
  };
}
