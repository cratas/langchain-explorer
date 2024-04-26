import { logger } from '../../../logger';
import { ModelOptions } from '../types/token-usage';
import { TokenUsageTracker } from './token-usage-tracker';

export class TokenUsageTrackerRegistry {
  private tokenUsageTrackers: Map<string, TokenUsageTracker> = new Map();

  /**
   * The singleton instance of the `TokenUsageTrackerRegistry`.
   */
  private static instance: TokenUsageTrackerRegistry;

  public static getInstance(): TokenUsageTrackerRegistry {
    if (!TokenUsageTrackerRegistry.instance) {
      logger.info('TokenUsageTrackerRegistry - Creating TokenUsageTrackerRegistry client instance');

      TokenUsageTrackerRegistry.instance = new TokenUsageTrackerRegistry();
    }

    return TokenUsageTrackerRegistry.instance;
  }

  /**
   * Creates and registers a new `TokenUsageTracker` instance for the given key.
   * @param {string} key - The unique identifier for the token usage tracker.
   * @param {ModelOptions[]} llmModels - The array of LLM model options for the tracker.
   * @private
   */
  private createTokenUsageTracker(key: string, llmModels: ModelOptions[]) {
    this.tokenUsageTrackers.set(key, new TokenUsageTracker(llmModels));
  }

  /**
   * Tracks token usage for a specific key. If a tracker already exists for the key, it is updated,
   * otherwise, a new tracker is created.
   * @param {string} key - The unique identifier for the token usage tracker.
   * @param {ModelOptions[]} llmModels - The array of LLM model options for the tracker.
   */
  public trackTockenUsage(key: string, llmModels: ModelOptions[]) {
    const existingTracker = this.tokenUsageTrackers.get(key);

    if (existingTracker) {
      existingTracker.bindCallbacksIntoLLM(llmModels);
    } else {
      this.createTokenUsageTracker(key, llmModels);
    }
  }

  public addTockenUsageTracker(key: string) {
    if (!this.tokenUsageTrackers.has(key)) {
      this.tokenUsageTrackers.set(key, new TokenUsageTracker());
    }
  }

  /**
   * Retrieves a `TokenUsageTracker` instance by its key.
   * @param {string} key - The key of the token usage tracker to retrieve.
   * @returns {TokenUsageTracker | undefined} The retrieved token usage tracker, or undefined if not found.
   */
  public getTokenUsageTracker(key: string): TokenUsageTracker | undefined {
    return this.tokenUsageTrackers.get(key);
  }

  /**
   * Deletes a `TokenUsageTracker` instance associated with the given key.
   * @param {string} key - The key of the token usage tracker to delete.
   */
  public deleteTokenUsageTracker(key: string) {
    this.tokenUsageTrackers.delete(key);
  }

  /**
   * Clears all `TokenUsageTracker` instances from the registry.
   */
  public clearTokenUsageTrackers() {
    this.tokenUsageTrackers.clear();
  }

  /**
   * Retrieves all the current token usage trackers.
   * @returns {Map<string, TokenUsageTracker>} A map of all registered token usage trackers.
   */
  public getTrackers(): Map<string, TokenUsageTracker> {
    return this.tokenUsageTrackers;
  }

  /**
   * Retrieves all the keys for the current token usage trackers.
   * @returns {string[]} An array of keys for the registered token usage trackers.
   */
  public getTrackerKeys(): string[] {
    return Array.from(this.tokenUsageTrackers.keys());
  }
}
