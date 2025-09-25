import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Gift,
  ExternalLink,
  AlertTriangle,
  Share2,
  Info,
  Check,
  X,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { beneficiosService } from "../services/beneficiosService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Beneficios: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [blockedLink, setBlockedLink] = useState<string | null>(null);

  const handleAccessClub = async () => {
    if (!user?.perfilAutenticado || !user.cpf) {
      toast({
        title: "Erro de Autenticação",
        description: "Dados do usuário incompletos. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await beneficiosService.clubBenf({
        perfilAutenticado: user.perfilAutenticado,
        cpf: user.cpf,
      });

      if (response?.webSmartLink) {
        setGeneratedLink(response.webSmartLink);
      } else {
        toast({
          title: "Erro ao obter link",
          description: "Não foi possível obter o link de acesso. Tente novamente.",
          variant: "destructive",
        });
        setIsConfirmationDialogOpen(false);
      }
    } catch (error) {
      console.error("Erro ao obter link do clube:", error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro de conexão. Por favor, tente mais tarde.",
        variant: "destructive",
      });
      setIsConfirmationDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmationOpenChange = (isOpen: boolean) => {
    setIsConfirmationDialogOpen(isOpen);
    if (!isOpen) {
      setGeneratedLink(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Gift className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Clube de Benefícios</h1>
            <p className="text-muted-foreground text-lg">
              Aproveite descontos e vantagens exclusivas para você.
            </p>
          </div>
        </div>
      </div>

      <Card className="card-medical max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Acesso ao Clube</CardTitle>
          <CardDescription>
            Clique no botão abaixo para ser redirecionado com segurança para o
            nosso portal de benefícios.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Dialog
            open={isConfirmationDialogOpen}
            onOpenChange={onConfirmationOpenChange}
          >
            <DialogTrigger asChild>
              <Button size="lg" className="w-full sm:w-auto">
                Acessar Clube de Benefícios
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="text-yellow-500" />
                  Atenção
                </DialogTitle>
                {!generatedLink ? (
                  <DialogDescription
                    asChild
                    className="pt-4 max-h-[60vh] overflow-y-auto pr-2"
                  >
                    <div className="space-y-4 text-sm text-left">
                      <p className="font-bold text-center text-base">
                        Termo de Ciência – Redirecionamento para Parceiro
                      </p>
                      <p>
                        Você está prestes a acessar serviços oferecidos pela
                        nossa parceira, a{" "}
                        <b className="text-primary">Alloyal</b>.
                      </p>
                      <p>
                        Ao continuar, você será direcionado para fora do
                        ambiente do Bensaúde.
                      </p>

                      <Alert variant="default" className="bg-blue-50 border-blue-200">
                        <Share2 className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-800">
                          Compartilhamento de Dados
                        </AlertTitle>
                        <AlertDescription className="text-blue-700 space-y-2">
                          <p>
                            Para que você seja identificado e acesse os
                            benefícios, o Bensaúde compartilha com a Alloyal
                            apenas:
                          </p>
                          <ul className="list-disc list-inside pl-4 font-medium">
                            <li>Nome completo</li>
                            <li>CPF</li>
                          </ul>
                        </AlertDescription>
                      </Alert>

                      <Alert variant="destructive" className="bg-yellow-50 border-yellow-200">
                        <Info className="h-4 w-4 text-yellow-600" />
                        <AlertTitle className="text-yellow-800">Importante</AlertTitle>
                        <AlertDescription className="text-yellow-700">
                          A partir do seu acesso ao ambiente da Alloyal, o tratamento dos seus dados passa a ser de responsabilidade deles, seguindo suas próprias políticas de privacidade.
                        </AlertDescription>
                      </Alert>
                      <p className="text-xs text-center text-muted-foreground pt-2">
                        Ao selecionar “OK”, você declara estar ciente e confirma o redirecionamento.
                        informações e confirma o redirecionamento. Caso não
                        queira prosseguir, basta clicar em “Cancelar”.
                      </p>
                    </div>
                  </DialogDescription>
                ) : (
                  <DialogDescription className="pt-4">
                    Seu link de acesso foi gerado! Clique no botão abaixo para
                    abrir o Clube de Benefícios em uma nova aba.
                  </DialogDescription>
                )}
              </DialogHeader>
              <DialogFooter>
                {!generatedLink ? (
                  <>
                    <DialogClose asChild>
                      <Button variant="ghost" disabled={isLoading}>
                        <X className="mr-2 h-4 w-4" /> Cancelar
                      </Button>
                    </DialogClose>
                    <Button onClick={handleAccessClub} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" /> OK
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button asChild className="w-full">
                    <a
                      href={generatedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Clique aqui para Acessar
                    </a>
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Diálogo para link bloqueado */}
      <Dialog
        open={!!blockedLink}
        onOpenChange={(isOpen) => !isOpen && setBlockedLink(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" />
              Pop-up Bloqueado
            </DialogTitle>
            <DialogDescription className="pt-4">
              O seu navegador bloqueou a abertura de uma nova janela. Por favor,
              clique no link abaixo para acessar o Clube de Benefícios.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <a
              href={blockedLink || ""}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
            >
              {blockedLink}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
