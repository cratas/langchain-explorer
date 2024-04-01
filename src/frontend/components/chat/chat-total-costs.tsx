import { TokenUsage } from '@/frontend/hooks/use-token-usage';
import { ConversationModelOptions } from '@/shared/types/common';
import { calcModelCostByTokens } from '@/shared/utils/calc-model-cost-by-tokens';
import { IconButton } from '@material-tailwind/react';
import React, { useState } from 'react';

type Props = {
  withMarginTop?: boolean;
  currentTokenUsage: TokenUsage | null;
  modelName: ConversationModelOptions;
};

const DECIMAL_PLACES = 8;

export const ChatTotalCosts = ({ currentTokenUsage, modelName, withMarginTop }: Props) => {
  const [opened, setOpened] = useState(false);

  const { totalPromptTokens, totalCompletionTokens } = currentTokenUsage ?? {
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
  };

  const inputCosts = calcModelCostByTokens(totalPromptTokens, modelName, 'input');

  const outputCosts = calcModelCostByTokens(totalCompletionTokens, modelName, 'output');

  const overallCosts = inputCosts + outputCosts;

  return (
    <div
      className={`absolute right-0 ${withMarginTop ? 'top-2' : 'top-0'} flex items-center ${opened ? 'w-auto' : ''}`}
    >
      <IconButton onClick={() => setOpened(!opened)} variant="text" className="text-white">
        <span
          className={`icon-[ri--arrow-${opened ? 'right' : 'left'}-s-line] animate-pulse cursor-pointer text-4xl`}
        />
      </IconButton>

      <div
        className={`flex ${opened ? 'w-auto' : ''} flex-wrap items-center justify-between gap-2 rounded-md border-2 border-lighter-purple p-1.5 text-sm font-normal text-white md:gap-10`}
      >
        <div className="flex gap-1">
          <span className="icon-[ri--money-dollar-circle-fill] bg-white text-4xl" />
          <div className="flex flex-col">
            <p className="text-xs">Total costs</p>
            <p className="font-bold">{`${overallCosts.toFixed(DECIMAL_PLACES)} $`}</p>
          </div>
        </div>

        {opened && (
          <div className="flex gap-1">
            <span className="icon-[ri--money-dollar-circle-fill] bg-browser-finder text-4xl" />

            <div className="flex flex-col">
              <p className="text-xs">Inputs costs</p>
              <p className="font-bold">{`${inputCosts.toFixed(DECIMAL_PLACES)} $`}</p>
            </div>
          </div>
        )}

        {opened && (
          <div className="flex gap-1">
            <span className="icon-[ri--money-dollar-circle-fill] bg-lighter-purple text-4xl" />

            <div className="flex flex-col">
              <p className="text-xs">Outputs costs</p>
              <p className="font-bold">{`${outputCosts.toFixed(DECIMAL_PLACES)} $`}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
