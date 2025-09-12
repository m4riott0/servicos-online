import axios, { AxiosInstance } from 'axios';

//const API_BASE_URL = 'https://apiapp2024.bensaude.com.br';
const API_BASE_URL = 'https://localhost:7041/';

class ApiClient {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000,
    });

    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        
        // Don't clear token on 401, just log it
        if (error.response?.status === 401) {
          console.warn('Unauthorized request, but keeping token');
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('bensaude_token', token);
    console.log('Token set:', token.substring(0, 20) + '...');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('bensaude_token');
    console.log('Token cleared');
  }

  getStoredToken() {
    const stored = localStorage.getItem('bensaude_token');
    if (stored) {
      this.token = stored;
      console.log('Token loaded from storage:', stored.substring(0, 20) + '...');
    }
    return this.token;
  }

  get instance() {
    return this.api;
  }
}

export const apiClient = new ApiClient();
