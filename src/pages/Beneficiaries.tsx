import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { 
  Users, 
  User, 
  Calendar, 
  Plus,
  Edit,
  Shield,
  Heart,
  IdCard
} from 'lucide-react';
import { authorizationService } from '../services/authorizationService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import type { Beneficiary } from '../types/api';

export const Beneficiaries: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.perfilAutenticado) {
      loadBeneficiaries();
    }
  }, [user]);

  const loadBeneficiaries = async () => {
  if (!user?.perfilAutenticado) return;

  setIsLoading(true);
  try {
    const response = await authorizationService.getBeneficiaries({
      perfilAutenticado: user.perfilAutenticado,
    });

    setBeneficiaries(response || []);

  } catch (error) {
    console.error('Error loading beneficiaries:', error);
    toast({
      title: "Erro ao carregar beneficiários",
      description: "Erro ao carregar beneficiários. Tente novamente.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'ativo': { variant: 'default' as const, color: 'text-success' },
      'inativo': { variant: 'secondary' as const, color: 'text-muted-foreground' },
      'suspenso': { variant: 'destructive' as const, color: 'text-destructive' },
      'cancelado': { variant: 'destructive' as const, color: 'text-destructive' },
    };
    
    const statusInfo = statusMap[status.toLowerCase()] || statusMap['ativo'];
    
    return (
      <Badge variant={statusInfo.variant} className={statusInfo.color}>
        {status}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Beneficiários</h1>
              <p className="text-muted-foreground text-lg">
                Gerencie os beneficiários do seu plano de saúde
              </p>
            </div>
          </div>
          <Button variant="medical">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Dependente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-medical">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Beneficiários
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{beneficiaries.length}</div>
          </CardContent>
        </Card>

        <Card className="card-medical">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ativos
            </CardTitle>
            <Shield className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {beneficiaries.filter(b => b.status.toLowerCase() === 'ativo').length}
            </div>
          </CardContent>
        </Card>

        <Card className="card-medical">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Planos Diferentes
            </CardTitle>
            <Heart className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(beneficiaries.map(b => b.plano)).size}
            </div>
          </CardContent>
        </Card>

        <Card className="card-medical">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Idade Média
            </CardTitle>
            <Calendar className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {beneficiaries.length > 0 
                ? Math.round(beneficiaries.reduce((acc, b) => acc + calculateAge(b.dataNascimento), 0) / beneficiaries.length)
                : 0
              } anos
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Beneficiaries List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Lista de Beneficiários
          </h2>
        </div>

        {beneficiaries.length === 0 ? (
          <Card className="card-medical">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhum beneficiário encontrado</h3>
              <p className="text-muted-foreground">
                Não há beneficiários cadastrados no momento
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {beneficiaries.map((beneficiary) => (
              <Card key={beneficiary.codigo} className="card-medical hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                        {getInitials(beneficiary.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg mb-1">
                            {beneficiary.nome}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(beneficiary.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Personal Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <IdCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">CPF</p>
                        <p className="text-sm text-muted-foreground">
                          {beneficiary.cpf.toString().replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Idade</p>
                        <p className="text-sm text-muted-foreground">
                          {calculateAge(beneficiary.dataNascimento)} anos
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Plano</p>
                        <p className="text-sm text-muted-foreground">
                          {beneficiary.plano}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-4 border-t border-border/50">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="medical" size="sm" className="flex-1">
                      <User className="h-4 w-4 mr-2" />
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