import { apiClient } from "./apiClient";
import type * as ApiTypes from "../types/api";

export const utilizacaoService = {
  avaliarAtendimento: async (
    req: ApiTypes.AvaliarAtendimentoRequest
  ): Promise<ApiTypes.ApiResponse> => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse>(
      "/api/utilizacao/AvaliarAtendimento",
      req
    );
    return response.data;
  },

  getBeneficiariosUtilizacao: async (
    req: ApiTypes.BeneficiariosUtilizacaoRequest
  ): Promise<
    ApiTypes.ApiResponse<{ codigoBeneficiario: string; nome: string }[]>
  > => {
    const response = await apiClient.instance.post<
      ApiTypes.ApiResponse<{ codigoBeneficiario: string; nome: string }[]>
    >("/api/utilizacao/Beneficiarios", req);
    return response.data;
  },

  getListaUtilizacao: async (req: ApiTypes.ListUtilizacaoRequest): Promise<ApiTypes.UtilizacaoItem[]> => {
  const response = await apiClient.instance.post<ApiTypes.ListaUtilizacaoResponse>(
    "/api/Utilizacao/ListarUtilizacao",
    req
  );
  return response.data.procedimentos ?? [];
}



//   getListaUtilizacao: async (
//     req: ApiTypes.ListUtilizacaoRequest
//   ): Promise<ApiTypes.ListaUtilizacaoResponse> => {
//     const response =
//       await apiClient.instance.post<ApiTypes.ListaUtilizacaoResponse>(
//         "/api/Utilizacao/ListarUtilizacao",
//         req
//       );
//     return response.data;
//   },
};
