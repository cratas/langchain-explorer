import { NextResponse } from 'next/server';
import { StreamingTextResponse } from 'ai';
import { CustomerSupportService } from '@/backend/services/customer-support-service';
import { logger } from '../../../../logger';
import { endpoints } from '../endpoints';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages } = body;

    logger.info(`POST ${endpoints.customerSupport} with data: ${JSON.stringify(body)}`);

    const customerSupportService = new CustomerSupportService();

    const stream = await customerSupportService.getLLMResponseStream(messages);

    return new StreamingTextResponse(stream);
  } catch (error) {
    logger.error(`Error in customer support request: ${error}`);

    return NextResponse.json({ error }, { status: 500 });
  }
};
