/* eslint-disable no-case-declarations */
import { NextResponse } from 'next/server';
import { PINECONE_INDEX } from '@/config-global';
import { PineconeIndexService } from '@/backend/services/pinecone-index-service';
import { CUSTOM_CHATBOT_DEFAULT_FILE_NAME } from '@/shared/constants/common';
import { DocumentsLoaderFactory } from '@/backend/helpers/documents-loader-factory';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { validateRequestAndGetFormData } from './validate-request-and-get-data';
import { logger } from '../../../../../logger';

export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();

    const { chunkOverlap, chunkSize, sourceType, file, url, embeddingModel, fileName } =
      validateRequestAndGetFormData(formData);

    logger.info(
      `Save context request with sourceType: ${sourceType}, file: ${file}, url: ${url},
       embeddingModel: ${embeddingModel}, fileName: ${fileName}`
    );

    const pineconeService = new PineconeIndexService(PINECONE_INDEX);

    await pineconeService.deleteAllNamespacesExceptProvidedNamespace(
      CUSTOM_CHATBOT_DEFAULT_FILE_NAME
    );

    const loader = DocumentsLoaderFactory.createLoader(sourceType, file || url);

    const documents = await loader.load();

    const splitter = new CharacterTextSplitter({
      separator: '\n',
      chunkSize: Number(chunkSize),
      chunkOverlap: Number(chunkOverlap),
    });

    const splitDocs = await splitter.splitDocuments(documents);

    await pineconeService.saveDocumentsToVectorStore(splitDocs, embeddingModel, fileName as string);

    return NextResponse.json({ message: 'Pinecone index created' }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error in data validation: ${error.message}`);

      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    logger.error(`Error in saving context: ${error}`);

    return NextResponse.json({ message: 'Failed to save context' }, { status: 500 });
  }
};
