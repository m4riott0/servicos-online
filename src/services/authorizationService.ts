import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';

export const authorizationService = {
  getBeneficiaries: async (req: ApiTypes.BeneficiariesRequest) =>
    (await apiClient.instance.post<ApiTypes.Beneficiary[]>('/api/Autorizacoes/Beneficiarios', req)).data,

  getAuthorizations: async (req: ApiTypes.ListAuthorizationsRequest) =>
    (await apiClient.instance.post<ApiTypes.Authorization[]>('/api/Autorizacoes/ListarAutorizacoes', req)).data,
};
