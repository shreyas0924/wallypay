import { PrismaClient } from '@repo/database/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { AddMoney } from '../../../components/add-money-card';
import { BalanceCard } from '../../../components/balance-card';
import { OnRampTransactions } from '../../../components/on-ramp-txn';

const prisma = new PrismaClient();

async function getBalance() {
  const session = await getServerSession(authOptions);

  let balance = await prisma.balance.findFirst({
    where: {
      userId: Number(session?.user?.id),
    },
  });

  if (!balance) {
    balance = await prisma.balance.create({
      data: {
        userId: Number(session?.user?.id),
        amount: 0,
        locked: 0,
      },
    });
  }

  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

 async function getOnRampTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  return txns.map((t) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}

export default async function () {
  const balance = await getBalance();
  const transactions = await getOnRampTransactions();

  return (
    <div className='w-screen'>
      <div className='text-4xl dark:text-gray-300 pt-8 ml-4 mb-8 font-bold'>
        Transfer
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 p-4'>
        <div>
          <AddMoney />
        </div>
        <div>
          <BalanceCard amount={balance.amount} locked={balance.locked} />
          <div className='pt-4'>
            <OnRampTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
