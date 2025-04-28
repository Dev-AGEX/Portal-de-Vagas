import { NextResponse } from "next/server";
import { getTrabalheConosco, getCurriculosByStatus } from "@/src/services/trabalheconosco";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const data = status 
      ? await getCurriculosByStatus(status)
      : await getTrabalheConosco();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Falhas em Carregar os Curriculos" },
      { status: 500 }
    );
  }
}