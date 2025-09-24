import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bone,
  ShieldPlus,
  Trash2,
  UserPlus,
  PlusCircle,
  Check,
} from "lucide-react";
import { comercialService } from "@/services";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useIsMobile } from "@/hooks/use-mobile";

const commercialOptions = [
  {
    title: "Adicionar Dependentes",
    description: "Inclua novos dependentes em seu plano.",
    icon: UserPlus,
    path: "",
    action: "addDependent",
    color: "text-blue-500",
  },
  {
    title: "Contratar SOS",
    description:
      "Adquira o serviço de atendimento pré-hospitalar de urgência e emergência.",
    icon: ShieldPlus,
    path: "/contratar-sos",
    action: null,
    color: "text-red-500",
  },
  {
    title: "Contratar Plano Ortopédico",
    description: "Adicione o acessório de cobertura ortopédica ao seu plano.",
    icon: Bone,
    path: "/ortopedico",
    action: null,
    color: "text-black",
  },
];

export const Comercial = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dependents, setDependents] = useState([
    { nome: "", cpf: "", dataNascimento: "", cidade: "", celular: "" },
  ]);
  const isMobile = useIsMobile();

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newDependents = [...dependents];
    newDependents[index] = { ...newDependents[index], [name]: value };
    setDependents(newDependents);
  };

  const addDependentField = () => {
    if (dependents.length < 5) {
      setDependents([
        ...dependents,
        { nome: "", cpf: "", dataNascimento: "", cidade: "", celular: "" },
      ]);
    }
  };

  const removeDependentField = (index: number) => {
    if (dependents.length > 1) {
      const newDependents = dependents.filter((_, i) => i !== index);
      setDependents(newDependents);
    }
  };

  const handleAddDependent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.perfilAutenticado) {
      toast({
        title: "Erro de autenticação",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const novosDependentes = dependents.map((dep) => ({
        ...dep,
        cpf: parseInt(dep.cpf.replace(/\D/g, "")),
        dataNascimento: dep.dataNascimento,
        celular: dep.celular.replace(/\D/g, ""),
      }));

      await comercialService.addDependent({
        perfilAutenticado: user.perfilAutenticado,
        novosDependentes,
      });

      toast({
        title: "Sucesso!",
        description: "Dependente(s) adicionado(s) com sucesso.",
      });
      setIsDialogOpen(false);
      setDependents([
        { nome: "", cpf: "", dataNascimento: "", cidade: "", celular: "" },
      ]);
    } catch (error: any) {
      toast({
        title: "Erro ao Adicionar Dependente",
        description:
          error.message || "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Área Comercial</h1>
        <p className="text-muted-foreground text-lg">
          Gerencie seus produtos e adicione novos serviços.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {commercialOptions.map((option) => {
          if (option.action === "addDependent") {
            return (
              <Dialog
                key={option.title}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
              >
                <DialogTrigger asChild>
                  <Card className="card-medical h-full flex flex-col hover:border-primary transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 flex items-center justify-center rounded-lg bg-muted`}
                        >
                          <option.icon className={`h-6 w-6 ${option.color}`} />
                        </div>
                        <CardTitle>{option.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription>{option.description}</CardDescription>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Dependente</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do dependente abaixo.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddDependent}>
                    <div className="max-h-[60vh] overflow-y-auto p-1">
                      {dependents.map((dependent, index) => (
                        <div
                          key={index}
                          className="space-y-4 py-4 border-b last:border-b-0 relative pr-10"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium text-muted-foreground">
                              Dependente {index + 1}
                            </p>
                            {dependents.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-0 h-8 w-8"
                                onClick={() => removeDependentField(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">
                                  Remover Dependente
                                </span>
                              </Button>
                            )}
                          </div>
                          {isMobile ? (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor={`nome-${index}`}>Nome</Label>
                                <Input
                                  id={`nome-${index}`}
                                  name="nome"
                                  value={dependent.nome}
                                  onChange={(e) => handleInputChange(index, e)}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`cpf-${index}`}>CPF</Label>
                                <Input
                                  id={`cpf-${index}`}
                                  name="cpf"
                                  value={dependent.cpf}
                                  onChange={(e) => handleInputChange(index, e)}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`dataNascimento-${index}`}>
                                  Nascimento
                                </Label>
                                <Input
                                  id={`dataNascimento-${index}`}
                                  name="dataNascimento"
                                  type="date"
                                  value={dependent.dataNascimento}
                                  onChange={(e) => handleInputChange(index, e)}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`cidade-${index}`}>
                                  Cidade
                                </Label>
                                <Input
                                  id={`cidade-${index}`}
                                  name="cidade"
                                  value={dependent.cidade}
                                  onChange={(e) => handleInputChange(index, e)}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`celular-${index}`}>
                                  Celular
                                </Label>
                                <Input
                                  id={`celular-${index}`}
                                  name="celular"
                                  value={dependent.celular}
                                  onChange={(e) => handleInputChange(index, e)}
                                  required
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor={`nome-${index}`}
                                  className="text-right"
                                >
                                  Nome
                                </Label>
                                <Input
                                  id={`nome-${index}`}
                                  name="nome"
                                  value={dependent.nome}
                                  onChange={(e) => handleInputChange(index, e)}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor={`cpf-${index}`}
                                  className="text-right"
                                >
                                  CPF
                                </Label>
                                <Input
                                  id={`cpf-${index}`}
                                  name="cpf"
                                  value={dependent.cpf}
                                  onChange={(e) => handleInputChange(index, e)}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor={`dataNascimento-${index}`}
                                  className="text-right"
                                >
                                  Nascimento
                                </Label>
                                <Input
                                  id={`dataNascimento-${index}`}
                                  name="dataNascimento"
                                  type="date"
                                  value={dependent.dataNascimento}
                                  onChange={(e) => handleInputChange(index, e)}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor={`cidade-${index}`}
                                  className="text-right"
                                >
                                  Cidade
                                </Label>
                                <Input
                                  id={`cidade-${index}`}
                                  name="cidade"
                                  value={dependent.cidade}
                                  onChange={(e) => handleInputChange(index, e)}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor={`celular-${index}`}
                                  className="text-right"
                                >
                                  Celular
                                </Label>
                                <Input
                                  id={`celular-${index}`}
                                  name="celular"
                                  value={dependent.celular}
                                  onChange={(e) => handleInputChange(index, e)}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {dependents.length < 5 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-4 flex items-center justify-center gap-2"
                        onClick={addDependentField}
                      >
                        <PlusCircle className="h-4 w-4" />
                        Adicionar Outro Dependente
                      </Button>
                    )}

                    <DialogFooter className="gap-2 pt-4 sm:pt-2">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full sm:w-auto"
                        >
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                      >
                        {isSubmitting ? (
                          <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        Adicionar
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            );
          }

          return (
            <Link
              to={option.path}
              key={option.title}
              className="block hover:no-underline"
            >
              <Card className="card-medical h-full flex flex-col hover:border-primary transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-lg bg-muted`}
                    >
                      <option.icon className={`h-6 w-6 ${option.color}`} />
                    </div>
                    <CardTitle>{option.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{option.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
