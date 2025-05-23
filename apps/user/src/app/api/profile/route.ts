import { PrismaClient } from "@repo/database/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    select: {
      id: true,
      email: true,
      name: true,
      number: true,
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { name, email } = data;

  const user = await prisma.user.update({
    where: { id: Number(session.user.id) },
    data: {
      name: name || undefined,
      email: email || undefined,
    },
    select: {
      id: true,
      email: true,
      name: true,
      number: true,
    },
  });

  return NextResponse.json(user);
}