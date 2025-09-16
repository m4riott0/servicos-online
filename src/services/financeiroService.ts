import { apiClient } from "./apiClient";
import * as ApiTypes from "../types/api";

export const financeiroService = {
  // 1 - Baixar Boleto
  baixarBoleto: async (req: ApiTypes.DownloadBoletoRequest) => {
    const response = await apiClient.instance.post(
      "/api/Financeiro/BaixarBoleto",
      req,
      { responseType: "blob" } 
    );
    return response.data;
  },

  // 2 - Excluir Cartão
  excluirCartao: async (req: ApiTypes.DeleteCreditCardRequest) => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse>(
      "/api/Financeiro/CartaoCredito/ExcluirCartao",
      req
    );
    return response.data;
  },

  // 3 - Listar Cartões
  listarCartoes: async (req: ApiTypes.ListCreditCardsRequest) => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.MockCreditCard[]>>(
      "/api/Financeiro/CartaoCredito/ListarCartoes",
      req
    );
    return response.data?.dados || [];
  },

  // 4 - Listar Cartão Específico (usa o mesmo endpoint que listarCartoes)
  listarCartaoEspecifico: async (req: ApiTypes.ListCreditCardsRequest) => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.MockCreditCard>>(
      "/api/Financeiro/CartaoCredito/ListarCartoes",
      req
    );
    return response.data?.dados || null;
  },

  // 5 - Tokenizar Cartão
  tokenizarCartao: async (req: ApiTypes.TokenizeCreditCardRequest) => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse>(
      "/api/Financeiro/CartaoCredito/TokenizarCartao",
      req
    );
    return response.data;
  },

  // 6 - Código de Barras
  getCodigoBarras: async (req: ApiTypes.BarcodeRequest) => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<{ codigoBarras: string }>>(
      "/api/Financeiro/CodigoBarras",
      req
    );
    return response.data?.dados;
  },

  // 7 - Extrato de Co-Participação
  getExtratoCoParticipacao: async (req: ApiTypes.CoParticipationExtractRequest) => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.FinancialExtract[]>>(
      "/api/Financeiro/ExtratoCoParticipacao",
      req
    );
    return response.data?.dados || [];
  },

  // 8 - Extrato IRPF
  getExtratoIRPF: async (req: ApiTypes.IRPFExtractRequest) => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.FinancialExtract[]>>(
      "/api/Financeiro/ExtratoIRPF",
      req
    );
    return response.data?.dados || [];
  },

  // 9 - Listar Extrato IRPF
  listarExtratoIRPF: async (req: ApiTypes.ListIRPFExtractRequest) => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.FinancialExtract[]>>(
      "/api/Financeiro/ListarExtratoIRPF",
      req
    );
    return response.data?.dados || [];
  },

  // 10 - Listar Parcelas
  listarParcelas: async (req: ApiTypes.ListInstallmentsRequest) => {
    const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.MockInstallment[]>>(
      "/api/Financeiro/ListarParcelas",
      req
    );
    return response.data?.dados || [];
  },
};
