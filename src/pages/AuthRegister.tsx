import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle, Mail, Phone, MessageSquare } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useToast } from '../hooks/use-toast';
import LoginHero from "../assets/login-hero.png";
import { maskCelular, maskEmail } from '@/lib/utils';

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

type TipoSolicitacao = "email" | "celular";

export const AuthRegister: React.FC<AuthRegisterProps> = ({ cpf, userInfo, onBack }) => {
  const [step, setStep] = useState<'contact' | 'verification' | 'password'>('contact');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [celular, setCelular] = useState(userInfo.celular || '');
  const [email, setEmail] = useState(userInfo.email || '');
  const [token, setToken] = useState('');
  const [tokenEmail, setTokenEmail] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'sms' | 'email' | 'both'>('both');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactRegistered, setContactRegistered] = useState(false);
  const [tipoSolicitacao, setTipoSolicitacao] = useState<TipoSolicitacao>("celular");

  const { register, isAuthenticated, createAccount, registerContact, confirmContact, resendSMS } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/Home" replace />;
  }

  // Se já tem conta mas não tem senha, pular para senha
  React.useEffect(() => {
    if (userInfo.temContaNoApp && userInfo.temSenhaCadastrada) {
      setStep('password');
    }
  }, [userInfo]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    const cpfNumbers = parseInt(cpf.replace(/\D/g, ''));

    try {
      // Se não tem conta no app, criar primeiro
      if (!userInfo.temContaNoApp) {
        await createAccount(cpfNumbers);
      }

      setContactRegistered(true);
      setStep('verification');
    } catch (error) {
      console.error('Error registering contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: "Token obrigatório",
        description: "Digite pelo menos um código de verificação.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const cpfNumbers = parseInt(cpf.replace(/\D/g, ''));

    try {

      let contato = "email";
      let tipo_contato: "phone" | "email" = 'email';
      if (tipoSolicitacao === 'celular') {
        tipo_contato = 'phone';
        contato = parseInt(celular.replace(/\D/g, '')).toString();
      } 
      console.log(contato)
      console.log(tipo_contato)
      await confirmContact(cpfNumbers, tipo_contato, contato, token);


      // Registrar contatos
      if (celular) {
        const phoneNumbers = parseInt(celular.replace(/\D/g, ''));
        await registerContact(cpfNumbers, 'phone', phoneNumbers.toString());
      }
      
      if (email) {
        await registerContact(cpfNumbers, 'email', email);
      }

      
      setStep('password');
    } catch (error) {
      console.error('Error confirming contact:', error);
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
    const cpfNumbers = parseInt(cpf.replace(/\D/g, ''));
    const success = await register(cpfNumbers, senha);
    setIsSubmitting(false);
  };

  //TODO - ver isso, se vai colocar contador, spinner. ou desabilitar depois de um tempo
  const handleResendSMS = async () => {
    const cpfNumbers = parseInt(cpf.replace(/\D/g, ''));
    await resendSMS(cpfNumbers);
  };

  const renderContactForm = () => (
    <Card className="card-medical">
      <CardHeader>
        <CardTitle className="text-center">Dados de Contato</CardTitle>
        <CardDescription className="text-center">
          Informe seus dados para confirmar a identidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleContactSubmit} className="space-y-6">

          <div className="space-y-2">

            <Label>Selecione o método</Label>
            <div className="flex flex-col gap-2">
              <label
                className={`flex items-center gap-2 p-2 border rounded-lg 
                   ${!email ? "cursor-not-allowed bg-gray-100 text-gray-400" : "cursor-pointer hover:bg-gray-50"}`}
                >
                <input
                  type="radio"
                  name="tipoSolicitacao"
                  value="email"
                  checked={email ? tipoSolicitacao === "email" : false}
                  onChange={() => email && setTipoSolicitacao("email")}
                  disabled={!email}
                />
                <span>
                  {email ? `E-mail: ${maskEmail(email)}` : "E-mail não disponível"}
                </span>
              </label>
              <label
                className={`flex items-center gap-2 p-2 border rounded-lg 
                ${!celular ? "cursor-not-allowed bg-gray-100 text-gray-400" : "cursor-pointer hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  name="tipoSolicitacao"
                  value="celular"
                  checked={celular ? tipoSolicitacao === "celular" : false}
                  onChange={() => celular && setTipoSolicitacao("celular")}
                  disabled={!celular}
                />
                <span>
                  {celular ? `Celular: ${maskCelular(celular)}` : "Celular não disponível"}
                </span>
              </label>

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
                Processando...
              </>
            ) : (
              'Continuar'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderVerificationForm = () => (
    <Card className="card-medical">
      <CardHeader>
        <CardTitle className="text-center">Verificação</CardTitle>
        <CardDescription className="text-center">
          Enviamos o código para o contato selecionado
        </CardDescription>
      </CardHeader>
      <CardContent>

        <form onSubmit={handleVerificationSubmit} className="space-y-6">

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Informe o código enviado
            </Label>
            <Input
              type="text"
              placeholder="Digite o código"
              value={token}
              onChange={(e) => setToken(e.target.value)}
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
              Reenviar
            </Button>
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
                Verificando...
              </>
            ) : (
              'Validar Código'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderPasswordForm = () => (
    <Card className="card-medical">
      <CardHeader>
        <CardTitle className="text-center">Criar Senha</CardTitle>
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
                type={showPassword ? 'text' : 'password'}
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
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                type={showConfirmPassword ? 'text' : 'password'}
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
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
              'Criar Conta'
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
            <h1 className="text-3xl font-bold text-primary">
              {step === 'password' ? 'Criar Senha' : 'Cadastro'}
            </h1>
            <p className="text-muted-foreground mt-2">
              Olá, <span className="font-semibold">{userInfo.nome.split(' ')[0]}</span>!
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step === 'contact' ? 'text-primary font-bold' : (contactRegistered ? 'text-primary' : 'text-muted-foreground')}`}>
              {contactRegistered ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 border-2 rounded-full" />}
              <span className="ml-2 text-sm">Contato</span>
            </div>
            <div className="w-8 h-0.5 bg-border"></div>
            <div className={`flex items-center ${step === 'verification' ? 'text-primary font-bold' : (step === 'password' ? 'text-primary' : 'text-muted-foreground')}`}>
              {step === 'password' ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 border-2 rounded-full" />}
              <span className="ml-2 text-sm">Verificação</span>
            </div>
            <div className="w-8 h-0.5 bg-border"></div>
            <div className={`flex items-center ${step === 'password' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
              <div className="w-5 h-5 border-2 rounded-full" />
              <span className="ml-2 text-sm">Senha</span>
            </div>
          </div>

          {/* Form Content */}
          {console.log(step)}
          {step === 'contact' && renderContactForm()}
          {step === 'verification' && renderVerificationForm()}
          {step === 'password' && renderPasswordForm()}

          {/* Back Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {/* //TODO - Verificação "de" ou "do" ? */}
              Voltar para verificação de CPF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};