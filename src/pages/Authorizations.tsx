import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import {
  FileText,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Download,
  Eye,
} from "lucide-react";
import { authorizationService } from "../services/authorizationService";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import type { Authorization, Beneficiary } from "../types/api";

export const Authorizations: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const loadAuthorizations = useCallback(
    async (beneficiaryCode: string) => {
      if (!user?.perfilAutenticado) return;

      setIsRefreshing(true);
      try {
        const data = await authorizationService.getAuthorizations({
          perfilAutenticado: user.perfilAutenticado,
        });
        setAuthorizations(data);
      } catch (error) {
        console.error("Error loading authorizations:", error);
        setAuthorizations([]);
        toast({
          title: "Erro ao carregar autorizações",
          description:
            "Não foi possível buscar as autorizações. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsRefreshing(false);
      }
    },
    [user, toast]
  );

  const loadPageData = useCallback(async () => {
    if (!user?.perfilAutenticado) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const loadedBeneficiaries = await authorizationService.getBeneficiaries({
        perfilAutenticado: user.perfilAutenticado,
      });
      setBeneficiaries(loadedBeneficiaries);

      if (loadedBeneficiaries.length > 0) {
        const firstBeneficiaryCode = loadedBeneficiaries[0].codigo;
        setSelectedBeneficiary(firstBeneficiaryCode);

        const loadedAuthorizations =
          await authorizationService.getAuthorizations({
            perfilAutenticado: user.perfilAutenticado,
          });
        setAuthorizations(loadedAuthorizations);
      } else {
        setAuthorizations([]);
      }
    } catch (error) {
      console.error("Error loading page data:", error);
      setBeneficiaries([]);
      setAuthorizations([]);
      toast({
        title: "Erro ao carregar dados",
        description:
          "Não foi possível carregar as informações da página. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      if (user.perfilAutenticado) {
        loadPageData();
      } else {
        setIsLoading(false);
        toast({
          title: "Perfil de Usuário Inválido",
          description:
            "Não foi possível carregar os dados. O perfil autenticado não foi encontrado.",
          variant: "destructive",
        });
      }
    }
  }, [user, loadPageData]);

  
  const handleBeneficiaryChange = (beneficiaryCode: string) => {
    setSelectedBeneficiary(beneficiaryCode);
    setAuthorizations([]); 
    loadAuthorizations(beneficiaryCode);
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();

    const statusMap = {
      aprovado: {
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-success",
      },
      pendente: {
        variant: "secondary" as const,
        icon: Clock,
        color: "text-warning",
      },
      negado: {
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-destructive",
      },
    };

    const statusInfo = statusMap[normalizedStatus] || statusMap["pendente"];
    const Icon = statusInfo.icon;

    return (
      <Badge variant={statusInfo.variant} className="flex items-center space-x-1">
        <Icon className={`h-3 w-3 ${statusInfo.color}`} />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Autorizações</h1>
            <p className="text-muted-foreground text-lg">
              Acompanhe suas solicitações de procedimentos médicos
            </p>
          </div>
        </div>
      </div>

      <Card className="card-medical">
        <CardHeader>
          <CardTitle>Selecionar Beneficiário</CardTitle>
          <CardDescription>
            Escolha o beneficiário para visualizar as autorizações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Select
                value={selectedBeneficiary}
                onValueChange={handleBeneficiaryChange}
              >
                <SelectTrigger disabled={beneficiaries.length <= 1}>
                  <SelectValue placeholder="Selecione um beneficiário" />
                </SelectTrigger>
                <SelectContent>
                  {beneficiaries.map((beneficiary) => (
                    <SelectItem key={beneficiary.codigo} value={beneficiary.codigo}>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>
                          {beneficiary.nome} - {beneficiary.plano}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => loadAuthorizations(selectedBeneficiary)}
              disabled={!selectedBeneficiary || isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de autorizações */}
      {selectedBeneficiary && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Autorizações ({authorizations.length})</h2>

          {isRefreshing ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : authorizations.length === 0 ? (
            <Card className="card-medical">
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Nenhuma autorização encontrada
                </h3>
                <p className="text-muted-foreground">
                  Este beneficiário não possui autorizações registradas
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {authorizations.map((auth) => (
                <Card key={auth.id} className="card-medical">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {auth.tipo}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(auth.data).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{auth.beneficiario}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(auth.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        ID: {auth.id}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                        {auth.status.toLowerCase() === "aprovado" && (
                          <Button variant="medical" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Baixar Guia
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
