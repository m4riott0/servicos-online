import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { CheckCircle, Lock } from "lucide-react";
import { recoveryService } from "../services/recoveryService";
import { useToast } from "../hooks/use-toast";
import Logo from "../assets/bensaude.png";
import { maskCelular, maskEmail } from "@/lib/utils";

type TipoSolicitacao = "email" | "celular";
type Step = "token" | "password" | "success";

const getSessionData = () => {
  const cpf = localStorage.getItem("cpf") || "";
  const email = localStorage.getItem("email") || "";
  const celular = localStorage.getItem("celular") || "";
  return { cpf, email, celular };
};

export const PasswordRecovery: React.FC = () => {
  const { cpf, email, celular } = getSessionData();
  const [token, setToken] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<Step>("token");
  const [tipoSolicitacao, setTipoSolicitacao] =
    useState<TipoSolicitacao>("celular");
  const [canResend, setCanResend] = useState(true);

  const { toast } = useToast();

  // --- Timer de reenvio ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!canResend) {
      timer = setTimeout(() => setCanResend(true), 2 * 60 * 1000);
    }
    return () => clearTimeout(timer);
  }, [canResend]);

  const startResendTimer = () => setCanResend(false);

  const cpfNumerico = cpf ? parseInt(cpf.replace(/\D/g, ""), 10) : 0;
  const celularNumerico =
    celular && tipoSolicitacao === "celular"
      ? parseInt(celular.replace(/\D/g, ""), 10)
      : 0;

  // --- Requisição do código ---
  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await recoveryService.recoverPassword({
        cpf: cpfNumerico,
        tipoSolicitacao,
        celular: celularNumerico,
      });
      toast({
        title: "Código de recuperação enviado",
        description: `Código enviado para seu ${
          tipoSolicitacao === "email" ? "email" : "celular"
        }!`,
      });
      startResendTimer();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar código",
        description:
          error?.response?.data?.message ?? "Erro ao enviar token. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Validação do token ---
  const handleValidateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await recoveryService.validateRecoveryToken({
        cpf: cpfNumerico,
        token,
        tipoSolicitacao,
      });
      setStep("password");
      toast({
        title: "Código validado com sucesso",
        description: "Agora você pode definir uma nova senha.",
      });
    } catch (error: any) {
      toast({
        title: "Código inválido",
        description:
          error?.response?.data?.message ?? "Token inválido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Alteração da senha ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== confirmSenha) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await recoveryService.changePassword({
        cpf: cpfNumerico,
        token,
        senha,
        confirmacaoSenha: confirmSenha,
        tipoSolicitacao,
      });
      setStep("success");
      toast({
        title: "Senha alterada com sucesso",
        description: "Sua senha foi alterada com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar senha",
        description:
          error?.response?.data?.message ?? "Erro ao alterar senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-section-hero p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center mb-8">
          <img src={Logo} className="mb-4" alt="Logo da Bensaúde" />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500 mb-2">
            Recuperar Senha
          </h1>
          <p className="text-muted-foreground">Redefina sua senha de acesso</p>
        </div>

        <Card className="card-medical">
          {/* STEP 1 - Escolha do método e token */}
          {step === "token" && (
            <>
              <CardHeader className="text-center">
                <CardTitle>Escolha como receber o código</CardTitle>
                <CardDescription>
                  Enviaremos um código para seu e-mail ou celular cadastrado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRequestToken} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Selecione o método</Label>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="tipoSolicitacao"
                          value="email"
                          checked={tipoSolicitacao === "email"}
                          onChange={() => setTipoSolicitacao("email")}
                        />
                        <span>
                          {email
                            ? `E-mail: ${maskEmail(email)}`
                            : "E-mail não disponível"}
                        </span>
                      </label>

                      <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="tipoSolicitacao"
                          value="celular"
                          checked={tipoSolicitacao === "celular"}
                          onChange={() => setTipoSolicitacao("celular")}
                        />
                        <span>
                          {celular
                            ? `Celular: ${maskCelular(celular)}`
                            : "Celular não disponível"}
                        </span>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="medical"
                    className="w-full"
                    disabled={isSubmitting || !canResend}
                  >
                    {isSubmitting && (
                      <LoadingSpinner size="sm" className="mr-2" />
                    )}
                    Enviar Código
                  </Button>

                  {!canResend && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Aguarde 2 minutos para reenviar o código.
                    </p>
                  )}
                </form>

                <form onSubmit={handleValidateToken} className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="token">Código recebido</Label>
                    <Input
                      id="token"
                      type="text"
                      placeholder="Digite o código"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="medical"
                    className="w-full"
                    disabled={isSubmitting || !token}
                  >
                    Validar Código
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {/* STEP 2 - Alterar senha */}
          {step === "password" && (
            <>
              <CardHeader className="text-center">
                <Lock className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle>Defina uma nova senha</CardTitle>
                <CardDescription>
                  Digite e confirme sua nova senha de acesso.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="senha">Nova senha</Label>
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Digite sua nova senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmSenha">Confirme a senha</Label>
                    <Input
                      id="confirmSenha"
                      type="password"
                      placeholder="Confirme sua nova senha"
                      value={confirmSenha}
                      onChange={(e) => setConfirmSenha(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="medical"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <LoadingSpinner size="sm" className="mr-2" />
                    )}
                    Alterar Senha
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {/* STEP 3 - Sucesso */}
          {step === "success" && (
            <>
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <CardTitle className="text-blue-500">Senha Alterada!</CardTitle>
                <CardDescription>
                  Sua senha foi alterada com sucesso. Agora você pode fazer
                  login.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/login">
                  <Button variant="medical" className="w-full">
                    Fazer Login
                  </Button>
                </Link>
              </CardContent>
            </>
          )}

          {/* Link de voltar */}
          <CardContent className="pt-0">
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:text-primary-hover transition-colors"
              >
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
