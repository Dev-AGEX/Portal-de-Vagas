import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_API_URL}/items/trabalhe_conosco/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        STATUS_DOS_CURRICULO: status
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update status');
    }

    const updatedCurriculo = await response.json();
    return NextResponse.json(updatedCurriculo);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}