import { TokenUsage } from '@/frontend/hooks/use-token-usage';
import { ConversationModelOptions, EmbeddingModelOptions } from '@/shared/types/common';
import { calcModelCostByTokens } from '@/shared/utils/calc-model-cost-by-tokens';
import React from 'react';

type Props = {
  withMarginTop?: boolean;
  currentTokenUsage: TokenUsage | null;
  modelName: ConversationModelOptions;
  embeddingModelName?: EmbeddingModelOptions;
  isLoading?: boolean;
};

const DECIMAL_PLACES = 8;

export const ChatTotalCosts = ({
  currentTokenUsage,
  modelName,
  embeddingModelName,
  withMarginTop,
  isLoading,
}: Props) => {
  const { totalPromptTokens, totalCompletionTokens, embeddingTokens } = currentTokenUsage ?? {
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    embeddingTokens: 0,
  };

  const inputCosts = calcModelCostByTokens(totalPromptTokens, modelName, 'input');

  const outputCosts = calcModelCostByTokens(totalCompletionTokens, modelName, 'output');

  const embeddingCosts = embeddingModelName
    ? calcModelCostByTokens(embeddingTokens, embeddingModelName, 'input')
    : 0;

  const overallCosts = inputCosts + outputCosts + embeddingCosts;

  return (
    <div className={`ml-auto ${withMarginTop ? 'mt-2' : ''} flex w-full items-center`}>
      <div className="flex w-full flex-wrap items-center justify-between gap-2 rounded-md border-2 border-lighter-purple p-1.5 text-sm font-normal text-white md:gap-10">
        {renderItem(
          'Total costs',
          totalPromptTokens + totalCompletionTokens,
          overallCosts.toFixed(DECIMAL_PLACES),
          isLoading
        )}

        {renderItem(
          'Input costs',
          totalPromptTokens,
          inputCosts.toFixed(DECIMAL_PLACES),
          isLoading
        )}

        {renderItem(
          'Output costs',
          totalCompletionTokens,
          outputCosts.toFixed(DECIMAL_PLACES),
          isLoading
        )}

        {embeddingModelName &&
          renderItem(
            'Embedding costs',
            embeddingTokens,
            embeddingCosts.toFixed(DECIMAL_PLACES),
            isLoading
          )}
      </div>
    </div>
  );
};

const renderItem = (label: string, tokens: number, costs: string, isLoading = false) => (
  <div className="flex gap-2">
    {isLoading ? (
      <span className="icon-[eos-icons--loading] animate-spin bg-white text-5xl" />
    ) : (
      <span className="icon-[ri--money-dollar-circle-fill] bg-white text-5xl" />
    )}

    <div className="flex flex-col">
      <p className="text-xs font-bold text-text-primary">{label}</p>
      <p className="font-bold">
        {tokens}
        <span> tokens</span>
      </p>
      <p className="font-bold text-lighter-purple">{`${costs} $`}</p>
    </div>
  </div>
);
