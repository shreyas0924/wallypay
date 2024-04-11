import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';

export const OutgoingTransactions = ({
  p2pTxn,
}: {
  p2pTxn: {
    time: Date;
    amount: number;
    toUserName: string;
    toUserNumber: string;
  }[];
}) => {
  if (!p2pTxn.length) {
    return (
      <Card title='Recent Transactions'>
        <CardHeader>Outgoing Transactions</CardHeader>
        <div className='text-center pb-8 pt-8'>No Recent transactions</div>
      </Card>
    );
  }

  return (
    <Card className='w-1/2 border-none'>
      <CardHeader>
        <CardTitle>Outgoing Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='pt-2'>
          {p2pTxn.map((t, index) => (
            <Card key={index} className='py-3 my-2'>
              <CardContent className='flex gap-2'>
                <h1 className='text-lg'>Debited</h1>
                <Badge>
                  To : {t.toUserName ? t.toUserName : t.toUserNumber}
                </Badge>
                <div className='ml-auto'>
                  {'- ₹'} {Math.abs(t.amount) / 100}
                </div>
              </CardContent>
              <div className='ml-5 text-slate-600 text-md'>
                {t.time.toDateString()}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
