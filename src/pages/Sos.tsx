import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShieldPlus,
  Check,
  Info,
  FileText,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sosService } from "@/services/sosService";
import type {
  SOSBeneficiariesResponse,
  SOSConfirmContractResponse,
} from "@/types/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type Step = "beneficiaries" | "verification" | "success";

export const SOS = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("beneficiaries");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sosData, setSosData] = useState<SOSBeneficiariesResponse | null>(null);
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>(
    []
  );
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [token, setToken] = useState("");
  const [confirmationData, setConfirmationData] =
    useState<SOSConfirmContractResponse | null>(null);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      if (!user?.perfilAutenticado) {
        toast({
          title: "Erro de autenticação",
          description: "Usuário não autenticado. Faça login novamente.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await sosService.getSOSBeneficiaries({
          perfilAutenticado: user.perfilAutenticado,
        });
        setSosData(response);
      } catch (error: any) {
        toast({
          title: "Erro ao buscar beneficiários",
          description:
            error.message || "Não foi possível carregar os dados do SOS.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeneficiaries();
  }, [user, toast]);

  const handleBeneficiaryToggle = (codigo: string) => {
    setSelectedBeneficiaries((prev) =>
      prev.includes(codigo)
        ? prev.filter((c) => c !== codigo)
        : [...prev, codigo]
    );
  };

  const handleContinueToVerification = async () => {
    if (!user?.perfilAutenticado) return;
    setIsSubmitting(true);
    try {
      // 1. Aceitar os termos
      await sosService.acceptSOSTerms({
        perfilAutenticado: user.perfilAutenticado,
        codigoMatriculasBeneficiariosAlvo: selectedBeneficiaries,
      });

      // 2. Enviar SMS com o token
      await sosService.sendSOSSMS({
        perfilAutenticado: user.perfilAutenticado,
        codigoMatriculasBeneficiariosAlvo: selectedBeneficiaries,
      });

      toast({
        title: "Código enviado!",
        description: "Enviamos um código de verificação para o seu celular.",
      });
      setStep("verification");
    } catch (error: any) {
      toast({
        title: "Erro ao prosseguir",
        description:
          error.message ||
          "Não foi possível continuar com a contratação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmContract = async () => {
    if (!user?.perfilAutenticado || !token) return;
    setIsSubmitting(true);
    try {
      // 4. Confirmar a contratação com o token
      const response = await sosService.confirmSOSContract({
        perfilAutenticado: user.perfilAutenticado,
        codigoToken: parseInt(token, 10),
      });

      setConfirmationData(response);
      setStep("success");
      toast({
        title: "Contratação realizada com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro na confirmação",
        description: error.message || "Token inválido ou expirado.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCost = useMemo(() => {
    if (!sosData) return 0;
    return selectedBeneficiaries.length * sosData.valorParaContratacao;
  }, [selectedBeneficiaries, sosData]);

  const canContinue = selectedBeneficiaries.length > 0 && termsAccepted;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <ShieldPlus className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Contratar SOS</h1>
            <p className="text-muted-foreground text-lg">
              Adquira o serviço de atendimento pré-hospitalar de urgência e
              emergência.
            </p>
          </div>
        </div>
      </div>

      {step === "beneficiaries" && sosData && (
        <Card className="card-medical">
          <CardHeader>
            <CardTitle>Selecione os Beneficiários</CardTitle>
            <CardDescription>
              Escolha para quem deseja contratar o serviço SOS.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {sosData.beneficiarios.map((beneficiary) => (
                <div
                  key={beneficiary.codigoBeneficiario}
                  className={`flex items-center space-x-4 p-4 border rounded-lg ${
                    beneficiary.temAcessorioContratado
                      ? "bg-muted/50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-muted/50"
                  }`}
                  onClick={() =>
                    !beneficiary.temAcessorioContratado &&
                    handleBeneficiaryToggle(beneficiary.codigoBeneficiario)
                  }
                >
                  <Checkbox
                    id={beneficiary.codigoBeneficiario}
                    checked={selectedBeneficiaries.includes(
                      beneficiary.codigoBeneficiario
                    )}
                    onCheckedChange={() =>
                      handleBeneficiaryToggle(beneficiary.codigoBeneficiario)
                    }
                    disabled={beneficiary.temAcessorioContratado}
                  />
                  <Label
                    htmlFor={beneficiary.codigoBeneficiario}
                    className="flex-1 text-sm font-medium"
                  >
                    {beneficiary.nome}
                  </Label>
                  {beneficiary.temAcessorioContratado && (
                    <Badge variant="secondary">Já Possui</Badge>
                  )}
                </div>
              ))}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Informações Importantes</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  Valor por beneficiário:{" "}
                  <b>
                    {sosData.valorParaContratacao.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </b>
                </p>
                <p>
                  Início da vigência:{" "}
                  <b>
                    {new Date(
                      sosData.dataInicioVigenciaAposContratacao
                    ).toLocaleDateString("pt-BR")}
                  </b>
                </p>
                <div className="flex space-x-4">
                  <a
                    href={sosData.linkTermoAdesao}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Termo de Adesão
                  </a>
                  <a
                    href={sosData.linkContrato}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Contrato
                  </a>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              />
              <Label htmlFor="terms">
                Li e aceito os termos de adesão e o contrato.
              </Label>
            </div>

            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="font-semibold">Valor Total:</span>
              <span className="text-2xl font-bold text-primary">
                {totalCost.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button
                onClick={handleContinueToVerification}
                disabled={!canContinue || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Contratar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "verification" && (
        <Card className="card-medical max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Verificação por SMS</CardTitle>
            <CardDescription>
              Digite o código de 6 dígitos que enviamos para o seu celular.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              type="text"
              placeholder="000000"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="text-center text-2xl tracking-widest"
            />
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep("beneficiaries")}
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button
                onClick={handleConfirmContract}
                disabled={!token || token.length < 6 || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Confirmar Contratação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "success" && confirmationData && (
        <Card className="card-medical max-w-lg mx-auto">
          <CardHeader className="items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Contratação Concluída!</CardTitle>
            <CardDescription>
              O serviço SOS foi contratado com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg space-y-2">
              <p className="flex justify-between">
                <span className="text-muted-foreground">
                  Data da Contratação:
                </span>
                <span className="font-semibold">
                  {new Date(
                    confirmationData.dataConclusaoContratacao
                  ).toLocaleDateString("pt-BR")}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">
                  Início da Vigência:
                </span>
                <span className="font-semibold">
                  {new Date(
                    confirmationData.dataInicioVigencia
                  ).toLocaleDateString("pt-BR")}
                </span>
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <UserCheck className="mr-2 h-4 w-4" />
                Beneficiários Incluídos:
              </h4>
              <ul className="list-disc list-inside pl-2 text-muted-foreground">
                {confirmationData.beneficiariosContratados.map((nome) => (
                  <li key={nome}>{nome}</li>
                ))}
              </ul>
            </div>
            <Button onClick={() => navigate("/home")} className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Voltar para o Início
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};