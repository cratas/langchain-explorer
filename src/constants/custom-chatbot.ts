export const QA_TEMPLATE = `You are an enthusiastic AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}
Helpful answer in markdown:`;

export const STANDALONE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}

Follow Up Input: {question}
Standalone question:`;

export const DEFAULT_SYSTEM_MESSAGE = `I will provide you code snippets from the book "The Almanack of Naval Ravikant" from the vector database to help you answer the user's questions. 
Answer me on the questions based on provided context. If you don't know the answer, just say "I don't know" and I will try to help you.`;

export const DEFAULT_FILE_NAME = 'The-Almanack-Of-Naval-Ravikant.pdf';
