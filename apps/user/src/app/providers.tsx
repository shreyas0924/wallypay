'use client';
import { RecoilRoot } from '@repo/store';
import React from 'react';
import { SessionProvider } from 'next-auth/react';

type sessionProps = {
  children: React.ReactNode;
};
function NextAuthSessionProvider({ children }: sessionProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <RecoilRoot>{children}</RecoilRoot>;
    </NextAuthSessionProvider>
  );
}
