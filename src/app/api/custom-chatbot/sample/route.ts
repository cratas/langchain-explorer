/* eslint-disable no-restricted-syntax */
import { NextResponse } from 'next/server';
import { StreamingTextResponse } from 'ai';
import { CustomChatbotService } from '@/backend/services/custom-chatbot-service';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages, context } = body;

    const customChatbotService = new CustomChatbotService({
      conversationModelName: 'gpt-3.5-turbo',
      conversationModelTemperature: 0.2,
      embeddingModel: 'text-embedding-3-small',
      pineconeNamespaceName: context,
      retrievalSize: 3,
    });

    const stream = await customChatbotService.getLLMResponseStream(messages);

    return new StreamingTextResponse(stream);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
