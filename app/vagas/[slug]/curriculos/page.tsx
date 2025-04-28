"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Eye, Mail, Phone, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCandidatosByVaga, updateCandidatoStatus } from "@/src/services/cantidatos";


interface Vaga {
  id: number;
  Titulo: string;
  Local_da_vaga: string;
  Status_da_vaga: string;
  Descricao_da_vaga: string;
  date_created: string;
}

export default function CurriculosVaga() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const vagaId = searchParams.get('id');
  
  const [vaga, setVaga] = useState<Vaga | null>(null);
  // Remove this line completely ↓
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);

  useEffect(() => {
    async function loadVagaDetails() {
      try {
        const response = await fetch(`/api/vagas/${vagaId}`);
        if (!response.ok) throw new Error('Failed to fetch vaga');
        
        const data = await response.json();
        setVaga(data.data);
      } catch (error) {
        console.error('Error loading vaga:', error);
      } finally {
        setLoading(false);
      }
    }

    if (vagaId) {
      loadVagaDetails();
    }
  }, [vagaId, selectedStatus]);

  // Add this state near other state declarations
  const [stats, setStats] = useState({ total: 0, novos: 0 });
  
  // Update the useEffect that loads candidates
  useEffect(() => {
    async function loadCandidatos() {
      if (vaga?.Titulo) {
        try {
          const data = await getCandidatosByVaga(vaga.Titulo);
          setCandidatos(data);
          
          // Calculate stats
          const total = data.length;
          const novos = data.filter(c => c.status_do_curriculo === "NOVO").length;
          setStats({ total, novos });
        } catch (error) {
          console.error('Error loading candidates:', error);
          setCandidatos([]);
        }
      }
    }
  
    loadCandidatos();
  }, [vaga?.Titulo]);
  
  // Add this section in the Card component after the date section
  <div className="flex gap-4">
    <div className="bg-muted p-3 rounded-md">
      <p className="text-sm text-muted-foreground">Total de Currículos</p>
      <p className="text-xl font-bold">{stats.total}</p>
    </div>
    <div className="bg-muted p-3 rounded-md">
      <p className="text-sm text-muted-foreground">Currículos Novos</p>
      <p className="text-xl font-bold">{stats.novos}</p>
    </div>
  </div>

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    setIsStatusChanged(true);
  };

  const confirmStatusChange = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vagas/${vagaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Status_da_vaga: selectedStatus
        })
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }
      
      const updatedVaga = await response.json();
      setVaga(updatedVaga.data);
      setIsStatusChanged(false);
      setSelectedStatus("");
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoVisto = async (candidatoId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/candidatos/${candidatoId}/vistos`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status_do_curriculo: 'VISTO'
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }
  
      // Update local state only if API call was successful
      setCandidatos(prev => prev.map(c => 
        c.id === candidatoId ? { ...c, status_do_curriculo: 'VISTO' } : c
      ));
  
      setStats(prev => ({
        total: prev.total,
        novos: Math.max(0, prev.novos - 1)
      }));
  
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erro ao atualizar status do currículo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const voltar = () => {
    router.push("/vagas");
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  if (!vaga) {
    return <div className="p-8 text-center">Vaga não encontrada</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={voltar}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Currículos para: {vaga?.Titulo}</h1>
        </div>

        <div className="bg-muted p-3 rounded-md space-y-2 w-[200px]">
          <p className="text-sm text-muted-foreground">Status da Vaga</p>
          <div className="flex flex-col gap-2">
            <Select
              value={selectedStatus || vaga?.Status_da_vaga}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLICADO">Publicado</SelectItem>
                <SelectItem value="ARQUIVADA">Arquivada</SelectItem>
                <SelectItem value="DESATIVADA">Desativada</SelectItem>
              </SelectContent>
            </Select>
            
            {isStatusChanged && (
              <Button 
                onClick={confirmStatusChange}
                variant="default"
                className="w-[180px]"
              >
                Confirmar Alteração
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{vaga?.Titulo}</h2>
            <p className="text-muted-foreground">{vaga?.Local_da_vaga}</p>
          </div>

          <div>
            <h3 className="font-medium">Descrição</h3>
            <div className="mt-1" dangerouslySetInnerHTML={{ __html: vaga?.Descricao_da_vaga || '' }} />
          </div>

          <div className="flex gap-4">
            <div className="bg-muted p-3 rounded-md w-[155px]">
              <p className="text-sm text-muted-foreground">Data de Publicação</p>
              <p className="text-xl font-bold">
                {vaga?.date_created ? new Date(vaga.date_created).toLocaleDateString('pt-BR') : ''}
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md w-[155px]">
              <p className="text-sm text-muted-foreground">Total de Currículos</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-muted p-3 rounded-md w-[150px]">
              <p className="text-sm text-muted-foreground">Currículos Novos</p>
              <p className="text-xl font-bold">{stats.novos}</p>
            </div>
          </div>
        </div>
      </Card>

      

      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Lista de Currículos ({candidatos.length})</h2>
        
        {candidatos.map((candidato) => (
          <Card 
            key={candidato.id} 
            className={`p-4 ${candidato.status_do_curriculo === "NOVO" ? 'border-blue-500 border-2' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">{candidato.Nome}</h3>
                  {candidato.status_do_curriculo === "NOVO" && (
                    <Badge className="bg-blue-100 text-blue-800">
                      Novo
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{candidato.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{candidato.telefone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={candidato.status_do_canditado}
                    onValueChange={async (value) => {
                      try {
                        const response = await fetch(`/api/candidatos/${candidato.id}/status`, {
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            status_do_canditado: value
                          })
                        });

                        if (!response.ok) {
                          throw new Error('Failed to update status');
                        }

                        const data = await response.json();
                        setCandidatos(prev => prev.map(c => 
                          c.id === candidato.id ? { ...c, status_do_canditado: value } : c
                        ));
                      } catch (error) {
                        console.error('Error updating candidate status:', error);
                        alert('Erro ao atualizar status do candidato');
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status do Candidato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EM ANALISE">Em Análise</SelectItem>
                      <SelectItem value="REPROVADO">Reprovado</SelectItem>
                      <SelectItem value="APROVADO">Aprovado</SelectItem>
                      <SelectItem value="BANCO DE TALENTO">Banco de Talento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enviado em: {new Date(candidato.date_created).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex gap-2">
                {candidato.status_do_curriculo === "NOVO" && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => marcarComoVisto(candidato.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => downloadCurriculo(candidato.curriculo)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {candidatos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum currículo encontrado para esta vaga.
          </div>
        )}
      </div>
    </div>
  );
}


// Add these interfaces at the top with other interfaces
// Update the Candidato interface
interface Candidato {
  id: number;
  Nome: string;
  email: string;
  telefone: string;
  cidade: string;
  pretensao_salarial: string;
  status_do_canditado: string;
  status_do_curriculo: string;
  curriculo: string;
  date_created: string;  // Add this field
}

// Add this function before the component
// Update the download function
const downloadCurriculo = async (curriculoId: string) => {
  try {
    if (!curriculoId) {
      throw new Error('No curriculum file found');
    }

    const response = await fetch(`/api/candidatos?fileId=${curriculoId}`);
    
    if (!response.ok) {
      throw new Error('Failed to download curriculum');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curriculo_${curriculoId}`; 
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading curriculum:', error);
    alert('Erro ao baixar currículo. Tente novamente.');
  }
};



