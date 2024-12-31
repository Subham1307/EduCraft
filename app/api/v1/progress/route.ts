// /api/v1/progress PUT update progress

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as { id: string }).id;

    const body = await req.json();
    const { courseId, lessonId, completed } = body;

    // Input validation
    if (!courseId || !lessonId || typeof completed !== 'boolean') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Verify the course exists
    const course = await prismaClient.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Verify the lesson exists and belongs to the course
    const lesson = await prismaClient.lesson.findFirst({
      where: { id: lessonId, courseId },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found in the specified course' }, { status: 404 });
    }

    // Check if the user has purchased the course
    const purchase = await prismaClient.purchase.findFirst({
      where: { userId, courseId },
    });

    if (!purchase) {
      return NextResponse.json({ error: 'Course not purchased' }, { status: 403 });
    }

    // Check if the access is still valid
    const isAccessValid = new Date(purchase.expiryDate) > new Date();
    if (!isAccessValid) {
      return NextResponse.json({ error: 'Course access expired' }, { status: 403 });
    }

    // Update or create progress entry
    const progress = await prismaClient.progress.upsert({
      where: {
        userId_courseId_lessonId: {
          userId,
          courseId,
          lessonId,
        },
      },
      update: {
        completed,
      },
      create: {
        userId,
        courseId,
        lessonId,
        completed,
      },
    });

    return NextResponse.json({
      message: 'Progress updated successfully',
      progress,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update progress', details: error.message }, { status: 500 });
  }
}
