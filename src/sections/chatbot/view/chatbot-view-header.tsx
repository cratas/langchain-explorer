import { Button, Chip, Tooltip, Typography } from '@material-tailwind/react';

const renderChip = (label: string) => (
  <Chip
    value={label}
    size="sm"
    className="inline-block border border-lighter-purple normal-case text-text-light"
    variant="outlined"
  />
);

export const ChatBotViewHeader = () => (
  <div>
    <div className="mb-5 flex flex-wrap gap-2">
      {renderChip('Own context')}

      {renderChip('Retrieval Enhanced')}

      {renderChip('Knowledge Boost')}

      {renderChip('Real Time')}

      {renderChip('Custom Source')}
    </div>

    <div className="flex flex-col gap-10 lg:flex-row">
      <div className="flex w-full flex-col gap-2 lg:w-[45%]">
        <Typography placeholder="" variant="h5" className="text-text-light">
          What is RAG?
        </Typography>

        <Typography placeholder="" className="text-sm text-text-primary">
          RAG is a technique for augmenting LLM knowledge with additional data. LLMs can reason
          about wide-ranging topics, but their knowledge is limited to the public data up to a
          specific point in time that they were trained on. If you want to build AI applications
          that can reason about private data or data introduced after a model’s cutoff date, you
          need to augment the knowledge of the model with the specific information it needs. The
          process of bringing the appropriate information and inserting it into the model prompt is
          known as Retrieval Augmented Generation (RAG).
        </Typography>

        <Button
          placeholder=""
          size="sm"
          className="mt-5 inline-block max-w-[13rem] rounded bg-lighter-purple hover:bg-light-purple"
        >
          Create Custom RAG
        </Button>
      </div>

      <div className="flex w-full items-center justify-center lg:w-[55%]">
        <div className="flex w-full flex-wrap items-start gap-5">
          {renderItem('Conversation model', 'gpt-3.5-turbo', 'LLM Model used for conversation')}
          {renderItem('Embedding model', 'text-embedding-3-small', 'LLM Model used for embedding')}
          {renderItem(
            'LLM Temperature',
            '0.2',
            'Temperature of both embedding and conversation LLM'
          )}
          {renderItem('Source', 'PDF Document', 'Source type of the conversation')}
          {renderItem('Dimensions', '1536', 'The dimension of the vector store')}
          {renderItem('Chunk size', '1024', 'Chunk size of the vector store')}
          {renderItem(
            'Vectore Database',
            'Pinecone',
            'Vector database used for storing the vector representation of the documents'
          )}
          {renderItem('Chunk Overlap', '200', 'Chunk overlap of the vector store')}
          {renderItem(
            'Retrievals count',
            '3',
            'Count of retrieved chunks from vector databse sent to LLM'
          )}
        </div>
      </div>
    </div>
  </div>
);

const renderItem = (label: string, value: string, tooltipContent: string) => (
  <div className="flex min-w-[10rem] grow gap-2 rounded-lg border border-gray-900 bg-background-dark p-1 pr-2">
    <Tooltip content={tooltipContent}>
      <div className="flex cursor-pointer items-center justify-center rounded-md bg-background-light px-2">
        <span className="icon-[fluent--info-24-filled] text-2xl text-lighter-purple" />
      </div>
    </Tooltip>

    <div className="flex flex-col items-start justify-between overflow-hidden">
      <Typography placeholder="" className="truncate text-ellipsis text-sm text-text-primary">
        {label}
      </Typography>
      <Typography placeholder="" className="truncate  text-sm font-bold text-text-light">
        {value}
      </Typography>
    </div>
  </div>
);
