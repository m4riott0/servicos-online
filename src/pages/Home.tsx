import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { authorizationService } from "../services/authorizationService";
import { financeiroService } from "../services/financeiroService";
import { Badge } from "../components/ui/badge";
import { FileText, CreditCard, Users, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import type { Beneficiary, Authorization, Installment } from "../types/api";

export const Home: React.FC = () => {
  const { user } = useAuth();

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadHomeData = useCallback(async () => {
    if (!user?.perfilAutenticado) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    try {
      // const [
      //   loadedBeneficiaries,
      //   loadedAuthorizations,
      //   // A busca de parcelas foi removida conforme solicitado.
      // ] = await Promise.all([
      //   authorizationService.getBeneficiaries({
      //     perfilAutenticado: user.perfilAutenticado,
      //   }),
      //   authorizationService.getAuthorizations({
      //     perfilAutenticado: user.perfilAutenticado,
      //     codigoBeneficiario: 
      //   }),
      // ]);

      // setBeneficiaries(loadedBeneficiaries);
      // setAuthorizations(loadedAuthorizations);

      const loadedBeneficiaries = await authorizationService.getBeneficiaries({
        perfilAutenticado: user.perfilAutenticado,
      });

      const beneficiario = loadedBeneficiaries[0]; 

      if (!beneficiario) {
        console.error("Nenhum beneficiário encontrado");
        return;
      }

      const loadedAuthorizations = await authorizationService.getAuthorizations({
        perfilAutenticado: user.perfilAutenticado,
        codigoBeneficiario: beneficiario.codigo,
      });

      setBeneficiaries([beneficiario]); // opcional: manter como array
      setAuthorizations(loadedAuthorizations);
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setIsLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadHomeData();
    }
  }, [user, loadHomeData]);

  const stats = useMemo(() => {
    const pendingAuthorizations = authorizations.filter(
      (auth) => auth.statusProcedimento.toLowerCase() === "pendente"
    ).length;

    // const activeBeneficiaries = beneficiaries.filter(
    //   (b) => b.status.toLowerCase() === "ativo"
    // ).length;

    const activeBeneficiaries = beneficiaries.length

    return [
      {
        title: "Autorizações Pendentes",
        value: pendingAuthorizations.toString(),
        icon: FileText,
        color: "text-warning",
        link: "/authorizations",
      },
      {
        title: "Beneficiários depedentes",
        value: activeBeneficiaries.toString(),
        icon: Users,
        color: "text-success",
        link: "/beneficiaries",
      },
    ];
  }, [beneficiaries, authorizations]);

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Olá, {user?.nome?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Gerencie seus benefícios de saúde com facilidade
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <Link to={stat.link} key={index}>
            <Card className="card-medical hover:border-primary transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Contract Details */}
      <Card className="card-medical">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Detalhes do Contrato</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Número do Contrato</p>
            <p className="text-lg font-semibold">
              {user?.codigoContrato || "N/A"}
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Plano</p>
            <p className="text-lg font-semibold">
              {user?.codigoPlano || "Não informado"}
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Status do Contrato</p>
            <Badge variant={"default"}>Ativo</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
