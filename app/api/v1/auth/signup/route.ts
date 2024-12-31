import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prismaClient } from "@/app/lib/db"; // Adjust the import based on your Prisma client setup

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { email, password, name } = await req.json();

    // Validate the required fields
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user in the database
    const user = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!, // Ensure this environment variable is set
      { expiresIn: "1h" } // Token expiration (1 hour, adjust as needed)
    );

    // Respond with the token and redirect URL (e.g., dashboard)
    return NextResponse.json(
      {
        message: "User created successfully",
        token, // Send the token back to the frontend
        redirectUrl: "/courses" // You can modify this to any page you want
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
