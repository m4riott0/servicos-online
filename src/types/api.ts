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
  coparticipativo: boolean;
  id: string;
  nome: string;
  cpf: number;
  email: string;
  celular: string;
  perfilAutenticado: PerfilAutenticado;
  codigoBeneficiario: string;
  codigoPlano?: number;
  codigoContrato?: number;
  ehBeneficiary?: boolean;
  tipoPerfil?: string;

  // Dados Pessoais
  dataNascimento?: string;
  sexo?: string;
  nomeMae?: string;
  rg?: string;
  orgaoEmissorRg?: string;
  cartaoNacionalSaude?: string;
  tituloEleitor?: string;
  estadoCivil?: string;
  profissao?: string;
  pisPasep?: string;

  // Dados Contratuais
  numeroCarteirinha?: string;
  dataContratacao?: string;
  padraoAcomodacao?: string;
  tipoContratacao?: string;
  produtoContratado?: string;
  segmentacaoAssistencial?: string;
  dataFinalCPT?: string;
  carencias?: any[];
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
  cpf: number;
  email?: string;
  celular?: string;
  perfilAutenticado?: PerfilAutenticado;
  dataCancelamento?: string;
  dataInicioVigencia?: string;
  tipoPerfil: string;
  visualizaExtrato: boolean;
  visualizaFatura: boolean;
  visualizaIr: boolean;
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
  fone: string;
  cep: number;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  cpf: string;
  site: string;
  tipoEstabelecimento: string;
  cidade: string;
  uf: string;
  bairro: string;
  rua: string;
  cdLocalAtendimento: number;
}

export interface Seal {
  codigo: number;
  nome: string;
}

export interface MedicalGuideProvider {
  codigo: number;
  nome: string;
  tipoRegistro: number;
  nroRegistro: string;
  locaisAtendimento: ServiceLocation[];
  selos: Seal[];
}

export interface MedicalGuideProviderResponse {
  codigo: number;
  nome: string;
  prestadores: MedicalGuideProvider[];
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

export interface MedicalGuideProduct {
  codigo: string;
  descricao: string;
  tipoContrato: number;
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
//                                        Benefícios types
//==================================================================================================================
export interface ClubeRequest {
  perfilAutenticado: PerfilAutenticado;
  cpf: number;
}

export interface ClubeResponse {
  smartToken: string;
  appSmartLink: string;
  webSmartLink: string;
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

export interface SOSBeneficiariesRequest {
  perfilAutenticado: PerfilAutenticado;
}

export interface SOSTermAcceptanceRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoMatriculasBeneficiariosAlvo: string[];
}

export interface SOSSendSMSRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoMatriculasBeneficiariosAlvo: string[];
}

export interface SOSConfirmContractRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoToken: number;
}

export interface SOSBeneficiariesResponse {
  linkTermoAdesao: string;
  linkContrato: string;
  valorParaContratacao: number;
  dataInicioVigenciaAposContratacao: string;
  beneficiarios: {
    nome: string;
    codigoBeneficiario: string;
    dataInicioVigencia: string;
    temAcessorioContratado: boolean;
  }[];
}

export type SOSTermAcceptanceResponse = void;

export type SOSSendSMSResponse = void;

export interface SOSConfirmContractResponse {
  dataConclusaoContratacao: string;
  dataInicioVigencia: string;
  beneficiariosContratados: string[];
}

//==================================================================================================================
//                                        Ortopédico types
//==================================================================================================================
export interface OrthopedicBeneficiariesRequest {
  perfilAutenticado: PerfilAutenticado;
}

export interface OrthopedicTermAcceptanceRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoMatriculasBeneficiariosAlvo: string[];
}

export interface OrthopedicSendSMSRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoMatriculasBeneficiariosAlvo: string[];
}

export interface OrthopedicConfirmContractRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoToken: number;
}

export interface OrthopedicBeneficiariesResponse {
  linkContrato: string;
  linkTermoAdesao: string;
  arquivoTermoAdesao: string;
  valorParaContratacao: number;
  dataInicioVigenciaAposContratacao: string;
  beneficiarios: {
    nome: string;
    codigoBeneficiario: string;
    dataInicioVigencia: string;
    temAcessorioContratado: boolean;
  }[];
}

export type OrthopedicTermAcceptanceResponse = void;

export type OrthopedicSendSMSResponse = void;

export interface OrthopedicConfirmContractResponse {
  dataConclusaoContratacao: string;
  dataInicioVigencia: string;
  beneficiariosContratados: string[];
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

//==================================================================================================================
//                                        Utilizacao types
//==================================================================================================================

export interface BeneficiariosUtilizacaoRequest {
  perfilAutenticado: PerfilAutenticado;
}

export interface ListUtilizacaoRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoBeneficiario: string;
}

export interface AvaliarAtendimentoRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoBeneficiario: string;
  codigoPrestador: number;
  data: string;
  nota: number;
  comentario: string;
}

export interface UtilizacaoItem {
  valor: number;
  fantasia: string;
  categoria: string;
  procedimento: number;
  descricao: string;
  data: string;
  local:string;
  jaAvaliado?: boolean;
}

export interface ListaUtilizacaoResponse {
  semestre: number;
  ano: number;
  procedimentos: UtilizacaoItem[];
  erro?: string;
}


//==================================================================================================================
//                                        tabela copart types
//==================================================================================================================

export interface CopartTableRequest {
  perfilAutenticado: PerfilAutenticado;
  codigoBeneficiario: string;
}

export interface CopartTableItem {
  link: string;
}
