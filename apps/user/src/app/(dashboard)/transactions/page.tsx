import React from 'react';
import { IncomingTransactions } from '../../../components/incoming-txn';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { PrismaClient } from '@repo/database/client';
import { OutgoingTransactions } from '../../../components/outgoing-txn';
const prisma = new PrismaClient();

async function getAddBalanceTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id),
      status: 'Success',
    },
  });
  return txns.map((t) => ({
    time: t.startTime,
    amount: t.amount,
  }));
}

async function getP2PTransactionsIncoming() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      toUserId: {
        equals: Number(session?.user?.id),
      },
    },
  });
  return txns.map((t) => {
    return {
      time: t.timestamp,
      amount: t.amount,
    };
  });
}
async function getP2PTransactionsOutgoing() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      fromUserId: {
        equals: Number(session?.user?.id),
      },
    },
  });
  return txns.map((t) => {
    return {
      time: t.timestamp,
      amount: t.amount,
    };
  });
}
const Transactions = async () => {
  return (
    <div className='flex gap-4'>
      <IncomingTransactions
        addBalanceTxn={await getAddBalanceTransactions()}
        p2pTxn={await getP2PTransactionsIncoming()}
      />
      <OutgoingTransactions p2pTxn={await getP2PTransactionsOutgoing()} />
    </div>
  );
};

export default Transactions;
