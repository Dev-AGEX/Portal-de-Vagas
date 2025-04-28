const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_API_URL;

export interface TrabalheConosco {
  id: number;
  date_created: string;
  date_updated: string | null;
  nome: string;
  email: string;
  celular: string;
  cpf: string;
  pretensao_salarial: string;
  Cidades_onde_reside: string;
  Area_onde_atua: string;
  curriculo: string;
  STATUS_DOS_CURRICULO: string;
}

export async function getTrabalheConosco(): Promise<TrabalheConosco[]> {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/trabalhe_conosco`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
}

export async function getTrabalheConoscoById(id: number): Promise<TrabalheConosco | null> {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/trabalhe_conosco/${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

export async function getCurriculosByStatus(status: string): Promise<TrabalheConosco[]> {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/trabalhe_conosco?filter[STATUS_DOS_CURRICULO][_eq]=${status}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
}