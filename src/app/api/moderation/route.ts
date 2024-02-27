import { getOpenAIChatChainStream } from '@/utils/get-openai-chat-chain-stream';
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

      return NextResponse.json({ flagged: true, category, score: (score * 100).toFixed(2) });
    }

    const stream = await getOpenAIChatChainStream(messages, 0.9);

    return new StreamingTextResponse(stream);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
