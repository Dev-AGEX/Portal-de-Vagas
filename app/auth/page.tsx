"use client";

import { LoginForm } from "@/components/login-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Verifica se há token no localStorage
    const token = localStorage.getItem("authToken");
    
    // Adiciona evento para prevenir navegação com botão voltar após logout
    window.addEventListener("popstate", () => {
      // Se não houver token, impede a navegação de volta
      if (!localStorage.getItem("authToken")) {
        // Adiciona nova entrada ao histórico para "substituir" a entrada anterior
        window.history.pushState(null, "", "/auth");
      }
    });
    
    // Limpa o histórico de navegação para evitar voltar para páginas protegidas
    if (!token) {
      window.history.pushState(null, "", "/auth");
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Lado esquerdo - área com imagem de fundo */}
      <div 
        className="hidden md:flex md:w-1/2 lg:w-[69%] text-white flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10" 
        style={{ 
          background: "url('/fundo.png') center center / cover"
        }}
      >
        <div className="text-sm opacity-70 mt-auto">
          &copy; {new Date().getFullYear()} Agex Tranportes Urgentes. Todos os direitos reservados.
        </div>
      </div>
      
      {/* Lado direito - formulário de login */}
      <div className="w-full md:w-1/2 lg:w-[31%] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#0D1117] text-white">
        <div className="w-full max-w-sm space-y-4 md:space-y-6">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Acesse sua conta
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
}