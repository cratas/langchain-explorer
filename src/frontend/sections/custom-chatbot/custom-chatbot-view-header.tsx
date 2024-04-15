import routes from '@/app/routes';
import { BaseUseCaseViewHeader } from '@/frontend/components/common/base-use-case-view-header';

export const CustomChatBotViewHeader = () => (
  <BaseUseCaseViewHeader
    buttonText="Create custom RAG"
    buttonLinkURL={routes.customChatbot}
    chipItems={[
      'Own context',
      'Retrieval Enhanced',
      'Knowledge Boost',
      'Real Time',
      'Custom Source',
    ]}
    settingsItems={[
      {
        label: 'Conversation model',
        value: 'gpt-3.5-turbo',
        tooltipContent: 'LLM Model used for conversation.',
      },
      {
        label: 'Embedding model',
        value: 'text-embedding-3-small',
        tooltipContent: 'LLM Model used for embedding.',
      },
      {
        label: 'LLM Temperature',
        value: '0.2',
        tooltipContent: 'Temperature of both embedding and conversation LLM.',
      },
      {
        label: 'Source',
        value: 'PDF Document',
        tooltipContent: 'Source type of the conversation.',
      },
      {
        label: 'Dimensions',
        value: '1536',
        tooltipContent: 'The dimension of the vector store.',
      },
      {
        label: 'Chunk size',
        value: '1024',
        tooltipContent: 'Chunk size of the vector store.',
      },
      {
        label: 'Vectore Database',
        value: 'Pinecone',
        tooltipContent:
          'Vector database used for storing the vector representation of the documents.',
      },
      {
        label: 'Chunk Overlap',
        value: '200',
        tooltipContent: 'Chunk overlap of the vector store.',
      },
      {
        label: 'Retrievals count',
        value: '4',
        tooltipContent: 'Count of retrieved chunks from vector databse sent to LLM.',
      },
    ]}
    title="What is RAG?"
    description="RAG is a technique for augmenting LLM knowledge with additional data. LLMs can reason
  about wide-ranging topics, but their knowledge is limited to the public data up to a
  specific point in time that they were trained on. If you want to build AI applications
  that can reason about private data or data introduced after a model’s cutoff date, you
  need to augment the knowledge of the model with the specific information it needs. The
  process of bringing the appropriate information and inserting it into the model prompt is
  known as Retrieval Augmented Generation (RAG)."
  />
);
