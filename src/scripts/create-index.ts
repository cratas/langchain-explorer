const dotenv = require('dotenv');

const { Pinecone } = require('@pinecone-database/pinecone');

const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { PineconeStore } = require('langchain/vectorstores/pinecone');
const { PDFLoader } = require('langchain/document_loaders/fs/pdf');
const { CharacterTextSplitter } = require('langchain/text_splitter');

dotenv.config();

(async () => {
  const pinecone = new Pinecone();

  // referencing index we want to upload to
  const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX as string);

  // loading pdf
  const loader = new PDFLoader('src/scripts/navalPdf.pdf', {
    splitPages: false,
  });
  const docs = await loader.load();

  // splitting pdf into chunks
  const splitter = new CharacterTextSplitter({
    separator: '\n',
    chunkSize: 2000,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  // uploading chunks to pinecone
  await PineconeStore.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings({ modelName: 'text-embedding-3-large' }),
    {
      pineconeIndex,
    }
  );
})();
