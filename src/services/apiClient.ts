import axios, { AxiosInstance } from "axios";

//const API_BASE_URL = "https://apiapp2024.bensaude.com.br";
const API_BASE_URL = "https://localhost:7041";

class ApiClient {
  private api: AxiosInstance;
  private token: string | null = null;
  private tokenPromise: Promise<void> | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 30000,
    });

    this.tokenPromise = this.generateToken();

    this.api.interceptors.request.use(
      async (config) => {
    
        if (this.tokenPromise) {
          await this.tokenPromise;
        }

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
      (error) => {
        console.error("Erro da API:", {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        if (error.response?.status === 401) {
          console.warn("Token expirado ou inválido — gerando novo token...");
          this.tokenPromise = this.generateToken(); 
        }

        return Promise.reject(error);
      }
    );
  }

  private async generateToken() {
    try {
      const credentials = {
        usuario: "mixd",
        senha: "25f003f3c343d87018b8c0b4e264d268528c90000e9c3bb182084f14c14c0137",
      };
      const res = await axios.post<string>(
        `${API_BASE_URL}/api/Token/GerarToken`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      this.setToken(res.data);
    } catch (error) {
      console.error("Erro ao gerar token inicial:", error);
    }
  }

  private setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  get instance() {
    return this.api;
  }
}

export const apiClient = new ApiClient();
