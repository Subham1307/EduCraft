'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Upload } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock data for existing courses
const courses = [
  { id: '1', title: 'Introduction to Web Development' },
  { id: '2', title: 'Advanced JavaScript Techniques' },
  { id: '3', title: 'React.js Masterclass' },
]

export default function AddLessonPage() {
  const [courseId, setCourseId] = useState('')
  const [lessonTitle, setLessonTitle] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!courseId || !lessonTitle || !videoFile) {
      setError('Please fill in all fields and upload a video file.')
      return
    }

    // Here you would typically make an API call to add the lesson to the course
    // For this example, we'll just simulate a successful addition
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real implementation, you would upload the file to your server or a cloud storage service
      console.log('Lesson added:', { courseId, lessonTitle, videoFileName: videoFile.name })
      setSuccess(true)
      setLessonTitle('')
      setVideoFile(null)
      
      // Redirect to course list after a short delay
      setTimeout(() => router.push('/admin/courses'), 2000)
    } catch (err) {
      setError('Failed to add lesson. Please try again.')
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Add Lesson to Course</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="course">Select Course</Label>
            <Select onValueChange={(value) => setCourseId(value)}>
              <SelectTrigger id="course">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="lessonTitle">Lesson Title</Label>
            <Input
              id="lessonTitle"
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="videoUpload">Upload Video</Label>
            <div className="mt-1 flex items-center">
              <Input
                id="videoUpload"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="sr-only"
                required
              />
              <Label
                htmlFor="videoUpload"
                className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Upload className="h-4 w-4 inline-block mr-2" />
                Choose video file
              </Label>
              <span className="ml-3 text-sm text-gray-500">
                {videoFile ? videoFile.name : 'No file chosen'}
              </span>
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="bg-green-100 border-green-500 text-green-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Lesson added successfully!</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full">
            Add Lesson
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

