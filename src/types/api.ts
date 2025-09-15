export interface PerfilAutenticado {
  codigoSessao: number;
}

//================================================================================================================== 
//                                        Login types 
//================================================================================================================== 
export interface GenerateTokenRequest {
  usuario: string;
  senha: string;
}

export interface CPFVerificationRequest {
  cpf: number;
}

export interface CPFVerificationResponse {
  sucesso: boolean;
  celular: string;
  erro: string;
  beneficiario: boolean;
  temContaNoApp: boolean;
  temSenhaCadastrada: boolean;
  nome: string;
  email: string;
  dados?: {
    nome?: string;
    email?: string;
    celular?: string;
    perfilAutenticado?: PerfilAutenticado;
  };
}

export interface AuthenticationRequest {
  codigoPlano: number;
  codigoContrato: number;
  cpf: number;
  senha: string;
}

export interface AccountProfilesRequest {
  cpf: number;
  senha: string;
}

//================================================================================================================== 
//                                        Cadastro types 
//================================================================================================================== 
export interface CreateAccountRequest {
  cpf: number;
}

export interface RegisterContactRequest {
  cpf: number;
  celular?: number;
  email?: string;
}

export interface ConfirmContactRequest {
  cpf: number;
  celular?: number;
  email?: string;
  tokenSMS?: string;
  tokenEmail?: string;
}

export interface ResendSMSRequest {
  cpf: number;
}

export interface RegisterPasswordRequest {
  cpf: number;
  senha: string;
}

//================================================================================================================== 
//                                        Esqueci minha senha types 
//================================================================================================================== 
export interface RecoverPasswordRequest {
  cpf: number;
  tipoSolicitacao: string;
  celular: number;
}

export interface ValidateTokenRequest {
  cpf: number;
  tipoSolicitacao: string;
  token: string;
}

export interface ChangePasswordRequest {
  cpf: number;
  tipoSolicitacao: string;
  token: string;
  senha: string;
  confirmacaoSenha: string;
}

//================================================================================================================== 
//                                        Guia médico types 
//================================================================================================================== 
export interface MedicalGuideCity {
  id: number;
  nome: string;
}

export interface MedicalGuideSpecialty {
  id: number;
  nome: string;
}

export interface MedicalGuideProvider {
  id: number;
  nome: string;
  especialidade: string;
  cidade: string;
  endereco: string;
  telefone: string;
}

//================================================================================================================== 
//                                        Autorizações types 
//================================================================================================================== 
export interface BeneficiariesRequest {
  perfilAutenticado: PerfilAutenticado;
}

export interface ListAuthorizationsRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoBeneficiario: string;
}

export interface Authorization {
  id: string;
  tipo: string;
  data: string;
  status: string;
  beneficiario: string;
}

//================================================================================================================== 
//                                        Medicina preventiva types 
//================================================================================================================== 
export interface PreventiveMedicineRequest {
  cpf: number;
  nome: string;
  dataNascimento: string;
  cidade: string;
  telefone: number;
  programa: string;
}

//================================================================================================================== 
//                                        Odonto types 
//================================================================================================================== 
export interface OdontoInterestRequest {
  perfilAutenticado: PerfilAutenticado;
}

//================================================================================================================== 
//                                        Venda types 
//================================================================================================================== 
export interface InitialContactRequest {
  nome: string;
  cpf: number;
  dataNascimento: string;
  cidade: string;
  celular: string;
}

export interface ConsultInterviewRequest {
  cpf: number;
  idProposta: number;
}

export interface AddDependentRequest {
  perfilAutenticado: PerfilAutenticado;
  novosDependentes: {
    nome: string;
    cpf: number;
    dataNascimento: string;
    cidade: string;
    celular: string;
  }[];
}

export interface QuestionaryRequest {
  cpf: number;
}

//================================================================================================================== 
//                                        SOS types 
//================================================================================================================== 
export interface SOSTermAcceptanceRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoMatriculasBeneficiariosAlvo: string[];
}

