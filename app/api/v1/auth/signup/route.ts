import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prismaClient } from "@/app/lib/db"; // Adjust the import based on your Prisma client setup

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { email, password, name } = await req.json();

    // debug
    console.log("email = ",email)
    console.log("name = ",name)
    console.log("password = ",password)

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
    console.log("hashed password = ",hashedPassword)

    // Create a new user in the database
    await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Respond with the token and redirect URL (e.g., dashboard)
    return NextResponse.json(
      {
        message: "User created successfully",
        redirectUrl: "/login" // You can modify this to any page you want
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
