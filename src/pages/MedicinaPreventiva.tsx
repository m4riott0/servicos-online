import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeartPulse } from "lucide-react";
import { medicinaPreventiva } from "../services/medicinaPreventiva";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { format, parse } from "date-fns";

interface FormData {
  cpf: string;
  nome: string;
  dataNascimento: string;
  cidade: string;
  telefone: string;
  programa: string;
}

const programas = [{ id: 1, nome: "BemBebe" }];

const useMedicinaPreventiva = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fazerInscricao = async (requestData: any) => {
    setIsSubmitting(true);
    try {
      const response = await medicinaPreventiva.fazerInscricao(requestData);
      if (response.sucesso) {
        toast({
          title: "Inscrição realizada com sucesso!",
          description: "Entraremos em contato em breve.",
        });
        return true;
      } else {
        toast({
          title: "Erro na inscrição",
          description:
            response.erro ||
            "Não foi possível completar a inscrição. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Erro ao fazer inscrição:", error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { fazerInscricao, isSubmitting };
};

export const MedicinaPreventiva: React.FC = () => {
  const { user } = useAuth();
  const { fazerInscricao, isSubmitting } = useMedicinaPreventiva();

  const [formData, setFormData] = useState<FormData>({
    cpf: "",
    nome: "",
    dataNascimento: "",
    cidade: "",
    telefone: "",
    programa: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        cpf: user.cpf?.toString() || "",
        nome: user.nome || "",
        dataNascimento: user.dataNascimento
          ? format(new Date(user.dataNascimento), "dd/MM/yyyy")
          : "",
        telefone: user.celular || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, programa: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData = {
      cpf: formData.cpf.replace(/\D/g, ""), 
      nome: formData.nome,
      dataNascimento: parse(
        formData.dataNascimento,
        "dd/MM/yyyy",
        new Date()
      ).toISOString(), // formato correto
      cidade: formData.cidade,
      telefone: formData.telefone.replace(/\D/g, ""),
      programa: formData.programa,
    };

    const success = await fazerInscricao(requestData);
    if (success) {
      setFormData((prev) => ({ ...prev, cidade: "", programa: "" }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <HeartPulse className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Medicina Preventiva</h1>
            <p className="text-muted-foreground text-lg">
              Inscreva-se em nossos programas de cuidado e bem-estar.
            </p>
          </div>
        </div>
      </div>

      <Card className="card-medical max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Formulário de Inscrição</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para participar de um de nossos programas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  placeholder="DD/MM/AAAA"
                  required
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone para Contato</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Sua cidade"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="programa">Programa de Interesse</Label>
              <Select
                value={formData.programa}
                onValueChange={handleSelectChange}
                required
              >
                <SelectTrigger id="programa">
                  <SelectValue placeholder="Selecione um programa" />
                </SelectTrigger>
                <SelectContent>
                  {programas.map((p) => (
                    <SelectItem key={p.id} value={p.nome}>
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Inscrição"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
