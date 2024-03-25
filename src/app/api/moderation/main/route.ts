import { getOpenAIChatChainStream } from '@/backend/utils/get-openai-chat-chain-stream';
import { COMMON_TEMPLATE_WITH_CHAT_HISTORY } from '@/constants/common';
import { StreamingTextResponse } from 'ai';
import { OpenAIModerationChain } from 'langchain/chains';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages, minScore, conversationModel, conversationTemperature, categories } = body;
    const input = messages[messages.length - 1].content;

    // map object into array of selected categories
    const userSelectedCategories = Object.entries(categories)
      .filter(([category, value]) => value)
      .map(([category]) => category);

    const moderation = new OpenAIModerationChain({});

    const { results } = await moderation.invoke({
      input,
    });

    // categories classified by openAI model
    const categoryScores: { [key: string]: number } = results[0].category_scores;

    // categories filtered by user req (selected categories and min score)
    const wantedCategories = Object.entries(categoryScores).filter(
      ([category, value]) => userSelectedCategories.includes(category) && value >= minScore
    );

    // checking if there is match with user selected categories
    if (wantedCategories.length > 0) {
      const matches = wantedCategories
        .sort((x, y) => y[1] - x[1])
        .slice(0, 3)
        .map(([category, score]) => ({ category, score: (score * 100).toFixed(4) }));

      return NextResponse.json({ flagged: true, matches });
    }

    // set the conversation model based on the user's selection with temperature
    console.log('conversationModel', conversationModel);
    console.log('conversationTemperature', conversationTemperature);
    const stream = await getOpenAIChatChainStream(messages, COMMON_TEMPLATE_WITH_CHAT_HISTORY, 0.9);

    return new StreamingTextResponse(stream);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
