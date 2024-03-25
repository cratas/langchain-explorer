export type CustomerSupportUseCase = {
  label: string;
  value: 'administrator' | 'guest' | 'user';
  description: string;
  systemMessage: string;
};
