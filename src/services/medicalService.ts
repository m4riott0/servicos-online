import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';
export const medicalService = {
  getMedicalCities: async (): Promise<ApiTypes.MedicalGuideCity[]> => {
    try {
      const response = await apiClient.instance.get('/api/GuiaMedico/Cidades');
      return response.data || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
    }
  },

  getMedicalSpecialties: async (): Promise<ApiTypes.MedicalGuideSpecialty[]> => {
    try {
      const response = await apiClient.instance.get('/api/GuiaMedico/Especialidades');
      return response.data || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
    }
  },

  getMedicalProviders: async (req: ApiTypes.ProviderRequest): Promise<ApiTypes.MedicalGuideProvider[]> => {
    try {
      const response = await apiClient.instance.get('/api/GuiaMedico/Prestadores', { params: req });
      return response.data[0]['prestadores'] || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
    }
  },

  getSubstituteMedicalProviders: async (): Promise<ApiTypes.MedicalGuideProvider[]> => {
    try {
      const response = await apiClient.instance.get<ApiTypes.ApiResponse<ApiTypes.MedicalGuideProvider[]>>('/api/GuiaMedico/PrestadoresSubstituidos');
      return response.data?.dados || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
      return [];
    }
  },

  getMedicalProducts: async (): Promise<any[]> => {
    try {
      const response = await apiClient.instance.get<ApiTypes.ApiResponse<any[]>>('/api/GuiaMedico/Produto');
      return response.data?.dados || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
      return [];
    }
  },
};
