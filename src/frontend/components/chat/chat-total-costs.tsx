import { TokenUsage } from '@/frontend/hooks/use-token-usage';
import { ConversationModelOptions } from '@/shared/types/common';
import { calcModelCostByTokens } from '@/shared/utils/calc-model-cost-by-tokens';
import React from 'react';

type Props = {
  withMarginTop?: boolean;
  currentTokenUsage: TokenUsage | null;
  modelName: ConversationModelOptions;
  isLoading?: boolean;
};

const DECIMAL_PLACES = 8;

export const ChatTotalCosts = ({
  currentTokenUsage,
  modelName,
  withMarginTop,
  isLoading,
}: Props) => {
  const { totalPromptTokens, totalCompletionTokens } = currentTokenUsage ?? {
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
  };

  const inputCosts = calcModelCostByTokens(totalPromptTokens, modelName, 'input');

  const outputCosts = calcModelCostByTokens(totalCompletionTokens, modelName, 'output');

  const overallCosts = inputCosts + outputCosts;

  return (
    <div className={`ml-auto ${withMarginTop ? 'mt-2' : ''} flex w-full items-center`}>
      <div className="flex w-full flex-wrap items-center justify-between gap-2 rounded-md border-2 border-lighter-purple p-1.5 text-sm font-normal text-white md:gap-10">
        <div className="flex gap-1">
          {isLoading ? (
            <span className="icon-[eos-icons--loading] text-4xl" />
          ) : (
            <span className="icon-[ri--money-dollar-circle-fill] bg-white text-4xl" />
          )}

          <div className="flex flex-col">
            <p className="text-xs font-bold text-text-primary">Total costs</p>
            <p className="font-bold">{`${overallCosts.toFixed(DECIMAL_PLACES)} $`}</p>
          </div>
        </div>

        <div className="flex gap-1">
          {isLoading ? (
            <span className="icon-[eos-icons--loading] text-4xl" />
          ) : (
            <span className="icon-[ri--money-dollar-circle-fill] bg-browser-finder text-4xl" />
          )}

          <div className="flex flex-col">
            <p className="text-xs font-bold text-text-primary">Inputs costs</p>
            <p className="font-bold">{`${inputCosts.toFixed(DECIMAL_PLACES)} $`}</p>
          </div>
        </div>

        <div className="flex gap-1">
          {isLoading ? (
            <span className="icon-[eos-icons--loading] text-4xl" />
          ) : (
            <span className="icon-[ri--money-dollar-circle-fill] bg-lighter-purple text-4xl" />
          )}

          <div className="flex flex-col">
            <p className="text-xs font-bold text-text-primary">Outputs costs</p>
            <p className="font-bold">{`${outputCosts.toFixed(DECIMAL_PLACES)} $`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
