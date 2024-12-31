/api/v1/admin/courses/[courseId]/lessons

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const courseId = params.id;
    const body = await req.json();
    const { title, videoUrl, notesUrl } = body;

    if (!title || !videoUrl) {
      return NextResponse.json({ error: 'Title and video URL are required' }, { status: 400 });
    }

    await prismaClient.lesson.create({
      data: { title, videoUrl, notesUrl, courseId },
    });

    return NextResponse.json({ message: 'Lesson added successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add lesson', details: error.message }, { status: 500 });
  }
}
