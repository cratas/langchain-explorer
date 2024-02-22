import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { message } = body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      temperature: 0,
      max_tokens: 1000,
    });

    return NextResponse.json({ role: 'bot', content: response, id: uuidv4() });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
