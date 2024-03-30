'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Appbar } from '@repo/ui/components/appbar';
import { Separator } from '@repo/ui/components/ui/separator';
export default function Page(): JSX.Element {
  const session = useSession();
  return (
    <div className=''>
      {session ? (
        <h1>Hello {session.data?.user?.name}</h1>
      ) : (
        <h1>Please Signin</h1>
      )}
    </div>
  );
}
