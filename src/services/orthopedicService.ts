import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';
import { mockBeneficiaries } from './mockData';

export const orthopedicService = {
  acceptOrthopedicTerms: async (req: ApiTypes.OrthopedicTermAcceptanceRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Servicos/Ortopedico/AceiteTermoAdesao', req)).data,

  getOrthopedicBeneficiaries: async (req: ApiTypes.OrthopedicBeneficiariesRequest): Promise<ApiTypes.Beneficiary[]> => {
    try {
      const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.Beneficiary[]>>('/api/Servicos/Ortopedico/Beneficiarios', req);
      return response.data?.dados || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
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

  confirmOrthopedicContract: async (req: ApiTypes.OrthopedicConfirmContractRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Servicos/Ortopedico/ConfirmarContratacao', req)).data,

  sendOrthopedicSMS: async (req: ApiTypes.OrthopedicSendSMSRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Servicos/Ortopedico/EnviarSms', req)).data,
};
