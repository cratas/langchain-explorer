import { getProviderByModelName } from '@/backend/utils/get-provider-by-model';
import { useDebounce } from '@/frontend/hooks/use-debounce';
import { ConversationModelOptions } from '@/shared/types/common';
import { calcModelCostByTokens } from '@/shared/utils/calc-model-cost-by-tokens';
import { getTokensCountByLLMProvider } from '@/shared/utils/get-tokens-count-by-llm';
import { Tooltip } from '@material-tailwind/react';
import React, { memo, useMemo } from 'react';

type Props = {
  modelName: ConversationModelOptions;
  input: string;
};

const DECIMAL_PLACES = 8;

export const ChatInputCosts = memo(({ modelName, input }: Props) => {
  const { debouncedValue } = useDebounce(input, 100);

  const inputTokensCount = useMemo(
    () => getTokensCountByLLMProvider(getProviderByModelName(modelName), debouncedValue),
    [debouncedValue, modelName]
  );

  const inputOnlyPrice = useMemo(
    () => calcModelCostByTokens(inputTokensCount, modelName, 'input'),
    [inputTokensCount, modelName]
  );

  return (
    <Tooltip
      className="bg-white text-background-dark"
      content={
        <div className="flex max-w-[20rem] flex-col">
          <div>
            <span className="font-bold">Input only costs:</span>{' '}
            {calcModelCostByTokens(inputTokensCount, modelName, 'input')} $
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
      <div className="flex w-36 cursor-help items-center justify-center gap-1 rounded-md bg-browser-light p-2 text-sm font-normal text-white">
        <span className="icon-[ri--money-dollar-circle-fill] bg-white text-2xl" />
        <span className="text-nowrap text-sm">{inputOnlyPrice.toFixed(DECIMAL_PLACES)}</span>
      </div>
    </Tooltip>
  );
});

ChatInputCosts.displayName = 'ChatInputCosts';
