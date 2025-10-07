import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldPlus,
  ExternalLink,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
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

export const TeleMedicina: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const telemedicinaLink = "https://telemedicina.bensaude.com.br/";

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <ShieldPlus className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Telemedicina</h1>
            <p className="text-muted-foreground text-lg">
              Acesse consultas médicas por vídeo de onde estiver.
            </p>
          </div>
        </div>
      </div>

      <Card className="card-medical max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Acesso à Plataforma</CardTitle>
          <CardDescription>
            Clique no botão abaixo para ser redirecionado com segurança para o
            portal de Telemedicina.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full sm:w-auto">
                Acessar Telemedicina
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="text-yellow-500" />
                  Redirecionamento Externo
                </DialogTitle>
                <DialogDescription className="pt-4">
                  Você será redirecionado para a plataforma de Telemedicina, que
                  é um serviço parceiro. Deseja continuar?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">
                    <X className="mr-2 h-4 w-4" /> Cancelar
                  </Button>
                </DialogClose>
                <Button asChild>
                  <a
                    href={telemedicinaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <Check className="mr-2 h-4 w-4" /> Continuar
                  </a>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};
