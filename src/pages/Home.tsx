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
import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, FileText, User } from "lucide-react";
import Banner1 from '@/assets/banner1.png'
import Banner2 from '@/assets/banner2.png'
import Banner3 from '@/assets/banner3.png'
import BannerMobile1 from '@/assets/banner1_mobile.png'
import BannerMobile2 from '@/assets/banner2_mobile.png'
import BannerMobile3 from '@/assets/banner3_mobile.png'
import Autoplay from "embla-carousel-autoplay";
import { useIsMobile } from "@/hooks/use-mobile";

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const isMobile = useIsMobile();
  const desktopBanners = [Banner1, Banner2, Banner3];
  const mobileBanners = [BannerMobile1, BannerMobile2, BannerMobile3];
  const banners = isMobile ? mobileBanners : desktopBanners;
  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }));

  return (
    <div className="space-y-8">
      {/* Seção de Boas-vindas */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Olá,</h1>
            <h2 className="text-2xl font-semibold mb-4">{user?.nome}</h2>
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
        >
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={index}>
                <div className={`overflow-hidden rounded-lg ${isMobile ? 'h-[180px]' : 'h-[300px]'}`}>
                  <img src={banner} alt={`Banner ${index + 1}`} className="w-full h-full object-contain rounded-lg" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden h-10 w-10 bg-primary/50 text-white hover:bg-primary/70 group-hover:flex disabled:hidden sm:flex" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden h-10 w-10 bg-primary/50 text-white hover:bg-primary/70 group-hover:flex disabled:hidden sm:flex" />
        </Carousel>
      </div>
    </div>
  );
};
