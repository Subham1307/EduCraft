// /api/v1/admin/courses POST new course

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, price } = body;

    if (!title || !description || !price) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await prismaClient.course.create({
      data: { title, description, price },
    });

    return NextResponse.json({ message: 'Course added successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add course', details: error.message }, { status: 500 });
  }
}
