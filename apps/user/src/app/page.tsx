"use client";

import { useBalance } from "@repo/store";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Page() {
  const balance = useBalance();
  const { data: session, status } = useSession();

  return (
    <div className="text-center text-2xl flex gap-4 justify-center align-middle m-4">
      <div>Balance : {balance}</div>
      {status === "authenticated" ? (
        <div>Hello {session.user?.name}</div>
      ) : (
        <Link href="/api/auth/signin">Sign In</Link>
      )}
    </div>
  );
}
