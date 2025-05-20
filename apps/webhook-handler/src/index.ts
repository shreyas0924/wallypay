import express from 'express';
import { PrismaClient } from '@repo/database/client';
const app = express();
const db = new PrismaClient();
app.use(express.json());


app.post('/bankWebhook', async (req, res) => {
  // Use a generic webhook endpoint
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
          // Optionally store bankAccountId if you add it to the schema
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

app.listen(3003,() => {
  console.log("webhook running");
});
