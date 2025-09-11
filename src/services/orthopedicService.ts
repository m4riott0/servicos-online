import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';

export const orthopedicService = {
  acceptOrthopedicTerms: async (req: ApiTypes.OrthopedicTermAcceptanceRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Servicos/Ortopedico/AceiteTermoAdesao', req)).data,

  getOrthopedicBeneficiaries: async (req: ApiTypes.OrthopedicBeneficiariesRequest) =>
    (await apiClient.instance.post<ApiTypes.Beneficiary[]>('/api/Servicos/Ortopedico/Beneficiarios', req)).data,

  confirmOrthopedicContract: async (req: ApiTypes.OrthopedicConfirmContractRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Servicos/Ortopedico/ConfirmarContratacao', req)).data,

  sendOrthopedicSMS: async (req: ApiTypes.OrthopedicSendSMSRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Servicos/Ortopedico/EnviarSms', req)).data,
};
