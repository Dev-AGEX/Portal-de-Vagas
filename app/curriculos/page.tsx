"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { TrabalheConosco } from "@/src/services/trabalheconosco";

const STATUS_OPTIONS = [
  "EM ANALISE",
  "APROVADO",
  "REPROVADO",
  "BANCO DE TALENTOS"
] as const;

export default function Curriculos() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [curriculos, setCurriculos] = useState<TrabalheConosco[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCurriculos() {
      try {
        const response = await fetch('/api/curriculos/curriculo');
        const data = await response.json();
        setCurriculos(data);
      } finally {
        setIsLoading(false);
      }
    }

    loadCurriculos();
  }, []);

  const areas = Array.from(new Set(curriculos.map(curriculo => curriculo.Area_onde_atua)));

  // Update the filteredCurriculos constant to include area filtering
  const filteredCurriculos = curriculos.filter(curriculo => {
  // First check area filter
  if (areaFilter !== "all" && curriculo.Area_onde_atua !== areaFilter) {
    return false;
  }
  
  // Then check search term
  if (!searchTerm.trim()) return true;
  
  const searchLower = searchTerm.toLowerCase().trim();
  
  return (
    curriculo.nome?.toLowerCase().includes(searchLower) ||
    curriculo.email?.toLowerCase().includes(searchLower) ||
    curriculo.Area_onde_atua?.toLowerCase().includes(searchLower) ||
    curriculo.Cidades_onde_reside?.toLowerCase().includes(searchLower) ||
    curriculo.celular?.toLowerCase().includes(searchLower) ||
    curriculo.STATUS_DOS_CURRICULO?.toLowerCase().includes(searchLower)
  );
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDownload = async (fileId: string) => {
      try {
        const response = await fetch(`/api/curriculos/download?fileId=${fileId}`);
        if (!response.ok) throw new Error('Download failed');
        
        const blob = await response.blob();
        const contentType = response.headers.get('content-type');
        const contentDisposition = response.headers.get('content-disposition');
        
        // Get filename from content-disposition header
        let filename = 'curriculo';
        const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        alert('Erro ao baixar o currículo. Tente novamente.');
      }
    };

  const handleStatusChange = async (curriculoId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/curriculos/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: curriculoId, status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setCurriculos(prevCurriculos => 
        prevCurriculos.map(curriculo => 
          curriculo.id === curriculoId 
            ? { ...curriculo, STATUS_DOS_CURRICULO: newStatus }
            : curriculo
        )
      );
    } catch (error) {
      alert('Erro ao atualizar status. Tente novamente.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Banco de Currículos</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email, área, cidade, telefone ou status..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por área" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as áreas</SelectItem>
              {areas.map(area => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCurriculos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum currículo encontrado com os filtros aplicados.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCurriculos.map((curriculo) => (
            <Card key={curriculo.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">{curriculo.nome}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {curriculo.email} · {curriculo.celular}
                  </div>
                  <div className="text-sm mt-1">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      {curriculo.Area_onde_atua || "Área não informada"}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      curriculo.STATUS_DOS_CURRICULO === "APROVADO" ? "bg-green-100 text-green-600" :
                      curriculo.STATUS_DOS_CURRICULO === "REPROVADO" ? "bg-red-100 text-red-600" :
                      curriculo.STATUS_DOS_CURRICULO === "EM ANALISE" ? "bg-yellow-100 text-yellow-600" :
                      "bg-blue-100 text-blue-600"
                    }`}>
                      {curriculo.STATUS_DOS_CURRICULO}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Cidade: {curriculo.Cidades_onde_reside}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Recebido em: {new Date(curriculo.date_created).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Select
                    value={curriculo.STATUS_DOS_CURRICULO || "EM ANALISE"}
                    onValueChange={(value) => handleStatusChange(curriculo.id, value)}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue>
                        {curriculo.STATUS_DOS_CURRICULO || "EM ANALISE"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EM ANALISE" className="text-yellow-600 font-medium">
                        EM ANALISE
                      </SelectItem>
                      <SelectItem value="APROVADO" className="text-green-600 font-medium">
                      APROVADO
                      </SelectItem>
                      <SelectItem value="REPROVADO" className="text-red-600 font-medium">
                      REPROVADO
                      </SelectItem>
                      <SelectItem value="BANCO DE TALENTOS" className="text-blue-600 font-medium">
                      BANCO DE TALENTOS
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {curriculo.curriculo && (
                    <Button 
                      variant="outline" 
                      className="self-start md:self-center"
                      onClick={() => handleDownload(curriculo.curriculo)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}