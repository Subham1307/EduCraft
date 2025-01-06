import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';

export async function GET(req: NextRequest, { params }: { params: { title: string } }) {
  const encodedTitle = params.title;
  const courseTitle = decodeURIComponent(encodedTitle); // Decode the title from the URL
  // const authHeader = req.headers.get('Authorization');

  // if (!authHeader) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    // Decode the token to extract the user ID
    // const token = authHeader.split(' ')[1];
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // const userId = (decoded as { id: string }).id;

    // Fetch the course using the title
    const course = await prismaClient.course.findFirst({
      where: { title: courseTitle }, // Finds the first matching course by title
      include: { lessons: true },
    });
    
    

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if the user has purchased the course
    // const purchase = await prismaClient.purchase.findFirst({
    //   where: { userId, courseId: course.id },
    // });
    const purchase=true;

    const courseResponse = {
      id: course.id,
      title: course.title, // Include course title
      description: course.description,
      purchased: !!purchase,
      lessons: purchase
        ? course.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            videoUrl: lesson.videoUrl,
            notesUrl: lesson.notesUrl,
            createdAt: lesson.createdAt,
          }))
        : course.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title, // Only return titles if not purchased
          })),
    };

    return NextResponse.json(courseResponse);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch course details', details: error.message }, { status: 500 });
  }
}
