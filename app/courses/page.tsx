'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Sample course data (replace with actual data from your backend)
const courses = [
  { id: 1, title: 'Introduction to Web Development', price: 49.99, image: '/placeholder.svg?height=200&width=300' },
  { id: 2, title: 'Advanced JavaScript Techniques', price: 79.99, image: '/placeholder.svg?height=200&width=300' },
  { id: 3, title: 'React.js Masterclass', price: 99.99, image: '/placeholder.svg?height=200&width=300' },
  { id: 4, title: 'Node.js and Express.js Fundamentals', price: 69.99, image: '/placeholder.svg?height=200&width=300' },
  { id: 5, title: 'Python for Data Science', price: 89.99, image: '/placeholder.svg?height=200&width=300' },
  { id: 6, title: 'Machine Learning Basics', price: 129.99, image: '/placeholder.svg?height=200&width=300' },
]

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function CoursesPage() {
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
              src={course.image}
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

