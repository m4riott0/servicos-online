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
  tipoPerfil?: string;
}

export interface Params {
  codigoMensalidade: string;
  anoCompetencia: number;
  mesCompetencia: number;
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
  erro?: string;

  codigoSessao?: number;
  nome?: string;
  cpf?: string;
  dataNascimento?: string; 
  celular?: string;
  tipoPerfil?: string;
  codigoBeneficiario?: string;
  email?: string;
  dataConfirmacaoEmail?: string; 
  permitirValidacaoToken?: boolean;

  produtos?: {
    nome: string;
    codigoAns: string;
    dataInicioVigencia: string; 
    produtoPrincipal: boolean;
    coparticipativo: boolean;
    nomeEmpresa: string;
    nomeEmpresaAssociada: string;
  }[];

  acessorios?: {
    nome: string;
    codigoAcessorio: string;
  }[];

  beneficiariosAssociados?: {
    nome: string;
    cpf: string;
    codigoMatricula: string;
    codigoBeneficiario: string;
    dataNascimento: string; 
    padraoConforto: string;
    permitirValidacaoToken: boolean;
  }[];
  habilitaPix?: boolean;
  habilitaCartao?: boolean;
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
  codigo: number;
  nome: string;
  estado: string;
}

export interface MedicalGuideSpecialty {
  codigo: number;
  nome: string;
}
export interface ServiceLocation {
  bairro: string;
  cdLocalAtendimento: number;
  cep: number;
  cidade: string;
  cnpj: string;
  fone: string;
  nomeFantasia: string;
  razaoSocial: string;
  rua: string;
  site: string;
  tipoEstabelecimento: string;
  uf: string;
}

export interface selos {
  codigo: string;
  nome: string;
}

export interface MedicalGuideProvider {
  codigo: number;
  locaisAtendimento: ServiceLocation[];
  nome: string;
  nroRegistro: string;
  selos: selos[];
  tipoRegistro: number;
}

export interface ProviderRequest {
  codigoEspecialidade?: number;
  codigoCidade?: number;
  nomeCredenciado?: string;
  codigoLocalAtendimento?: number;
  nomeFantasia?: string;
  razaoSocial?: string;
  cpfCnpj?: number;
  crm?: string;
  somenteOdonto?: boolean;
}

//==================================================================================================================
//                                        Autorizações types
//==================================================================================================================
export interface ListBeneficiariesRequest {
  perfilAutenticado: PerfilAutenticado;
}
export interface ListAuthorizationsRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoBeneficiario: string;
}

export interface procedures {
  codigoProcedimento: string;
  descricaoProcedimento: string;
}

export interface Authorization {
  numeroTransacao: string;
  dataSolicitacao: string;
  prestadorSolicitante: string;
  procedimentos: procedures[];
  statusProcedimento: string;
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
  codigoMensalidade: number;
}

export interface OrthopedicBeneficiariesRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoMensalidade: string;
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
export interface BarcodeRequest {
  PerfilAutenticado: PerfilAutenticado;
  codigoMensalidade: string;
}

export interface DownloadBoletoRequest {
  PerfilAutenticado: PerfilAutenticado;
  codigoMensalidade: string;
}

export interface CoParticipationExtractRequest {
  PerfilAutenticado: PerfilAutenticado;
  anoCompetencia?: number;
  mesCompetencia?: number;
}

export interface IRPFExtractRequest {
  PerfilAutenticado: PerfilAutenticado;
  ano?: number;
}

export interface ListIRPFExtractRequest {
  PerfilAutenticado: PerfilAutenticado;
}

export interface ListInstallmentsRequest {
  PerfilAutenticado: PerfilAutenticado;
}

export interface Installment {
  codigoMensalidade: string;
  plano: number;
  contrato: number;
  contratoInterno: string;
  valor: number;
  vencimento: string;
  status: string;
  valorMulta: number;
  valorJuros: number;
  valorCoparticipacao: number;
  competencia?: string;
  mescompetencia?: number;
  anocompetencia?: number;
  tipoReceita?: string;
  dataEmissao?: string;
}
