import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';

export const authService = {
  async generateToken(credentials: ApiTypes.GenerateTokenRequest): Promise<string> {
    try {
      const res = await apiClient.instance.post<string>('/api/Token/GerarToken', credentials);
      console.log('Token gerado com sucesso');
      return res.data;
    } catch (error) {
      console.error('Erro ao gerar token:', error);
      throw error;
    }
  },

  async verificaCPF(request: ApiTypes.CPFVerificationRequest): Promise<ApiTypes.CPFVerificationResponse> {
    try {
      const res = await apiClient.instance.post<ApiTypes.CPFVerificationResponse>('/api/Login/VerificarCPF', request);
      console.log('Resposta da verificação de CPF:', res.data);
      return res.data;
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      throw error;
    }
  },

  async getAccountProfiles(request: ApiTypes.AccountProfilesRequest): Promise<ApiTypes.ApiResponse> {
    try {
      const res = await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Login/PerfisDaConta', request);
      console.log('Resposta dos perfis da conta:', res.data);
      return res.data;
    } catch (error) {
      console.error('Erro ao buscar perfis da conta:', error);
      throw error;
    }
  },

  async authenticate(request: ApiTypes.AuthenticationRequest): Promise<ApiTypes.ApiResponse> {
    try {
      const res = await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Login/Autenticar', request);
      console.log('Resposta da autenticação:', res.data);
      return res.data;
    } catch (error) {
      console.error('Erro na autenticação:', error);
      throw error;
    }
  },
};
