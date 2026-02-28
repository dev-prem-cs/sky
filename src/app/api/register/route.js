import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/app/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    // 1. Extract the data from the incoming request
    const { name, email, username, password } = await req.json();

    // 2. Basic Validation: Make sure they didn't leave anything blank
    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // 3. Connect to the database
    await connectMongoDB();

    // 4. Check for duplicates! We can't have two users with the same email OR username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email or username already exists." },
        { status: 409 } // 409 means "Conflict"
      );
    }

    // 5. Hash the password for security (10 is the number of "salt rounds")
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Save the brand new user to MongoDB!
    await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // 7. Send a success message back to the frontend
    return NextResponse.json(
      { message: "User registered successfully!" },
      { status: 201 } // 201 means "Created"
    );

  } catch (error) {
    console.error("Error during registration: ", error);
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 } // 500 means "Server Error"
    );
  }
}