import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const RAZORPAY_SECRET_KEY = process.env.RAZORPAY_SECRET_KEY!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment details' },
        { status: 400 }
      );
    }

    // Verify the Razorpay signature
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Update the purchase in your database
    await updateUserPurchase(userId, courseId);

    return NextResponse.json(
      { success: true, message: 'Payment verified and purchase updated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Function to update user's purchase in the database
async function updateUserPurchase(userId: string, courseId: string) {
  // Replace this with actual database logic, e.g., using Prisma
  console.log(`Database updated: User ${userId} now owns Course ${courseId}`);
}
