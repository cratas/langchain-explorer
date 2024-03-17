import { BaseUseCaseViewHeader } from '@/components/common/base-use-case-view-header';

export const CustomerSupportViewHeader = () => (
  <BaseUseCaseViewHeader
    title="Customer support using Function calls"
    description="
      Customer support through function calls is a structured approach to address customer 
      inquiries and issues. The process begins with an initialization function gathering 
      essential information like customer details and issue description. 
      In the context of a Large Language Model (LLM) like ChatGPT, Function calls refer to the way 
      in which the model interacts with external or additional functionalities that are not part of
      its core language processing capabilities. These function calls allow the model to perform 
      tasks or access information that is outside of its immediate scope of trained knowledge."
    buttonText="Customize Customer Support"
    chipItems={['Function calls', 'Database stored data', 'Role based access', 'Real Time']}
    settingsItems={[
      {
        label: 'LLM Model',
        value: 'gpt-3.5-turbo-0125',
        tooltipContent: 'LLM Model used for this use case.',
      },
      {
        label: 'LLM Temperature',
        value: '0',
        tooltipContent: 'Temperature of LLM Model.',
      },
      {
        label: 'Source',
        value: 'Relational Database',
        tooltipContent: 'Source type of the context.',
      },
      {
        label: 'Retriaval strategy',
        value: 'Function calls',
        tooltipContent: 'Function calls are used to retrieve the data from the database.',
      },
      {
        label: 'Database',
        value: 'Prisma',
        tooltipContent: 'Database used for storing the context data.',
      },
      {
        label: 'Context type',
        value: 'Simple E-commerce',
        tooltipContent:
          'Datbase keeps information about the products, customers and orders in the context of E-commerce.',
      },
      {
        label: 'Role',
        value: 'Guest',
        tooltipContent:
          'Users with limited access to the context. They can only get the general information.',
      },
      {
        label: 'Role',
        value: 'User (Roland Schimmel)',
        tooltipContent: 'Pre-logged user with access to his own orders and personal information.',
      },
      {
        label: 'Role',
        value: 'Administrator',
        tooltipContent: 'Full access to the context. Can perform any operation.',
      },
    ]}
  />
);
