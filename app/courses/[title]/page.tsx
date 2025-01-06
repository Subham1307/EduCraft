'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function CoursePage() {
  const params = useParams();
  const courseTitle = params.title
    ? Array.isArray(params.title)
      ? encodeURIComponent(params.title[0])
      : encodeURIComponent(params.title)
    : null; // Use `null` instead of `undefined` for consistency

  const [course, setCourse] = useState<any>(null); // Replace `any` with the actual course type if available
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      if (!courseTitle) {
        setError('Invalid course title');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/v1/courses/${courseTitle}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch course details');
        }
        const data = await response.json();
        setCourse(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseTitle]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center">Course not found</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {course.title}
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          className="order-2 md:order-1"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-2xl font-semibold mb-4">Course Lessons</h2>
          <ul className="space-y-4">
            {course.lessons.map((lesson: any, index: number) => (
              <motion.li
                key={lesson.id}
                className="bg-card text-card-foreground p-4 rounded-lg shadow"
                variants={fadeIn}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-semibold">{lesson.title}</h3>
                {lesson.duration && (
                  <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                )}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          className="order-1 md:order-2"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-lg">
            <Image
              src={course.image || '/placeholder.svg'}
              alt={course.title}
              width={600}
              height={400}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              {course.price && (
                <p className="text-3xl font-bold text-primary mb-4">
                  ${course.price.toFixed(2)}
                </p>
              )}
              <Button className="w-full">Enroll Now</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
