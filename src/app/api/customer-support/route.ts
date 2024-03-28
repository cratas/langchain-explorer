import { NextResponse } from 'next/server';
import { StreamingTextResponse } from 'ai';
import { CustomerSupportService } from '@/backend/services/customer-support-service';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages } = body;

    const customerSupportService = new CustomerSupportService();

    const stream = await customerSupportService.getLLMResponseStream(messages);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error }, { status: 500 });
  }
};
