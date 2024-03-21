/* eslint-disable no-restricted-syntax */
import { NextResponse } from 'next/server';
import { StreamingTextResponse } from 'ai';

export const POST = async (request: Request) => {
  try {
    return new StreamingTextResponse(stream);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
