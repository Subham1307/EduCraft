'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

// Sample course data (replace with actual data fetched from your backend)
const coursesData = {
  '1': {
    id: 1,
    title: 'Introduction to Web Development',
    price: 49.99,
    image: '/placeholder.svg?height=400&width=600',
    lessons: [
      { id: 1, title: 'HTML Basics', duration: '1h 30m' },
      { id: 2, title: 'CSS Fundamentals', duration: '2h 15m' },
      { id: 3, title: 'JavaScript Essentials', duration: '3h 00m' },
      { id: 4, title: 'Responsive Web Design', duration: '2h 45m' },
      { id: 5, title: 'Introduction to Web Accessibility', duration: '1h 30m' },
    ]
  },
  // Add more courses as needed
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function CoursePage() {
  const params = useParams()
  const courseId = params.id as string
  const course = coursesData[courseId]

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center">Course not found</div>
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
            {course.lessons.map((lesson, index) => (
              <motion.li 
                key={lesson.id}
                className="bg-card text-card-foreground p-4 rounded-lg shadow"
                variants={fadeIn}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="font-semibold">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground">{lesson.duration}</p>
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
              src={course.image}
              alt={course.title}
              width={600}
              height={400}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <p className="text-3xl font-bold text-primary mb-4">${course.price.toFixed(2)}</p>
              <Button className="w-full">Enroll Now</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

