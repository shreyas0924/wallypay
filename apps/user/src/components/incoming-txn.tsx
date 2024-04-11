import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';

type AddBalanceTxn = {
  time: Date;
  amount: number;
  fromId: number;
  name?: string;
};

type P2PTxn = {
  time: Date;
  amount: number;
  fromId: number;
  fromUserName: string;
  fromUserNumber: string;
};

export const IncomingTransactions = ({
  addBalanceTxn,
  p2pTxn,
}: {
  addBalanceTxn: AddBalanceTxn[];
  p2pTxn: P2PTxn[];
}) => {
  const allTransactions = [...addBalanceTxn, ...p2pTxn].sort(
    (a, b) => b.time.getTime() - a.time.getTime()
  );

  if (!allTransactions.length) {
    return (
      <Card title='Recent Transactions'>
        <CardHeader>Incoming Transactions</CardHeader>
        <div className='text-center pb-8 pt-8'>No Recent transactions</div>
      </Card>
    );
  }

  return (
    <Card className='w-1/2 border-none'>
      <CardHeader>
        <CardTitle>Incoming Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='pt-2'>
          {allTransactions.map((t, index) => {
            const isAddBalanceTxn = addBalanceTxn.some(
              (txn) => txn.fromId === t.fromId
            );
            const sender = isAddBalanceTxn
              ? addBalanceTxn.find((txn) => txn.fromId === t.fromId)
              : p2pTxn.find((txn) => txn.fromId === t.fromId);
            const senderName =
              (sender as AddBalanceTxn)?.name ||
              (sender as P2PTxn)?.fromUserName ||
              (sender as P2PTxn)?.fromUserNumber;
            return (
              <Card key={index} className='py-3 my-2'>
                <CardContent className='flex gap-2'>
                  <h1 className='text-lg'>Credited</h1>
                  <Badge>{senderName ? `From : ${senderName}` : 'Self'}</Badge>
                  <div className='ml-auto'>
                    {'+ ₹'} {Math.abs(t.amount) / 100}
                  </div>
                </CardContent>
                <div className='ml-5 text-slate-600 text-md'>
                  {t.time.toDateString()}
                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
