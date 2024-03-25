import { TextLoader } from 'langchain/document_loaders/fs/text';
import { GithubRepoLoader } from 'langchain/document_loaders/web/github';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { SourceOptions } from '@/shared/types/common';

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
