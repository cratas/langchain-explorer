import { COMMON_TEMPLATE_WITH_CHAT_HISTORY } from '@/backend/constants/prompt-templates';
import { ChatService } from '@/backend/services/chat-service';
import { ModerationService } from '@/backend/services/moderation-service';
import { ConversationModelOptions } from '@/shared/types/common';
import { StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

const MIN_SCORE = 0.1;

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages } = body;
    const input = messages[messages.length - 1].content;

    const moderationService = new ModerationService({ minScore: MIN_SCORE });

    const isInputFlaggedAsHarmful =
      await moderationService.checkInputAndSaveFlaggedCategories(input);

    if (isInputFlaggedAsHarmful) {
      const matches = moderationService.flaggedCategories;

      return NextResponse.json({ flagged: true, matches });
    }
    const chatService = new ChatService({
      modelName: 'gpt-3.5-turbo' as ConversationModelOptions,
      modelTemperature: 0.2,
      promptTemplate: COMMON_TEMPLATE_WITH_CHAT_HISTORY,
    });

    const stream = await chatService.getLLMResponseStream(messages);

    return new StreamingTextResponse(stream);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
