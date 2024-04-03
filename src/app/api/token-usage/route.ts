import { TokenUsageTrackerRegistry } from '@/backend/helpers/token-usage-tracker-registry';
import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const useCaseKey = searchParams.get('useCaseKey');

    if (!useCaseKey) {
      return NextResponse.json({ message: 'useCaseKey is required' }, { status: 400 });
    }

    const tokenUsage =
      TokenUsageTrackerRegistry.getTokenUsageTracker(useCaseKey)?.getCurrentTokenUsage();

    return NextResponse.json({ tokenUsage }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to save context' }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { useCaseKey } = body;

    TokenUsageTrackerRegistry.deleteTokenUsageTracker(useCaseKey);

    TokenUsageTrackerRegistry.addTockenUsageTracker(useCaseKey);

    return NextResponse.json({ message: 'Token usage saved' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to save token usage' }, { status: 500 });
  }
};
