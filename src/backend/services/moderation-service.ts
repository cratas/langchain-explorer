/* eslint-disable @typescript-eslint/no-dupe-class-members */
import { OpenAIModerationChain } from 'langchain/chains';
import { logger } from '../../../logger';

type CategoryWithScore = {
  category: string;
  score: string;
};

interface ModerationServiceOptions {
  minScore?: number;
  selectedCategories?: string[];
}

/**
 * ModerationService provides functionalities to filter and flag content
 * based on specified categories and scores using OpenAI's moderation API.
 */
export class ModerationService {
  private readonly _moderation: OpenAIModerationChain;

  private readonly _minScore: number;

  private _flaggedCategories: CategoryWithScore[] = [];

  /**
   * Constructs an instance of the ModerationService.
   * @param {ModerationServiceOptions} options - Configuration options for the moderation service.
   */
  constructor({ minScore = 0.1 }: ModerationServiceOptions) {
    this._moderation = new OpenAIModerationChain({});

    this._minScore = minScore;
  }

  /**
   * Gets the currently flagged categories.
   * @returns {CategoryWithScore[]} An array of categories with their respective scores.
   */
  public get flaggedCategories(): CategoryWithScore[] {
    return this._flaggedCategories;
  }

  /**
   * Sets the categories to be flagged.
   * @param {CategoryWithScore[]} categories - Categories with their scores to be flagged.
   * @throws Will throw an error if the categories array is empty.
   */
  public set flaggedCategories(categories: CategoryWithScore[]) {
    this._flaggedCategories = categories;
  }

  /**
   * Filters categories by selected categories based on the minimum score.
   * @private
   * @param {Object} categoryScores - An object with category scores.
   * @param {string[]} selectedCategories - Array of categories to be selected.
   * @returns {Array} Filtered categories.
   */
  private filterBySelectedCategories(
    categoryScores: { [key: string]: number },
    selectedCategories: string[]
  ): Array<[string, number]> {
    return Object.entries(categoryScores).filter(
      ([category, value]) => value >= this._minScore && selectedCategories.includes(category)
    );
  }

  /**
   * Filters categories by the minimum score.
   * @private
   * @param {Object} categoryScores - An object with category scores.
   * @returns {Array<[string, number]>} Filtered categories.
   */
  private filterByMinScore(categoryScores: { [key: string]: number }): Array<[string, number]> {
    return Object.entries(categoryScores).filter(([, value]) => value >= this._minScore);
  }

  /**
   * Formats the selected categories into a more readable format.
   * @private
   * @static
   * @param {[string, number][]} categoryScores - Array of category score tuples.
   * @returns {CategoryWithScore[]} Formatted categories with scores.
   */
  private static formatSelectedCategories(categoryScores: [string, number][]): CategoryWithScore[] {
    return categoryScores
      .sort((x, y) => y[1] - x[1])
      .map(([category, score]) => ({ category, score: (score * 100).toFixed(4) }));
  }

  /**
   * Checks the input string against the moderation API, flags categories based on the provided or default criteria, and updates the flaggedCategories property.
   * @param {string} input - The input text to be checked.
   * @param {string[]} selectedCategories - Optional. Specific categories to be checked against.
   * @returns {Promise<boolean>} A promise that resolves to true if any categories are flagged, false otherwise.
   */
  public async checkInputAndSaveFlaggedCategories(
    input: string,
    selectedCategories: string[] = []
  ): Promise<boolean> {
    try {
      const { results } = await this._moderation.invoke({
        input,
      });

      const categoriesWithScores: { [key: string]: number } = results[0].category_scores;

      // const flaggedByOpenAI = results[0]?.flagged;

      const selectedCategoriesWithScores = selectedCategories.length
        ? this.filterBySelectedCategories(categoriesWithScores, selectedCategories)
        : this.filterByMinScore(categoriesWithScores);

      if (selectedCategoriesWithScores.length > 0) {
        this.flaggedCategories = ModerationService.formatSelectedCategories(
          selectedCategoriesWithScores
        );

        logger.info(
          `ModerationService - Flagged categories in input text: ${JSON.stringify(this.flaggedCategories)}`
        );

        return true;
      }

      logger.info('ModerationService - No categories flagged in input text.');

      return false;
      // return !!flaggedByOpenAI;
    } catch (error) {
      logger.error(`ModerationService - Error checking input for flagged categories: ${error}`);

      throw new Error(
        `Error checking input for flagged categories from OpenAI moderation ${error}`
      );
    }
  }
}
