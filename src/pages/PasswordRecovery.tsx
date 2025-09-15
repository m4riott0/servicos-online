import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { User, CheckCircle, Lock } from 'lucide-react';
import { recoveryService } from '../services/recoveryService';
import { useToast } from '../hooks/use-toast';

type Step = 'cpf' | 'token' | 'password' | 'success';

export const PasswordRecovery: React.FC = () => {
  const [step, setStep] = useState<Step>('cpf');
  const [cpf, setCpf] = useState('');
  const [token, setToken] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    const cpfNumbers = cpf.replace(/\D/g, '');
    
    setIsSubmitting(true);
    try {
      await recoveryService.recoverPassword({
        cpf: parseInt(cpfNumbers),
        tipoSolicitacao: 'sms',
        celular: 0 // Would be obtained from CPF verification
      });
      
      setStep('token');
      toast({
        title: "Código de recuperação enviado",
        description: "Código de recuperação enviado para seu celular!",
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar código",
        description: "Erro ao enviar token. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleValidateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    const cpfNumbers = cpf.replace(/\D/g, '');
    
    setIsSubmitting(true);
    try {
      await recoveryService.validateRecoveryToken({
        cpf: parseInt(cpfNumbers),
        tipoSolicitacao: 'sms',
        token
      });
      
      setStep('password');
      toast({
        title: "Código validado com sucesso",
        description: "Agora você pode definir uma nova senha.",
      });
    } catch (error) {
      toast({
        title: "Código inválido",
        description: "Token inválido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

    const cpfNumbers = cpf.replace(/\D/g, '');
    setIsSubmitting(true);
    
    try {
      await recoveryService.changePassword({
        cpf: parseInt(cpfNumbers),
        tipoSolicitacao: 'sms',
        token,
        senha,
        confirmacaoSenha: confirmSenha
      });
      
      setStep('success');
      toast({
        title: "Senha alterada com sucesso",
        description: "Sua senha foi alterada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro ao alterar senha",
        description: "Erro ao alterar senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-section-hero p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-medical">
            <span className="text-primary-foreground font-bold text-2xl">B</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text-medical mb-2">Recuperar Senha</h1>
          <p className="text-muted-foreground">Redefina sua senha de acesso</p>
        </div>

        <Card className="card-medical">
          {step === 'cpf' && (
            <>
              <CardHeader className="text-center">
                <CardTitle>Digite seu CPF</CardTitle>
                <CardDescription>
                  Enviaremos um código para seu celular cadastrado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRequestToken} className="space-y-6">
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
                  <Button type="submit" variant="medical" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                    Enviar Código
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {step === 'success' && (
            <>
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                <CardTitle className="text-success">Senha Alterada!</CardTitle>
                <CardDescription>
                  Sua senha foi alterada com sucesso. Agora você pode fazer login.
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

          <CardContent className="pt-0">
            <div className="text-center">
              <Link to="/login" className="text-sm text-primary hover:text-primary-hover transition-colors">
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};