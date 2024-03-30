'use client';

import { TextInput } from '@repo/ui/components/ui/TextInput';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { useState } from 'react';
import { p2pTransfer } from '../lib/actions/p2pTransfer';

export function SendCard() {
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <Card className='w-2/5'>
      <CardHeader>
        <CardTitle>Send Money</CardTitle>
      </CardHeader>
      <CardContent>
        <TextInput
          placeholder={'Number'}
          label='Phone Number'
          type='number'
          onChange={(value) => {
            setNumber(value);
          }}
        />
        <TextInput
          placeholder={'Amount'}
          label='Amount'
          type='number'
          onChange={(value) => {
            setAmount(value);
          }}
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={async () => {
            await p2pTransfer(number, Number(amount) * 100);
          }}
        >
          Send
        </Button>
      </CardFooter>
    </Card>
  );
}
