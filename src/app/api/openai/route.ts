import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages } = body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages,
      temperature: 0,
      max_tokens: 1000,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
