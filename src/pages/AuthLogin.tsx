import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Eye, EyeOff, Lock, User, ArrowLeft } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import loginHero from '../assets/login-hero.png';

interface AuthLoginProps {
  cpf: string;
  userInfo: {
    nome: string;
    celular?: string;
    email?: string;
  };
  onBack: () => void; 
}

export const AuthLogin: React.FC<AuthLoginProps> = ({ cpf, userInfo, onBack }) => {
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/Home" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!senha) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite sua senha.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Attempting login with CPF:', cpf);
    const cpfNumbers = parseInt(cpf.replace(/\D/g, ""));
    const success = await login(cpfNumbers, senha);
    console.log('Login result:', success);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* lado esquerdo */}
      <div className="hidden lg:block relative bg-gradient-medical">
        <img
          src={loginHero}
          alt="Bensaúde - Cuidando da sua saúde"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* lado direito */}
      <div className="flex items-center justify-center p-8 bg-section-hero">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-500">Bem-vindo de volta</h1>
            <p className="text-muted-foreground mt-2">
              Olá, <span className="font-semibold">{userInfo.nome.split(' ')[0]}</span>!
            </p>
          </div>

          {/* Login */}
          <Card className="card-medical">
            <CardHeader>
              <CardTitle className="text-center">Digite sua senha</CardTitle>
              <CardDescription className="text-center">
                CPF: {cpf}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="senha" className="text-sm font-medium">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="senha"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua senha"
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

                <Button
                  type="submit"
                  className="w-full"
                  variant="medical"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>

                <div className="space-y-3 text-center">
                  <Link
                    to="/recuperar-senha"
                    state={{ cpf }}
                    className="text-sm text-primary hover:text-primary-hover transition-colors block"
                  >
                    Esqueceu sua senha?
                  </Link>
                  <button
                    type="button"
                    onClick={onBack}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para verificação de CPF
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};