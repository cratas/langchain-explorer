import { StarsEffect } from '@/components/effects';

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
