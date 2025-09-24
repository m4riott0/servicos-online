import { apiClient } from "./apiClient";
import type * as ApiTypes from "../types/api";

export const orthopedicService = {
  acceptOrthopedicTerms: async (
    req: ApiTypes.OrthopedicTermAcceptanceRequest
  ): Promise<ApiTypes.OrthopedicTermAcceptanceResponse> => {
    const response = await apiClient.instance.post<
      ApiTypes.ApiResponse<ApiTypes.OrthopedicTermAcceptanceResponse>
    >("/api/Servicos/Ortopedico/AceiteTermoAdesao", req);
    return response.data.dados;
  },

  getOrthopedicBeneficiaries: async (
    req: ApiTypes.OrthopedicBeneficiariesRequest
  ): Promise<ApiTypes.OrthopedicBeneficiariesResponse> => {
    const response = await apiClient.instance.post<
      ApiTypes.ApiResponse<ApiTypes.OrthopedicBeneficiariesResponse>
    >("/api/Servicos/Ortopedico/Beneficiarios", req);
    return response.data;
  },

  confirmOrthopedicContract: async (
    req: ApiTypes.OrthopedicConfirmContractRequest
  ): Promise<ApiTypes.OrthopedicConfirmContractResponse> => {
    const response = await apiClient.instance.post<
      ApiTypes.ApiResponse<ApiTypes.OrthopedicConfirmContractResponse>
    >("/api/Servicos/Ortopedico/ConfirmarContratacao", req);
    return response.data.dados;
  },

  sendOrthopedicSMS: async (
    req: ApiTypes.OrthopedicSendSMSRequest
  ): Promise<ApiTypes.OrthopedicSendSMSResponse> => {
    const response = await apiClient.instance.post<
      ApiTypes.ApiResponse<ApiTypes.OrthopedicSendSMSResponse>
    >("/api/Servicos/Ortopedico/EnviarSms", req);
  },
};
