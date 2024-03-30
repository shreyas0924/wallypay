'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Appbar } from '@repo/ui/components/appbar';
import { useRouter } from 'next/navigation';

export function AppbarClient() {
  const session = useSession();
  const router = useRouter();

  return (
    <nav className='border-b border-gray-300'>
      <div className='max-w-7xl mx-auto'>
        <Appbar
          name='PayTM'
          onSignin={signIn}
          onSignout={async () => {
            await signOut();
            router.push('/api/auth/signin');
          }}
          user={session.data?.user}
        />
      </div>
    </nav>
  );
}
