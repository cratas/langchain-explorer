import { Message } from '@/types/chat';
import { initChain } from '@/utils/chain';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const POST = async (request: Request, response: Response) => {
  const body = await request.json();
  const { message } = body;
  const history: Message[] = body.history || [];

  const chain = await initChain();

  const res = await chain.invoke({
    question: message,
    chat_history: history.map((h) => h.content).join('\n'),
  });

  console.log('res', res);

  const links: string[] = Array.from(
    new Set(
      res.sourceDocuments.map(
        (document: { metadata: { source: string } }) => document.metadata.source
      )
    )
  );

  return NextResponse.json({ isUser: false, content: res.text, id: uuidv4() });
};
