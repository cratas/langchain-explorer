import { TextLoader } from 'langchain/document_loaders/fs/text';
import { GithubRepoLoader } from 'langchain/document_loaders/web/github';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { SourceOptions } from '@/shared/types/common';

/**
 * Creates a document loader based on the specified source type.
 *
 * @param {SourceOptions} sourceType - The type of the source to load documents from.
 *    Can be 'pdf', 'text', 'cheerio-web-scraping', or 'github-repository'.
 * @param {Blob | string} source - The source from which the documents will be loaded.
 *    This could be a direct path, URL, or a Blob object, depending on the loader.
 * @returns {Object} A document loader instance that corresponds to the provided source type.
 * @throws {Error} Throws an error if an invalid source type is provided.
 */
export class DocumentsLoaderFactory {
  static createLoader(sourceType: SourceOptions, source: Blob | string) {
    switch (sourceType) {
      case 'pdf':
        return new PDFLoader(source, {
          splitPages: true,
        });
      case 'text':
        return new TextLoader(source);
      case 'cheerio-web-scraping':
        return new CheerioWebBaseLoader(source as string);
      case 'github-repository':
        return new GithubRepoLoader(source as string, {
          branch: 'main',
          recursive: false,
          unknown: 'warn',
          maxConcurrency: 5,
        });
      default:
        throw new Error('Invalid source type');
    }
  }
}
