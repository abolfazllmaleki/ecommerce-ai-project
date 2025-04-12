import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("to here...");
    const response = await fetch(`${process.env.BACKEND_URL}/products/${params.id}`);

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const product = await response.json();
    return NextResponse.json(product);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
