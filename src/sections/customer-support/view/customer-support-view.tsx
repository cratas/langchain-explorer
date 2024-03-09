import { useState } from 'react';
import { CustomerSupportInit } from '../customer-support-init';
import { CustomerSupportRoom } from '../customer-support-room';

type Initializition = {
  initialized: boolean;
  anonymization: boolean;
};

// TODO: add into view (about use case)
// TODO: rozlisit jestli se pta uzivatel nebo administrator
// podle toho handlit prava ve funkci
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
