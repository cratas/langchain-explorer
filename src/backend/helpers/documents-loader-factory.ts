import { SourceOptions } from '@/shared/types/source';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { GithubRepoLoader } from 'langchain/document_loaders/web/github';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';

/**
 * Creates a document loader instance based on the specified source type and source data.
 *
 * @param { SourceOptions } sourceType - The type of the source from which documents are to be loaded. This determines the kind of loader to be instantiated.
 * @param { Blob | string } source - The source from which the documents will be loaded. This can be either a Blob (for file-based sources like PDF) or a string (for URL-based sources or file paths).
 * @returns { PDFLoader | TextLoader | CheerioWebBaseLoader | GithubRepoLoader } Returns an instance of a document loader corresponding to the specified source type. The specific type of loader returned depends on the value of `sourceType`.
 * @throws { Error } Throws an error if an invalid source type is specified.
 *
 * This method is a static member of the `DocumentsLoaderFactory` class, which is responsible for creating instances of different types of document loaders.
 * It supports several source types, including 'pdf', 'text', 'cheerio-web-scraping', and 'github-repository'. Each source type corresponds to a specific loader class that is instantiated and returned.
 *  The method ensures that the correct type of loader is used for the given source, enhancing modularity and ease of maintenance.
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
