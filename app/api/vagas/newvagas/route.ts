import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_API_URL;
const COLLECTION = "Catrastro_de_Vagas";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const currentDate = new Date().toISOString();
    
    const payload = {
      ...body,
      date_created: currentDate,
      date_updated: currentDate,
      // You might want to get these from your authentication system
      user_created: "b79af301-d6de-4fb3-8093-2229f57195d4",
      user_updated: "c4424579-fee3-4b68-87dd-95a5eeddb3da",
    };

    const response = await fetch(`${DIRECTUS_URL}/items/${COLLECTION}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add your Directus API token here
        "Authorization": `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create job posting");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating job posting:", error);
    return NextResponse.json(
      { error: "Failed to create job posting" },
      { status: 500 }
    );
  }
}