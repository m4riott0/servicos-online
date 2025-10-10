import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, History, Star, User } from "lucide-react";
import { utilizacaoService } from "@/services/utilizacaoService";
import type { UtilizacaoItem, Beneficiary } from "@/types/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Extrai a lista de utilizações da resposta da API.
const getUtilizationsFromResponse = (response: any): UtilizacaoItem[] => {
  const data =
    response && typeof response === "object" && "procedimentos" in response
      ? response.procedimentos
      : response;
  return Array.isArray(data) ? data : [];
};

// Extrai e ajusta a lista de beneficiários da API (mapeia `codigoBeneficiario` para `codigo`).
const getBeneficiariesFromResponse = (response: any): Beneficiary[] => {
  const data = (response as any)?.dados ?? response;
  if (!Array.isArray(data)) return [];

  return data.map((item: any) => ({
    codigo: item.codigoBeneficiario,
    nome: item.nome,
  }));
};

// Página de Histórico de Utilização
export const Utilizacao: React.FC = () => {
  const categories = [
    "CONSULTAS",
    "EXAMES_TERAPIAS",
    "INTERNACAO",
    "OUTRAS_DESPESAS",
  ];

  // Formata os nomes das categorias para exibição.
  const formatCategories = (categories: string): string => {
    switch (categories) {
      case "CONSULTAS":
        return "Consultas";
      case "EXAMES_TERAPIAS":
        return "Exames e Terapias";
      case "INTERNACAO":
        return "Internação";
      case "ODONTOLOGICO":
        return "Odontologia";
      case "OUTRAS_DESPESAS":
        return "Outras Despesas";
      default:
        return categories;
    }
  };

  // Estados do componente
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>("");
  const [utilizations, setUtilizations] = useState<UtilizacaoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUtilization, setSelectedUtilization] =
    useState<UtilizacaoItem | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { user } = useAuth();
  const { toast } = useToast();

  // Busca o histórico de utilização para um beneficiário.
  const fetchUtilizations = useCallback(
    async (beneficiaryCode: string) => {
      if (!user?.perfilAutenticado) return;

      setIsHistoryLoading(true);
      try {
        const historyResponse = await utilizacaoService.getListaUtilizacao({
          perfilAutenticado: user.perfilAutenticado,
          codigoBeneficiario: beneficiaryCode,
        });

        const utilizationsData = getUtilizationsFromResponse(historyResponse);
        setUtilizations(utilizationsData);

        if (
          utilizationsData.length === 0 &&
          ((historyResponse as any)?.erro || (historyResponse as any)?.mensagem)
        ) {
          toast({
            title: "Aviso sobre o Histórico",
            description:
              (historyResponse as any).erro ||
              (historyResponse as any).mensagem,
            variant: "default",
          });
        }
      } catch (error) {
        toast({
          title: "Erro ao buscar histórico",
          description:
            (error as Error).message ||
            "Não foi possível carregar o histórico de utilização.",
          variant: "destructive",
        });
        setUtilizations([]);
      } finally {
        setIsHistoryLoading(false);
      }
    },
    [user?.perfilAutenticado, toast]
  );

  // Carrega a lista de beneficiários quando a página abre.
  useEffect(() => {
    const loadInitialData = async () => {      
      if (!user?.perfilAutenticado) return;

      setIsLoading(true);
      try {
        const beneficiariesResponse =
          await utilizacaoService.getBeneficiariosUtilizacao({
            perfilAutenticado: user.perfilAutenticado,
          });

        const loadedBeneficiaries = getBeneficiariesFromResponse(
          beneficiariesResponse
        );
        setBeneficiaries(loadedBeneficiaries);

        if (loadedBeneficiaries.length > 0) {
          const initialBeneficiaryCode = 
            loadedBeneficiaries.length === 1 
              ? loadedBeneficiaries[0].codigo 
              : user.codigoBeneficiario || loadedBeneficiaries[0]?.codigo;
          setSelectedBeneficiary(initialBeneficiaryCode);
        }
      } catch (error) {
        toast({
          title: "Erro ao carregar dados",
          description:
            (error as Error).message ||
            "Não foi possível carregar a lista de beneficiários.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadInitialData();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Busca o histórico sempre que o beneficiário selecionado muda.
  useEffect(() => {
    if (selectedBeneficiary) {
      fetchUtilizations(selectedBeneficiary);
    }
  }, [selectedBeneficiary, fetchUtilizations]);

  // Atualiza o beneficiário selecionado quando o usuário troca no select.
  const handleBeneficiaryChange = (beneficiaryCode: string) => {
    setSelectedBeneficiary(beneficiaryCode);
  };

  // Envia a avaliação do atendimento.
  const handleAvaliarAtendimento = async () => {
    if (!user?.perfilAutenticado || !selectedUtilization || rating === 0) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, selecione uma nota para a avaliação.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await utilizacaoService.avaliarAtendimento({
        perfilAutenticado: user.perfilAutenticado,
        codigoBeneficiario: selectedBeneficiary,
        codigoPrestador: selectedUtilization.procedimento,
        data: selectedUtilization.data,
        nota: rating,
        comentario: comment,
      });

      setUtilizations(
        utilizations.map((u) =>
          u === selectedUtilization ? { ...u, jaAvaliado: true } : u
        )
      );

      toast({
        title: "Avaliação enviada!",
        description: "Agradecemos seu feedback.",
      });
      setIsModalOpen(false);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast({
        title: "Erro ao enviar avaliação",
        description:
          (error as Error).message ||
          "Não foi possível enviar sua avaliação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Agrupa as utilizações por categoria para exibição.
  const groupedUtilizations = useMemo(() => {
    const initialGroups: Record<
      string,
      { items: UtilizacaoItem[]; total: number }
    > = {};

    categories.forEach((cat) => {
      initialGroups[cat] = { items: [], total: 0 };
    });

    utilizations.forEach((item) => {
      const categoryName = item.categoria || "Outras Despesas";
      if (initialGroups[categoryName]) {
        initialGroups[categoryName].items.push(item);
        initialGroups[categoryName].total += item.valor;
      }
    });

    return initialGroups;
  }, [utilizations, categories]);

  // Renderização do componente
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl p-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <History className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Histórico de Utilização</h1>
            <p className="text-muted-foreground text-lg">
              Consulte o detalhamento do uso do seu plano de saúde.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : beneficiaries.length > 0 ? (
        <>
          {beneficiaries.length > 0 && (
            <Card className="card-medical">
              <CardHeader>
                <CardTitle>Selecionar Beneficiário</CardTitle>
                <CardDescription>
                  Escolha o beneficiário para visualizar o histórico de
                  utilização.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedBeneficiary}
                  onValueChange={handleBeneficiaryChange}
                >
                  <SelectTrigger disabled={beneficiaries.length <= 1}>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    {beneficiaries.map((b) => (
                      <SelectItem key={b.codigo} value={b.codigo}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" /> <span>{b.nome}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {isHistoryLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="md" />
            </div>
          ) : utilizations.length > 0 ? (
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-4"
              defaultValue={Object.keys(groupedUtilizations).find(
                (cat) => groupedUtilizations[cat].items.length > 0
              )}
            >
              {categories.map((categoryName) => {
                const group = groupedUtilizations[categoryName];
                return (
                  <Card
                    key={categoryName}
                    className="card-medical overflow-hidden"
                  >
                    <AccordionItem value={categoryName} className="border-b-0">
                      <AccordionTrigger className="p-6 hover:no-underline">
                        <div className="flex justify-between items-center w-full">
                          <div className="text-left">
                            <h3 className="font-semibold text-lg">
                              {formatCategories(categoryName)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {group.items.length} procedimento(s)
                            </p>
                          </div>
                          <div className="flex items-baseline gap-2 pr-4">
                            <p className="font-bold text-lg text-gray-600">Total Gasto:</p>
                            <p className="text-lg font-bold text-primary">
                              {group.total.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="px-6 pb-6">
                          {group.items.length > 0 ? (
                            <div className="space-y-4 border-t pt-6">
                              {group.items.map((item, index) => (
                                <Card key={index} className="bg-background/50">
                                  <CardContent className="p-4 grid gap-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-semibold">
                                          {item.fantasia}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {item.local}
                                        </p>
                                      </div>
                                      <p className="text-sm text-muted-foreground whitespace-nowrap">
                                        {new Date(item.data).toLocaleDateString(
                                          "pt-BR",
                                          {
                                            timeZone: "UTC",
                                          }
                                        )}
                                      </p>
                                    </div>
                                    <div className="border-t pt-4 space-y-2">
                                      <p className="text-sm font-medium">
                                        Procedimento:
                                      </p>
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground pl-2">
                                        <p>
                                          <b>{item.procedimento}</b> -{" "}
                                          {item.descricao}
                                        </p>
                                      </div>
                                    </div>
                                    {!item.jaAvaliado ? (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedUtilization(item);
                                          setIsModalOpen(true);
                                        }}
                                      >
                                        <Star className="h-4 w-4 mr-2" />{" "}
                                        Avaliar Atendimento
                                      </Button>
                                    ) : (
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                                        <span>Atendimento já avaliado</span>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-sm text-muted-foreground py-8 border-t">
                              Nenhum registro nesta categoria.
                            </p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                );
              })}
            </Accordion>
          ) : (
            <Card className="card-medical">
              <CardContent className="text-center py-12 flex flex-col items-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Nenhum registro de utilização
                </h3>
                <p className="text-muted-foreground">
                  Este beneficiário não possui histórico de utilização.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="card-medical">
          <CardContent className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">
              Nenhuma utilização encontrada
            </h3>
            <p className="text-muted-foreground">
              Não há registros de utilização para o beneficiário selecionado.
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avaliar Atendimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nota</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comentário (opcional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Deixe seu comentário sobre o atendimento..."
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleAvaliarAtendimento} disabled={isSubmitting}>
              {isSubmitting && <LoadingSpinner className="mr-2 h-4 w-4" />}
              Enviar Avaliação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
