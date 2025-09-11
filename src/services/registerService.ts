import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';

export const registerService = {
  createAccount: async (req: ApiTypes.CreateAccountRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Registro/CriarConta', req)).data,

  registerPhone: async (req: ApiTypes.RegisterContactRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Registro/CadastrarCelular', req)).data,

  registerEmail: async (req: ApiTypes.RegisterContactRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Registro/CadastrarEmail', req)).data,

  confirmPhone: async (req: ApiTypes.ConfirmContactRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Registro/ConfirmarCelular', req)).data,

  confirmEmail: async (req: ApiTypes.ConfirmContactRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Registro/ConfirmarEmail', req)).data,

  resendSMS: async (req: ApiTypes.ResendSMSRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Registro/ReenviarSmsConfirmacao', req)).data,

  registerPassword: async (req: ApiTypes.RegisterPasswordRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Registro/CadastrarSenha', req)).data,
};
