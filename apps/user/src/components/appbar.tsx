'use client';
import { Button } from '@repo/ui/components/ui/button';
import { ModeToggle } from '@repo/ui/components/theme-toggle';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AppbarProps {
  user?: {
    name?: string | null;
  };
  onSignin: () => void;
  onSignout: () => void;
  name: string;
  userName?: string | null;
}

export function Appbar({
  user,
  onSignin,
  onSignout,
  name,
  userName,
}: AppbarProps): JSX.Element {
  return (
    <div className='flex items-center justify-between align-middle my-4 gap-2'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='w-6 h-6'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3'
        />
      </svg>

      <Link href={'/'} className='text-xl font-medium cursor-pointer'>
        {name}
      </Link>
      <div className='flex gap-6 ml-auto justify-center items-center align-middle'>
        <ModeToggle />
        <div className='flex flex-col justify-center'>
          <Button onClick={user ? onSignout : onSignin}>
            {user ? 'Logout' : 'Login'}
          </Button>
        </div>
      </div>
    </div>
  );
}

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
