import { z } from 'zod';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvironmentVariablesSchemaType {}
  }
}

type EnvironmentVariablesSchemaType = z.infer<typeof environmentVariablesSchema>;

const environmentVariablesSchema = z.object({
  OPENAI_API_KEY: z.string(),
  ANTHROPIC_API_KEY: z.string(),
  MISTRAL_API_KEY: z.string(),
  PINECONE_API_KEY: z.string(),
  PINECONE_INDEX: z.string(),
});

const result = ((): z.infer<typeof environmentVariablesSchema> => {
  try {
    return environmentVariablesSchema.parse(process.env);
  } catch {
    throw Error(
      `
          Incorrect environment setup.
          
          This application requires ${JSON.stringify(
            Object.keys(environmentVariablesSchema.keyof().Values)
          )} environment variables.
        `
    );
  }
})();

const env = <K extends keyof EnvironmentVariablesSchemaType>(
  key: K
): EnvironmentVariablesSchemaType[K] => result[key];

export const OPENAI_API_KEY = env('OPENAI_API_KEY');
export const ANTHROPIC_API_KEY = env('ANTHROPIC_API_KEY');
export const MISTRAL_API_KEY = env('MISTRAL_API_KEY');
export const PINECONE_API_KEY = env('PINECONE_API_KEY');
export const PINECONE_INDEX = env('PINECONE_INDEX');
