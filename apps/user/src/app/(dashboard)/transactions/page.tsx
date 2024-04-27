import React from 'react';
import { IncomingTransactions } from '../../../components/incoming-txn';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { PrismaClient } from '@repo/database/client';
import { OutgoingTransactions } from '../../../components/outgoing-txn';

const prisma = new PrismaClient();
type Transaction = {
  toUser: {
    number: string;
    name: string | null;
  };
  id: number;
  amount: number;
  timestamp: Date;
  fromUserId: number;
  toUserId: number;
};
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
    fromId: t.userId,
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
    include: {
      fromUser: {
        select: {
          name: true,
          number: true,
        },
      },
    },
  });

  return txns.map((t) => {
    return {
      time: t.timestamp,
      amount: Number(t.amount),
      fromId: t.fromUserId,
      toUserName: session?.user?.name,
      fromUserName: t.fromUser?.name ?? 'Unnamed',
      fromUserNumber: t.fromUser.number,
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
    include: {
      toUser: {
        select: {
          name: true,
          number: true,
        },
      },
    },
  });
  return txns.map((t: Transaction) => {
    return {
      time: t.timestamp,
      amount: t.amount,
      toUserName: t.toUser.name ?? '',
      toUserNumber: t.toUser.number,
    };
  });
}

const Transactions = async () => {
  return (
    <div className='w-full flex flex-wrap '>
      <IncomingTransactions
        addBalanceTxn={await getAddBalanceTransactions()}
        p2pTxn={await getP2PTransactionsIncoming()}
      />
      <OutgoingTransactions p2pTxn={await getP2PTransactionsOutgoing()} />
    </div>
  );
};

export default Transactions;
