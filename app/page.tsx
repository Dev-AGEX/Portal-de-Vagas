"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Briefcase, Users, UserCheck, TrendingUp, Clock } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  // Authentication check
  useEffect(() => {
    // Verifica se existe um token de autenticação
    const token = localStorage.getItem("authToken");
    
    // Se não existir token, redireciona para a página de autenticação
    if (!token) {
      router.push("/auth");
    }
  }, [router]);
  
  interface Job {
    id: number;
    titulo: string;
    departamento: string;
    localidade: string;
    status: string;
    applicants: number;
  }

  const [dashboardData, setDashboardData] = useState({
    vagasAtivas: 0,
    totalCandidatos: 0,
    contratados: 0,
    tempoMedioContratacao: 0,
    vagasRecentes: [] as Job[]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        
        // Fazer as requisições sem timeout inicialmente
        try {
          const [vagasResponse, activeVagasResponse, candidatosResponse] = await Promise.all([
            fetch('/api/deshboard/vagas'),
            fetch('/api/deshboard/vagas?type=active'),
            fetch('/api/deshboard/candidatos')
          ]);
          
          // Verificar se todas as respostas estão ok
          if (!vagasResponse.ok || !activeVagasResponse.ok || !candidatosResponse.ok) {
            throw new Error('Falha ao buscar dados');
          }
          
          // Processar as respostas
          const vagas = await vagasResponse.json();
          const activeVagas = await activeVagasResponse.json();
          const candidatosData = await candidatosResponse.json();
          
          // Map the vagas data using the correct field names from the API response
          const vagasRecentes = vagas.map((vaga: any) => ({
            id: vaga.id,
            titulo: vaga.titulo || "Sem título",
            departamento: vaga.departamento || "Não especificado",
            localidade: vaga.localidade || "Não especificado",
            applicants: 0,
            status: vaga.status || "Desconhecido"
          }));
          
          setDashboardData({
            vagasAtivas: activeVagas.total || 0,
            totalCandidatos: candidatosData.total || 0,
            contratados: 0,
            tempoMedioContratacao: 0,
            vagasRecentes
          });
        } catch (fetchError) {
          console.error("Erro ao buscar dados:", fetchError);
          throw fetchError;
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Set default values on error
        setDashboardData({
          vagasAtivas: 0,
          totalCandidatos: 0,
          contratados: 0,
          tempoMedioContratacao: 0,
          vagasRecentes: []
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const stats = [
    {
      title: "Vagas Ativas",
      value: dashboardData.vagasAtivas.toString(),
      icon: Briefcase,
      trend: "+25%",
      description: "em relação ao mês anterior",
    },
    {
      title: "Total de Candidatos",
      value: dashboardData.totalCandidatos.toString(),
      icon: Users,
      trend: "+12%",
      description: "em relação ao mês anterior",
    },
  ];

  if (isLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="h-8 w-8 text-primary" />
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{stat.value}</h2>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Vagas Recentes</h2>
        <div className="grid gap-4">
          {dashboardData.vagasRecentes.map((job) => (
            <Card key={job.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{job.titulo}</h3>
                  <div className="text-sm text-muted-foreground">
                    {job.departamento !== "Não especificado" ? `${job.departamento} · ` : ""}{job.localidade}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    {job.status}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}