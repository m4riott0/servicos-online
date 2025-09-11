import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';

export const medicalService = {
  getMedicalCities: async () =>
    (await apiClient.instance.get<ApiTypes.MedicalGuideCity[]>('/api/GuiaMedico/Cidades')).data,

  getMedicalSpecialties: async () =>
    (await apiClient.instance.get<ApiTypes.MedicalGuideSpecialty[]>('/api/GuiaMedico/Especialidades')).data,

  getMedicalProviders: async () =>
    (await apiClient.instance.get<ApiTypes.MedicalGuideProvider[]>('/api/GuiaMedico/Prestadores')).data,

  getSubstituteMedicalProviders: async () =>
    (await apiClient.instance.get<ApiTypes.MedicalGuideProvider[]>('/api/GuiaMedico/PrestadoresSubstituidos')).data,

  getMedicalProducts: async () =>
    (await apiClient.instance.get<any[]>('/api/GuiaMedico/Produtos')).data,
};
