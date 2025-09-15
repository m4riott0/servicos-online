import { apiClient } from './apiClient';
import type * as ApiTypes from '../types/api';
import { mockInstallments, mockCreditCards, mockCoParticipationExtract, mockIRPFExtract } from './mockData';

export const financeiroService = {
  downloadBoleto: async (req: ApiTypes.DownloadBoletoRequest): Promise<Blob> => {
    try {
      const response = await apiClient.instance.post('/api/Financeiro/BaixarBoleto', req, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.warn('Chamada da API falhou, criando PDF simulado:', error);
      // Cria um blob simulado para simular um PDF
      return new Blob(['Mock PDF content'], { type: 'application/pdf' });
    }
  },

  deleteCreditCard: async (req: ApiTypes.DeleteCreditCardRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Financeiro/CartaoCredito/ExcluirCartao', req)).data,

  listCreditCards: async (req: ApiTypes.ListCreditCardsRequest): Promise<ApiTypes.CreditCard[]> => {
    try {
      const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.CreditCard[]>>('/api/Financeiro/CartaoCredito/ListarCartoes', req);
      return response.data?.dados || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
      return mockCreditCards.map(mock => ({
        id: mock.id,
        apelido: mock.apelido,
        numeroMascarado: mock.numeroMascarado,
        bandeira: mock.bandeira,
        titular: mock.titular
      }));
    }
  },

  tokenizeCreditCard: async (req: ApiTypes.TokenizeCreditCardRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Financeiro/CartaoCredito/TokenizarCartao', req)).data,

  getBarcode: async (req: ApiTypes.BarcodeRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Financeiro/CodigoBarras', req)).data,

  getCoParticipationExtract: async (req: ApiTypes.CoParticipationExtractRequest): Promise<ApiTypes.FinancialExtract[]> => {
    try {
      const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.FinancialExtract[]>>('/api/Financeiro/ExtratoCoParticipacao', req);
      return response.data?.dados || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
      return mockCoParticipationExtract.map(mock => ({
        periodo: mock.periodo,
        valor: mock.valor,
        tipo: mock.tipo,
        descricao: mock.descricao
      }));
    }
  },

  getIRPFExtract: async (req: ApiTypes.IRPFExtractRequest): Promise<ApiTypes.FinancialExtract[]> => {
    try {
      const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.FinancialExtract[]>>('/api/Financeiro/ExtratoIRPF', req);
      return response.data?.dados || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
      return mockIRPFExtract.map(mock => ({
        periodo: mock.periodo,
        valor: mock.valor,
        tipo: mock.tipo,
        descricao: mock.descricao
      }));
    }
  },

  listIRPFExtracts: async (req: ApiTypes.ListIRPFExtractRequest) =>
    (await apiClient.instance.post<ApiTypes.ApiResponse>('/api/Financeiro/ListarExtratoIRPF', req)).data,

  listInstallments: async (req: ApiTypes.ListInstallmentsRequest): Promise<ApiTypes.Installment[]> => {
    try {
      const response = await apiClient.instance.post<ApiTypes.ApiResponse<ApiTypes.Installment[]>>('/api/Financeiro/ListarParcelas', req);
      return response.data?.dados || [];
    } catch (error) {
      console.warn('Chamada da API falhou, usando dados simulados:', error);
      return mockInstallments.map(mock => ({
        codigo: mock.codigo,
        vencimento: mock.vencimento,
        valor: mock.valor,
        status: mock.status,
        codigoBarras: mock.codigoBarras
      }));
    }
  },
};
