export interface PerfilAutenticado {
  codigoSessao: number;
}

export interface GenerateTokenRequest {
  usuario: string;
  senha: string;
}

export interface Beneficiary {
  codigo: string;
  nome: string;
  cpf?: number;
  dataNascimento?: string;
  plano?: string;
  status?: string;
}

export interface ApiResponse<T = any> {
  sucesso: boolean;
  dados?: T;
  erro?: string;
  mensagem?: string;
}

export interface User {
  id: string;
  nome: string;
  cpf: number;
  email: string;
  celular: string;
  perfilAutenticado: PerfilAutenticado;
  codigoPlano?: number;
  codigoContrato?: number;
  isBeneficiary?: boolean;
}

//================================================================================================================== 
//                                        Login types 
//================================================================================================================== 
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

export interface AuthResponse {
  sucesso: boolean;
  codigoSessao?: string;
  nome?: string;
  cpf?: number;
  email?: string;
  celular?: string;
  erro?: string;
}

export interface AccountProfilesRequest {
  cpf: number;
  senha: string;
}

export interface AccountProfile {
  codigoPlano: number;
  codigoContrato: number;
  nome?: string;
  email?: string;
  celular?: string;
  perfilAutenticado?: PerfilAutenticado;
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

export interface ListAuthorizationsRequest {
  perfilAutenticado: PerfilAutenticado
}

export interface procedures {
  codigoProcedimento: string;
  descricaoProcedimento: string
}

export interface Authorization {
  numeroTransacao: string,
  dataSolicitacao: string,
  prestadorSolicitante: string, 
  procedimentos: procedures[],  
  statusProcedimento: string
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

export interface BarcodeRequest {
  perfilAutenticado: PerfilAutenticado;
}

export interface CoParticipationExtractRequest {
  perfilAutenticado: PerfilAutenticado;
  anoCompetencia: number;
  mesCompetencia: number;
}


export interface IRPFExtractRequest {
  perfilAutenticado: PerfilAutenticado;
  ano?: number;
}

export interface ListIRPFExtractRequest {
  perfilAutenticado: PerfilAutenticado;
}

export interface ListInstallmentsRequest {
  perfilAutenticado: PerfilAutenticado;
}


export interface Installment {
  codigoMensalidade: string;
  plano: number;
  contrato: number;
  contratoInterno: string;
  competencia: string;
  mescompetencia: number;
  anocompetencia: number;
  tipoReceita: string;
  vencimento: string;
  valor: number;
  dataEmissao: string;
  status: string;
  valorMulta: number;
  valorJuros: number;
  valorCoparticipacao: number;
}
