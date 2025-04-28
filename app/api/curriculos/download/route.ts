import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_API_URL}/assets/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const contentType = response.headers.get('content-type');
    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'curriculo';

    // Extract filename from content-disposition if available
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    // Add file extension based on content type
    if (contentType?.includes('pdf')) {
      filename += '.pdf';
    } else if (contentType?.includes('word')) {
      filename += '.doc';
    } else if (contentType?.includes('officedocument')) {
      filename += '.docx';
    }

    const blob = await response.blob();
    
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}