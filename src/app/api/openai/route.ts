import { getOpenAIChatChainStream } from '@/utils/get-openai-chat-chain-stream';
import { StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages } = body;

    const stream = await getOpenAIChatChainStream(messages);

    return new StreamingTextResponse(stream);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
