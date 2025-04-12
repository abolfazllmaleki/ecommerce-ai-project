// route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    const response = await fetch(
      `${process.env.BACKEND_URL}/products/${id}/increment/views`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
