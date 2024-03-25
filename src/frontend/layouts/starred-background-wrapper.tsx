import { StarsEffect } from '@/frontend/components/effects';

export const StarredBackgroundWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <>
    <StarsEffect />

    {children}
  </>
);
