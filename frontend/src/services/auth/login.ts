import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Simulating login validation (replace with database check)
  if (email === "user@example.com" && password === "password123") {
    return NextResponse.json(
      { access_token: "fake-jwt-token" },
      { status: 200 }
    );
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
