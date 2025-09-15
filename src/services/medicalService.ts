import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';
import { mockMedicalCities, mockMedicalSpecialties, mockMedicalProviders } from './mockData';

export const medicalService = {
  getMedicalCities: async (): Promise<ApiTypes.MedicalGuideCity[]> => {
    try {
      const response = await apiClient.instance.get<ApiTypes.ApiResponse<ApiTypes.MedicalGuideCity[]>>('/api/GuiaMedico/Cidades');
      return response.data?.dados || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
      return mockMedicalCities;
    }
  },

  getMedicalSpecialties: async (): Promise<ApiTypes.MedicalGuideSpecialty[]> => {
    try {
      const response = await apiClient.instance.get<ApiTypes.ApiResponse<ApiTypes.MedicalGuideSpecialty[]>>('/api/GuiaMedico/Especialidades');
      return response.data?.dados || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
      return mockMedicalSpecialties;
    }
  },

  getMedicalProviders: async (): Promise<ApiTypes.MedicalGuideProvider[]> => {
    try {
      const response = await apiClient.instance.get<ApiTypes.ApiResponse<ApiTypes.MedicalGuideProvider[]>>('/api/GuiaMedico/Prestadores');
      return response.data?.dados || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
      return mockMedicalProviders.map(mock => ({
        id: mock.id,
        nome: mock.nome,
        especialidade: mock.especialidade,
        cidade: mock.cidade,
        endereco: mock.endereco,
        telefone: mock.telefone
      }));
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
