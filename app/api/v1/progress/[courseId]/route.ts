// /api/v1/progress/[courseId] get progress of that course

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  const { courseId } = params;

  try {
    const progress = await prismaClient.progress.findFirst({
      where: { courseId },
      select: { lessonsCompleted: true, course: { select: { lessons: true } } },
    });

    if (!progress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 });
    }

    return NextResponse.json({
      courseId,
      lessonsCompleted: progress.lessonsCompleted,
      totalLessons: progress.course.lessons.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress', details: error.message }, { status: 500 });
  }
}
