{/*TODO: refatorar a nova home*/}

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useToast } from "../hooks/use-toast";
import { authorizationService } from "../services/authorizationService";
import { financeiroService } from "../services/financeiroService";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Users,
  FileText,
  CreditCard,
  Calendar,
  TrendingUp,
  Bell,
  Heart,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import type {
  Beneficiary,
  Authorization,
  Installment,
  FinancialExtract,
} from "../types/api";

export const Home: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [coParticipationExtract, setCoParticipationExtract] = useState<
    FinancialExtract[]
  >([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (user?.perfilAutenticado) {
      loadHomeData();
    } else {
      setIsLoadingData(false);
    }
  }, [user]);

  const loadHomeData = async () => {
    if (!user?.perfilAutenticado) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    try {
      const [
        loadedBeneficiaries,
        loadedInstallments,
        loadedCoParticipationExtract,
        allAuthorizations,
      ] = await Promise.all([
        authorizationService.getBeneficiaries({
          perfilAutenticado: user.perfilAutenticado,
        }),

        financeiroService.listInstallments({
          perfilAutenticado: user.perfilAutenticado,
        }),

        financeiroService.getCoParticipationExtract({
          perfilAutenticado: user.perfilAutenticado,
        }),

        authorizationService.getAuthorizations({
          perfilAutenticado: user.perfilAutenticado,
        }),
      ]);

      setBeneficiaries(loadedBeneficiaries || []);
      setInstallments(loadedInstallments || []);
      setCoParticipationExtract(loadedCoParticipationExtract || []);
      setAuthorizations(allAuthorizations || []);
    } catch (error) {
      console.error("Error loading home data:", error);
      toast({
        title: "Erro ao carregar dados",
        description:
          "Não foi possível carregar as informações da página inicial.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const stats = useMemo(() => {
    const pendingAuthorizations = authorizations.filter(
      (auth) => auth.status.toLowerCase() === "pendente"
    ).length;

    const activeBeneficiaries = beneficiaries.filter(
      (b) => b.status.toLowerCase() === "ativo"
    ).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const consultationsThisMonth = authorizations.filter(
      (auth) =>
        auth.tipo.toLowerCase() === "consulta" &&
        new Date(auth.data).getMonth() === currentMonth &&
        new Date(auth.data).getFullYear() === currentYear
    ).length;

    const totalSavings = coParticipationExtract.reduce(
      (sum, item) => sum + item.valor,
      0
    );

    return [
      {
        title: "Autorizações Pendentes",
        value: pendingAuthorizations.toString(),
        icon: FileText,
        color: "text-warning",
      },
      {
        title: "Beneficiários Ativos",
        value: activeBeneficiaries.toString(),
        icon: Users,
        color: "text-success",
      },
      {
        title: "Consultas este mês",
        value: consultationsThisMonth.toString(),
        icon: Calendar,
        color: "text-primary",
      },
      {
        title: "Economia total",
        value: `R$ ${totalSavings.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icon: TrendingUp,
        color: "text-secondary",
      },
    ];
  }, [beneficiaries, authorizations, coParticipationExtract]);

  const recentActivities = useMemo(() => {
    const combinedActivities = [
      ...authorizations.map((auth) => ({
        id: auth.id,
        type: "authorization",
        title: `Autorização ${
          auth.status.toLowerCase() === "aprovado"
            ? "aprovada"
            : auth.status.toLowerCase() === "pendente"
            ? "pendente"
            : "negada"
        }`,
        description: `${auth.tipo} - ${auth.beneficiario}`,
        date: auth.data,
        status:
          auth.status.toLowerCase() === "aprovado"
            ? "success"
            : auth.status.toLowerCase() === "pendente"
            ? "warning"
            : "destructive",
      })),
      ...installments.map((inst) => ({
        id: inst.codigo,
        type: "payment",
        title: `Mensalidade ${inst.status.toLowerCase()}`,
        description: `Vencimento: ${new Date(
          inst.vencimento
        ).toLocaleDateString("pt-BR")} - R$ ${inst.valor.toLocaleString(
          "pt-BR",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}`,
        date: inst.vencimento,
        status:
          inst.status.toLowerCase() === "pago"
            ? "success"
            : inst.status.toLowerCase() === "pendente"
            ? "warning"
            : "destructive",
      })),
    ];

    return combinedActivities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [authorizations, installments]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="card-medical">
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
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activities */}
        <Card className="card-medical">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Atividades Recentes</CardTitle>
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 pb-4 border-b border-border/50 last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{activity.title}</h4>
                      <Badge
                        variant={
                          activity.status === "success"
                            ? "default"
                            : activity.status === "warning"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {activity.status === "success"
                          ? "Aprovado"
                          : activity.status === "warning"
                          ? "Pendente"
                          : activity.status === "destructive"
                          ? "Negado"
                          : "Info"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card className="card-medical">
          <CardHeader>
            <CardTitle className="text-xl">Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nome:</span>
                <span className="font-medium">{user?.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CPF:</span>
                <span className="font-medium">
                  {user?.cpf
                    ?.toString()
                    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">
                  {user?.email || "Não informado"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Celular:</span>
                <span className="font-medium">
                  {user?.celular || "Não informado"}
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-6">
              Atualizar Dados
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
