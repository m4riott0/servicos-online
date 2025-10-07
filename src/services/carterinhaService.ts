import { apiClient } from "./apiClient";
import * as types from "../types/api";

export const carterinhaService = {
    async dadosCarterinha(data: types.CarterinhaRequest) {
        const response = await apiClient.instance.post("/api/Carteirinha/ListarCarteirinhas", data);
        return response.data;
    }
};
