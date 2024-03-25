import { COMMON_TEMPLATE_WITH_CHAT_HISTORY } from '@/constants/common';
import { getOpenAIChatChainStream } from '@/backend/utils/get-openai-chat-chain-stream';
import { StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages } = body;

    const stream = await getOpenAIChatChainStream(messages, COMMON_TEMPLATE_WITH_CHAT_HISTORY);

    return new StreamingTextResponse(stream);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
