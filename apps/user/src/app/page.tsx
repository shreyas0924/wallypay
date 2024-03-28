'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Appbar } from '@repo/ui/components/appbar';
import { Separator } from '@repo/ui/components/ui/separator';
export default function Page(): JSX.Element {
  const session = useSession();
  return (
    <div className=''>
      <Appbar
        onSignin={signIn}
        onSignout={signOut}
        user={session.data?.user}
        name='Paytm'
      />
      <h1>Hello {session.data?.user?.name}</h1>
    </div>
  );
}
