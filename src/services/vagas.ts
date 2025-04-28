import { apiCMS } from "@/src/gateways/page";

export interface Vaga {
  id: number;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  Titulo: string;
  Local_da_vaga: string;
  Status_da_vaga: "PUBLICADO" | "RASCUNHO" | "ARQUIVADA";
  Descricao_da_vaga: string;
}

export interface VagasResponse {
  data: Vaga[];
}

export async function getVagas(): Promise<Vaga[]> {
  try {
    const response = await fetch('/api/vagas', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching vagas:", error);
    throw error;
  }
}

export async function getVagaById(id: number): Promise<Vaga | null> {
  try {
    const response = await apiCMS({
      collection: `Catrastro_de_Vagas/${id}`,
      nextTag: [`vaga-${id}`],
    });
    
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching vaga ${id}:`, error);
    throw error;
  }
}

export async function getPublicVagas(): Promise<Vaga[]> {
  try {
    const response = await apiCMS({
      collection: "Catrastro_de_Vagas",
      nextTag: ["vagas-public"],
      method: "GET",
    });
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching public vagas:", error);
    throw error;
  }
}