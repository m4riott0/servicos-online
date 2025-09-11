import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';

export const commercialService = {
  initialContact: async (req: ApiTypes.InitialContactRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Venda/ContatoInicial', req)).data,

  consultInterview: async (req: ApiTypes.ConsultInterviewRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Venda/Entrevista/Consultar', req)).data,

  addDependent: async (req: ApiTypes.AddDependentRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Venda/AdicionarDependente', req)).data,
  
  questionary: async (req: ApiTypes.QuestionaryRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Venda/Questionario/Consultar', req)).data
};
