// /api/v1/courses GET list of courses

import { NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';
import { getServerSession } from 'next-auth';

export async function GET() {
  const session = await getServerSession();
  console.log("session is ",session)
  try {
    const courses = await prismaClient.course.findMany({
      select: { id: true, title: true, description: true, price: true },
    });

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses', details: error.message }, { status: 500 });
  }
}