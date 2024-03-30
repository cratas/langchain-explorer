const ROOT = '/api';

export const endpoints = {
  pinecone: {
    saveContext: `${ROOT}/pinecone/save-context`,
  },
  customChatbot: {
    sample: `${ROOT}/custom-chatbot/sample`,
    main: `${ROOT}/custom-chatbot/main`,
  },
  openAI: `${ROOT}/openai`,
  moderation: { sample: `${ROOT}/moderation/sample`, main: `${ROOT}/moderation/main` },
  customerSupport: `${ROOT}/customer-support`,
  tokenUsage: `${ROOT}/token-usage`,
};
