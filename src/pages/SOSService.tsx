import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Shield, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Heart,
  Users,
  MessageSquare,
  Ambulance,
  FileText
} from 'lucide-react';
import { sosService } from '../services/sosService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import type { Beneficiary } from '../types/api';

export const SOSService: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>([]);
  const [smsToken, setSmsToken] = useState('');
  const [step, setStep] = useState<'select' | 'terms' | 'sms' | 'confirm' | 'success'>('select');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.perfilAutenticado) {
      loadBeneficiaries();
    }
  }, [user]);

  const loadBeneficiaries = async () => {
    if (!user?.perfilAutenticado) return;
    
    setIsLoading(true);
    try {
      const data = await sosService.getSOSBeneficiaries({
        perfilAutenticado: user.perfilAutenticado
      });
      setBeneficiaries(data || []);
    } catch (error) {
      console.error('Error loading SOS beneficiaries:', error);
      toast({
        title: "Erro ao carregar beneficiários",
        description: "Erro ao carregar beneficiários. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBeneficiaryToggle = (beneficiaryCode: string) => {
    setSelectedBeneficiaries(prev => 
      prev.includes(beneficiaryCode)
        ? prev.filter(code => code !== beneficiaryCode)
        : [...prev, beneficiaryCode]
    );
  };

  const handleAcceptTerms = async () => {
    if (!user?.perfilAutenticado || selectedBeneficiaries.length === 0) return;
    
    setIsLoading(true);
    try {
      await sosService.acceptSOSTerms({
        perfilAutenticado: user.perfilAutenticado,
        codigoMatriculasBeneficiariosAlvo: selectedBeneficiaries
      });
      
      setStep('sms');
      toast({
        title: "Termos aceitos com sucesso",
        description: "Termos de adesão aceitos com sucesso!",
      });
    } catch (error) {
      console.error('Error accepting SOS terms:', error);
      toast({
        title: "Erro ao aceitar termos",
        description: "Erro ao aceitar termos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendSMS = async () => {
    if (!user?.perfilAutenticado) return;
    
    setIsLoading(true);
    try {
      await sosService.sendSOSSMS({
        perfilAutenticado: user.perfilAutenticado,
        codigoMatriculasBeneficiariosAlvo: selectedBeneficiaries
      });
      
      setStep('confirm');
      toast({
        title: "Código enviado",
        description: "Código de confirmação enviado por SMS!",
      });
    } catch (error) {
      console.error('Error sending SOS SMS:', error);
      toast({
        title: "Erro ao enviar SMS",
        description: "Erro ao enviar SMS. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmContract = async () => {
    if (!user?.perfilAutenticado || !smsToken) return;
    
    setIsLoading(true);
    try {
      await sosService.confirmSOSContract({
        perfilAutenticado: user.perfilAutenticado,
        codigoToken: parseInt(smsToken)
      });
      
      setStep('success');
      toast({
        title: "Serviço SOS ativado",
        description: "Serviço SOS contratado com sucesso!",
      });
    } catch (error) {
      console.error('Error confirming SOS contract:', error);
      toast({
        title: "Erro na confirmação",
        description: "Erro ao confirmar contratação. Verifique o código.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && step === 'select') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-destructive/5 via-warning/5 to-destructive/10 rounded-2xl p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-destructive to-warning rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">SOS Saúde 24h</h1>
            <p className="text-muted-foreground text-lg">
              Atendimento médico de emergência 24 horas por dia
            </p>
          </div>
        </div>
      </div>

      {/* Service Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-medical">
          <CardHeader>
            <Phone className="h-8 w-8 text-destructive mb-2" />
            <CardTitle className="text-lg">Atendimento 24h</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Suporte médico disponível todos os dias, 24 horas por dia
            </p>
          </CardContent>
        </Card>

        <Card className="card-medical">
          <CardHeader>
            <Ambulance className="h-8 w-8 text-warning mb-2" />
            <CardTitle className="text-lg">Emergências</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Atendimento especializado para situações de emergência
            </p>
          </CardContent>
        </Card>

        <Card className="card-medical">
          <CardHeader>
            <Heart className="h-8 w-8 text-secondary mb-2" />
            <CardTitle className="text-lg">Cuidado Integral</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Acompanhamento médico completo quando você mais precisa
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contract Flow */}
      <Card className="card-medical">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Contratar Serviço SOS</span>
          </CardTitle>
          <CardDescription>
            Siga os passos abaixo para ativar o serviço SOS para seus beneficiários
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step Indicator */}
          <div className="flex items-center space-x-4 mb-8">
            {[
              { key: 'select', label: 'Selecionar', icon: Users },
              { key: 'terms', label: 'Termos', icon: FileText },
              { key: 'sms', label: 'SMS', icon: MessageSquare },
              { key: 'confirm', label: 'Confirmar', icon: CheckCircle },
              { key: 'success', label: 'Sucesso', icon: Shield }
            ].map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isActive = step === stepItem.key;
              const isCompleted = ['select', 'terms', 'sms', 'confirm'].indexOf(step) > ['select', 'terms', 'sms', 'confirm'].indexOf(stepItem.key);
              
              return (
                <div key={stepItem.key} className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-success text-success-foreground' :
                    isActive ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-sm ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>
                    {stepItem.label}
                  </span>
                  {index < 4 && <div className="w-8 h-px bg-border" />}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          {step === 'select' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Selecione os beneficiários</h3>
                <div className="space-y-3">
                  {beneficiaries.map((beneficiary) => (
                    <div key={beneficiary.codigo} className="flex items-center space-x-3 p-3 border border-border/50 rounded-lg">
                      <Checkbox
                        id={beneficiary.codigo}
                        checked={selectedBeneficiaries.includes(beneficiary.codigo)}
                        onCheckedChange={() => handleBeneficiaryToggle(beneficiary.codigo)}
                      />
                      <Label htmlFor={beneficiary.codigo} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{beneficiary.nome}</p>
                            <p className="text-sm text-muted-foreground">{beneficiary.plano}</p>
                          </div>
                          <Badge variant="outline">{beneficiary.status}</Badge>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                variant="medical" 
                onClick={() => setStep('terms')}
                disabled={selectedBeneficiaries.length === 0}
                className="w-full"
              >
                Continuar ({selectedBeneficiaries.length} selecionados)
              </Button>
            </div>
          )}

          {step === 'terms' && (
            <div className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Leia atentamente os termos de adesão do serviço SOS Saúde 24h antes de prosseguir.
                </AlertDescription>
              </Alert>
              
              <div className="bg-muted/50 p-4 rounded-lg max-h-64 overflow-y-auto">
                <h4 className="font-medium mb-3">Termos de Adesão - SOS Saúde 24h</h4>
                <div className="text-sm space-y-2 text-muted-foreground">
                  <p>1. O serviço SOS Saúde funciona 24 horas por dia, 7 dias por semana.</p>
                  <p>2. O atendimento é realizado por profissionais qualificados.</p>
                  <p>3. Em casos de emergência, ligue imediatamente para 192 (SAMU).</p>
                  <p>4. Este serviço é complementar ao seu plano de saúde.</p>
                  <p>5. Taxas adicionais podem se aplicar conforme uso.</p>
                  <p>6. O serviço pode ser cancelado a qualquer momento.</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accept-terms"
                  checked={hasAcceptedTerms}
                  onCheckedChange={(checked) => setHasAcceptedTerms(checked === true)}
                />
                <Label htmlFor="accept-terms" className="text-sm">
                  Li e aceito os termos de adesão do serviço SOS Saúde 24h
                </Label>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setStep('select')} className="flex-1">
                  Voltar
                </Button>
                <Button 
                  variant="medical" 
                  onClick={handleAcceptTerms}
                  disabled={!hasAcceptedTerms || isLoading}
                  className="flex-1"
                >
                  {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                  Aceitar Termos
                </Button>
              </div>
            </div>
          )}

          {step === 'sms' && (
            <div className="space-y-6">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Confirmação por SMS</h3>
                <p className="text-muted-foreground">
                  Enviaremos um código de confirmação para o seu celular cadastrado
                </p>
              </div>

              <Button 
                variant="medical" 
                onClick={handleSendSMS}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                Enviar Código SMS
              </Button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="text-center">
                <Clock className="h-12 w-12 text-warning mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Digite o código recebido</h3>
                <p className="text-muted-foreground">
                  Insira o código de 6 dígitos enviado para o seu celular
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="sms-token">Código SMS</Label>
                  <Input
                    id="sms-token"
                    type="text"
                    placeholder="000000"
                    value={smsToken}
                    onChange={(e) => setSmsToken(e.target.value)}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={handleSendSMS} className="flex-1">
                    Reenviar SMS
                  </Button>
                  <Button 
                    variant="medical" 
                    onClick={handleConfirmContract}
                    disabled={!smsToken || smsToken.length !== 6 || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                    Confirmar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-6">
              <CheckCircle className="h-16 w-16 text-success mx-auto" />
              <div>
                <h3 className="text-xl font-medium mb-2">Serviço SOS Ativado!</h3>
                <p className="text-muted-foreground">
                  O serviço SOS Saúde 24h foi ativado com sucesso para os beneficiários selecionados.
                </p>
              </div>
              
              <div className="bg-success/10 p-4 rounded-lg">
                <p className="text-sm font-medium text-success-foreground mb-2">
                  Telefone de Emergência SOS
                </p>
                <p className="text-2xl font-bold text-success">0800 123 4567</p>
              </div>

              <Button variant="medical" onClick={() => window.location.reload()} className="w-full">
                Finalizar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};