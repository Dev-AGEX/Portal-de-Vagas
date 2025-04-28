import { NextResponse, NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// Interface para o tipo de parâmetros esperado pelo Next.js
interface RouteParams {
  id: string;
}

// Interface para o contexto da rota com params como Promise
interface RouteContext {
  params: Promise<RouteParams>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const params = await context.params;
    const { id } = params;
    
    if (!process.env.NEXT_PUBLIC_DIRECTUS_API_URL || !process.env.DIRECTUS_API_TOKEN) {
      throw new Error('Variáveis de ambiente não configuradas');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DIRECTUS_API_URL}/assets/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`Falha ao buscar arquivo: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type') || 'application/pdf';
    const fileBlob = await response.blob();

    return new NextResponse(fileBlob, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'attachment; filename="curriculo.pdf"',
      },
    });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}