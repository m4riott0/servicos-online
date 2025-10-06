import React, { useState, useEffect, useCallback } from "react";
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
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, FileText, User } from "lucide-react";
import Banner2 from '@/assets/banner2.png'
import Banner4 from '@/assets/banner4.png'
import Autoplay from "embla-carousel-autoplay";

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );
  const banners = [ Banner2, Banner4];

  return (
    <div className="space-y-8">
      {/* Seção de Boas-vindas */}
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

      {/* Card de Dados Principais */}
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
      
      {/* Carrossel de Banners */}
      <div className="w-full max-w-[1800px] mx-auto">
        <Carousel
          setApi={setApi}
          plugins={[
            plugin.current
          ]}
          className="relative rounded-xl group"
          opts={{
            loop: true,
          }}
          onMouseEnter={() => plugin.current.stop()}
          onMouseLeave={() => plugin.current.play()}
        >
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={index}>
                <div className="overflow-hidden rounded-lg h-[300px]">
                  <img src={banner} alt={`Banner ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* Indicadores de Pontos (Dots) */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: count }).map((_, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className={`h-2 w-2 rounded-full p-0 transition-colors ${index === current ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground/50'}`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
