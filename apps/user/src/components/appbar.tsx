'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Appbar } from '@repo/ui/components/appbar';
import { useRouter } from 'next/navigation';
import { PrismaClient } from '@repo/database/client';

export function AppbarClient() {
  const session = useSession();
  const router = useRouter();

  return (
    <nav className='border-b border-gray-300'>
      <div className='max-w-7xl mx-auto'>
              <Appbar
          name='Wallet App'
          onSignin={signIn}
          onSignout={async () => {
            await signOut();
            router.push('/api/auth/signin');
          }}
          user={session.data?.user}
          userName={session.data?.user?.name}
        />
      </div>
    </nav>
  );
}
