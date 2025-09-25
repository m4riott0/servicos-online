import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';

export const medicalService = {
  getMedicalCities: async (somenteOdonto = false): Promise<ApiTypes.MedicalGuideCity[]> => {
    try {
      const response = await apiClient.instance.get('/api/GuiaMedico/Cidades', {
        params: { somenteOdonto },
      });
      return response.data;
    } catch (error) {
      console.warn('Chamada da API falhou (getMedicalCities):', error);
      return [];
    }
  },

  getMedicalSpecialties: async (codigoPrestador?: number): Promise<ApiTypes.MedicalGuideSpecialty[]> => {
    try {
      const response = await apiClient.instance.get('/api/GuiaMedico/Especialidades', {
        params: { codigoPrestador },
      });
      return response.data;
    } catch (error) {
      console.warn('Chamada da API falhou (getMedicalSpecialties):', error);
      return [];
    }
  },

  getMedicalProviders: async (req: ApiTypes.ProviderRequest): Promise<ApiTypes.MedicalGuideProvider[]> => {
    try {
      const response = await apiClient.instance.get<ApiTypes.MedicalGuideProviderResponse[]>('/api/GuiaMedico/Prestadores', {
        params: req,
      });
      // API retorna um array onde cada item contém "prestadores"
      return response.data.flatMap(item => item.prestadores || []);
    } catch (error) {
      console.warn('Chamada da API falhou (getMedicalProviders):', error);
      return [];
    }
  },

  getSubstituteMedicalProviders: async (params?: {
    codCidadeSub?: number;
    nomeSub?: string;
    cnpjSub?: string;
    crmSub?: string;
  }): Promise<any[]> => {
    try {
      const response = await apiClient.instance.get('/api/GuiaMedico/PrestadoresSubstituidos', {
        params,
      });
      return response.data || [];
    } catch (error) {
      console.warn('Chamada da API falhou (getSubstituteMedicalProviders):', error);
      return [];
    }
  },

  getMedicalProducts: async (): Promise<ApiTypes.MedicalGuideProduct[]> => {
    try {
      const response = await apiClient.instance.get('/api/GuiaMedico/Produtos');
      return response.data;
    } catch (error) {
      console.warn('Chamada da API falhou (getMedicalProducts):', error);
      return [];
    }
  },
};
