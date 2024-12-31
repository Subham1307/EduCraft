'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'


const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

// Define Course type
type Course = {
    id: number;
    title: string;
    description: string;
    price: number;
  };

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]); // Use Course type for state

  // Fetch courses function
  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/v1/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data: Course[] = await response.json(); // Type the fetched data
      setCourses(data); // Update the state with fetched courses
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Use useEffect to fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []); // Empty dependency array ensures it runs only once


  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        className="text-4xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Our Courses
      </motion.h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-lg"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.1 }}
          >
            <Image
              src={'course.thumbnail'}
              alt={course.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-2xl font-bold text-primary mb-4">${course.price.toFixed(2)}</p>
              <Button asChild className="w-full">
                <Link href={`/courses/${course.id}`}>View Course</Link>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

