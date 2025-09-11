import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Eye, EyeOff, Lock, User, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Alert, AlertDescription } from '../components/ui/alert';

type RegisterStep = 'verify' | 'contacts' | 'password' | 'success';

export const Register: React.FC = () => {
  const [step, setStep] = useState<RegisterStep>('verify');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cpfData, setCpfData] = useState<any>(null);
  
  const { verificaCPF, register, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleverificaCPF = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cpfNumbers = cpf.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      toast({
        title: "CPF inválido",
        description: "Por favor, digite um CPF válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const response = await verificaCPF(parseInt(cpfNumbers));
    
    if (response) {
      setCpfData(response);
      
      if (response.temContaNoApp && response.temSenhaCadastrada) {
        toast({
          title: "Conta já existe",
          description: "Este CPF já possui conta. Faça login.",
          variant: "destructive",
        });
      } else if (response.temContaNoApp && !response.temSenhaCadastrada) {
        setStep('password');
      } else {
        setStep('contacts');
      }
    }
    setIsSubmitting(false);
  };

  const handleRegisterContacts = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would register contacts and confirm them
    // For now, we'll skip to password step
    setStep('password');
  };

  const handleRegisterPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (senha !== confirmSenha) {
      toast({
        title: "Senhas não coincidem",
        description: "Por favor, digite a mesma senha nos dois campos.",
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

    const cpfNumbers = cpf.replace(/\D/g, '');
    setIsSubmitting(true);
    const success = await register(parseInt(cpfNumbers), senha);
    
    if (success) {
      setStep('success');
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-section-hero">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-section-hero p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-medical">
            <span className="text-primary-foreground font-bold text-2xl">B</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text-medical mb-2">Bensaude Saúde</h1>
          <p className="text-muted-foreground">Criar nova conta</p>
        </div>

        <Card className="card-medical">
          {step === 'verify' && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Verificar CPF</CardTitle>
                <CardDescription>
                  Primeiro, vamos verificar se você é elegível para criar uma conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleverificaCPF} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
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

                  <Button
                    type="submit"
                    className="w-full btn-medical"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Verificando...
                      </>
                    ) : (
                      'Verificar CPF'
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {step === 'contacts' && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Dados de Contato</CardTitle>
                <CardDescription>
                  Informe seus dados para confirmação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegisterContacts} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-medical pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Celular</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={phone}
                        onChange={handlePhoneChange}
                        maxLength={15}
                        className="input-medical pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    variant="medical"
                    disabled={isSubmitting}
                  >
                    Continuar
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {step === 'password' && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Criar Senha</CardTitle>
                <CardDescription>
                  {cpfData?.nome && `Olá, ${cpfData.nome}! `}
                  Crie uma senha segura para sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cpfData && (
                  <Alert className="mb-6">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      CPF verificado com sucesso! {cpfData.beneficiario ? 'Você é um beneficiário ativo.' : ''}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleRegisterPassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="senha">Nova Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="senha"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="input-medical pl-10 pr-10"
                        minLength={6}
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmSenha">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmSenha"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Digite a senha novamente"
                        value={confirmSenha}
                        onChange={(e) => setConfirmSenha(e.target.value)}
                        className="input-medical pl-10 pr-10"
                        minLength={6}
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
                    className="w-full btn-medical"
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
            </>
          )}

          {step === 'success' && (
            <>
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                <CardTitle className="text-2xl text-success">Conta Criada!</CardTitle>
                <CardDescription>
                  Sua conta foi criada com sucesso. Agora você pode fazer login.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/login">
                  <Button className="w-full btn-medical">
                    Fazer Login
                  </Button>
                </Link>
              </CardContent>
            </>
          )}

          {step !== 'success' && (
            <CardContent className="pt-0">
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-primary hover:text-primary-hover transition-colors"
                >
                  Já tem conta? Faça login aqui
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};