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
  templateTokensCount: number;
};

const DECIMAL_PLACES = 8;

export const ChatInputCosts = memo(({ modelName, input, templateTokensCount }: Props) => {
  const { debouncedValue } = useDebounce(input, 100);

  const inputTokensCount = useMemo(
    () => getTokensCountByLLMProvider(getProviderByModelName(modelName), debouncedValue),
    [debouncedValue, modelName]
  );

  const inputOnlyPrice = useMemo(
    () => calcModelCostByTokens(inputTokensCount, modelName, 'input'),
    [inputTokensCount, modelName]
  );

  const totalPrice = useMemo(
    () => calcModelCostByTokens(templateTokensCount, modelName, 'input') + inputOnlyPrice,
    [inputOnlyPrice, templateTokensCount, modelName]
  );

  return (
    <Tooltip
      className="bg-white text-background-dark"
      content={
        <div className="flex max-w-[20rem] flex-col">
          <div>
            <span className="font-bold">Input only costs:</span> {inputOnlyPrice} $
          </div>
          <div>
            <span className="font-bold">Input only tokens:</span> {inputTokensCount}
          </div>
          <div className="my-1 h-[1px] w-full bg-black" />
          <div>
            <span className="font-bold">Prompt template costs:</span>{' '}
            {calcModelCostByTokens(templateTokensCount, modelName, 'input')} $
          </div>
          <div>
            <span className="font-bold">Prompt template tokens:</span> {templateTokensCount}
          </div>
          <div className="my-1 h-[1px] w-full bg-black" />
          <div>
            <span className="font-bold">Total costs:</span> {totalPrice} $
          </div>
          <div>
            <span className="font-bold">Total tokens:</span>{' '}
            {inputTokensCount + templateTokensCount}
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
        <span className="text-nowrap text-sm">{totalPrice.toFixed(DECIMAL_PLACES)}</span>
      </div>
    </Tooltip>
  );
});

ChatInputCosts.displayName = 'ChatInputCosts';
