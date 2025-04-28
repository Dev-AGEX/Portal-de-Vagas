import { NextResponse } from 'next/server';

// Interface para o tipo de parâmetros esperado pelo Next.js
interface RouteParams {
  id: string;
}

// Interface para o contexto da rota com params como Promise
interface RouteContext {
  params: Promise<RouteParams>;
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_API_URL}/items/Candidatos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
      },
      body: JSON.stringify({
        status_do_canditado: body.status_do_canditado
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: 'Falha ao atualizar status do candidato' },
        { status: response.status }
      );
    }

    const updatedCandidate = await response.json();
    return NextResponse.json(updatedCandidate.data);
    
  } catch (error) {
    console.error('Erro ao atualizar status do candidato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}