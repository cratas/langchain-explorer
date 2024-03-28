import { COMMON_TEMPLATE_WITH_CHAT_HISTORY } from '@/backend/constants/prompt-templates';
import { ChatService } from '@/backend/services/chat-service';
import { StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import { logger } from '../../../../logger';
import { endpoints } from '../endpoints';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages } = body;

    logger.info(`POST ${endpoints.openAI} with data: ${JSON.stringify(body)}`);

    const chatService = new ChatService({
      modelName: 'gpt-3.5-turbo',
      modelTemperature: 0.2,
      promptTemplate: COMMON_TEMPLATE_WITH_CHAT_HISTORY,
    });

    const stream = await chatService.getLLMResponseStream(messages);

    return new StreamingTextResponse(stream);
  } catch (error) {
    logger.error(`Error in main moderation request: ${error}`);

    return NextResponse.json({ error }, { status: 500 });
  }
};
