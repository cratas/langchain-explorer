import { COMMON_TEMPLATE_WITH_CHAT_HISTORY } from '@/backend/constants/prompt-templates';
import { ChatService } from '@/backend/services/chat-service';
import { ModerationService } from '@/backend/services/moderation-service';
import { StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import { logger } from '../../../../../logger';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages, minScore, conversationModel, conversationTemperature, categories } = body;
    const input = messages[messages.length - 1].content;

    logger.info(
      `Main moderation request with last message: ${input}, min score: ${minScore}, conversation model: ${conversationModel}, 
      conversation temperature: ${conversationTemperature}, categories: ${JSON.stringify(categories)}`
    );

    // map object into array of selected categories
    const userSelectedCategories = Object.entries(categories)
      .filter(([, value]) => value)
      .map(([category]) => category);

    const moderationService = new ModerationService({ minScore });

    const isInputFlaggedAsHarmful = await moderationService.checkInputAndSaveFlaggedCategories(
      input,
      userSelectedCategories
    );

    if (isInputFlaggedAsHarmful) {
      const matches = moderationService.flaggedCategories;

      return NextResponse.json({ flagged: true, matches });
    }

    const chatService = new ChatService({
      modelName: conversationModel,
      modelTemperature: conversationTemperature,
      promptTemplate: COMMON_TEMPLATE_WITH_CHAT_HISTORY,
    });

    const stream = await chatService.getLLMResponseStream(messages);

    return new StreamingTextResponse(stream);
  } catch (error) {
    logger.error(`Error in main moderation request: ${error}`);

    return NextResponse.json({ error }, { status: 500 });
  }
};
