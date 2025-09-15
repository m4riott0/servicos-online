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
import {
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  CheckCircle,
  Mail,
  Phone,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import LoginHero from "../assets/login-hero.png";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AuthRegisterProps {
  cpf: string;
  userInfo: {
    nome: string;
    celular?: string;
    email?: string;
    temContaNoApp: boolean;
    temSenhaCadastrada: boolean;
  };
  onBack: () => void;
}

export const AuthRegister: React.FC<AuthRegisterProps> = ({
  cpf,
  userInfo,
  onBack,
}) => {
  const [step, setStep] = useState<"contact" | "verification" | "password">(
    "contact"
  );
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [celular, setCelular] = useState(userInfo.celular || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [tokenSMS, setTokenSMS] = useState("");
  const [tokenEmail, setTokenEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactRegistered, setContactRegistered] = useState(false);

  const {
    register,
    isAuthenticated,
    createAccount,
    registerContact,
    confirmContact,
    resendSMS,
  } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/Home" replace />;
  }

  // Se já tem conta mas não tem senha, pular para senha
  React.useEffect(() => {
    if (userInfo.temContaNoApp && !userInfo.temSenhaCadastrada) {
      setStep("password");
    }
  }, [userInfo]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setCelular(formatted);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!celular && !email) {
      toast({
        title: "Dados obrigatórios",
        description: "Informe pelo menos um meio de contato.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const cpfNumbers = parseInt(cpf.replace(/\D/g, ""));

    try {
      // Se não tem conta no app, criar primeiro
      if (!userInfo.temContaNoApp) {
        await createAccount(cpfNumbers);
      }

      // Registrar contatos
      if (celular) {
        const phoneNumbers = parseInt(celular.replace(/\D/g, ""));
        await registerContact(cpfNumbers, "phone", phoneNumbers.toString());
      }

      if (email) {
        await registerContact(cpfNumbers, "email", email);
      }

      setContactRegistered(true);
      setStep("verification");
    } catch (error) {
      console.error("Error registering contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenSMS && !tokenEmail) {
      toast({
        title: "Token obrigatório",
        description: "Digite pelo menos um código de verificação.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const cpfNumbers = parseInt(cpf.replace(/\D/g, ""));

    try {
      if (tokenSMS && celular) {
        const phoneNumbers = parseInt(celular.replace(/\D/g, ""));
        await confirmContact(
          cpfNumbers,
          "phone",
          phoneNumbers.toString(),
          tokenSMS
        );
      }

      if (tokenEmail && email) {
        await confirmContact(cpfNumbers, "email", email, tokenEmail);
      }

      setStep("password");
    } catch (error) {
      console.error("Error confirming contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senha) {
      toast({
        title: "Campo obrigatório",
        description: "Digite uma senha.",
        variant: "destructive",
      });
      return;
    }

    if (senha !== confirmSenha) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive",
      });
      return;
    }

    if (senha.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const cpfNumbers = parseInt(cpf.replace(/\D/g, ""));
    const success = await register(cpfNumbers, senha);
    setIsSubmitting(false);
  };

  const handleResendSMS = async () => {
    const cpfNumbers = parseInt(cpf.replace(/\D/g, ""));
    await resendSMS(cpfNumbers);
  };

  const renderContactForm = () => (
    <Card className="card-medical">
      <CardHeader>
        <CardTitle className="text-center">
          Enviar token
        </CardTitle>
        <CardDescription className="text-center">
          Selecione o contato para enviar o token
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleContactSubmit} className="space-y-6">

          <RadioGroup
            value={celular || email}
            onValueChange={celular ? setCelular : setEmail}
            className="space-y-4"
          >
            {/* Celular */}
            <div className="space-y-2">
              <Label htmlFor="radio-celular" className="text-sm font-medium">
                Celular
              </Label>
              <div className="relative">
                <RadioGroupItem
                  value={userInfo.celular}
                  id="radio-celular"
                  className="peer"
                >
                  {celular || "Não informado"}
                </RadioGroupItem>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="radio-email" className="text-sm font-medium">
                E-mail
              </Label>
              <div className="relative">
                <RadioGroupItem
                  value={userInfo.email}
                  id="radio-email"
                  className="peer"
                >
                  {email || "Não informado"}
                </RadioGroupItem>
              </div>
            </div>
          </RadioGroup>

          <Button
            type="submit"
            className="w-full"
            variant="medical"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Processando...
              </>
            ) : (
              "Continuar"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderVerificationForm = () => (
    <Card className="card-medical">
      <CardHeader>
        <p className="text-center text-blue-500 font-bold text-2xl mb-4">
          Olá. {userInfo.nome}
        </p>
        <CardDescription className="text-center">
          Digite os códigos enviados para seus contatos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerificationSubmit} className="space-y-6">
          {celular && (
            <div className="space-y-2">
              <Label htmlFor="tokenSMS" className="text-sm font-medium">
                Código SMS ({celular})
              </Label>
              <Input
                id="tokenSMS"
                type="text"
                placeholder="000000"
                value={tokenSMS}
                onChange={(e) => setTokenSMS(e.target.value)}
                className="input-medical text-center"
                maxLength={6}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResendSMS}
                className="w-full"
              >
                Reenviar SMS
              </Button>
            </div>
          )}

          {email && (
            <div className="space-y-2">
              <Label htmlFor="tokenEmail" className="text-sm font-medium">
                Código E-mail ({email})
              </Label>
              <Input
                id="tokenEmail"
                type="text"
                placeholder="000000"
                value={tokenEmail}
                onChange={(e) => setTokenEmail(e.target.value)}
                className="input-medical text-center"
                maxLength={6}
              />
            </div>
          )}

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
              "Verificar"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderPasswordForm = () => (
    <Card className="card-medical">
      <CardHeader>
        <p className="text-center text-blue-500 font-bold text-2xl mb-4">
          Olá. {userInfo.nome}
        </p>
        <CardDescription className="text-center">
          Defina uma senha para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="senha" className="text-sm font-medium">
              Nova Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="senha"
                type={showPassword ? "text" : "password"}
                placeholder="Digite uma senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="input-medical pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmSenha" className="text-sm font-medium">
              Confirmar Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="confirmSenha"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Digite a senha novamente"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                className="input-medical pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            variant="medical"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Criando conta...
              </>
            ) : (
              "Criar Conta"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

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

      {/* Right side - Register Form */}
      <div className="flex items-center justify-center p-8 bg-section-hero">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-500">
              {step === "password" ? "Criar Senha" : "Cadastro"}
            </h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center ${
                step === "contact"
                  ? "text-primary"
                  : contactRegistered
                  ? "text-blue-500"
                  : "text-muted-foreground"
              }`}
            >
              {contactRegistered ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5 border-2 rounded-full" />
              )}
              <span className="ml-2 text-sm">Contato</span>
            </div>
            <div className="w-8 h-0.5 bg-border"></div>
            <div
              className={`flex items-center ${
                step === "verification"
                  ? "text-primary"
                  : step === "password"
                  ? "text-blue-500"
                  : "text-muted-foreground"
              }`}
            >
              {step === "password" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5 border-2 rounded-full" />
              )}
              <span className="ml-2 text-sm">Verificação</span>
            </div>
            <div className="w-8 h-0.5 bg-border"></div>
            <div
              className={`flex items-center ${
                step === "password" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="w-5 h-5 border-2 rounded-full" />
              <span className="ml-2 text-sm">Senha</span>
            </div>
          </div>

          {/* Form Content */}
          {step === "contact" && renderContactForm()}
          {step === "verification" && renderVerificationForm()}
          {step === "password" && renderPasswordForm()}

          {/* Back Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para verificação de CPF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
