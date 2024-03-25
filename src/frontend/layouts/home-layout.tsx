import React, { PropsWithChildren } from 'react';
import { MoonEffect, StarsEffect } from '@/frontend/components/effects';
import { Container } from './container';
import { Footer } from './footer';

export const HomeLayout = ({ children }: PropsWithChildren) => (
  <Container>
    <MoonEffect />

    <StarsEffect />

    <div className="flex min-h-screen flex-col">
      <div className="pt-36 md:pt-52">{children}</div>

      <Footer />
    </div>
  </Container>
);
