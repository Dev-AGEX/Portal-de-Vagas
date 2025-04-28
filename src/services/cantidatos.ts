export interface Candidato {
  id: number;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  Nome: string;
  email: string;
  telefone: string;
  cpf: string;
  pretensao_salarial: string;
  cidade: string;
  mensagem: string;
  vaga: string;
  local_da_vaga: string;
  status_do_canditado: string;
  curriculo: string;
  status_do_curriculo: string;
}

export async function getCandidatosByVaga(vagaTitle: string): Promise<Candidato[]> {
  try {
    const response = await fetch(`/api/candidatos?vaga=${encodeURIComponent(vagaTitle)}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch candidates');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
}

export async function updateCandidatoStatus(candidatoId: number, newStatus: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_API_URL}/items/Candidatos/${candidatoId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status_do_canditado: newStatus
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Error updating candidate status:', error);
    return false;
  }
}

export async function downloadCurriculo(curriculoId: string): Promise<Blob | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_API_URL}/assets/${curriculoId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to download curriculum');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading curriculum:', error);
    return null;
  }
}

export async function getCandidatesCount(vagaTitle: string): Promise<number> {
  try {
    const candidates = await getCandidatosByVaga(vagaTitle);
    return candidates.length;
  } catch (error) {
    console.error('Error getting candidates count:', error);
    return 0;
  }
}