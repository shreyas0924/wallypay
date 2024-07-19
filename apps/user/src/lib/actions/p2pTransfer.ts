"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { PrismaClient } from "@repo/database/client";

const prisma = new PrismaClient();

export async function p2pTransfer(toNumber: string, amount: number) {
  const session = await getServerSession(authOptions);
  const fromUser = session?.user?.id;
  if (!fromUser) {
    return {
      message: "Error while sending",
    };
  }
  const toUser = await prisma.user.findFirst({
    where: {
      number: toNumber,
    },
  });

  if (!toUser) {
    return {
      message: "User not found",
    };
  }
  await prisma.$transaction(async (tx: any) => {
    //If we use FOR UPDATE here, we can ensure that the balance is not changed by another user in between the
    //time we check the balance and the time we update it. It'll create a lock and the second txn will run only
    //after the first
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(fromUser)} FOR UPDATE`;

    const fromBalance = await tx.balance.findUnique({
      where: { userId: Number(fromUser) },
    });
    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error("Insufficient funds");
    }

    await tx.balance.update({
      where: { userId: Number(fromUser) },
      data: { amount: { decrement: amount } },
    });

    await tx.balance.update({
      where: { userId: toUser.id },
      data: { amount: { increment: amount } },
    });

    await tx.p2pTransfer.create({
      data: {
        fromUserId: Number(fromUser),
        toUserId: toUser.id,
        amount,
        timestamp: new Date(),
      },
    });
  });
}
