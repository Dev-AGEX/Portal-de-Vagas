import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Obtém o token dos cookies
  const token = request.cookies.get("authToken")?.value;
  
  // Verifica se o usuário está tentando acessar uma rota protegida
  const isAuthPage = request.nextUrl.pathname === "/auth";
  
  // Lista de rotas públicas que não precisam de autenticação
  const publicRoutes = ["/auth"];
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Se não houver token e não estiver em uma rota pública, redireciona para /auth
  if (!token && !isPublicRoute) {
    const response = NextResponse.redirect(new URL("/auth", request.url));
    
    // Adiciona cabeçalhos para prevenir cache
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    
    return response;
  }
  
  // Se houver token e estiver na página de autenticação, redireciona para a página inicial
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  // Para todas as outras respostas, também previne cache
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  
  return response;
}

// Configurar quais caminhos o middleware deve ser executado
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};