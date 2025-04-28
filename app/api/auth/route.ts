import { NextResponse } from 'next/server';
import * as argon2 from 'argon2';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_API_URL}/items/Usuarios`;
    const response = await fetch(`${apiUrl}?filter[Email][_eq]=${encodeURIComponent(body.Email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    const user = data.data?.[0];

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 401 });
      console.log('Usuário não encontrado');
    }

    const isValidPassword = await argon2.verify(user.Senha, body.Senha);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
      console.log('Senha incorreta');
    }

    const { Senha, ...userData } = user;
    return NextResponse.json({ data: userData });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}