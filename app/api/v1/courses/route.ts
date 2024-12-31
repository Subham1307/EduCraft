// /api/v1/courses GET list of courses

import { NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';

export async function GET() {
  try {
    const courses = await prismaClient.course.findMany({
      select: { id: true, title: true, description: true, price: true },
    });

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses', details: error.message }, { status: 500 });
  }
}