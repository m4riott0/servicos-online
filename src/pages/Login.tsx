import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { User } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { AuthLogin } from "./AuthLogin";
import { AuthRegister } from "./AuthRegister";
import type { CPFVerificationResponse } from "../types/api";
import LoginHero from "../assets/login-hero.png";
import Logo from "../assets/bensaude.png";
import { useIsMobile } from "../hooks/use-mobile";

type LoginStep = "cpf" | "login" | "register";

export const Login: React.FC = () => {
  const [step, setStep] = useState<LoginStep>("cpf");
  const [cpf, setCpf] = useState("");
  const [userInfo, setUserInfo] = useState<CPFVerificationResponse | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { verificaCPF, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  if (isAuthenticated) {
    return <Navigate to="/Home" replace />;
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handleCPFSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cpf) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite seu CPF.",
        variant: "destructive",
      });
      return;
    }

    const cpfNumbers = cpf.replace(/\D/g, "");
    if (cpfNumbers.length !== 11) {
      toast({
        title: "CPF inválido",
        description: "Por favor, digite um CPF válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await verificaCPF(parseInt(cpfNumbers));

      if (!response || !response.sucesso) {
        toast({
          title: "CPF não encontrado",
          description: response?.erro || "Erro na verificação do CPF.",
          variant: "destructive",
        });
        return;
      }

      if (!response.beneficiario) {
        toast({
          title: "Beneficiário não encontrado",
          description: "Este CPF não pertence a um beneficiário ativo.",
          variant: "destructive",
        });
        return;
      }

      // CPF verificado com sucesso para um beneficiário
      setUserInfo(response);
      localStorage.setItem("cpf", cpfNumbers);
      if (response.email) {
        localStorage.setItem("email", response.email);
      }
      if (response.celular) {
        localStorage.setItem("celular", response.celular);
      }

      if (response.temContaNoApp && response.temSenhaCadastrada) {
        setStep("login");
      } else {
        setStep("register");
      }
    } catch (error) {
      console.error("Error verifying CPF:", error);
      toast({
        title: "Erro de conexão",
        description:
          "Não foi possível conectar com o servidor. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep("cpf");
    setUserInfo(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-section-hero">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Render login step
  if (step === "login" && userInfo) {
    return (
      <AuthLogin
        cpf={cpf}
        userInfo={{
          nome: userInfo.nome || "Usuário",
          celular: userInfo.celular,
          email: userInfo.email,
        }}
        onBack={handleBack}
      />
    );
  }

  if (step === "register" && userInfo) {
    return (
      <AuthRegister
        cpf={cpf}
        userInfo={{
          nome: userInfo.nome || "Usuário",
          celular: userInfo.celular,
          email: userInfo.email,
          temContaNoApp: userInfo.temContaNoApp || false,
          temSenhaCadastrada: userInfo.temSenhaCadastrada || false,
        }}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Image */}
      <div className="hidden lg:block relative bg-gradient-medical">
        <img
          src={LoginHero}
          alt="login Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Right side - CPF Form */}
      <div className="flex items-center justify-center p-8 bg-section-hero">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            {isMobile && (
              <img src={Logo} alt="Bensaúde Logo" className="h-12 w-auto " />
            )}
            <h1 className="text-3xl font-bold text-blue-500">
              Portal do Beneficiário
            </h1>
          </div>

          {/* CPF Form */}
          <Card className="card-medical">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Acesse sua conta</CardTitle>
              <CardDescription>Digite seu CPF para começar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCPFSubmit} className="space-y-6">
                {/* CPF Field */}
                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-sm font-medium">
                    CPF
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={handleCPFChange}
                      maxLength={14}
                      className="input-medical pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  variant="medical"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Verificando...
                    </>
                  ) : (
                    "Continuar"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            © 2025 Bensaúde. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};
