import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';
import { mockBeneficiaries, mockAuthorizations } from './mockData';

export const authorizationService = {
  getBeneficiaries: async (req: ApiTypes.BeneficiariesRequest): Promise<ApiTypes.Beneficiary[]> => {
    try {
      const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.Beneficiary[]>>('/api/Autorizacoes/Beneficiarios', req);
      return response.data?.dados || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
      // Retorna dados simulados em caso de erro
      return mockBeneficiaries.map(mock => ({
        codigo: mock.codigo,
        nome: mock.nome,
        cpf: mock.cpf,
        dataNascimento: mock.dataNascimento,
        plano: mock.plano,
        status: mock.status
      }));
    }
  },

  getAuthorizations: async (req: ApiTypes.ListAuthorizationsRequest): Promise<ApiTypes.Authorization[]> => {
    try {
      const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.Authorization[]>>('/api/Autorizacoes/ListarAutorizacoes', req);
      return response.data?.dados || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
      // Retorna dados simulados em caso de erro
      return mockAuthorizations.map(mock => ({
        id: mock.id,
        tipo: mock.tipo,
        data: mock.data,
        status: mock.status,
        beneficiario: mock.beneficiario
      }));
    }
  },
};
