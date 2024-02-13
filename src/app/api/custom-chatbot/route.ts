import { Message } from '@/types/chat';
import { getChain } from '@/utils/chain';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const POST = async (request: Request, response: Response) => {
  const body = await request.json();
  const { message } = body;
  const history: Message[] = body.history || [];

  const chain = await getChain();

  const res = await chain.invoke({
    question: message,
    chat_history: history.map((h) => h.content).join('\n'),
  });

  console.log('res', res);

  return NextResponse.json({ isUser: false, content: res.text, id: uuidv4() });
};
