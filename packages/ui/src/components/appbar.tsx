import { ModeToggle } from './theme-toggle';
import { Button } from './ui/button';

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

      <div className='text-xl font-medium'>{name}</div>
      <div className='flex gap-4 ml-auto justify-center items-center align-middle'>
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
