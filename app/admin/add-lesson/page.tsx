'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Upload, Loader } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSignedURL } from '@/app/create/actions';

const MAX_VIDEO_SIZE_MB = 100;

// TypeScript type for the course object
type Course = {
  id: string;
  title: string;
};

const fetchCourses = async (): Promise<Course[]> => {
  try {
    const response = await fetch('/api/v1/courses');
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

const calculateChecksum = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const hashBuffer = crypto.subtle.digest('SHA-256', buffer);
      hashBuffer.then((hash) => {
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

export default function AddLessonPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | undefined>();
  const [notification, setNotification] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      const fetchedCourses = await fetchCourses();
      setCourses(fetchedCourses);
    };
    loadCourses();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setVideoFile(undefined);
      return;
    }

    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      setNotification({ type: 'error', message: `File size must not exceed ${MAX_VIDEO_SIZE_MB}MB.` });
      return;
    }

    if (!file.type.startsWith('video/')) {
      setNotification({ type: 'error', message: 'Please upload a valid video file.' });
      return;
    }

    setVideoFile(file);
    setNotification(null); // Clear any previous error
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null); // Clear previous notifications

    if (!courseId || !lessonTitle || !videoFile) {
      setNotification({ type: 'error', message: 'Please fill in all fields and upload a video file.' });
      return;
    }

    setLoading(true);

    try {
      // Calculate checksum
      const checksum = await calculateChecksum(videoFile);

      // Get signed URL
      const signedUrlResult = await getSignedURL(videoFile.type, checksum, courseId, lessonTitle);
      if (!signedUrlResult?.success?.url) {
        throw new Error('Failed to get a signed URL. Please try again.');
      }

      const url = signedUrlResult.success.url;

      // Upload file to S3
      await fetch(url, {
        method: 'PUT',
        body: videoFile,
        headers: {
          'Content-Type': videoFile.type,
        },
      });

      setNotification({ type: 'success', message: 'Lesson added successfully!' });
      setLessonTitle('');
      setVideoFile(undefined);

      // Optionally redirect after success
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Failed to add lesson. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

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
            <Select onValueChange={(value) => setCourseId(value)} required>
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
              <span className="ml-3 text-sm text-gray-500">{videoFile ? videoFile.name : 'No file chosen'}</span>
            </div>
          </div>
          {notification && (
            <Alert
              variant={notification.type === 'error' ? 'destructive' : 'default'}
              className={notification.type === 'success' ? 'bg-green-100 border-green-500 text-green-800' : ''}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{notification.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Adding Lesson...
              </>
            ) : (
              'Add Lesson'
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
