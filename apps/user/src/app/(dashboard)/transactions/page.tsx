import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { PrismaClient } from '@repo/database/client';
import { TransactionsClient } from './TransactionsClient';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

async function getTransactions() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  const userId = Number(session.user.id);

  const [onRampTxns, p2pIncoming, p2pOutgoing] = await Promise.all([
    // Get OnRamp transactions
    prisma.onRampTransaction.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      // Remove or replace 'bankAccount' with the correct relation if it exists in your schema
      // include: {
      //   bankAccount: true,
      // }
    }),
    // Get incoming P2P
    prisma.p2pTransfer.findMany({
      where: { toUserId: userId },
      orderBy: { timestamp: 'desc' },
      include: {
        fromUser: {
          select: { name: true, number: true }
        }
      }
    }),
    // Get outgoing P2P
    prisma.p2pTransfer.findMany({
      where: { fromUserId: userId },
      orderBy: { timestamp: 'desc' },
      include: {
        toUser: {
          select: { name: true, number: true }
        }
      }
    })
  ]);

  return {
    onRamp: onRampTxns,
    incoming: p2pIncoming,
    outgoing: p2pOutgoing
  };
}

export default async function TransactionsPage() {
  const transactions = await getTransactions();
  return <TransactionsClient transactions={transactions} />;
}
