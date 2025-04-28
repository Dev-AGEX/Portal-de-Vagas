"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Editor } from '@tinymce/tinymce-react';
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function NovaVaga() {
  const router = useRouter();
  const editorRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Titulo: "",
    Local_da_vaga: "",
    Descricao_da_vaga: "",
    Status_da_vaga: "PUBLICADO"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const descricaoContent = editorRef.current?.getContent();

    try {
      const response = await fetch('/api/vagas/newvagas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          Descricao_da_vaga: descricaoContent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create job posting');
      }

      router.push('/vagas');
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Erro ao criar vaga. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Nova Vaga</h1>
      </div>

      <Card className="max-w-4xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título da Vaga</label>
            <Input
              required
              value={formData.Titulo}
              onChange={(e) => setFormData({ ...formData, Titulo: e.target.value })}
              placeholder="Ex: Desenvolvedor Full Stack"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Local da Vaga</label>
            <Input
              required
              value={formData.Local_da_vaga}
              onChange={(e) => setFormData({ ...formData, Local_da_vaga: e.target.value })}
              placeholder="Ex: São Paulo - SP"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status da Vaga</label>
            <Select
              value={formData.Status_da_vaga}
              onValueChange={(value) => setFormData({ ...formData, Status_da_vaga: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLICADO">Publicado</SelectItem>
                <SelectItem value="ARQUIVADA">Arquivada</SelectItem>
                <SelectItem value="DESATIVADA">Desativada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição da Vaga</label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY_API}
              onInit={(evt: any, editor: any) => editorRef.current = editor}
              init={{
                height: 500,
                menubar: true,
                language: 'pt_BR',
                language_url: '/tinymce/langs/pt_BR.js',
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Vaga"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}