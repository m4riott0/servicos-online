import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';

export const sosService = {
  acceptSOSTerms: async (req: ApiTypes.SOSTermAcceptanceRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Servicos/Sos/AceiteTermoAdesao', req)).data,

  getSOSBeneficiaries: async (req: ApiTypes.SOSBeneficiariesRequest) =>
    (await apiClient.instance.post<ApiTypes.Beneficiary[]>('/api/Servicos/Sos/Beneficiarios', req)).data,

  confirmSOSContract: async (req: ApiTypes.SOSConfirmContractRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Servicos/Sos/ConfirmarContratacao', req)).data,

  sendSOSSMS: async (req: ApiTypes.SOSSendSMSRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Servicos/Sos/EnviarSms', req)).data,
};
