import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_DIRECTUS_API_URL;
    const token = process.env.DIRECTUS_API_TOKEN;
    
    if (!apiUrl || !token) {
      console.error('Missing API URL or token in environment variables');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    // Fetch candidates from both collections
    const [trabalheConoscoResponse, candidatosResponse] = await Promise.all([
      fetch(`${apiUrl}/items/trabalhe_conosco`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }),
      fetch(`${apiUrl}/items/Candidatos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })
    ]);

    if (!trabalheConoscoResponse.ok || !candidatosResponse.ok) {
      throw new Error('Failed to fetch candidates');
    }

    const trabalheConoscoData = await trabalheConoscoResponse.json();
    const candidatosData = await candidatosResponse.json();

    // Calculate total candidates
    const totalCandidatos = (trabalheConoscoData.data?.length || 0) + (candidatosData.data?.length || 0);

    return NextResponse.json({ total: totalCandidatos });

  } catch (error) {
    console.error('Erro ao buscar candidatos:', error);
    return NextResponse.json({ error: 'Falha ao buscar candidatos' }, { status: 500 });
  }
}