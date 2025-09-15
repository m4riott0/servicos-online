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

export const MedicalGuide: React.FC = () => {
  const [cities, setCities] = useState<MedicalGuideCity[]>([]);
  const [specialties, setSpecialties] = useState<MedicalGuideSpecialty[]>([]);
  const [providers, setProviders] = useState<MedicalGuideProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<MedicalGuideProvider[]>([]);
  
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [providers, selectedCity, selectedSpecialty, searchTerm]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [citiesData, specialtiesData, providersData] = await Promise.all([
        medicalService.getMedicalCities(),
        medicalService.getMedicalSpecialties(),
        medicalService.getMedicalProviders(),
      ]);
      
      setCities(citiesData || []);
      setSpecialties(specialtiesData || []);
      setProviders(providersData || []);
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

  const filterProviders = () => {
    let filtered = [...providers];
    
    if (selectedCity) {
      filtered = filtered.filter(provider => provider.cidade === selectedCity);
    }
    
    if (selectedSpecialty) {
      filtered = filtered.filter(provider => provider.especialidade === selectedSpecialty);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.endereco.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProviders(filtered);
  };

  const clearFilters = () => {
    setSelectedCity('');
    setSelectedSpecialty('');
    setSearchTerm('');
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
              <Label>Cidade</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.nome}>
                      {city.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Specialty Filter */}
            <div className="space-y-2">
              <Label>Especialidade</Label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.id} value={specialty.nome}>
                      {specialty.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Prestadores Encontrados ({filteredProviders.length})
          </h2>
          <Badge variant="secondary" className="text-sm">
            {filteredProviders.length === providers.length ? 'Todos' : 'Filtrados'}
          </Badge>
        </div>

        {filteredProviders.length === 0 ? (
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
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="card-medical hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{provider.nome}</CardTitle>
                      <CardDescription className="flex items-center space-x-1">
                        <Badge variant="outline" className="text-xs">
                          {provider.especialidade}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1 text-warning">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Location */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{provider.cidade}</p>
                      <p className="text-sm text-muted-foreground">{provider.endereco}</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{provider.telefone}</p>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-success font-medium">Disponível hoje</p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Ligar
                    </Button>
                    <Button variant="medical" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};