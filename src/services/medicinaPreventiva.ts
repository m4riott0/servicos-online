import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';

export const medicinaPreventiva = {
  fazerInscricao: async (req: ApiTypes.PreventiveMedicineRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/MedicinaPreventiva/FazerInscricao', req)).data,
};