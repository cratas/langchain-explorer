import { NextResponse } from 'next/server';
import { StreamingTextResponse } from 'ai';
import { CustomChatbotService } from '@/backend/services/custom-chatbot-service';
import { logger } from '../../../../../logger';
import { endpoints } from '../../endpoints';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages, context, useCaseKey } = body;

    logger.info(`POST ${endpoints.customChatbot.sample} with data: ${JSON.stringify(body)}`);

    const customChatbotService = new CustomChatbotService({
      conversationModelName: 'gpt-3.5-turbo',
      conversationModelTemperature: 0.2,
      embeddingModel: 'text-embedding-3-small',
      pineconeNamespaceName: context,
      retrievalSize: 4,
      tokensUsageTrackerKey: useCaseKey,
    });

    const stream = await customChatbotService.getLLMResponseStream(messages);

    return new StreamingTextResponse(stream);
  } catch (error) {
    logger.error(`Error in main custom chatbot request: ${error}`);

    return NextResponse.json({ error }, { status: 500 });
  }
};
