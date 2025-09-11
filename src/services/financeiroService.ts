import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';

export const financeiroService = {
  downloadBoleto: async (req: ApiTypes.DownloadBoletoRequest) =>
    (await apiClient.instance.post('/api/Financeiro/BaixarBoleto', req, { responseType: 'blob' })).data,

  deleteCreditCard: async (req: ApiTypes.DeleteCreditCardRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Financeiro/CartaoCredito/ExcluirCartao', req)).data,

  listCreditCards: async (req: ApiTypes.ListCreditCardsRequest) =>
    (await apiClient.instance.post<ApiTypes.CreditCard[]>('/api/Financeiro/CartaoCredito/ListarCartoes', req)).data,

  tokenizeCreditCard: async (req: ApiTypes.TokenizeCreditCardRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Financeiro/CartaoCredito/TokenizarCartao', req)).data,

  getBarcode: async (req: ApiTypes.BarcodeRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Financeiro/CodigoBarras', req)).data,

  getCoParticipationExtract: async (req: ApiTypes.CoParticipationExtractRequest) =>
    (await apiClient.instance.post<ApiTypes.FinancialExtract[]>('/api/Financeiro/ExtratoCoParticipacao', req)).data,

  getIRPFExtract: async (req: ApiTypes.IRPFExtractRequest) =>
    (await apiClient.instance.post<ApiTypes.FinancialExtract[]>('/api/Financeiro/ExtratoIRPF', req)).data,

  listIRPFExtracts: async (req: ApiTypes.ListIRPFExtractRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Financeiro/ListarExtratoIRPF', req)).data,

  listInstallments: async (req: ApiTypes.ListInstallmentsRequest) =>
    (await apiClient.instance.post<ApiTypes.Installment[]>('/api/Financeiro/ListarParcelas', req)).data,
};
