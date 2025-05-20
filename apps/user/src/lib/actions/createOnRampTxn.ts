'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { PrismaClient } from '@repo/database/client';
import axios from 'axios';

const prisma = new PrismaClient();
export async function createOnRampTransaction(
  provider: string,
  amount: number,
  selectedAccountId: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: 'Unauthenticated request',
    };
  }
  const token = (Math.random() * 1000).toString();

  await prisma.onRampTransaction.create({
    data: {
      provider,
      status: 'Processing',
      startTime: new Date(),
      token: token,
      userId: Number(session?.user?.id),
      amount: amount * 100,
    },
  });

  try {
    await axios.post(`${process.env.WEBHOOK_URL}/bankWebhook`, {
      token: token,
      user_identifier: session.user.id,
      amount: (amount * 100).toString(),
      selectedAccountId: selectedAccountId,
      provider: provider
    });
  } catch (error) {
    console.error('Error triggering webhook:', error);
  }

  return {
    message: 'Done',
  };
}
