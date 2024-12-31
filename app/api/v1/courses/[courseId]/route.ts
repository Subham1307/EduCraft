// /api/v1/courses/[courseId] GET details of specific course based on purchased or not
import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';
import jwt from 'jsonwebtoken';

 
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const courseId = params.id;
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Decode the token to extract the user ID
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as { id: string }).id;

    // Fetch the course
    const course = await prismaClient.course.findUnique({
      where: { id: courseId },
      include: { lessons: true },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if the user has purchased the course
    const purchase = await prismaClient.purchase.findFirst({
      where: { userId, courseId },
    });

    if (!purchase) {
      // User hasn't purchased the course; return only lesson titles
      const lessonTitles = course.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
      }));

      return NextResponse.json({
        id: course.id,
        title: course.title,
        description: course.description,
        purchased: false,
        lessons: lessonTitles,
      });
    }

    // User has purchased the course; return full lesson details
    const lessons = course.lessons.map(lesson  => ({
      id: lesson.id,
      title: lesson.title,
      videoUrl: lesson.videoUrl,
      notesUrl: lesson.notesUrl,
      createdAt: lesson.createdAt,
    }));

    return NextResponse.json({
      id: course.id,
      title: course.title,
      description: course.description,
      purchased: true,
      lessons,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch course details', details: error.message }, { status: 500 });
  }
}
