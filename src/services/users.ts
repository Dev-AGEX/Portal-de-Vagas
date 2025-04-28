import { apiCMS } from "@/src/gateways/page";

export interface User {
  id: number;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  Primeiro_Nome: string;
  Sobrenome: string;
  Email: string;
  Senha: string;
  Status: "ATIVADO" | "DESATIVADO";
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const response = await apiCMS({
      collection: "auth/login",
      nextTag: ["auth"],
      method: "POST",
      body: {
        Email: email,
        Senha: password
      }
    });

    if (!response?.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
}