export interface SOSBeneficiariesRequest {
  perfilAutenticado: PerfilAutenticado;
}

export interface SOSConfirmContractRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoToken: number;
}

export interface SOSSendSMSRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoMatriculasBeneficiariosAlvo: string[];
}

//================================================================================================================== 
//                                        Ortopédico types 
//================================================================================================================== 
export interface OrthopedicTermAcceptanceRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoMatriculasBeneficiariosAlvo: string[];
}

export interface OrthopedicBeneficiariesRequest {
  perfilAutenticado: PerfilAutenticado;
}

export interface OrthopedicConfirmContractRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoToken: number;
}

export interface OrthopedicSendSMSRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoMatriculasBeneficiariosAlvo: string[];
}

//================================================================================================================== 
//                                        Financeiro types 
//================================================================================================================== 
export interface DownloadBoletoRequest {
  perfilAutenticado: PerfilAutenticado;
}

export interface DeleteCreditCardRequest {
  perfilAutenticado: PerfilAutenticado;
  customerId: string;
  token: string;
}

export interface ListCreditCardsRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoMensalidade?: number;
  customerId?: string;
  tokenCartao?: string;
}

export interface TokenizeCreditCardRequest {
  perfilAutenticado: PerfilAutenticado;
  apelidoCartao: string;
  primeiroNome: string;
  ultimoNome: string;
  numeroCartaoCredito: number;
  mesExpiracao: number;
  anoExpiracao: number;
  nomeTitularCartao: string;
  enderecoCobranca1: string;
  enderecoCobranca2: string;
  cidadeCobranca: string;
  unidadeFederalCobranca: string;
  cepCobranca: number;
  paisCobranca: string;
  telefoneCobranca: number;
  emailCobranca: string;
}

export interface BarcodeRequest {
  perfilAutenticado: PerfilAutenticado;
}

export interface CoParticipationExtractRequest {
  perfilAutenticado: PerfilAutenticado;
}

export interface IRPFExtractRequest {
  perfilAutenticado: PerfilAutenticado;
  ano: number;
}

export interface ListIRPFExtractRequest {
  perfilAutenticado: PerfilAutenticado;
}

export interface ListInstallmentsRequest {
  perfilAutenticado: PerfilAutenticado;
}

export interface ApiResponse<T = any> {
  sucesso: boolean;
  dados?: T;
  erro?: string;
  mensagem?: string;
}

export interface MockBeneficiary {
  codigo: string;
  nome: string;
  cpf: number;
  dataNascimento: string;
  plano: string;
  status: string;
}

export interface MockAuthorization {
  id: string;
  tipo: string;
  data: string;
  status: string;
  beneficiario: string;
}

export interface MockMedicalProvider {
  id: number;
  nome: string;
  especialidade: string;
  cidade: string;
  endereco: string;
  telefone: string;
}

export interface MockInstallment {
  codigo: number;
  vencimento: string;
  valor: number;
  status: string;
  codigoBarras?: string;
}

export interface MockCreditCard {
  id: string;
  apelido: string;
  numeroMascarado: string;
  bandeira: string;
  titular: string;
}

export interface MockFinancialExtract {
  periodo: string;
  valor: number;
  tipo: string;
  descricao: string;
}

export interface User {
  id: string;
  nome: string;
  cpf: number;
  email: string;
  celular: string;
  perfilAutenticado?: PerfilAutenticado;
}

export interface Beneficiary {
  codigo: string;
  nome: string;
  cpf: number;
  dataNascimento: string;
  plano: string;
  status: string;
}

export interface CreditCard {
  id: string;
  apelido: string;
  numeroMascarado: string;
  bandeira: string;
  titular: string;
}

export interface Installment {
  codigo: number;
  vencimento: string;
  valor: number;
  status: string;
  codigoBarras?: string;
}

export interface FinancialExtract {
  periodo: string;
  valor: number;
  tipo: string;
  descricao: string;
}