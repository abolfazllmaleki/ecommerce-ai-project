import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  // Simulating user creation (replace with database logic)
  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "User registered successfully" },
    { status: 200 }
  );
}
