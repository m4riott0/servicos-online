import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';
export const medicalService = {
  getMedicalCities: async (): Promise<ApiTypes.MedicalGuideCity[]> => {
    try {
      const response = await apiClient.instance.get<ApiTypes.ApiResponse<ApiTypes.MedicalGuideCity[]>>('/api/GuiaMedico/Cidades');
      return response.data?.dados || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
    }
  },

  getMedicalSpecialties: async (): Promise<ApiTypes.MedicalGuideSpecialty[]> => {
    try {
      const response = await apiClient.instance.get<ApiTypes.ApiResponse<ApiTypes.MedicalGuideSpecialty[]>>('/api/GuiaMedico/Especialidades');
      return response.data?.dados || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
    }
  },

  getMedicalProviders: async (): Promise<ApiTypes.MedicalGuideProvider[]> => {
    try {
      const response = await apiClient.instance.get<ApiTypes.ApiResponse<ApiTypes.MedicalGuideProvider[]>>('/api/GuiaMedico/Prestadores');
      return response.data?.dados || [];
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
