const ROOT = '/api';

export const endpoints = {
  pinecone: {
    saveContext: `${ROOT}/pinecone/save-context`,
    search: `${ROOT}/pinecone/search`,
  },
  customChatbot: `${ROOT}/custom-chatbot`,
  openAI: `${ROOT}/openai`,
  moderation: `${ROOT}/moderation`,
  customerSupport: `${ROOT}/customer-support`,
};
