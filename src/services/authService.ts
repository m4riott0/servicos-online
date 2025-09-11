import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';

export const authService = {
  async generateToken(credentials: ApiTypes.GenerateTokenRequest): Promise<string> {
    try {
      const res = await apiClient.instance.post<string>('/api/Token/GerarToken', credentials);
      console.log('Token generated successfully');
      return res.data;
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  },

  async verificaCPF(request: ApiTypes.CPFVerificationRequest): Promise<ApiTypes.CPFVerificationResponse> {
    try {
      const res = await apiClient.instance.post<ApiTypes.CPFVerificationResponse>('/api/Login/VerificarCPF', request);
      console.log('CPF verification response:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error verifying CPF:', error);
      throw error;
    }
  },

  async getAccountProfiles(request: ApiTypes.AccountProfilesRequest): Promise<ApiTypes.ApiResponse> {
    try {
      const res = await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Login/PerfisDaConta', request);
      console.log('Account profiles response:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error getting account profiles:', error);
      throw error;
    }
  },

  async authenticate(request: ApiTypes.AuthenticationRequest): Promise<ApiTypes.ApiResponse> {
    try {
      const res = await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Login/Autenticar', request);
      console.log('Authentication response:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error authenticating:', error);
      throw error;
    }
  },
};
