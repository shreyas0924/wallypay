import express from 'express';
import { PrismaClient } from '@repo/database/client';
import cron from 'node-cron';
const app = express();
const db = new PrismaClient();
app.use(express.json());


app.post('/bankWebhook', async (req, res) => {
  const paymentInformation: {
    token: string;
    userId: string;
    amount: string;
    selectedAccountId?: string; 
    provider?: string;
  } = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
    selectedAccountId: req.body.selectedAccountId,
    provider: req.body.provider,
  };

  try {
    await db.$transaction([
      db.balance.updateMany({
        where: {
          userId: Number(paymentInformation.userId),
        },
        data: {
          amount: {
            increment: Number(paymentInformation.amount),
          },
        },
      }),
      db.onRampTransaction.updateMany({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: 'Success',
          provider: paymentInformation.provider,
          ...(paymentInformation.selectedAccountId && { bankAccountId: Number(paymentInformation.selectedAccountId) }),
        },
      }),
    ]);

    res.json({
      message: 'Captured',
    });
  } catch (e) {
    console.error(e);
    res.status(411).json({
      message: 'Error while processing webhook',
    });
  }
});

cron.schedule('*/120 * * * *', async () => {
  try {
    const processingTxns = await db.onRampTransaction.findMany({
      where: { status: 'Processing' },
    });
    if (processingTxns.length > 0) {
      console.log(`Found ${processingTxns.length} processing transaction(s). Retrying...`);
      for (const txn of processingTxns) {
        try {
          await db.$transaction([
            db.balance.updateMany({
              where: { userId: txn.userId },
              data: {
                amount: { increment: txn.amount },
              },
            }),
            db.onRampTransaction.updateMany({
              where: { token: txn.token },
              data: {
                status: 'Success',
                provider: txn.provider,
                ...(txn.bankAccountId && { bankAccountId: txn.bankAccountId }),
              },
            }),
          ]);
          console.log(`Retried txn ${txn.token} successfully`);
        } catch (err) {
          console.error(`Retry failed for txn ${txn.token}:`, err);
        }
      }
    } else {
      console.log("No processing transactions to retry");
    }
  } catch (e) {
    console.error("Error checking processing transactions:", e);
  }
});

app.listen(3003,() => {
  console.log("webhook running");
});
