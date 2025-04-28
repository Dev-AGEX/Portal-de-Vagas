import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vagaTitle = searchParams.get('vaga');
    const fileId = searchParams.get('fileId');

    // If fileId is present, handle file download
    if (fileId) {
      const fileResponse = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_API_URL}/assets/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
        },
      });

      if (!fileResponse.ok) {
        throw new Error('Failed to fetch file');
      }

      const fileBlob = await fileResponse.blob();
      return new NextResponse(fileBlob, {
        headers: {
          'Content-Type': fileResponse.headers.get('Content-Type') || 'application/pdf',
          'Content-Disposition': `attachment; filename="curriculo.pdf"`,
        },
      });
    }

    // Regular candidates fetch logic
    const apiUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_API_URL}/items/Candidatos`;
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch candidates: ${response.status}`);
    }

    const data = await response.json();

    if (vagaTitle) {
      const filteredData = data.data.filter((candidate: any) => 
        candidate.vaga === vagaTitle
      );
      return NextResponse.json({ data: filteredData });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in candidates API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}