import { StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import { CustomChatbotService } from '@/backend/services/custom-chatbot-service';
import { logger } from '../../../../../logger';

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
    } = body;

    logger.info(
      `Main custom chatbot request with context: ${context}, last message: ${messages[messages.length - 1].content},
       conversation model: ${conversationModel}, conversation temperature: ${conversationTemperature}, 
       retrieval size: ${retrievalSize}, embedding model: ${embeddingModel}`
    );

    const customChatbotService = new CustomChatbotService({
      conversationModelName: conversationModel,
      conversationModelTemperature: conversationTemperature,
      embeddingModel,
      pineconeNamespaceName: context,
      retrievalSize,
    });

    const stream = await customChatbotService.getLLMResponseStream(messages);

    return new StreamingTextResponse(stream);
  } catch (error) {
    logger.error(`Error in main custom chatbot request: ${error}`);

    return NextResponse.json({ error }, { status: 500 });
  }
};
