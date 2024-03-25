import { PropsWithChildren } from 'react';
import { FormProvider as Form, UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
} & PropsWithChildren;

const FormProvider = ({ children, onSubmit, methods }: Props) => (
  <Form {...methods}>
    <form onSubmit={onSubmit}>{children}</form>
  </Form>
);

FormProvider.displayName = 'FormProvider';

export default FormProvider;
