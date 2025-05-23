import { PrismaClient } from "@repo/database/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

const prisma = new PrismaClient();

async function getDashboardData() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const [balance, p2pTransfers, onRampTxns] = await Promise.all([
    // Get user balance
    prisma.balance.findFirst({
      where: { userId: Number(session.user.id) },
    }),
    // Get P2P transfers
    prisma.p2pTransfer.findMany({
      where: {
        OR: [
          { fromUserId: Number(session.user.id) },
          { toUserId: Number(session.user.id) },
        ],
      },
      orderBy: { timestamp: 'desc' },
      include: {
        fromUser: true,
        toUser: true,
      },
    }),
    // Get OnRamp transactions
    prisma.onRampTransaction.findMany({
      where: { userId: Number(session.user.id) },
      orderBy: { startTime: 'desc' },
    }),
  ]);

  return {
    balance,
    p2pTransfers,
    onRampTxns,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  
  return <DashboardClient data={data} />;
}
