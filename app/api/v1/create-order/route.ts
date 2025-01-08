import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay"

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

  

export async function POST(req: NextRequest) {
    const body = await req.json(); // Parse the request body as JSON
    const { amount, userId, courseId } = body; // Destructure the relevant fields

    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const order = await razorpay.orders.create({
            amount, // Amount in paise (e.g., ₹100 = 10000 paise)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: true,
            notes: {
                userId,
                courseId,
            },
        });
        return NextResponse.json({ order: order }, { status: 200 })
    } catch (error) {
        console.error("Error doing payement", error)
        return NextResponse.json(
            { error: "Error purchasing the course" },
            { status: 500 }
        )
    }
}