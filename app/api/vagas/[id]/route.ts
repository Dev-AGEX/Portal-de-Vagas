import { NextResponse } from 'next/server';

// Interface para o tipo de parâmetros esperado pelo Next.js
interface RouteParams {
  id: string;
}

// Interface para o contexto da rota com params como Promise
interface RouteContext {
  params: Promise<RouteParams>;
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!process.env.DIRECTUS_API_TOKEN) {
      throw new Error('API token not configured');
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_API_URL}/items/Catrastro_de_Vagas/${id}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('API Response:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to fetch vaga: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in vaga API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vaga details' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    const apiUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_API_URL}/items/Catrastro_de_Vagas/${id}`;
    
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error('Directus API error:', response.status, await response.text());
      throw new Error(`Failed to update vaga: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating vaga:', error);
    return NextResponse.json(
      { error: 'Failed to update vaga status' },
      { status: 500 }
    );
  }
}