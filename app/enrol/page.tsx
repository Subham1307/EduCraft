'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Course {
  id: string;
  title: string;
  price: number;
}

const PaymentPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/v1/courses');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data);
      } catch (err: any) {
        console.error("Unable to load courses",err)
        setError('Failed to load courses. Please try again later.');
      }
    };

    fetchCourses();
  }, []);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    const course = courses.find(c => c.id === courseId);
    if (course) setAmount(course.price.toString());
  };

  const verifyPayment = async (response: any) => {
    try {
      const res = await fetch('/api/v1/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          courseId: selectedCourse,
          userId: 'user_12345', // Replace with actual user ID
        }),
      });
  
      const result = await res.json();
  
      if (result.success) {
        // setSuccess(true);
        // setTimeout(() => {
        //   router.push(`/courses/${selectedCourse}`);
        // }, 3000); // Redirect to course page
      } else {
        setError(result.message || 'Payment verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'Payment verification failed');
    }
  };
  

  const handlePayment = async () => {
    if (!selectedCourse) {
      setError('Please select a course');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100, // Amount in paise
          userId: 'user_12345', // Replace with actual user ID
          courseId: selectedCourse,
        }),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'EduPro',
        description: 'Course Payment',
        order_id: order.id,
        handler: verifyPayment,
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Make Payment</h1>
        <div className="space-y-6">
          <div>
            <Label htmlFor="course">Select Course</Label>
            <Select onValueChange={handleCourseChange}>
              <SelectTrigger id="course">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title} - ₹{course.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Amount (INR)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              readOnly
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button onClick={handlePayment} className="w-full" disabled={loading || !selectedCourse}>
            {loading ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;
