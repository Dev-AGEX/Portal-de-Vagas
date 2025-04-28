import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_DIRECTUS_API_URL;
    const token = process.env.DIRECTUS_API_TOKEN;
    const collectionName = 'Catrastro_de_Vagas';
    
    if (!apiUrl || !token) {
      console.error('Missing API URL or token in environment variables');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    // Get the type parameter from the URL
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'active') {
      // Fetch all vagas for active count
      const response = await fetch(`${apiUrl}/items/${collectionName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const activeVagas = data.data.filter((vaga: any) => vaga.Status_da_vaga === "PUBLICADO");
      
      return NextResponse.json({ total: activeVagas.length });
    }

    // Default behavior: fetch recent vagas
    const urldata = await fetch(`${apiUrl}/items/${collectionName}?sort=-date_created&limit=3`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!urldata.ok) {
      throw new Error(`HTTP error! status: ${urldata.status}`);
    }

    const data = await urldata.json();
    const formattedVagas = data.data?.map((vaga: any) => ({
      id: vaga.id,
      titulo: vaga.Titulo || "Sem título",
      departamento: vaga.Departamento || "Não especificado",
      localidade: vaga.Local_da_vaga || "Não especificado",
      status: vaga.Status_da_vaga || "Desconhecido",
      date_created: vaga.date_created
    })) || [];
    
    return NextResponse.json(formattedVagas);
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    return NextResponse.json({ error: 'Falha ao buscar vagas' }, { status: 500 });
  }
}