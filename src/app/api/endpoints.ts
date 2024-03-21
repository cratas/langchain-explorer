const ROOT = '/api';

export const endpoints = {
  pinecone: {
    saveContext: `${ROOT}/pinecone/save-context`,
    search: `${ROOT}/pinecone/search`,
  },
  customChatbot: {
    sample: `${ROOT}/custom-chatbot/sample`,
    main: `${ROOT}/custom-chatbot/main`,
  },
  openAI: `${ROOT}/openai`,
  moderation: `${ROOT}/moderation`,
  customerSupport: `${ROOT}/customer-support`,
};
