import { apiClient } from "./apiClient";
import type * as ApiTypes from "../types/api";

export const sosService = {
  acceptSOSTerms: async (
    req: ApiTypes.SOSTermAcceptanceRequest
  ): Promise<ApiTypes.SOSTermAcceptanceResponse> => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.SOSTermAcceptanceResponse>>(
      "/api/Servicos/Sos/AceiteTermoAdesao",
      req
    );
    return response.data.dados;
  },

  getSOSBeneficiaries: async (
    req: ApiTypes.SOSBeneficiariesRequest
  ): Promise<ApiTypes.SOSBeneficiariesResponse> => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.SOSBeneficiariesResponse>>(
      "/api/Servicos/Sos/Beneficiarios",
      req
    );
    return response.data;
  },

  confirmSOSContract: async (
    req: ApiTypes.SOSConfirmContractRequest
  ): Promise<ApiTypes.SOSConfirmContractResponse> => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.SOSConfirmContractResponse>>(
      "/api/Servicos/Sos/ConfirmarContratacao",
      req
    );
    return response.data.dados;
  },

  sendSOSSMS: async (
    req: ApiTypes.SOSSendSMSRequest
  ): Promise<ApiTypes.SOSSendSMSResponse> => {
    const response = await apiClient.instance.post<ApiTypes.SOSSendSMSResponse>(
      "/api/Servicos/Sos/EnviarSms",
      req
    );
    return response.data;
  },
};
