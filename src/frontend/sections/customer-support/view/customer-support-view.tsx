import { useState } from 'react';
import { BrowserLayout } from '@/frontend/layouts';
import { OPTIONS } from '@/frontend/constants/customer-support';
import { CustomerSupportUseCase } from '@/frontend/types/customer-support';
import { CustomerSupportInit } from '../customer-support-init';
import { CustomerSupportRoom } from '../customer-support-room';
import { CustomerSupportViewHeader } from '../customer-support-view-header';

export const CustomerSupportView = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<CustomerSupportUseCase | null>(null);

  const handleSubmit = (value: string) => {
    const selected = OPTIONS.find((option) => option.value === value);

    setSelectedUseCase(selected!);
  };

  return (
    <>
      <CustomerSupportViewHeader />

      <BrowserLayout>
        <div className="flex h-[40rem] flex-col items-center justify-center bg-background-dark p-3">
          {selectedUseCase ? (
            <CustomerSupportRoom
              onBack={() => setSelectedUseCase(null)}
              selectedUseCase={selectedUseCase}
            />
          ) : (
            <CustomerSupportInit onSubmit={handleSubmit} />
          )}
        </div>
      </BrowserLayout>
    </>
  );
};
