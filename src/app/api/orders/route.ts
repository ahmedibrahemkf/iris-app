import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(orders);
  } catch(error) {
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
