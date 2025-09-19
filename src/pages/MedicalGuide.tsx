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
  Clock,
  Stethoscope,
  Star,
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
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog"
import Selo from '@/components/layout/Selo';

export const MedicalGuide: React.FC = () => {
  const [cities, setCities] = useState<MedicalGuideCity[]>([]);
  const [specialties, setSpecialties] = useState<MedicalGuideSpecialty[]>([]);
  const [providers, setProviders] = useState<MedicalGuideProvider[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form validation states
  const [cityError, setCityError] = useState('');
  const [specialtyError, setSpecialtyError] = useState('');

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
      setProviders([]);
    } catch (error) {
      console.error('Error loading medical guide data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Erro ao carregar dados do guia médico. Tente novamente.",
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
    setSpecialtyError('');
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    if (!selectedCity) {
      setCityError('Selecione uma cidade.');
      valid = false;
    }
    if (!selectedSpecialty) {
      setSpecialtyError('Selecione uma especialidade.');
      valid = false;
    }
    if (!valid) return;

    setCityError('');
    setSpecialtyError('');

    // Aqui você pode chamar a busca real
    const payload: ApiTypes.ProviderRequest = {
      ...(selectedCity && { codigoCidade: Number(selectedCity) }),
      ...(selectedSpecialty && { codigoEspecialidade: Number(selectedSpecialty) }),
      ...(searchTerm && { nomeCredenciado: searchTerm })
    };

    medicalService.getMedicalProviders(payload).then(data => setProviders(data || []));
  };

  // Remove erro ao selecionar valor
  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    if (value) setCityError('');
  };
  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value);
    if (value) setSpecialtyError('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const enderecos = [
    "Rua A, 123 - Bairro X",
    "Rua B, 456 - Bairro Y"
  ];

  const telefones = [
    "(11) 1234-5678",
    "(11) 9876-5432"
  ];

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
              {/* Search Term */}
              <div className="space-y-2">
                <Label htmlFor="search">Buscar por nome</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nome do médico ou endereço"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* City Filter */}
              <div className="space-y-2">
                <Label htmlFor="city">
                  Cidade <span className="text-red-600">*</span>
                </Label>
                <Select value={selectedCity} onValueChange={handleCityChange}>
                  <SelectTrigger
                    id="city"
                    className={
                      `w-full ${cityError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`
                    }
                  >
                    <SelectValue placeholder="Selecione uma cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.codigo} value={city.codigo.toString()}>
                        {city.nome + ` / ` + city.estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {cityError && (
                  <span className="text-xs text-red-600 mt-1 block">{cityError}</span>
                )}
              </div>

              {/* Specialty Filter */}
              <div className="space-y-2">
                <Label htmlFor="specialty">
                  Especialidade <span className="text-red-600">*</span>
                </Label>
                <Select value={selectedSpecialty} onValueChange={handleSpecialtyChange}>
                  <SelectTrigger
                    id="specialty"
                    className={
                      `w-full ${specialtyError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`
                    }
                  >
                    <SelectValue placeholder="Selecione uma especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty.codigo} value={specialty.codigo.toString()}>
                        {specialty.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {specialtyError && (
                  <span className="text-xs text-red-600 mt-1 block">{specialtyError}</span>
                )}
              </div>

              {/* Clear Filters */}
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" onClick={clearFilters} type="button" className="w-full">
                  Limpar Filtros
                </Button>
              </div>

              {/* Pesquisar */}
              <div className="space-y-2 md:col-span-4">
                <Label>&nbsp;</Label>
                <Button
                  variant="default"
                  className="w-full"
                  type="submit"
                >
                  Pesquisar
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Prestadores Encontrados ({providers.length})
          </h2>
          {/* <Badge variant="secondary" className="text-sm">
            {filteredProviders.length === providers.length ? 'Todos' : 'Filtrados'}
          </Badge> */}
        </div>

        {providers.length === 0 ? (
          <Card className="card-medical">
            <CardContent className="text-center py-12">
              <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhum prestador encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros de busca para encontrar mais resultados
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <Card key={provider.codigo} className="card-medical hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3 text-lg mb-1">
                        {provider.nome}
                        <span className="text-xs text-muted-foreground">
                          {provider.locaisAtendimento[0].nomeFantasia}
                        </span>
                      </CardTitle>

                      <CardDescription className="flex items-center space-x-1 mt-1">
                        {provider.selos && provider.selos.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {provider.selos[0].nome}
                          </Badge>
                        )}
                        {provider.selos && provider.selos.length > 1 && (
                          <Badge variant="outline" className="text-xs">
                            +{provider.selos.length}
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                    {/* <div className="flex items-center space-x-1 text-warning">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div> */}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  {/* Location */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{provider.locaisAtendimento[0].rua + " - " + provider.locaisAtendimento[0].bairro}</p>
                      <p className="text-sm text-muted-foreground">CEP: {provider.locaisAtendimento[0].cep}</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {/* <p className="text-sm">{provider.telefone}</p> */}
                    <p className="text-sm">{provider.locaisAtendimento[0].fone}</p>
                  </div>

                  {/* Availability */}
                  {/* <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-success font-medium">Disponível hoje</p>
                  </div> */}

                  {/* Actions */}
                </CardContent>

                <Dialog>
                  {/* Botão que abre o Dialog */}
                  <DialogTrigger asChild>
                    <div className="grid grid-cols-2 gap-3 p-2 mt-auto ml-2 mb-2">
                      <Button variant="medical" size="sm" className="w-full">
                        Ver Detalhes
                      </Button>
                    </div>
                  </DialogTrigger>

                  {/* Conteúdo do Dialog */}
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Detalhes do credenciado</DialogTitle>
                      {/* <DialogDescription>
                        Aqui vai a descrição ou instruções do dialog.
                      </DialogDescription> */}


                      {/* Detalhes do credenciado */}
                      <p><span className="font-medium">Nome:</span> {provider.nome}</p>
                      <p><span className="font-medium">CRM:</span> {provider.nroRegistro}</p>
                      <p><span className="font-medium">NOME FANTASIA:</span> {provider.locaisAtendimento[0].nomeFantasia}</p>
                      <p><span className="font-medium">RAZÃO SOCIAL:</span> {provider.locaisAtendimento[0].razaoSocial}</p>
                      <p><span className="font-medium">CNPJ/CPF:</span> {provider.locaisAtendimento[0].cnpj}</p>


                      {/* Endereços */}
                      <div className="mt-4">
                        <p className="font-medium">Endereço:</p>
                        <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                          {provider.locaisAtendimento.map((data, index) => (
                            <li key={index}>{data.rua} {data.bairro != "NÃO INFORMADO" &&  "-" + data.bairro}, {data.cidade} / {data.uf} - {data.cep} </li>
                          ))}
                        </ul>
                      </div>

                      {/* Telefones */}
                      <div className="mt-4">
                        <p className="font-medium">Telefones:</p>
                        <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                          {provider.locaisAtendimento.map((data, index) => (
                            <li key={index}>{data.fone}</li>
                          ))}
                        </ul>
                      </div>

                      <p><span className="font-medium">Tipo de estabelecimento:</span> {provider.locaisAtendimento[0].tipoEstabelecimento}</p>
                      <p><span className="font-medium">Site:</span> {provider.locaisAtendimento[0].site}</p>

                      {/* Selos */}
                      {/* //TODO - Ajustar a logica para os selos certos. os codigos do selo que retorna da api não comrresponde com a dos arquivos  */}
                      <div className="mt-4">
                        <p className="font-medium">Selos:</p>
                        <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                          {provider.selos.map((data, index) => (
                            <Selo codigo={data.codigo} nome={data.nome}></Selo>
                          ))}
                        </ul>
                      </div>

                    </DialogHeader>
                    {/* Botão para fechar */}
                    <DialogClose asChild>
                      <Button className="mt-4">Fechar</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};