'use client';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectShad,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select-shad';
import { TextInput } from '@repo/ui/components/ui/TextInput';
import { useState } from 'react';
import { createOnRampTransaction } from '../lib/actions/createOnRampTxn';

const SUPPORTED_BANKS = [
  {
    name: 'HDFC Bank',
    redirectUrl: 'https://netbanking.hdfcbank.com',
    //we have to connect to our webhook instead of netbanking url
  },
  {
    name: 'Axis Bank',
    redirectUrl: 'https://www.axisbank.com/',
  },
];

export const AddMoney = () => {
  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || '');
  const [value, setValue] = useState(0);
  return (
    <Card title='Add Money'>
      <CardHeader>
        <CardTitle>Add Money to Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <TextInput
          label={'Amount'}
          placeholder={'Amount'}
          onChange={(val) => {
            setValue(Number(val));
          }}
          type='number'
        />
      </CardContent>
      <CardContent>
        <div className='text-left'>Bank</div>
        <SelectShad>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select Bank' />
          </SelectTrigger>
          <SelectContent
            onSelect={(value: string) => {
              setRedirectUrl(
                SUPPORTED_BANKS.find((x) => x.name === value)?.redirectUrl || ''
              );
              setProvider(
                SUPPORTED_BANKS.find((x) => x.name === value)?.name || ''
              );
            }}
          >
            <SelectGroup>
              {SUPPORTED_BANKS.map((x) => (
                <SelectItem key={x.name} value={x.name}>
                  {x.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </SelectShad>
      </CardContent>
      <CardFooter>
        <Button
          onClick={async () => {
            await createOnRampTransaction(provider, value);
            window.location.href = redirectUrl || '';
          }}
        >
          Add Money
        </Button>
      </CardFooter>
    </Card>
  );
};
