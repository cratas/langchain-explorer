import { useState } from 'react';
import { CustomerSupportRoom } from '../customer-support-room';
import { CustomerSupportInit } from '../customer-support-init';

type Initializition = {
  initialized: boolean;
  anonymization: boolean;
};

// TODO: add into view (about use case)
export const CustomerSupportView = () => {
  const [initialization, setInitialization] = useState<Initializition>({
    initialized: false,
    anonymization: false,
  });

  return (
    <div className="flex h-[40rem] flex-col items-center justify-center bg-background-dark p-3">
      {initialization.initialized ? (
        <CustomerSupportRoom
          anonymization={initialization.anonymization}
          onBack={() => setInitialization((prev) => ({ ...prev, initialized: false }))}
        />
      ) : (
        <CustomerSupportInit
          anonymization={initialization.anonymization}
          setAnonymization={(anonymization) =>
            setInitialization((prev) => ({ ...prev, anonymization }))
          }
          onSubmit={(anonymization) => setInitialization({ initialized: true, anonymization })}
        />
      )}
    </div>
  );
};
