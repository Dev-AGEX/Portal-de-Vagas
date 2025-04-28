import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_API_URL}/items/Catrastro_de_Vagas`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: {
        revalidate: 0
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch vagas: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error in vagas API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vagas' },
      { status: 500 }
    );
  }
}