import { getProviderByModelName } from '@/backend/utils/get-provider-by-model';
import { ConversationModelOptions } from '@/shared/types/common';
import { calcModelCostByTokens } from '@/shared/utils/calc-model-cost-by-tokens';
import { getTokensCountByLLMProvider } from '@/shared/utils/get-tokens-count-by-llm';
import { Tooltip } from '@material-tailwind/react';
import React from 'react';

type Props = {
  modelName: ConversationModelOptions;
  input: string;
};

const DECIMAL_PLACES = 8;

export const ChatInputCosts = ({ modelName, input }: Props) => {
  const inputTokensCount = getTokensCountByLLMProvider(getProviderByModelName(modelName), input);

  const inputOnlyPrice = calcModelCostByTokens(inputTokensCount, modelName, 'input');

  return (
    <Tooltip
      className="bg-white text-background-dark"
      content={
        <div className="flex max-w-[20rem] flex-col">
          <div>
            <span className="font-bold">Input only costs:</span>{' '}
            {calcModelCostByTokens(inputTokensCount, modelName, 'input').toFixed(DECIMAL_PLACES)} $
          </div>
          <div>
            <span className="font-bold">Number of tokens:</span> {inputTokensCount}
          </div>
          <div>
            <span className="font-bold">Note:</span>Total costs for this message will be higher due
            to the template for model to generate the better response and providing chat history.
          </div>
        </div>
      }
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 25 },
      }}
    >
      <div className="flex cursor-help items-center justify-center gap-1 rounded-md bg-browser-light p-2 font-bold text-white">
        <span className="icon-[ri--money-dollar-circle-fill] bg-white text-2xl" />
        <span className="text-nowrap text-sm">{inputOnlyPrice.toFixed(DECIMAL_PLACES)}</span>
      </div>
    </Tooltip>
  );
};
