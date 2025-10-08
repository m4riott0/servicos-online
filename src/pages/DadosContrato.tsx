import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { carterinhaService } from "@/services/carterinhaService";
import type { User as UserType, ApiResponse } from "@/types/api";

const DataItem: React.FC<{ label: string; value?: string | number | null }> = ({
  label,
  value,
}) => (
  <div className="p-4 bg-muted/50 rounded-lg">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-lg font-semibold">{value || "Não informado"}</p>
  </div>
);

export const DadosContrato: React.FC = () => {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState<Partial<UserType> | null>(authUser);

  const formatSexo = (sexo: string | undefined): string | null => {
    if (!sexo) {
      return null;
    }
    const sexoMap: Record<string, string> = {
      m: "Masculino",
      f: "Feminino",
    };
    return sexoMap[sexo.toLowerCase()] || sexo;
  };

  const formatEstadoCivil = (estadoCivil: string | undefined): string | null => {
    if (!estadoCivil) {
      return null;
    }
    const estadoCivilMap: Record<string, string> = {
      s: "Solteiro(a)",
      c: "Casado(a)",
      d: "Divorciado(a)",
      v: "Viúvo(a)",
    };
    return estadoCivilMap[estadoCivil.toLowerCase()] || estadoCivil;
  };
  
  const formatCpf = (cpf: number | undefined) => {
    if (!cpf) {
      return null;
    }
    const cpfString = String(cpf).padStart(11, '0');
    return cpfString.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatRg = (rg: string | undefined) => {
    if (!rg) return null;

    const onlyNumbers = rg.replace(/\D/g, "");

    if (onlyNumbers.length === 9) {
      return onlyNumbers.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
    }
    return rg.toUpperCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (authUser?.perfilAutenticado) {
        try {
          const response = await carterinhaService.dadosCarterinha({
            perfilAutenticado: authUser.perfilAutenticado,
          });

          const carterinhaData = Array.isArray(response)
            ? response[0]
            : response?.dados?.[0];

          if (carterinhaData) {
            const mappedData = {
              ...carterinhaData,
              cartaoNacionalSaude: carterinhaData.cns,
              padraoAcomodacao: carterinhaData.acomodacao,
              produtoContratado: carterinhaData.produto,
              tipoContratacao: carterinhaData.tipoContrato,
              nomeMae: carterinhaData.nomeMae,
              estadoCivil: carterinhaData.estadoCivil,
              sexo: carterinhaData.sexo,
              rg: carterinhaData.rg,
              orgaoEmissorRg: carterinhaData.orgaoExpeditor,
            };

            setUserData((prev) => ({ ...prev, ...mappedData }));
          } else {
            console.warn("Nenhum dado retornado da API de carteirinha.");
          }
        } catch (error) {
          console.error("Erro ao buscar dados da carteirinha:", error);
        }
      }
    };
    fetchData();
  }, [authUser]);

  const user = userData;

  return (
    <div className="space-y-8">
      {/* Dados pessoais*/}
      <Card className="card-medical">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Dados Pessoais</CardTitle>
          </div>
          <CardDescription>Suas informações de cadastro.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DataItem label="Nome" value={user?.nome} />
          <DataItem
            label="Data de Nascimento"
            value={
              user?.dataNascimento
                ? format(new Date(user.dataNascimento), "dd/MM/yyyy")
                : null
            }
          /> 
          <DataItem label="Sexo" value={formatSexo(user?.sexo)} />
          <DataItem label="Nome da Mãe" value={user?.nomeMae} />
          <DataItem label="CPF" value={formatCpf(user?.cpf)} />
          <DataItem label="RG" value={formatRg(user?.rg)} />
          <DataItem label="Órgão Emissor do RG" value={user?.orgaoEmissorRg} />
          <DataItem
            label="Cartão Nacional de Saúde"
            value={user?.cartaoNacionalSaude}
          />
          <DataItem label="Título de Eleitor" value={user?.tituloEleitor} />
          <DataItem label="Estado Civil" value={formatEstadoCivil(user?.estadoCivil)} />
          <DataItem label="Profissão" value={user?.profissao} />
          <DataItem label="PIS/PASEP" value={user?.pisPasep} />
        </CardContent>
      </Card>

      {/* Dados Contratuais */}
      <Card className="card-medical">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Detalhes do Contrato</CardTitle>
          </div>
          <CardDescription>Informações sobre seu plano.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DataItem label="Número do Contrato" value={user?.codigoContrato} />
          <DataItem
            label="Número da Carteirinha"
            value={user?.numeroCarteirinha}
          />
          <DataItem
            label="Data de Contratação"
            value={
              user?.dataContratacao
                ? format(new Date(user.dataContratacao), "dd/MM/yyyy")
                : null
            }
          />
          <DataItem
            label="Padrão de Acomodação"
            value={user?.padraoAcomodacao}
          />
          <DataItem label="Tipo de Contrato" value={user?.tipoContratacao} />
          <DataItem
            label="Produto Contratado"
            value={user?.produtoContratado}
          />
          <DataItem
            label="Segmentação Assistencial"
            value={user?.segmentacaoAssistencial}
          />
        </CardContent>
      </Card>
    </div>
  );
};
