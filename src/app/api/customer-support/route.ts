import { NextResponse } from 'next/server';
import { COMMON_TEMPLATE_WITH_CHAT_HISTORY } from '@/constants/common';
import { formatChatHistory } from '@/utils/format-chat-history';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { StreamingTextResponse } from 'ai';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import {
  FUNCTIONS,
  functionCallsDefinition,
} from '@/lib/customer-support/function-calls-definition';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages } = body;

    const currentMessageContent = messages[messages.length - 1].content;
    const formattedChatHistory = formatChatHistory(messages.slice(0, -1));

    const prompt = PromptTemplate.fromTemplate(COMMON_TEMPLATE_WITH_CHAT_HISTORY);

    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
      modelName: 'gpt-3.5-turbo-0125',
      maxTokens: 1000,
    });

    const modelWithProvidedFunctions = model.bind(functionCallsDefinition);

    const chain = RunnableSequence.from([prompt, modelWithProvidedFunctions]);

    const response = await chain.invoke({
      chat_history: formattedChatHistory,
      input: currentMessageContent,
    });

    let finalInput;

    if (response.content) {
      finalInput = `Return me exactly the same message: ${response.content}`;
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

      finalInput = `Create me user response considering my results from function calls 
      without mentioning logic behind (function calls e.g., just use provided context and chat history for creating user friendly response). 
      There are results grouped by function call names:
      
      ${JSON.stringify(results)}. 
      `;
    }

    const outputParser = new HttpResponseOutputParser();

    const resultChain = RunnableSequence.from([model, outputParser]);

    const resultStream = await resultChain.stream(finalInput);

    return new StreamingTextResponse(resultStream);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};
