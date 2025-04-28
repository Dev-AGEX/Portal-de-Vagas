import { NextResponse } from 'next/server';

type WithPromise<T> = {
  params: Promise<T>;
};

export async function PATCH(
  request: Request,
  context: WithPromise<{ id: string }>
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
        status_do_curriculo: body.status_do_curriculo
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: 'Falha ao atualizar status do currículo' },
        { status: response.status }
      );
    }

    const updatedCandidate = await response.json();
    return NextResponse.json(updatedCandidate.data);
    
  } catch (error) {
    console.error('Erro ao atualizar status do currículo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}