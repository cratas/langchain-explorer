import { ModelOptions } from '../types/token-usage';
import { TokenUsageTracker } from './token-usage-tracker';

/**
 * A registry class for managing multiple instances of `TokenUsageTracker`.
 * This class allows for the creation, tracking, and management of token usage trackers
 * across different clients or components in an application.
 */
export class TokenUsageTrackerRegistry {
  /**
   * A map of `TokenUsageTracker` instances, keyed by a unique identifier.
   */
  static tokenUsageTrackers: Map<string, TokenUsageTracker> = new Map();

  /**
   * Creates and registers a new `TokenUsageTracker` instance for the given key.
   * @param {string} key - The unique identifier for the token usage tracker.
   * @param {ModelOptions[]} llmModels - The array of LLM model options for the tracker.
   * @private
   */
  private static createTokenUsageTracker(key: string, llmModels: ModelOptions[]) {
    TokenUsageTrackerRegistry.tokenUsageTrackers.set(key, new TokenUsageTracker(llmModels));
  }

  /**
   * Tracks token usage for a specific key. If a tracker already exists for the key, it is updated,
   * otherwise, a new tracker is created.
   * @param {string} key - The unique identifier for the token usage tracker.
   * @param {ModelOptions[]} llmModels - The array of LLM model options for the tracker.
   */
  static trackTockenUsage(key: string, llmModels: ModelOptions[]) {
    const existingTracker = TokenUsageTrackerRegistry.tokenUsageTrackers.get(key);

    if (existingTracker) {
      existingTracker.bindCallbacksIntoLLM(llmModels);
    } else {
      TokenUsageTrackerRegistry.createTokenUsageTracker(key, llmModels);
    }
  }

  static addTockenUsageTracker(key: string) {
    if (!TokenUsageTrackerRegistry.tokenUsageTrackers.has(key)) {
      TokenUsageTrackerRegistry.tokenUsageTrackers.set(key, new TokenUsageTracker());
    }
  }

  /**
   * Retrieves a `TokenUsageTracker` instance by its key.
   * @param {string} key - The key of the token usage tracker to retrieve.
   * @returns {TokenUsageTracker | undefined} The retrieved token usage tracker, or undefined if not found.
   */
  static getTokenUsageTracker(key: string): TokenUsageTracker | undefined {
    return TokenUsageTrackerRegistry.tokenUsageTrackers.get(key);
  }

  /**
   * Deletes a `TokenUsageTracker` instance associated with the given key.
   * @param {string} key - The key of the token usage tracker to delete.
   */
  static deleteTokenUsageTracker(key: string) {
    TokenUsageTrackerRegistry.tokenUsageTrackers.delete(key);
  }

  /**
   * Clears all `TokenUsageTracker` instances from the registry.
   */
  static clearTokenUsageTrackers() {
    TokenUsageTrackerRegistry.tokenUsageTrackers.clear();
  }

  /**
   * Retrieves all the current token usage trackers.
   * @returns {Map<string, TokenUsageTracker>} A map of all registered token usage trackers.
   */
  static getTrackers(): Map<string, TokenUsageTracker> {
    return TokenUsageTrackerRegistry.tokenUsageTrackers;
  }

  /**
   * Retrieves all the keys for the current token usage trackers.
   * @returns {string[]} An array of keys for the registered token usage trackers.
   */
  static getTrackerKeys(): string[] {
    return Array.from(TokenUsageTrackerRegistry.tokenUsageTrackers.keys());
  }
}
