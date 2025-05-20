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
import { useState, useEffect } from 'react';
import { createOnRampTransaction } from '../lib/actions/createOnRampTxn';

export const AddMoney = () => {
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [provider, setProvider] = useState('');
  const [value, setValue] = useState(0);

  useEffect(() => {
    // Fetch user's bank accounts from API
    fetch('/api/bank-account')
      .then(res => res.json())
      .then(data => {
        setBankAccounts(data);
        if (data.length > 0) {
          setSelectedAccountId(data[0].id.toString());
          setProvider(data[0].provider);
        }
      });
  }, []);

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
        <div className='text-left'>Bank Account</div>
        <SelectShad>
          <SelectTrigger className='w-[250px]'>
            <SelectValue placeholder='Select Bank Account' />
          </SelectTrigger>
          <SelectContent
            onSelect={(value: any) => {
              const account = bankAccounts.find((x) => x.id.toString() === value);
              setSelectedAccountId(value);
              setProvider(account?.provider || '');
            }}
          >
            <SelectGroup>
              {bankAccounts.map((x) => (
                <SelectItem key={x.id} value={x.id.toString()}>
                  {x.provider} - {x.accountNumber.slice(-4)} 
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </SelectShad>
      </CardContent>
      <CardFooter>
        <Button
          onClick={async () => {
            if (!selectedAccountId) return;
            await createOnRampTransaction(provider, value, selectedAccountId);
          }}
        >
          Add Money
        </Button>
      </CardFooter>
    </Card>
  );
};
