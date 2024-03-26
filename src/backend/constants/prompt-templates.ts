export const COMMON_TEMPLATE_WITH_CHAT_HISTORY = `
Current conversation history:
{chat_history}

User input: {input}`;

export const STANDALONE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}

Follow Up Input: {question}
Standalone question:`;

export const CREATE_ANSWER_FROM_FUNCTION_CALLS_TEMPLATE = `Create me user response considering my results from function calls 
without mentioning logic behind (function calls e.g., just use provided context and chat history for creating user friendly response). 
There are results grouped by function call names:

{input} 
`;

export const REPEATE_MESSAGE_TEMPLATE = `Return me exactly the same message: {input}`;
