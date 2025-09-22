import { apiClient } from "./apiClient";
import type * as ApiTypes from "../types/api";

export const authorizationService = {
  getBeneficiaries: async (
    req: ApiTypes.ListBeneficiariesRequest
  ): Promise<ApiTypes.Beneficiary[]> => {
    try {
      const response = await apiClient.instance.post("/api/Autorizacoes/Beneficiarios", req);      
      return !response.data ? [] : response.data.map(item => ({
        codigo: item.codigoBeneficiario,
        nome: item.nome
      }));

    } catch (error) {
      console.error("Erro ao buscar beneficiários:", error);
      throw error;
    }
  },

  getAuthorizations: async (
    req: ApiTypes.ListAuthorizationsRequest
  ): Promise<ApiTypes.Authorization[]> => {
    try {
      const response = await apiClient.instance.post("/api/Autorizacoes/ListarAutorizacoes", req);
      return response.data.autorizacoes || [];
    } catch (error) {
      console.error("Erro ao buscar autorizações:", error);
      throw error;
    }
  },
};
