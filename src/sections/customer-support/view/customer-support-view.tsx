import { useState } from 'react';
import { CustomerSupportInit } from '../customer-support-init';
import { CustomerSupportRoom } from '../customer-support-room';
import { CustomerSupportUseCase, OPTIONS } from '../types';

// TODO: add into view (about use case)
export const CustomerSupportView = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<CustomerSupportUseCase | null>(null);

  const handleSubmit = (value: string) => {
    const selected = OPTIONS.find((option) => option.value === value);
    setSelectedUseCase(selected!);
  };

  return (
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
  );
};