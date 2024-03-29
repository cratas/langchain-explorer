import { ChatOpenAI } from '@langchain/openai';
import { TokenUsageHandler } from './token-usage-handler';

export class TokenUsageTrackerRegistry {
  static tokenUsageTrackers: Map<string, TokenUsageHandler> = new Map();

  static createTokenUsageTracker(key: string, llmModels: ChatOpenAI[]) {
    TokenUsageTrackerRegistry.tokenUsageTrackers.set(key, new TokenUsageHandler(llmModels));
  }

  static trackTockenUsage(key: string, llmModels: ChatOpenAI[]) {
    const existingTracker = TokenUsageTrackerRegistry.tokenUsageTrackers.get(key);

    if (existingTracker) {
      existingTracker.bindCallbackSIntoLLM(llmModels);
    } else {
      TokenUsageTrackerRegistry.createTokenUsageTracker(key, llmModels);
    }
  }

  static getTokenUsageTracker(key: string) {
    return TokenUsageTrackerRegistry.tokenUsageTrackers.get(key);
  }

  static deleteTokenUsageTracker(key: string) {
    TokenUsageTrackerRegistry.tokenUsageTrackers.delete(key);
  }

  static clearTokenUsageTrackers() {
    TokenUsageTrackerRegistry.tokenUsageTrackers.clear();
  }

  static getTrackers() {
    return TokenUsageTrackerRegistry.tokenUsageTrackers;
  }

  static getTrackerKeys() {
    return Array.from(TokenUsageTrackerRegistry.tokenUsageTrackers.keys());
  }
}
