'use client';

import { useBalance } from '@repo/store';

export default function Page() {
  const balance = useBalance();

  return (
    <div className='text-center text-2xl '>
      <h1>Its working</h1>
      <div>Balance : {balance}</div>
    </div>
  );
}
