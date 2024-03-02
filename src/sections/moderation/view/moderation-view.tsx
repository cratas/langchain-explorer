import { useState } from 'react';
import { ModerationRoom } from '../moderation-room';
import { ModerationInit } from '../moderation-init';
import { ModerationUseCase, OPTIONS } from '../types';

// TODO: add into view (about use case)
export const ModerationView = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<ModerationUseCase | null>(null);

  const handleSubmit = (value: string) => {
    const selected = OPTIONS.find((option) => option.value === value);
    setSelectedUseCase(selected!);
  };

  return (
    <div className="flex h-[40rem] flex-col items-center justify-center bg-background-dark p-3">
      {selectedUseCase ? (
        <ModerationRoom onBack={() => setSelectedUseCase(null)} selectedUseCase={selectedUseCase} />
      ) : (
        <ModerationInit onSubmit={handleSubmit} />
      )}
    </div>
  );
};
