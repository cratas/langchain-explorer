import { useState } from 'react';
import { BrowserLayout } from '@/layouts';
import { ModerationRoom } from '../moderation-room';
import { ModerationInit } from '../moderation-init';
import { ModerationUseCase, OPTIONS } from '../types';
import { ModerationViewHeader } from '../moderation-view-header';

export const ModerationView = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<ModerationUseCase | null>(null);

  const handleSubmit = (value: string) => {
    const selected = OPTIONS.find((option) => option.value === value);
    setSelectedUseCase(selected!);
  };

  return (
    <>
      <ModerationViewHeader />

      <BrowserLayout>
        <div className="flex h-[40rem] flex-col items-center justify-center overflow-auto bg-background-dark p-3">
          {selectedUseCase ? (
            <ModerationRoom
              onBack={() => setSelectedUseCase(null)}
              selectedUseCase={selectedUseCase}
            />
          ) : (
            <ModerationInit onSubmit={handleSubmit} />
          )}
        </div>
      </BrowserLayout>
    </>
  );
};
