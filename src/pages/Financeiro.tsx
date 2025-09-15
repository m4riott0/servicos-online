import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { 
  CreditCard, 
  FileText, 
  Download, 
  Calendar, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Eye
} from 'lucide-react';
import { financeiroService } from '../services/financeiroService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import type { Installment, CreditCard as CreditCardType, FinancialExtract } from '../types/api';

export const Financial: React.FC = () => {
  // Installments state
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [isLoadingInstallments, setIsLoadingInstallments] = useState(false);
  
  // Credit cards state
  const [creditCards, setCreditCards] = useState<CreditCardType[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  
  // Extracts state
  const [coParticipationExtract, setCoParticipationExtract] = useState<FinancialExtract[]>([]);
  const [irpfExtract, setIrpfExtract] = useState<FinancialExtract[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isLoadingExtracts, setIsLoadingExtracts] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.perfilAutenticado) {
      loadFinancialData();
    }
  }, [user]);

  const loadFinancialData = async () => {
    await Promise.all([
      loadInstallments(),
      loadCreditCards(),
      loadExtracts()
    ]);
  };

  const loadInstallments = async () => {
    if (!user?.perfilAutenticado) return;
    
    setIsLoadingInstallments(true);
    try {
      const data = await financeiroService.listInstallments({
        perfilAutenticado: user.perfilAutenticado
      });
      setInstallments(data || []);
    } catch (error) {
      console.error('Error loading installments:', error);
      toast({
        title: "Erro ao carregar parcelas",
        description: "Erro ao carregar parcelas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingInstallments(false);
    }
  };

  const loadCreditCards = async () => {
    if (!user?.perfilAutenticado) return;
    
    setIsLoadingCards(true);
    try {
      const data = await financeiroService.listCreditCards({
        perfilAutenticado: user.perfilAutenticado
      });
      setCreditCards(data || []);
    } catch (error) {
      console.error('Error loading credit cards:', error);
      toast({
        title: "Erro ao carregar cartões",
        description: "Erro ao carregar cartões. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCards(false);
    }
  };

  const loadExtracts = async () => {
    if (!user?.perfilAutenticado) return;
    
    setIsLoadingExtracts(true);
    try {
      const [coParticipationData, irpfData] = await Promise.all([
        financeiroService.getCoParticipationExtract({
          perfilAutenticado: user.perfilAutenticado
        }),
        financeiroService.getIRPFExtract({
          perfilAutenticado: user.perfilAutenticado,
          ano: selectedYear
        })
      ]);
      
      setCoParticipationExtract(coParticipationData || []);
      setIrpfExtract(irpfData || []);
    } catch (error) {
      console.error('Error loading extracts:', error);
      toast({
        title: "Erro ao carregar extratos",
        description: "Erro ao carregar extratos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingExtracts(false);
    }
  };

  const downloadBoleto = async () => {
    if (!user?.perfilAutenticado) return;
    
    try {
      const blob = await financeiroService.downloadBoleto({
        perfilAutenticado: user.perfilAutenticado
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `boleto_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download concluído",
        description: "Boleto baixado com sucesso!",
      });
    } catch (error) {
      console.error('Error downloading boleto:', error);
      toast({
        title: "Erro no download",
        description: "Erro ao baixar boleto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const deleteCreditCard = async (customerId: string, token: string) => {
    if (!user?.perfilAutenticado) return;
    
    try {
      await financeiroService.deleteCreditCard({
        perfilAutenticado: user.perfilAutenticado,
        customerId,
        token
      });
      
      // Reload credit cards
      loadCreditCards();
      
      toast({
        title: "Cartão removido",
        description: "Cartão removido com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting credit card:', error);
      toast({
        title: "Erro ao remover cartão",
        description: "Erro ao remover cartão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getInstallmentStatusBadge = (status: string) => {
    const statusMap = {
      'pago': { variant: 'default' as const, icon: CheckCircle, color: 'text-success' },
      'pendente': { variant: 'secondary' as const, icon: Clock, color: 'text-warning' },
      'vencido': { variant: 'destructive' as const, icon: AlertCircle, color: 'text-destructive' },
    };
    
    const statusInfo = statusMap[status.toLowerCase()] || statusMap['pendente'];
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center space-x-1">
        <Icon className={`h-3 w-3 ${statusInfo.color}`} />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Financeiro</h1>
            <p className="text-muted-foreground text-lg">
              Gerencie pagamentos, boletos e extratos
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="installments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="installments">Parcelas</TabsTrigger>
          <TabsTrigger value="cards">Cartões</TabsTrigger>
          <TabsTrigger value="extracts">Extratos</TabsTrigger>
          <TabsTrigger value="boletos">Boletos</TabsTrigger>
        </TabsList>

        {/* Installments Tab */}
        <TabsContent value="installments" className="space-y-6">
          <Card className="card-medical">
            <CardHeader>
              <CardTitle>Parcelas em Aberto</CardTitle>
              <CardDescription>
                Visualize e gerencie suas mensalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingInstallments ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : installments.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma parcela em aberto</h3>
                  <p className="text-muted-foreground">
                    Todas as suas mensalidades estão em dia!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {installments.map((installment) => (
                    <div key={installment.codigo} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            R$ {installment.valor.toLocaleString('pt-BR', { 
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2 
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Vencimento: {new Date(installment.vencimento).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getInstallmentStatusBadge(installment.status)}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Credit Cards Tab */}
        <TabsContent value="cards" className="space-y-6">
          <Card className="card-medical">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cartões de Crédito</CardTitle>
                  <CardDescription>
                    Gerencie seus cartões cadastrados
                  </CardDescription>
                </div>
                <Button variant="medical">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Cartão
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingCards ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : creditCards.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum cartão cadastrado</h3>
                  <p className="text-muted-foreground">
                    Adicione um cartão para facilitar seus pagamentos
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {creditCards.map((card) => (
                    <div key={card.id} className="p-4 border border-border/50 rounded-lg bg-gradient-to-br from-card to-muted/50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">{card.apelido}</p>
                          <p className="text-sm text-muted-foreground">{card.numeroMascarado}</p>
                        </div>
                        <Badge variant="outline">{card.bandeira}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{card.titular}</p>
                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteCreditCard('customerId', 'token')}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Extracts Tab */}
        <TabsContent value="extracts" className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadExtracts} disabled={isLoadingExtracts}>
              <Calendar className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Co-participation Extract */}
            <Card className="card-medical">
              <CardHeader>
                <CardTitle>Extrato de Coparticipação</CardTitle>
                <CardDescription>
                  Seus gastos com coparticipação
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingExtracts ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {coParticipationExtract.slice(0, 5).map((extract, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{extract.descricao}</p>
                          <p className="text-xs text-muted-foreground">{extract.periodo}</p>
                        </div>
                        <p className="text-sm font-medium">R$ {extract.valor.toFixed(2)}</p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-4">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Extrato Completo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* IRPF Extract */}
            <Card className="card-medical">
              <CardHeader>
                <CardTitle>Extrato IRPF</CardTitle>
                <CardDescription>
                  Informe de rendimentos para IR
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingExtracts ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {irpfExtract.slice(0, 5).map((extract, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{extract.descricao}</p>
                          <p className="text-xs text-muted-foreground">{extract.periodo}</p>
                        </div>
                        <p className="text-sm font-medium">R$ {extract.valor.toFixed(2)}</p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-4">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Informe {selectedYear}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Boletos Tab */}
        <TabsContent value="boletos" className="space-y-6">
          <Card className="card-medical">
            <CardHeader>
              <CardTitle>Boletos</CardTitle>
              <CardDescription>
                Baixe seus boletos de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Baixar Boleto</h3>
                <p className="text-muted-foreground mb-6">
                  Clique no botão abaixo para baixar seu boleto atual
                </p>
                <Button variant="medical" onClick={downloadBoleto}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Boleto Atual
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};