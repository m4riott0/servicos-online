import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Users, 
  FileText, 
  CreditCard, 
  Calendar,
  TrendingUp,
  Bell,
  Heart,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Guia Médico',
      description: 'Encontre prestadores próximos a você',
      icon: Heart,
      href: '/guia-medico',
      color: 'bg-gradient-to-br from-primary/10 to-primary/20',
    },
    {
      title: 'Autorizações',
      description: 'Acompanhe suas solicitações',
      icon: FileText,
      href: '/autorizacoes',
      color: 'bg-gradient-to-br from-secondary/10 to-secondary/20',
    },
    {
      title: 'Financeiro',
      description: 'Visualize boletos e extratos',
      icon: CreditCard,
      href: '/financeiro',
      color: 'bg-gradient-to-br from-warning/10 to-warning/20',
    },
    {
      title: 'Serviços SOS',
      description: 'Emergências 24h',
      icon: Shield,
      href: '/servicos/sos',
      color: 'bg-gradient-to-br from-destructive/10 to-destructive/20',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'authorization',
      title: 'Autorização aprovada',
      description: 'Consulta cardiológica - Dr. João Silva',
      date: '2024-09-09',
      status: 'success',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Boleto disponível',
      description: 'Mensalidade de Setembro 2024',
      date: '2024-09-08',
      status: 'warning',
    },
    {
      id: 3,
      type: 'appointment',
      title: 'Consulta agendada',
      description: 'Medicina preventiva - Check-up anual',
      date: '2024-09-07',
      status: 'info',
    },
  ];

  const stats = [
    {
      title: 'Autorizações Pendentes',
      value: '2',
      icon: FileText,
      color: 'text-warning',
    },
    {
      title: 'Beneficiários Ativos',
      value: '4',
      icon: Users,
      color: 'text-success',
    },
    {
      title: 'Consultas este mês',
      value: '3',
      icon: Calendar,
      color: 'text-primary',
    },
    {
      title: 'Economia total',
      value: 'R$ 2.450',
      icon: TrendingUp,
      color: 'text-secondary',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bem-vindo, {user?.nome?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Gerencie seus benefícios de saúde com facilidade
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-medical">
              <Heart className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="card-medical">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="card-medical hover:scale-105 transition-transform duration-300 cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                    <action.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activities */}
        <Card className="card-medical">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Atividades Recentes</CardTitle>
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b border-border/50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{activity.title}</h4>
                      <Badge 
                        variant={activity.status === 'success' ? 'default' : 
                               activity.status === 'warning' ? 'destructive' : 'secondary'}
                      >
                        {activity.status === 'success' ? 'Aprovado' :
                         activity.status === 'warning' ? 'Pendente' : 'Info'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card className="card-medical">
          <CardHeader>
            <CardTitle className="text-xl">Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nome:</span>
                <span className="font-medium">{user?.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CPF:</span>
                <span className="font-medium">{user?.cpf}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{user?.email || 'Não informado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Celular:</span>
                <span className="font-medium">{user?.celular || 'Não informado'}</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-6">
              Atualizar Dados
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};