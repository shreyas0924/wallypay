import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { PrismaClient } from "@repo/database/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { provider, accountNumber, ifsc } = await req.json();
  if (!provider || !accountNumber || !ifsc) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const account = await prisma.bankAccount.create({
    data: {
      userId: Number(session.user.id),
      provider,
      accountNumber,
      ifsc,
    },
  });
  return NextResponse.json(account);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const accounts = await prisma.bankAccount.findMany({
    where: { userId: Number(session.user.id) },
  });
  return NextResponse.json(accounts);
}