import { apiClient } from "./apiClient";
import type * as ApiTypes from "../types/api";

export const authorizationService = {
  getBeneficiaries: async (
    req: ApiTypes.BeneficiariesRequest
  ): Promise<ApiTypes.Beneficiary[]> => {
    try {
      const response = await apiClient.instance.post<
        ApiTypes.ApiResponse<ApiTypes.Beneficiary[]>
      >("/api/Autorizacoes/Beneficiarios", req);
      return response.data?.dados || [];
    } catch (error) {
      console.warn("Chamada da API falhou, usando dados simulados:", error);
    }
  },

  getAuthorizations: async (
    req: ApiTypes.ListAuthorizationsRequest
  ): Promise<ApiTypes.Authorization[]> => {
    try {
      const response = await apiClient.instance.post<
        ApiTypes.ApiResponse<ApiTypes.Authorization[]>
      >("/api/Autorizacoes/ListarAutorizacoes", req);
      return response.data?.dados || [];
    } catch (error) {
      console.warn("Chamada da API falhou, usando dados simulados:", error);
    }
  },
};
