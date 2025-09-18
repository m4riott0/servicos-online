import { apiClient } from "./apiClient";
import * as ApiTypes from "../types/api";

export const financeiroService = {

  baixarBoleto: async (req: ApiTypes.DownloadBoletoRequest) => {
    const response = await apiClient.instance.post(
      "/api/Financeiro/BaixarBoleto",
      req,
      { responseType: "blob" } 
    );
    return response.data;
  },


  getCodigoBarras: async (req: ApiTypes.BarcodeRequest) => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<{ codigoBarras: string }>>(
      "/api/Financeiro/CodigoBarras",
      req
    );
    return response.data?.dados;
  },


  getExtratoCoParticipacao: async (req: ApiTypes.CoParticipationExtractRequest) => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.FinancialExtract[]>>(
      "/api/Financeiro/ExtratoCoParticipacao",
      req
    );
    return response.data?.dados || [];
  },


  getExtratoIRPF: async (req: ApiTypes.IRPFExtractRequest) => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.FinancialExtract[]>>(
      "/api/Financeiro/ExtratoIRPF",
      req
    );
    return response.data?.dados || [];
  },


  listarExtratoIRPF: async (req: ApiTypes.ListIRPFExtractRequest) => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.FinancialExtract[]>>(
      "/api/Financeiro/ListarExtratoIRPF",
      req
    );
    return response.data?.dados || [];
  },


  listarParcelas: async (req: ApiTypes.ListInstallmentsRequest) => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.MockInstallment[]>>(
      "/api/Financeiro/ListarParcelas",
      req
    );
    return response.data?.dados || [];
  },
};
