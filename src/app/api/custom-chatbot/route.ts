import { Message } from '@/types/chat';
import { getChain } from '@/utils/chain';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const POST = async (request: Request) => {
  const body = await request.json();
  const { message, history } = body;

  const chain = await getChain();

  const res = await chain.invoke({
    question: message,
    chat_history: history.map((h: Message) => h.content).join('\n'),
  });

  return NextResponse.json({ isUser: false, content: res.text, id: uuidv4() });
};
