// /api/v1/purchases POST purchase GET user purchase

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';

export async function GET(req: NextRequest) {
    try {
      const userId = req.headers.get('user-id');
  
      const purchases = await prismaClient.purchase.findMany({
        where: { userId },
        select: { id: true, course: { select: { id: true, title: true } }, expiryDate: true },
      });
  
      return NextResponse.json(purchases);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch purchases', details: error.message }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId, userId } = body;

    const course = await prismaClient.course.findUnique({ where: { id: courseId } });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const purchase = await prismaClient.purchase.create({
      data: {
        courseId,
        userId,
        purchaseDate: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentStatus: 'SUCCESS',
      },
    });

    return NextResponse.json({ message: 'Course purchased successfully', purchase });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to purchase course', details: error.message }, { status: 500 });
  }
}
