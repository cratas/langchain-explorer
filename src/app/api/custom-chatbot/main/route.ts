/* eslint-disable no-restricted-syntax */
import { StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import { CustomChatbotService } from '@/backend/services/custom-chatbot-service';

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
    return NextResponse.json({ error }, { status: 500 });
  }
};
