"use client";
import { RecoilRoot } from "@repo/store";
import React from "react";
import { SessionProvider } from "next-auth/react";

interface SessionProps {
  children: React.ReactNode;
}
function NextAuthSessionProvider({ children }: SessionProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <RecoilRoot>{children}</RecoilRoot>
    </NextAuthSessionProvider>
  );
}
