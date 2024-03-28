'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Appbar } from '@repo/ui/components/appbar';
export default function Page(): JSX.Element {
  const session = useSession();
  return (
    <div>
      <Appbar onSignin={signIn} onSignout={signOut} user={session.data?.user} />
      <h1>Hello {session.data?.user?.name}</h1>
    </div>
  );
}
