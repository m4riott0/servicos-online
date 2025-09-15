import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "../services/apiClient";
import { authService } from "../services/authService";
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
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

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const storedToken = apiClient.getStoredToken();

        if (!storedToken) {
          const credentials = {
            usuario: "mixd",
            senha:
              "25f003f3c343d87018b8c0b4e264d268528c90000e9c3bb182084f14c14c0137",
          };
          const token = await authService.generateToken(credentials);
          apiClient.setToken(token);
          console.log("Token inicial gerado com sucesso");
        }
      } catch (error) {
        console.error("Error initializing token:", error);
        try {
          const credentials = {
            usuario: "mixd",
            senha:
              "25f003f3c343d87018b8c0b4e264d268528c90000e9c3bb182084f14c14c0137",
          };
          const token = await authService.generateToken(credentials);
          apiClient.setToken(token);
          console.log("Token de fallback gerado com sucesso");
        } catch (tokenError) {
          console.error("Failed to generate token:", tokenError);
          toast({
            title: "Erro de conexão",
            description: "Não foi possível conectar com o servidor.",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const verificaCPF = async (
    cpf: number
  ): Promise<CPFVerificationResponse | null> => {
    try {
      setIsLoading(true);

      const response = await authService.verificaCPF({ cpf });
      return response;
    } catch (error) {
      console.error("Error verifying CPF:", error);
      toast({
        title: "Erro",
        description: "Erro ao verificar CPF. Tente novamente.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (cpf: number, senha: string): Promise<boolean> => {
    const cpfString = cpf.toString().replace(/\D/g, "");

    try {
      setIsLoading(true);

      const profilesResponse = await authService.getAccountProfiles({
        cpf,
        senha,
      });
      console.log("Resposta dos perfis da conta:", profilesResponse);

      if (Array.isArray(profilesResponse) && profilesResponse.length > 0) {
        const perfil = profilesResponse[0];

        const authResponse = await authService.authenticate({
          codigoPlano: perfil.codigoPlano,
          codigoContrato: perfil.codigoContrato,
          cpf: parseInt(cpfString), 
          senha,
        });

        console.log("Payload enviado para autenticação:", {
          codigoPlano: perfil.codigoPlano,
          codigoContrato: perfil.codigoContrato,
          cpf: cpfString,
          senha,
        });

        if (authResponse.sucesso) {
          const userData: User = {
            id: cpf.toString(),
            nome: perfil.nome || "Usuário",
            cpf,
            email: perfil.email || "",
            celular: perfil.celular || "",
            perfilAutenticado: perfil.perfilAutenticado || null,
          };

          setUser(userData);

          toast({
            title: "Sucesso",
            description: `Bem-vindo, ${userData.nome}!`,
          });

          return true;
        }

        toast({
          title: "Credenciais inválidas",
          description: authResponse.erro || "Senha incorreta.",
          variant: "destructive",
        });
        return false;
      }

      if (profilesResponse?.sucesso && profilesResponse?.dados) {
        const dados = profilesResponse.dados;

        const authResponse = await authService.authenticate({
          codigoPlano: dados.codigoPlano || 0,
          codigoContrato: dados.codigoContrato || 0,
          cpf: parseInt(cpfString),
          senha,
        });

        if (authResponse.sucesso) {
          const userData: User = {
            id: cpf.toString(),
            nome: dados.nome || dados?.dados?.nome || "Usuário",
            cpf,
            email: dados.email || dados?.dados?.email || "",
            celular: dados.celular || dados?.dados?.celular || "",
            perfilAutenticado:
              dados.perfilAutenticado ||
              dados?.dados?.perfilAutenticado ||
              null,
          };

          setUser(userData);

          toast({
            title: "Sucesso",
            description: `Bem-vindo, ${userData.nome}!`,
          });

          return true;
        }

        toast({
          title: "Credenciais inválidas",
          description: authResponse.erro || "Senha incorreta.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Erro ao buscar perfis",
        description: "Nenhum perfil encontrado para este CPF.",
        variant: "destructive",
      });
      return false;
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        toast({
          title: "Senha incorreta",
          description: "Verifique sua senha e tente novamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro de conexão",
          description: "Erro no servidor. Tente novamente.",
          variant: "destructive",
        });
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (cpf: number, senha: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await registerService.registerPassword({ cpf, senha });
      if (response.sucesso) {
        toast({
          title: "Conta criada com sucesso",
          description: "Conta criada com sucesso!",
        });
        return true;
      }
      toast({
        title: "Erro ao criar conta",
        description: response.erro || "Erro ao criar conta.",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Erro de conexão",
        description: "Erro no servidor. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async (cpf: number): Promise<boolean> => {
    try {
      const response = await registerService.createAccount({ cpf });

      if (response.sucesso) {
        toast({
          title: "Conta criada com sucesso",
          description: "Conta criada com sucesso!",
        });
        return true;
      }

      toast({
        title: "Erro ao criar conta",
        description: response.erro || "Erro ao criar conta.",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      console.error("Create account error:", error);
      toast({
        title: "Erro de conexão",
        description: "Erro no servidor. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const registerContact = async (
    cpf: number,
    type: "phone" | "email",
    contact: string
  ): Promise<boolean> => {
    try {
      let response;

      if (type === "phone") {
        response = await registerService.registerPhone({
          cpf,
          celular: parseInt(contact),
        });
      } else {
        response = await registerService.registerEmail({ cpf, email: contact });
      }

      if (response.sucesso) {
        toast({
          title: "Código de verificação enviado",
          description: `Código de verificação enviado para seu ${
            type === "phone" ? "celular" : "e-mail"
          }.`,
        });
        return true;
      }

      toast({
        title: "Erro ao enviar código",
        description:
          response.erro ||
          `Erro ao enviar código para ${
            type === "phone" ? "celular" : "e-mail"
          }.`,
        variant: "destructive",
      });
      return false;
    } catch (error) {
      console.error("Register contact error:", error);
      toast({
        title: "Erro de conexão",
        description: "Erro no servidor. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const confirmContact = async (
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

      if (response.sucesso) {
        toast({
          title: "Verificação realizada com sucesso",
          description: `${
            type === "phone" ? "Celular" : "E-mail"
          } verificado com sucesso!`,
        });
        return true;
      }

      toast({
        title: "Código inválido",
        description: response.erro || "Código de verificação inválido.",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      console.error("Confirm contact error:", error);
      toast({
        title: "Erro de conexão",
        description: "Erro no servidor. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const resendSMS = async (cpf: number): Promise<boolean> => {
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
    } catch (error) {
      console.error("Resend SMS error:", error);
      toast({
        title: "Erro de conexão",
        description: "Erro no servidor. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    // Não limpa o token completamente, apenas os dados do usuário
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const value: AuthContextType = {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
