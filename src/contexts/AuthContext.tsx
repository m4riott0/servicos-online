import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { authService } from "../services/authService";
import { apiClient } from "../services/apiClient";
import { registerService } from "../services/registerService";
import type { User, CPFVerificationResponse } from "../types/api";
import { useToast } from "../hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (cpf: number, senha: string) => Promise<boolean>;
  logout: () => void;
  verificaCPF: (cpf: number) => Promise<CPFVerificationResponse | null>;
  register: (cpf: number, senha: string) => Promise<boolean>;
  createAccount: (cpf: number) => Promise<boolean>;
  registerContact: (
    cpf: number,
    type: "phone" | "email",
    contact: string
  ) => Promise<boolean>;
  confirmContact: (
    cpf: number,
    type: "phone" | "email",
    contact: string,
    token: string
  ) => Promise<boolean>;
  resendSMS: (cpf: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isAuthenticated = !!user;

  // Verifica se o CPF já existe no sistema
  const verificaCPF = useCallback(async (
    cpf: number
  ): Promise<CPFVerificationResponse | null> => {
    try {
      setIsLoading(true);
      return await authService.verificaCPF({ cpf });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error?.response?.data?.erro || "Erro ao verificar CPF.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Realiza login validando perfis e sessão
  const login = useCallback(async (cpf: number, senha: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const profilesResponse = await authService.getAccountProfiles({
        cpf,
        senha,
      });

      if (!Array.isArray(profilesResponse) || profilesResponse.length === 0) {
        toast({
          title: "CPF ou senha inválidos",
          description: "Verifique suas credenciais e tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      const perfil = profilesResponse[0];

      const authResponse = await authService.authenticate({
        codigoPlano: perfil.codigoPlano,
        codigoContrato: perfil.codigoContrato,
        cpf,
        senha,
      });

      const isSuccess =
        authResponse &&
        (authResponse.sucesso === true ||
          (authResponse.codigoSessao && authResponse.nome));

      if (!isSuccess) {
        toast({
          title: "CPF ou senha inválidos",
          description: "Verifique suas credenciais e tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      const verificationResponse = await authService.verificaCPF({ cpf });
      const ehBeneficiary = verificationResponse?.beneficiario ?? false;

      const userData = {
        id: cpf.toString(),
        nome: authResponse.nome || perfil.nome || "Usuário",
        cpf,
        email: authResponse.email || perfil.email || "",
        celular: authResponse.celular || perfil.celular || "",
        perfilAutenticado: (() => {
          const sessao = authResponse.codigoSessao
            ? authResponse.codigoSessao
            : perfil.perfilAutenticado?.codigoSessao;

          return sessao && !isNaN(sessao) ? { codigoSessao: sessao } : null;
        })(),
        codigoPlano: perfil.codigoPlano,
        codigoContrato: perfil.codigoContrato,
        ehBeneficiary: ehBeneficiary,

        // Dados Pessoais e Contratuais
        dataNascimento: authResponse.dataNascimento,
        numeroCarteirinha: authResponse.codigoBeneficiario,
        produtoContratado: authResponse.produtos?.[0]?.nome,
        dataContratacao: authResponse.produtos?.[0]?.dataInicioVigencia,
        padraoAcomodacao: authResponse.beneficiariosAssociados?.[0]?.padraoConforto,
        sexo: undefined, 
        nomeMae: undefined, 
        rg: undefined, 
        orgaoEmissorRg: undefined, 
        cartaoNacionalSaude: undefined, 
        tituloEleitor: undefined, 
        estadoCivil: undefined, 
        profissao: undefined, 
        pisPasep: undefined, 
        tipoContratacao: undefined, 
        segmentacaoAssistencial: undefined, 
        dataFinalCPT: undefined, 
        carencias: undefined, 
      };

      setUser(userData);

      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${perfil.nome?.split(" ")[0] || "Usuário"}!`,
      });
      return true;
    } catch (error: any) {
      let errorTitle = "Erro de conexão";
      let errorDescription =
        "Não foi possível conectar ao servidor. Tente novamente.";

      if (error.response) {
        const status = error.response.status;

        switch (status) {
          case 401:
            errorTitle = "CPF ou senha inválidos";
            errorDescription = "Verifique suas credenciais e tente novamente.";
            break;
          case 400:
            errorTitle = "Dados inválidos";
            errorDescription = "Verifique os dados informados.";
            break;
          case 500:
            errorTitle = "Erro do servidor";
            errorDescription =
              "Erro interno do servidor. Tente novamente em alguns minutos.";
            break;
          default:
            errorTitle = "Erro inesperado";
            errorDescription = `Erro ${status}. Tente novamente.`;
        }
      } else if (error.code === "NETWORK_ERROR") {
        errorTitle = "Erro de rede";
        errorDescription = "Verifique sua conexão com a internet.";
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Cadastra senha para o usuário
  const register = useCallback(async (cpf: number, senha: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await registerService.registerPassword({ cpf, senha });
      toast({
        title: "Conta criada com sucesso",
        description: "Acesse o sistema!",
      });
      return true;

    } catch {
      toast({
        title: "Erro de conexão",
        description: "Erro no servidor. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Cria conta inicial (sem senha ainda)
  const createAccount = useCallback(async (cpf: number): Promise<boolean> => {
    try {
      const response = await registerService.createAccount({ cpf });

      toast({
        title: "Conta criada com sucesso",
        description: "Conta criada com sucesso!",
      });
      return true;
    } catch {
      toast({
        title: "Erro de conexão",
        description: "Erro no servidor. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Registra contato (telefone ou e-mail)
  const registerContact = useCallback(async (
    cpf: number,
    type: "phone" | "email",
    contact: string
  ): Promise<boolean> => {
    try {

      if (type === "phone") {
        await registerService.registerPhone({
          cpf,
          celular: parseInt(contact),
        });
      } else {
        await registerService.registerEmail({ cpf, email: contact });
      }

      toast({
        title: "Código de verificação enviado",
        description: `Código enviado para seu ${type === "phone" ? "celular" : "e-mail"}.`,
        variant: "default"
      });

      return true;

    } catch (erro) {
      console.error('Erro ao registrar contato:', erro); // Adicione esta linha
      toast({
        title: "Erro de conexão",
        description: "Erro no servidor. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Confirma contato (valida token SMS ou e-mail)
  const confirmContact = useCallback(async (
    cpf: number,
    type: "phone" | "email",
    contact: string,
    token: string
  ): Promise<boolean> => {
    try {
      let response;

      if (type === "phone") {
        response = await registerService.confirmPhone({
          cpf,
          celular: parseInt(contact),
          tokenSMS: token,
        });
      } else {
        response = await registerService.confirmEmail({
          cpf,
          email: contact,
          tokenEmail: token,
        });
      }

      toast({
        title: "Verificação realizada com sucesso",
        description: `${type === "phone" ? "Celular" : "E-mail"
          } verificado com sucesso!`,
      });
      return true;
    } catch {
      toast({
        title: "Erro de conexão",
        description: "Erro no servidor. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Reenvia SMS de verificação
  const resendSMS = useCallback(async (cpf: number): Promise<boolean> => {
    try {
      const response = await registerService.resendSMS({ cpf });

      if (response.sucesso) {
        toast({
          title: "Código reenviado",
          description: "Novo código enviado para seu celular.",
        });
        return true;
      }

      toast({
        title: "Erro ao reenviar código",
        description: response.erro || "Erro ao reenviar SMS.",
        variant: "destructive",
      });
      return false;
    } catch {
      toast({
        title: "Erro de conexão",
        description: "Erro no servidor. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Remove dados do usuário da sessão
  const logout = useCallback(() => {
    setUser(null);
    apiClient.clearToken();
    apiClient.renewToken();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  }, [toast]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      verificaCPF,
      register,
      createAccount,
      registerContact,
      confirmContact,
      resendSMS,
    }),
    [user, isLoading, isAuthenticated, login, logout, verificaCPF, register, createAccount, registerContact, confirmContact, resendSMS]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
