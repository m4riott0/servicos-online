import React from "react";
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
  const { user } = useAuth();

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
          <DataItem label="Sexo" value={user?.sexo} />
          <DataItem label="Nome da Mãe" value={user?.nomeMae} />
          <DataItem label="CPF" value={user?.cpf} />
          <DataItem label="RG" value={user?.rg} />
          <DataItem label="Órgão Emissor do RG" value={user?.orgaoEmissorRg} />
          <DataItem
            label="Cartão Nacional de Saúde"
            value={user?.cartaoNacionalSaude}
          />
          <DataItem label="Título de Eleitor" value={user?.tituloEleitor} />
          <DataItem label="Estado Civil" value={user?.estadoCivil} />
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
          <DataItem label="Número da Carteirinha" value={user?.numeroCarteirinha} />
          <DataItem
            label="Data de Contratação"
            value={
              user?.dataContratacao
                ? format(new Date(user.dataContratacao), "dd/MM/yyyy")
                : null
            }
          />
          <DataItem label="Padrão de Acomodação" value={user?.padraoAcomodacao} />
          <DataItem label="Tipo de Contratação" value={user?.tipoContratacao} />
          <DataItem label="Produto Contratado" value={user?.produtoContratado} />
          <DataItem
            label="Segmentação Assistencial"
            value={user?.segmentacaoAssistencial}
          />
        </CardContent>
      </Card>
    </div>
  );
};