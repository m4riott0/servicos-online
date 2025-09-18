import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  CreditCard,
  FileText,
  Download,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Eye,
} from "lucide-react";

export const Financial: React.FC = () => {
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

      {/* Main Content */}
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
              <CardTitle>Parcelas dos ultimos 12 meses</CardTitle>
              <CardDescription>
                Visualize e gerencie suas mensalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">R$ 250,00</p>
                      <p className="text-sm text-muted-foreground">
                        Vencimento: 10/09/2025
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="default"
                      className="flex items-center space-x-1"
                    >
                      <Clock className="h-3 w-3 text-yellow-600" />
                      <span className="capitalize">Pago</span>
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">R$ 250,00</p>
                      <p className="text-sm text-muted-foreground">
                        Vencimento: 10/09/2025
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="default"
                      className="flex items-center space-x-1"
                    >
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                      <span className="capitalize">Pago</span>
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-6">
          <Card className="card-medical">
            <CardHeader>
              <CardTitle>Cartões de Crédito</CardTitle>
              <CardDescription>
                Gerencie seus cartões para pagamentos recorrentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Disponível em breve
                </h3>
                <p className="text-muted-foreground">
                  Esta funcionalidade está em desenvolvimento e estará
                  disponível em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Extracts Tab */}
        <TabsContent value="extracts" className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <Select defaultValue={currentYear.toString()}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-medical">
              <CardHeader>
                <CardTitle>Extrato de Coparticipação</CardTitle>
                <CardDescription>
                  Seus gastos com coparticipação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Example Extract Item */}
                  <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div>
                      <p className="text-sm font-medium">Consulta Eletiva</p>
                      <p className="text-xs text-muted-foreground">05/2025</p>
                    </div>
                    <p className="text-sm font-medium">R$ 30,00</p>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div>
                      <p className="text-sm font-medium">Exame Laboratorial</p>
                      <p className="text-xs text-muted-foreground">05/2025</p>
                    </div>
                    <p className="text-sm font-medium">R$ 15,50</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Extrato Completo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-medical">
              <CardHeader>
                <CardTitle>Extrato IRPF</CardTitle>
                <CardDescription>
                  Informe de rendimentos para IR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Example IRPF Item */}
                  <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div>
                      <p className="text-sm font-medium">Mensalidades Pagas</p>
                      <p className="text-xs text-muted-foreground">
                        Ano de {currentYear}
                      </p>
                    </div>
                    <p className="text-sm font-medium">R$ 3.000,00</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Informe {currentYear}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Boletos Tab */}
        <TabsContent value="boletos" className="space-y-6">
          <Card className="card-medical">
            <CardHeader>
              <CardTitle>Boletos</CardTitle>
              <CardDescription>Baixe seus boletos de pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Baixar Boleto</h3>
                <p className="text-muted-foreground mb-6">
                  Clique no botão abaixo para baixar seu boleto atual
                </p>
                <Button variant="medical">
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
