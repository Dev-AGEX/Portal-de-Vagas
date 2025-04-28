"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Vagas",
    href: "/vagas",
    icon: Briefcase,
  },
  {
    title: "Currículos",
    href: "/curriculos",
    icon: FileText,
  },
];

export function Sidebar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  // Não renderiza a sidebar na página de autenticação
  if (pathname === '/auth') {
    return null;
  }
  
  return (
    <div className="fixed left-0 top-0 border-r bg-card flex flex-col h-screen z-50 w-64">
      <div className="p-4 border-b flex items-center">
        <Image 
          src="/logo.svg" 
          alt="CRM Logo"
          width={120}
          height={40}
          className="transition-colors dark:brightness-0 dark:invert"
        />
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid gap-1 px-2 py-4">
          {sidebarItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="justify-start"
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4 mr-2" />
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      
      <div className="border-t p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            // Remover o token do localStorage
            localStorage.removeItem("authToken");
            
            // Remover o token dos cookies
            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
            
            // Adicionar entrada ao histórico para evitar voltar
            window.history.pushState(null, "", "/auth");
            
            // Redirecionar para a página de autenticação
            router.push("/auth");
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 mr-2" />
          ) : (
            <Moon className="h-4 w-4 mr-2" />
          )}
          {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
        </Button>
      </div>
    </div>
  );
}