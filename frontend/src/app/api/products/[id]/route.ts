// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Validate parameter after proper destructuring
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    console.log("are we connected???");
    // Use your actual Nest.js backend URL
    const backendUrl = `http://localhost:3000/products/${id}`;

    const response = await fetch(backendUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: response.status }
      );
    }

    const product = await response.json();
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
