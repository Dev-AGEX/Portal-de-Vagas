import { NextResponse } from 'next/server';
import * as argon2 from 'argon2';
import { sign } from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Tentando autenticar usuário:', body.Email);

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_DIRECTUS_API_URL) {
      console.error('NEXT_PUBLIC_DIRECTUS_API_URL não está configurado');
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 });
    }

    if (!process.env.DIRECTUS_API_TOKEN) {
      console.error('DIRECTUS_API_TOKEN não está configurado');
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_API_URL}/items/Usuarios`;
    console.log('URL da API:', apiUrl);

    try {
      const response = await fetch(`${apiUrl}?filter[Email][_eq]=${encodeURIComponent(body.Email)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.DIRECTUS_API_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.error(`Erro na API Directus: ${response.status} - ${response.statusText}`);
        return NextResponse.json({ error: 'Erro ao consultar banco de dados' }, { status: 500 });
      }

      const data = await response.json();
      console.log('Resposta da API:', JSON.stringify(data));

      const user = data.data?.[0];

      if (!user) {
        console.log('Usuário não encontrado');
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 401 });
      }

      // Verificar senha com argon2 em vez de bcrypt
      const isValidPassword = await argon2.verify(user.Senha, body.Senha);

      if (!isValidPassword) {
        console.log('Senha incorreta');
        return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
      }

      const { Senha, ...userData } = user;
      
      // Gerar token JWT
      const token = sign(
        { userId: user.id, email: user.Email, role: user.role || 'user' },
        process.env.JWT_SECRET || 'fallback_secret_key_for_development',
        { expiresIn: '24h' }
      );

      // Retornar dados do usuário e token
      return NextResponse.json({ 
        data: userData,
        token: token 
      });
    } catch (fetchError) {
      console.error('Erro ao fazer fetch da API Directus:', fetchError);
      return NextResponse.json({ error: 'Erro ao conectar com o banco de dados' }, { status: 500 });
    }

  } catch (error) {
    console.error('Erro no servidor:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
