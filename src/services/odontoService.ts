import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';

export const odontoService = {
  interesseContratacao: async (req: ApiTypes.OdontoInterestRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Odonto/InteresseContratacaoOdonto', req)).data,
};