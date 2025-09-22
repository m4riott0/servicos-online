import { apiClient } from "./apiClient";
import * as ApiTypes from "../types/api";

export const financeiroService = {
  getCodigoBarras: async (req: ApiTypes.BarcodeRequest) => {
    const response = await apiClient.instance.post(
      "/api/Financeiro/CodigoBarras",
      req,
      { params: { codigoMensalidade: req.codigoMensalidade } }
    );
    return response.data;
  },

  baixarBoleto: async (req: ApiTypes.DownloadBoletoRequest) => {
    const response = await apiClient.instance.post(
      "/api/Financeiro/BaixarBoleto",
      req,
      {
        params: { codigoMensalidade: req.codigoMensalidade },
        responseType: "blob",
      }
    );
    return response.data;
  },

  getExtratoCoParticipacao: async (
    req: ApiTypes.CoParticipationExtractRequest
  ) => {
    const response = await apiClient.instance.post(
      "/api/Financeiro/ExtratoCoParticipacao",
      req,
      {
        params: {
          anoCompetencia: req.anoCompetencia,
          mesCompetencia: req.mesCompetencia,
        },
        responseType: "blob",
      }
    );
    return response.data;
  },

  getExtratoIRPF: async (req: ApiTypes.IRPFExtractRequest) => {
    console.log("Payload enviado para ExtratoIRPF:", req);
    const response = await apiClient.instance.post<Blob>(
      "/api/Financeiro/ExtratoIRPF",
      req,
      { responseType: "blob" }
    );
    return response.data;
  },

  listarExtratoIRPF: async (req: ApiTypes.ListIRPFExtractRequest) => {
    console.log("Payload enviado para ListarExtratoIRPF:", req);
    const response = await apiClient.instance.post(
      "/api/Financeiro/ListarExtratoIRPF",
      req
    );
    return response.data?.dados || [];
  },

  listarParcelas: async (req: ApiTypes.ListInstallmentsRequest) => {
    console.log("Payload enviado para ListarParcelas:", req);
    const response = await apiClient.instance.post<ApiTypes.Installment[]>(
      "/api/Financeiro/ListarParcelas",
      req
    );
    return response.data;
  },
};
