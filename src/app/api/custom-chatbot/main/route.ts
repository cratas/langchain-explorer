import { StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import { CustomChatbotService } from '@/backend/services/custom-chatbot-service';
import { logger } from '../../../../../logger';
import { endpoints } from '../../endpoints';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const {
      messages,
      context,
      conversationModel,
      conversationTemperature,
      retrievalSize,
      embeddingModel,
      useCaseKey,
    } = body;

    logger.info(`POST ${endpoints.customChatbot.main} with data: ${JSON.stringify(body)}`);

    const customChatbotService = new CustomChatbotService({
      conversationModelName: conversationModel,
      conversationModelTemperature: Number(conversationTemperature),
      embeddingModel,
      pineconeNamespaceName: context,
      retrievalSize: Number(retrievalSize),
      tokensUsageTrackerKey: useCaseKey,
    });

    const stream = await customChatbotService.getLLMResponseStream(messages);

    return new StreamingTextResponse(stream);
  } catch (error) {
    logger.error(`Error in main custom chatbot request: ${error}`);

    return NextResponse.json({ error }, { status: 500 });
  }
};
