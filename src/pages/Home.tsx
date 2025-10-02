import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, FileText, User } from "lucide-react";
import Banner from '@/assets/banner.png'
import Autoplay from "embla-carousel-autoplay";

export const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Olá, {user?.nome}</h1>
            <p className="text-muted-foreground text-lg">
              Gerencie seus benefícios de saúde com facilidade
            </p>
          </div>
        </div>
      </div>

      <Card className="card-medical">
        <CardHeader>
          <CardTitle>Seus Dados Principais</CardTitle>
          <CardDescription>
            Um resumo das suas informações mais importantes.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <CreditCard className="h-6 w-6 text-primary" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Carteirinha</p>
              <p className="text-sm text-muted-foreground">{user?.numeroCarteirinha || "Não informado"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <User className="h-6 w-6 text-primary" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">CPF</p>
              <p className="text-sm text-muted-foreground">{user?.cpf || "Não informado"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <FileText className="h-6 w-6 text-primary" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Nº do Contrato</p>
              <p className="text-sm text-muted-foreground">{user?.codigoContrato || "Não informado"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/contrato">
              Ver todos os dados
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <div className="w-full max-h-64 overflow-hidden rounded-xl">
        <Carousel
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem key={index}>
                <img src={Banner} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
