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
import { toast } from "@repo/ui/components/ui/use-toast";
import { Toaster } from "@repo/ui/components/ui/toaster";
import { useRouter } from 'next/navigation';

export function SendCard() {
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTransfer = async () => {
    if (!number || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Optimistic update - show success toast immediately
      toast({
        title: "Transfer initiated",
        description: `Sending ₹${amount} to ${number}`,
      });

      await p2pTransfer(number, Number(amount) * 100);
      
      // Clear form and show success
      setNumber('');
      setAmount('');
      toast({
        title: "Transfer successful",
        description: `Successfully sent ₹${amount} to ${number}`,
      });
      
      // Refresh the page to update balances
      router.refresh();
    } catch (error: any) {
      // Handle specific error cases
      if (error.message?.includes('not found')) {
        toast({
          title: "User not found",
          description: "This phone number is not registered",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Transfer failed",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

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
          value={number}
          onChange={(value) => setNumber(value)}
        />
        <TextInput
          placeholder={'Amount'}
          label='Amount'
          type='number'
          value={amount}
          onChange={(value) => setAmount(value)}
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleTransfer}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </CardFooter>
      <Toaster />
    </Card>
  );
}
