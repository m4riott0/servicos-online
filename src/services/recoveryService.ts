import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';

export const recoveryService = {
  recoverPassword: async (req: ApiTypes.RecoverPasswordRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Login/RecuperarSenha', req)).data,

  validateRecoveryToken: async (req: ApiTypes.ValidateTokenRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Login/ValidarTokenRecuperacao', req)).data,

  changePassword: async (req: ApiTypes.ChangePasswordRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Login/AlterarSenha', req)).data,
};
