import { apiClient } from "./apiClient";
import type * as ApiTypes from "../types/api";

export const CopartTable = {
  copartTableRequest: async (
    req: ApiTypes.CopartTableRequest
  ): Promise<{ link: string }> => {
    const response = await apiClient.instance.post(
      "/api/TabelasCoparticipacao/MinhaTabelaCoparticipacao",
      req
    );
    return response.data; 
  },
};
