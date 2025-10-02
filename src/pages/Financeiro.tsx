import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { useIsMobile } from "../hooks/use-mobile";
import {
  CreditCard,
  FileText,
  Download,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Barcode,
  Copy,
  QrCode,
  ExternalLink,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { financeiroService } from "../services/financeiroService";
import * as ApiTypes from "../types/api";
import { useAuth } from "@/contexts/AuthContext";
import { useResponsavelFinanceiro } from "@/hooks/usePermissao";
import { useCopart } from "@/hooks/useCopart";
import { CopartTable } from "@/services/copartService";
import { set } from "date-fns";

export const Financial: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const [parcelas, setParcelas] = useState<ApiTypes.Installment[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [selectedInvoice, setSelectedInvoice] =
    useState<ApiTypes.Installment | null>(null);
  const [copartModalOpen, setCopartModalOpen] = useState(false);
  const [copartTable, setCopartTable] = useState("");
  const [coparticipacao, setCoparticipacao] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(
    (currentYear - 1).toString()
  );
  const [irpfData, setIrpfData] = useState<any[]>([]);

  const { toast } = useToast();
  const { user } = useAuth();
  const ehResponsavelFinanceiro = useResponsavelFinanceiro();
  const { ehCoparticipativo } = useCopart();

  // Carregar parcelas
  useEffect(() => {
    const fetchParcelas = async () => {
      if (!user?.perfilAutenticado) {
        setLoading(false);
        return;
      }
      try {
        const dados = await financeiroService.listarParcelas({
          PerfilAutenticado: user.perfilAutenticado,
        });
        setParcelas(dados);
        console.log("Estado 'parcelas' atualizado:", dados);
      } catch (error) {
        console.error("Erro ao buscar parcelas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParcelas();
  }, [user]);

  // Listar IRPF
  useEffect(() => {
    const fetchIrpfData = async () => {
      if (!user?.perfilAutenticado) {
        return;
      }
      try {
        const dados = await financeiroService.listarExtratoIRPF({
          PerfilAutenticado: user.perfilAutenticado,
        });
        setIrpfData(dados);
      } catch (err) {
        console.error("Erro ao buscar extratos IRPF:", err);
      }
    };
    fetchIrpfData();
  }, [user]);

  // Baixar IRPF
  const handleDownloadIRPF = async () => {
    if (!user?.perfilAutenticado) return;
    try {
      const blob = await financeiroService.getExtratoIRPF({
        PerfilAutenticado: user?.perfilAutenticado,
        ano: parseInt(selectedYear, 10),
      });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `informe-irpf-${selectedYear}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast({
        title: "Download Iniciado",
        description: `O informe de IRPF para o ano de ${selectedYear} está sendo baixado.`,
      });
    } catch (err) {
      console.error("Erro ao baixar extrato IRPF:", err);
    }
  };

  //tabela de copart
  const handleCopartTable = async () => {
    if (!user?.perfilAutenticado) return;

    try {
      const response = await CopartTable.copartTableRequest({
        perfilAutenticado: user.perfilAutenticado,
      });

      if (response?.link) {
        window.open(response.link, "_blank", "noopener,noreferrer");
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível obter o link da tabela.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Erro ao buscar tabela de coparticipação:", err);
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao buscar a tabela de coparticipação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Abrir pagamento e buscar código de barras
  const handlePayClick = async (invoice: ApiTypes.Installment) => {
    if (!user?.perfilAutenticado) return;
    try {
      const codigo = await financeiroService.getCodigoBarras({
        PerfilAutenticado: user?.perfilAutenticado,
        codigoMensalidade: invoice.codigoMensalidade,
      });
      setBarcode(codigo?.codigoBarras || "");
      setSelectedInvoice(invoice);
      setIsPaymentModalOpen(true);
    } catch (err) {
      console.error("Erro ao buscar código de barras:", err);
    }
  };

  // baixar boleto
  const handleDownloadBoleto = async (invoice?: ApiTypes.Installment) => {
    const invoiceToDownload = invoice || selectedInvoice;
    if (!invoiceToDownload || !user?.perfilAutenticado) return;
    try {
      const blob = await financeiroService.baixarBoleto({
        PerfilAutenticado: user?.perfilAutenticado,
        codigoMensalidade: invoiceToDownload.codigoMensalidade,
      });

      const prefixo = invoiceToDownload.status === "Pago" ? "recibo" : "boleto";
      const mes = String(invoiceToDownload.mescompetencia || "").padStart(
        2,
        "0"
      );
      const ano = invoiceToDownload.anocompetencia;

      const nomeArquivo =
        mes && ano
          ? `${prefixo}-${mes}-${ano}.pdf`
          : `${prefixo}-${invoiceToDownload.codigoMensalidade}.pdf`;

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", nomeArquivo);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Erro ao baixar boleto:", err);
    }
  };

  // Copiar código de barras
  const handleCopyBarcode = () => {
    if (!barcode) return;
    navigator.clipboard.writeText(barcode.replace(/\s/g, ""));
    toast({
      title: "Código de Barras Copiado!",
      description:
        "O código de barras foi copiado para a área de transferência.",
    });
    setIsPaymentModalOpen(false);
  };

  // Extrato de Coparticipação
  const handleExtratoCoPart = async (invoice: ApiTypes.Installment) => {
    if (!user?.perfilAutenticado) return;

    try {
      const extrato = await financeiroService.getExtratoCoParticipacao({
        PerfilAutenticado: user?.perfilAutenticado,
        anoCompetencia: invoice.anocompetencia,
        mesCompetencia: invoice.mescompetencia,
      });

      const url = window.URL.createObjectURL(new Blob([extrato]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "extrato_coparticipacao.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Você não possui uma conta coparticipativa",
        variant: "destructive",
      }),
        console.error("Erro ao consultar extrato:", err);
    }
  };

  return (
    <div className="space-y-8">
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

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices">
            {ehResponsavelFinanceiro
              ? "Faturas e Boletos"
              : "Extrato de Coparticipação"}
          </TabsTrigger>
          <TabsTrigger value="irpf">Imposto de Renda</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          <Card className="card-medical">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <CardTitle>
                    {ehResponsavelFinanceiro
                      ? "Parcelas dos últimos 12 meses"
                      : "Extratos de Coparticipação"}
                  </CardTitle>
                  <CardDescription>
                    {ehResponsavelFinanceiro
                      ? "Visualize e gerencie suas mensalidades"
                      : "Baixe seus extratos de coparticipação por competência"}
                  </CardDescription>
                </div>

                {ehCoparticipativo && (
                  <Button
                    asChild
                    onClick={handleCopartTable}
                    variant="outline"
                    className="w-full sm:w-auto bg-blue-400 hover:bg-blue-400/80 text-white"
                  >
                    <a href="#">
                      <ExternalLink className="mr-2 h-4 w-4" /> Tabela de
                      Coparticipação
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parcelas.map((p) => (
                  <div
                    key={p.codigoMensalidade}
                    className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {ehResponsavelFinanceiro ? (
                          <DollarSign className="h-5 w-5 text-primary" />
                        ) : (
                          <Calendar className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        {ehResponsavelFinanceiro ? (
                          <>
                            <p className="font-medium">
                              {p.valor.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Vencimento:{" "}
                              {p.vencimento
                                ? new Date(p.vencimento).toLocaleDateString()
                                : "-"}
                            </p>
                          </>
                        ) : (
                          <p className="font-medium">
                            Competência: {p.competencia || "N/A"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 w-full sm:w-auto pb-8 sm:pb-0">
                      {ehResponsavelFinanceiro && (
                        <div className="hidden sm:flex">
                          {p.status === "Pago" ? (
                            <Badge
                              variant="outline"
                              className="flex items-center space-x-1 border-transparent bg-blue-600 text-blue-50 hover:bg-blue-600/80"
                            >
                              <CheckCircle className="h-3 w-3" />
                              <span>Pago</span>
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="flex items-center space-x-1 border-transparent bg-yellow-500 text-yellow-50 hover:bg-yellow-500/80"
                            >
                              <Clock className="h-3 w-3" />
                              <span>Em Aberto</span>
                            </Badge>
                          )}
                        </div>
                      )}

                      {ehResponsavelFinanceiro && (
                        <>
                          {p.status === "Pago" ? (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleDownloadBoleto(p)}
                            >
                              <Download className="h-4 w-4 mr-2" /> Ver Recibo
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handlePayClick(p)}
                            >
                              <Barcode className="h-4 w-4 mr-2" /> Pagar Fatura
                            </Button>
                          )}
                        </>
                      )}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span tabIndex={0}>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExtratoCoPart(p)}
                                disabled={!ehCoparticipativo}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                {ehResponsavelFinanceiro
                                  ? "Extrato Copart"
                                  : "Baixar Extrato"}
                              </Button>
                            </span>
                          </TooltipTrigger>
                          {!ehCoparticipativo && (
                            <TooltipContent>
                              Seu plano não é coparticipativo.
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                      {ehResponsavelFinanceiro && (
                        <>
                          <div className="absolute bottom-2 right-2 sm:hidden">
                            {p.status === "Pago" ? (
                              <Badge
                                variant="outline"
                                className="flex items-center space-x-1 border-transparent bg-blue-600 text-blue-50 hover:bg-blue-600/80"
                              >
                                <CheckCircle className="h-3 w-3" />
                                <span>Pago</span>
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="flex items-center space-x-1 border-transparent bg-yellow-500 text-yellow-50 hover:bg-yellow-500/80"
                              >
                                <Clock className="h-3 w-3" />
                                <span>Em Aberto</span>
                              </Badge>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="irpf" className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="default" onClick={handleDownloadIRPF}>
              <Calendar className="h-4 w-4 mr-2" />
              Baixar Informe IRPF ({selectedYear})
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="card-medical">
              <CardHeader>
                <CardTitle>Extrato IRPF</CardTitle>
                <CardDescription>Informe de rendimentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {irpfData.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">{item.descricao}</p>
                        <p className="text-xs text-muted-foreground">
                          Ano {item.ano}
                        </p>
                      </div>
                      <p className="text-sm font-medium">R$ {item.valor}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Pagamento da Fatura</DialogTitle>
            <DialogDescription>
              {selectedInvoice &&
                `Vencimento: ${new Date(
                  selectedInvoice.vencimento
                ).toLocaleDateString()} - Valor: R$ ${selectedInvoice.valor.toFixed(
                  2
                )}`}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="barcode" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="barcode">Código de Barras</TabsTrigger>
              <TabsTrigger value="credit-card">Cartão de Crédito</TabsTrigger>
              <TabsTrigger value="pix">PIX</TabsTrigger>
            </TabsList>
            <TabsContent value="barcode" className="mt-4">
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <Input
                  id="barcode"
                  value={barcode}
                  readOnly
                  className="text-center font-mono text-sm tracking-wider"
                />
                <Button onClick={handleCopyBarcode} className="w-full">
                  <Copy className="mr-2 h-4 w-4" /> Copiar Código
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="credit-card" className="mt-4">
              <div className="flex flex-col items-center justify-center space-y-4 p-10 border rounded-lg bg-muted/20 text-center">
                <Clock className="h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">
                  O pagamento com Cartão de Crédito estará disponível em breve.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="pix" className="mt-4">
              <div className="flex flex-col items-center justify-center space-y-4 p-10 border rounded-lg bg-muted/20 text-center">
                <Clock className="h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">
                  O pagamento com PIX estará disponível em breve.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => handleDownloadBoleto()}
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Boleto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={copartModalOpen} onOpenChange={setCopartModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Extrato de Coparticipação
            </DialogTitle>
            <DialogDescription>
              Itens cobrados no mês selecionado
            </DialogDescription>
          </DialogHeader>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                {coparticipacao.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum item encontrado.
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Descrição</th>
                        <th className="text-right p-2">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coparticipacao.map((item, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="p-2">{item.descricao}</td>
                          <td className="p-2 text-right">R$ {item.valor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};
