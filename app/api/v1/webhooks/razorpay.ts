import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prismaClient } from '@/app/lib/db';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-razorpay-signature');
  const body = await req.text(); // Retrieve raw body as text for signature verification

  // Verify webhook authenticity
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const payload = JSON.parse(body);
  const event = payload.event;

  if (event === 'order.paid') {
    const payment = payload.payload.payment.entity;
    const { userId, courseId } = payment.notes; // Assuming you send userId & courseId in the `notes` field

    console.log(`User ${userId} purchased course ${courseId}`);

    // Update your database with the purchase
    try {
      // Example: Add course to the user's purchases
      await updateUserPurchase(userId, courseId);
      return NextResponse.json({ message: 'Purchase recorded' });
    } catch (err) {
      console.error('Error updating purchase:', err);
      return NextResponse.json({ error: 'Failed to record purchase' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Unhandled event' }, { status: 400 });
  }
}

// Mock function to update user's purchase in the database
async function updateUserPurchase(userId: string, courseId: string) {
    try {
      // Check if the user and course exist
      const user = await prismaClient.user.findUnique({ where: { id: userId } });
      const course = await prismaClient.course.findUnique({ where: { id: courseId } });
  
      if (!user) {
        throw new Error(`User with ID ${userId} does not exist`);
      }
      if (!course) {
        throw new Error(`Course with ID ${courseId} does not exist`);
      }
  
      // Create a new purchase
      const purchase = await prismaClient.purchase.create({
        data: {
          userId,
          courseId,
          expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1-year expiry
          paymentStatus: "SUCCESS", // Assuming payment is successful
        },
      });
  
      console.log(`Purchase created successfully:`, purchase);
      return purchase;
    } catch (error) {
      console.error(`Error updating purchase:`, error);
      throw error;
    }
  }
