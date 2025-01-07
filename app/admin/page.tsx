'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { PlusCircle, BookOpen } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <Card>
              <CardHeader>
                <CardTitle>Add New Course</CardTitle>
                <CardDescription>Create a new course for your platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/add-course">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Course
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Add New Lesson</CardTitle>
                <CardDescription>Add a lesson to an existing course</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/add-lesson">
                    <BookOpen className="mr-2 h-4 w-4" /> Add Lesson
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

