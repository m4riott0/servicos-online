import { apiClient } from "./apiClient";
import * as ApiTypes from "../types/api";

export const beneficiosService = {
    clubBenf: async (req: ApiTypes.ClubeRequest) =>
        (await apiClient.instance.post<ApiTypes.ClubeResponse>('/api/Clube/SmartLinkLogin', req)).data,
}