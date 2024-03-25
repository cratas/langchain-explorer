import { OpenAIModerationChain } from 'langchain/chains';

interface ModerationServiceOptions {
  minScore?: number;
  selectedCategories?: string[];
}

export class ModerationService {
  private moderation: OpenAIModerationChain;

  private minScore: number;

  selectedCategories: string[];

  constructor({ minScore = 0.1, selectedCategories = [] }: ModerationServiceOptions) {
    this.moderation = new OpenAIModerationChain({});

    this.minScore = minScore;

    this.selectedCategories = selectedCategories;
  }

  public async getClassifiedCategories(input: string) {
    const { results } = await this.moderation.invoke({
      input,
    });

    // categories classified by openAI model

    return results;
  }
}
