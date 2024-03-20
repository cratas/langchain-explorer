import { Typography } from '@material-tailwind/react';
import { PropsWithChildren } from 'react';

export const UseCaseSettingsCard = ({ title, children }: PropsWithChildren<{ title: string }>) => (
  <div>
    <Typography placeholder="" className="mb-5 mt-1 text-sm font-bold text-text-light">
      {title}
    </Typography>

    <div className="my-5 flex flex-col gap-4 px-3">{children}</div>
  </div>
);
