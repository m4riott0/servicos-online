import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';

export const authService = {
  async verificaCPF(
    request: ApiTypes.CPFVerificationRequest
  ): Promise<ApiTypes.CPFVerificationResponse> {
    try {
      const res = await apiClient.instance.post<ApiTypes.CPFVerificationResponse>(
        '/api/Login/VerificarCPF',
        request
      );
      return res.data;
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      throw error;
    }
  },

  async getAccountProfiles(
    request: ApiTypes.AccountProfilesRequest
  ): Promise<ApiTypes.AccountProfile[]> {
    try {
      const res = await apiClient.instance.post<ApiTypes.AccountProfile[]>(
        '/api/Login/PerfisDaConta',
        request
      );
      return res.data;
    } catch (error) {
      console.error('Erro ao buscar perfis da conta:', error);
      throw error;
    }
  },

  async authenticate(
    request: ApiTypes.AuthenticationRequest
  ): Promise<ApiTypes.AuthResponse> {
    try {
      const res = await apiClient.instance.post<ApiTypes.AuthResponse>(
        '/api/Login/Autenticar',
        request
      );
      return res.data;
    } catch (error) {
      console.error('Erro na autenticação:', error);
      throw error;
    }
  }
};
