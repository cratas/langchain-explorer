export const COMMON_TEMPLATE_WITH_CHAT_HISTORY = `
Current conversation history:
{chat_history}

User input: {input}`;

export const STANDALONE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}

Follow Up Input: {question}
Standalone question:`;
