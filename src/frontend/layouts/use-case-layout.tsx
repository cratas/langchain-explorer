import { StarsEffect } from '@/frontend/components/effects';

export const UseCaseLayout = ({
  children,
  settingsDrawer,
}: Readonly<{
  children: React.ReactNode;
  settingsDrawer: React.ReactNode;
}>) => (
  <div>
    <StarsEffect />

    <div>{settingsDrawer}</div>

    {children}
  </div>
);
