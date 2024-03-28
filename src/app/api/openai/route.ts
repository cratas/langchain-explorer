import { COMMON_TEMPLATE_WITH_CHAT_HISTORY } from '@/backend/constants/prompt-templates';
import { ChatService } from '@/backend/services/chat-service';
import { StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import { logger } from '../../../../logger';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages } = body;

    logger.info(
      `Customer support request with last message: ${messages[messages.length - 1].content}`
    );

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
