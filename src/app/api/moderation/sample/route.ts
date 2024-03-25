import { COMMON_TEMPLATE_WITH_CHAT_HISTORY } from '@/backend/constants/prompt-templates';
import { ChatService } from '@/backend/services/chat-service';
import { StreamingTextResponse } from 'ai';
import { OpenAIModerationChain } from 'langchain/chains';
import { NextResponse } from 'next/server';

const MIN_SCORE = 0.1;

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages } = body;
    const input = messages[messages.length - 1].content;

    const moderation = new OpenAIModerationChain({});

    const { results } = await moderation.invoke({
      input,
    });

    const categoryScores: { [key: string]: number } = results[0].category_scores;

    if (Object.values(categoryScores).some((score) => score >= MIN_SCORE)) {
      const [category, score] = Object.entries(categoryScores).sort((x, y) => y[1] - x[1])[0];

      return NextResponse.json({ flagged: true, category, score: (score * 100).toFixed(4) });
    }

    const chatService = new ChatService({
      modelName: 'gpt-3.5-turbo',
      modelTemperature: 0.2,
      promptTemplate: COMMON_TEMPLATE_WITH_CHAT_HISTORY,
    });

    const stream = await chatService.getLLMResponseStream(messages);

    return new StreamingTextResponse(stream);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
