import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';
import { mockBeneficiaries } from './mockData';

export const sosService = {
  acceptSOSTerms: async (req: ApiTypes.SOSTermAcceptanceRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Servicos/Sos/AceiteTermoAdesao', req)).data,

  getSOSBeneficiaries: async (req: ApiTypes.SOSBeneficiariesRequest): Promise<ApiTypes.Beneficiary[]> => {
    try {
      const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.Beneficiary[]>>('/api/Servicos/Sos/Beneficiarios', req);
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

  confirmSOSContract: async (req: ApiTypes.SOSConfirmContractRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Servicos/Sos/ConfirmarContratacao', req)).data,

  sendSOSSMS: async (req: ApiTypes.SOSSendSMSRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Servicos/Sos/EnviarSms', req)).data,
};
