import { PropsWithChildren } from 'react';

export const Container = ({ children }: PropsWithChildren) => (
  <div className="container relative min-h-screen">{children}</div>
);
