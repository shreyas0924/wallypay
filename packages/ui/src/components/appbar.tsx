import { ModeToggle } from './theme-toggle';
import { Button } from './ui/button';

interface AppbarProps {
  user?: {
    name?: string | null;
  };
  onSignin: () => void;
  onSignout: () => void;
  name: string;
}

export function Appbar({
  user,
  onSignin,
  onSignout,
  name,
}: AppbarProps): JSX.Element {
  return (
    <div className='flex items-center justify-between align-middle my-6'>
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
