"use client";
import { RecoilRoot } from "@repo/store";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
interface SessionProps {
  children: React.ReactNode;
}
function NextAuthSessionProvider({ children }: SessionProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextAuthSessionProvider>
        <RecoilRoot>{children}</RecoilRoot>
      </NextAuthSessionProvider>
    </ThemeProvider>
  );
}
