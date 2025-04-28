"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, UserPlus, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Vaga, getVagas } from "@/src/services/vagas";  // Update import
import { getCandidatosByVaga } from "@/src/services/cantidatos";

export default function Vagas() {
  const router = useRouter();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [candidateCounts, setCandidateCounts] = useState<Record<string, { total: number; novos: number }>>({});
  
  // Add this useEffect to load vagas
  useEffect(() => {
    async function loadVagas() {
      try {
        const data = await getVagas();
        setVagas(data);
      } catch (error) {
        console.error('Error loading vagas:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadVagas();
  }, []);

  // Existing useEffect for candidateCounts
  useEffect(() => {
    async function loadCandidateCounts() {
      const counts: Record<string, { total: number; novos: number }> = {};
      for (const vaga of vagas) {
        const candidates = await getCandidatosByVaga(vaga.Titulo);
        counts[vaga.Titulo] = {
          total: candidates.length,
          novos: candidates.filter(c => c.status_do_curriculo === "NOVO").length
        };
      }
      setCandidateCounts(counts);
    }
  
    if (vagas.length > 0) {
      loadCandidateCounts();
    }
  }, [vagas]);

  const visualizarCurriculos = (vagaId: number) => {
    const vaga = vagas.find(v => v.id === vagaId);
    const slugifiedTitle = vaga?.Titulo.toLowerCase().replace(/ /g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    router.push(`/vagas/${slugifiedTitle}/curriculos?id=${vagaId}`);
  };

  if (isLoading) {
    return <div className="p-8">Carregando vagas...</div>;
  }

  // Add filtering logic for vagas
  const activeVagas = vagas.filter(vaga => vaga.Status_da_vaga !== "ARQUIVADA");
const archivedVagas = vagas.filter(vaga => vaga.Status_da_vaga === "ARQUIVADA");

  const handleNovaVaga = () => {
    router.push('/vagas/new');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Vagas</h1>
        <Button onClick={handleNovaVaga}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Vaga
        </Button>
      </div>

      <div className="space-y-8">
        {/* Active Vagas */}
        <div className="grid gap-4">
          <h2 className="text-2xl font-semibold">Vagas Ativas</h2>
          {activeVagas.map((vaga) => (
            <Card key={vaga.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{vaga.Titulo}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    {vaga.Local_da_vaga}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">{candidateCounts[vaga.Titulo]?.total || 0}</span> total
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        <span className="font-medium text-primary">{candidateCounts[vaga.Titulo]?.novos || 0}</span> novos
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    {vaga.Status_da_vaga}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => visualizarCurriculos(vaga.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Currículos
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Archived Vagas */}
        {archivedVagas.length > 0 && (
          <div className="grid gap-4">
            <h2 className="text-2xl font-semibold text-muted-foreground">Vagas Arquivadas</h2>
            {archivedVagas.map((vaga) => (
            <Card key={vaga.id} className="p-6 bg-muted">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{vaga.Titulo}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    {vaga.Local_da_vaga}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">{candidateCounts[vaga.Titulo]?.total || 0}</span> total
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">{candidateCounts[vaga.Titulo]?.novos || 0}</span> novos
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-muted-foreground/20 text-muted-foreground text-sm">
                    {vaga.Status_da_vaga}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => visualizarCurriculos(vaga.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Currículos
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
