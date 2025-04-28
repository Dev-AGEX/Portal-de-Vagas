"use client";

import { CONFIG } from "@/src/config/page";

interface IpropsApi {
  collection: string;
  nextTag: string[];
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: FormData | object;
}

export const apiCMS = async ({ nextTag, collection, method = "GET", body }: IpropsApi) => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};