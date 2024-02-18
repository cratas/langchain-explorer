export type Message = {
  id: string;
  content?: string;
  role: 'user' | 'bot' | 'system';
  isError?: boolean;
};
