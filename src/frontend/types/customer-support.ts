import { CustomerSupportRoles } from '@/shared/constants/customer-support';

export type CustomerSupportUseCase = {
  label: string;
  value: CustomerSupportRoles;
  description: string;
  systemMessage: string;
};
