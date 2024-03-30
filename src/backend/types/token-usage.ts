import { ChatAnthropic } from '@langchain/anthropic';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatOpenAI } from '@langchain/openai';

export type ModelOptions = ChatOpenAI | ChatMistralAI | ChatAnthropic;
