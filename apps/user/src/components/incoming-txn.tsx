import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';

export const IncomingTransactions = ({
  addBalanceTxn,
  p2pTxn,
}: {
  addBalanceTxn: {
    time: Date;
    amount: number;
  }[];
  p2pTxn: {
    time: Date;
    amount: number;
  }[];
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
    <Card>
      <CardHeader>
        <CardTitle>Incoming Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='pt-2'>
          {allTransactions.map((t, index) => (
            <Card key={index} className='py-3 my-2'>
              <CardContent className='flex'>
                <h1 className='text-lg'>Credited</h1>
                <div className='ml-auto'>
                  {'+ ₹'} {Math.abs(t.amount) / 100}
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
