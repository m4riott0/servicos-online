import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

//const API_BASE_URL = "https://apiapp2024.bensaude.com.br";
const API_BASE_URL = "https://localhost:7041";

type FailedRequest = {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
};

class ApiClient {
  private api: AxiosInstance;
  private token: string | null = null;
  private isRefreshing = false;
  private failedQueue: FailedRequest[] = [];

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 30000,
    });

    this.generateAndSetInitialToken();

    this.api.interceptors.request.use(
      async (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        console.log(
          "Requisição API:",
          config.method?.toUpperCase(),
          config.url
        );

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        console.error("Erro da API:", { 
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((newToken) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                return this.api(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            console.warn("Token expirado ou inválido — gerando novo token...");
            const newToken = await this.generateToken();
            this.setToken(newToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            // Processa a fila de requisições que falharam
            this.processQueue(null, newToken);

            // Tenta novamente a requisição original
            return this.api(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.clearToken(); // Limpa o token inválido
            console.error("Falha ao renovar o token.", refreshError);
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }
  
  private async generateAndSetInitialToken() {
    try {
      const token = await this.generateToken();
      this.setToken(token);
    } catch {
      console.log("Erro ao gerar token inicial.")
    }
  }

  private async generateToken(): Promise<string> {
    try {
      const credentials = {
        usuario: "mixd",
        senha: "25f003f3c343d87018b8c0b4e264d268528c90000e9c3bb182084f14c14c0137",
      };
      const response = await axios.post<string>(
        `${API_BASE_URL}/api/Token/GerarToken`,
        credentials,
      );
      console.log("Novo token gerado com sucesso.");
      return response.data;
    } catch (error) {
      console.error("Erro ao gerar token:", error);
      throw error; 
    }
  }

  private setToken(token: string | null) {
    this.token = token;
    if (token) {
      this.api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common.Authorization;
    }
  }

  clearToken() {
    this.setToken(null);
  }

  renewToken() {
    this.generateAndSetInitialToken();
  }

  private processQueue(error: unknown, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  get instance() {
    return this.api;
  }
}

export const apiClient = new ApiClient();
