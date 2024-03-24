'use client';
import { RecoilRoot } from '@repo/store';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
