import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Search,
  MapPin,
  Phone,
  Stethoscope,
  Filter
} from 'lucide-react';
import { medicalService } from '../services/medicalService';
import { useToast } from '../hooks/use-toast';
import type { MedicalGuideCity, MedicalGuideSpecialty, MedicalGuideProvider } from '../types/api';
import type * as ApiTypes from '../types/api';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle, 
  DialogClose
} from "@/components/ui/dialog";
import Selo from '@/components/layout/Selo';

export const MedicalGuide: React.FC = () => {
  const [cities, setCities] = useState<MedicalGuideCity[]>([]);
  const [specialties, setSpecialties] = useState<MedicalGuideSpecialty[]>([]);
  const [providers, setProviders] = useState<MedicalGuideProvider[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [cityError, setCityError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [citiesData, specialtiesData] = await Promise.all([
        medicalService.getMedicalCities(),
        medicalService.getMedicalSpecialties(),
      ]);
      setCities(citiesData || []);
      setSpecialties(specialtiesData || []);
    } catch (error) {
      console.error('Erro ao carregar guia médico:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCity('');
    setSelectedSpecialty('');
    setSearchTerm('');
    setCityError('');
    setProviders([]);
  };

  const validateForm = (): boolean => {
    if (!selectedCity) {
      setCityError('Selecione uma cidade.');
      return false;
    }
    setCityError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload: ApiTypes.ProviderRequest = {
      ...(selectedCity && { codigoCidade: Number(selectedCity) }),
      ...(selectedSpecialty && { codigoEspecialidade: Number(selectedSpecialty) }),
      ...(searchTerm && { nomeCredenciado: searchTerm })
    };

    setIsLoading(true);
    medicalService.getMedicalProviders(payload)
      .then(data => setProviders(data || []))
      .finally(() => setIsLoading(false));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Guia Médico</h1>
            <p className="text-muted-foreground text-lg">
              Encontre prestadores credenciados próximos a você
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="card-medical">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros de Busca</span>
          </CardTitle>
          <CardDescription>
            Use os filtros para encontrar o prestador ideal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              {/* Cidade */}
              <div className="space-y-2">
                <Label htmlFor="city">Cidade <span className="text-red-600">*</span></Label>
                <Select value={selectedCity} onValueChange={(v) => { setSelectedCity(v); setCityError(''); }}>
                  <SelectTrigger id="city" className={cityError ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione uma cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city.codigo} value={city.codigo.toString()}>
                        {city.nome} / {city.estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {cityError && <span className="text-xs text-red-600">{cityError}</span>}
              </div>

              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="search">Buscar por nome</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nome do médico ou endereço"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Especialidade */}
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Selecione uma especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map(spec => (
                      <SelectItem key={spec.codigo} value={spec.codigo.toString()}>
                        {spec.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Limpar */}
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" onClick={clearFilters} type="button" className="w-full">
                  Limpar Filtros
                </Button>
              </div>

              {/* Pesquisar */}
              <div className="space-y-2 md:col-span-4">
                <Label>&nbsp;</Label>
                <Button type="submit" className="w-full">Pesquisar</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Prestadores Encontrados ({providers.length})
        </h2>

        {providers.length === 0 ? (
          <Card className="card-medical">
            <CardContent className="text-center py-12">
              <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhum prestador encontrado</h3>
              <p className="text-muted-foreground">
                Ajuste os filtros para tentar novamente
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map(provider => {
              const local = provider.locaisAtendimento?.[0];
              return (
                <Card key={provider.codigo} className="card-medical hover:shadow-lg transition-all flex flex-col h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{provider.nome}</CardTitle>
                    {provider.selos?.length > 0 && (
                      <CardDescription>
                        <Badge variant="outline" className="text-xs">{provider.selos[0].nome}</Badge>
                        {provider.selos.length > 1 && (
                          <Badge variant="outline" className="text-xs ml-1">
                            +{provider.selos.length - 1}
                          </Badge>
                        )}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-3 flex-1">
                    {local && (
                      <>
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="text-sm font-medium">{local.rua} - {local.bairro}</p>
                            <p className="text-sm text-muted-foreground">CEP: {local.cep}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{local.fone}</p>
                        </div>
                      </>
                    )}
                  </CardContent>

                  {/* Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="medical" size="sm" className="m-2">Ver Detalhes</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Detalhes do credenciado</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2 text-sm">
                        <p><strong>Nome:</strong> {provider.nome}</p>
                        <p><strong>CRM:</strong> {provider.nroRegistro}</p>
                        <p><strong>Nome Fantasia:</strong> {local?.nomeFantasia}</p>
                        <p><strong>Razão Social:</strong> {local?.razaoSocial}</p>
                        <p><strong>CNPJ/CPF:</strong> {local?.cnpj}</p>

                        {/* Endereços */}
                        <div>
                          <p className="font-medium mt-2">Endereços:</p>
                          <ul className="list-disc ml-4">
                            {provider.locaisAtendimento?.map((data, i) => (
                              <li key={i}>
                                {data.rua}{data.bairro !== "NÃO INFORMADO" && ` - ${data.bairro}`}, {data.cidade} / {data.uf} - {data.cep}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Telefones */}
                        <div>
                          <p className="font-medium mt-2">Telefones:</p>
                          <ul className="list-disc ml-4">
                            {provider.locaisAtendimento?.map((data, i) => (
                              <li key={i}>{data.fone}</li>
                            ))}
                          </ul>
                        </div>

                        <p><strong>Tipo de estabelecimento:</strong> {local?.tipoEstabelecimento}</p>
                        <p><strong>Site:</strong> {local?.site}</p>

                        {/* Selos */}
                        {provider.selos?.length > 0 && (
                          <div>
                            <p className="font-medium mt-2">Selos:</p>
                            <div className="flex flex-wrap gap-2">
                              {provider.selos.map(selo => (
                                <Selo key={selo.codigo} codigo={selo.codigo.toString()} nome={selo.nome} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <DialogClose asChild>
                        <Button className="mt-4 w-full">Fechar</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
