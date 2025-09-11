import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Login } from '../../pages/Login';
import { PasswordRecovery } from '../../pages/PasswordRecovery';
import { AuthProvider } from '../../contexts/AuthContext';

const mockApiService = {
  generateToken: vi.fn(),
  verificaCPF: vi.fn(),
  authenticate: vi.fn(),
  getAccountProfiles: vi.fn(),
  createAccount: vi.fn(),
  registerPhone: vi.fn(),
  registerEmail: vi.fn(),
  confirmPhone: vi.fn(),
  confirmEmail: vi.fn(),
  resendSMS: vi.fn(),
  registerPassword: vi.fn(),
  recoverPassword: vi.fn(),
  validateRecoveryToken: vi.fn(),
  changePassword: vi.fn(),
  setToken: vi.fn(),
  clearToken: vi.fn(),
  getStoredToken: vi.fn(),
};

vi.mock('../../services/api', () => ({
  apiService: mockApiService,
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiService.getStoredToken.mockReturnValue(null);
  });

  describe('Login Component', () => {
    it('renders CPF verification form initially', () => {
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      expect(screen.getByText('Bensaude Saúde')).toBeInTheDocument();
      expect(screen.getByText('Acesse sua conta')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('000.000.000-00')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
    });

    it('formats CPF input correctly', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const cpfInput = screen.getByPlaceholderText('000.000.000-00');
      
      await user.type(cpfInput, '12345678901');
      
      expect(cpfInput).toHaveValue('123.456.789-01');
    });

    it('handles CPF verification and redirects to login', async () => {
      const user = userEvent.setup();
      
      mockApiService.generateToken.mockResolvedValue('fake-token');
      mockApiService.verificaCPF.mockResolvedValue({
        sucesso: true,
        nome: 'João Silva',
        email: 'joao@email.com',
        celular: '11999999999',
        temContaNoApp: true,
        temSenhaCadastrada: true,
        beneficiario: true
      });

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const cpfInput = screen.getByPlaceholderText('000.000.000-00');
      const submitButton = screen.getByRole('button', { name: /continuar/i });

      await user.type(cpfInput, '12345678901');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Entrar na sua conta')).toBeInTheDocument();
        expect(screen.getByText('João Silva')).toBeInTheDocument();
      });
    });

    it('handles CPF verification and redirects to registration', async () => {
      const user = userEvent.setup();
      
      mockApiService.generateToken.mockResolvedValue('fake-token');
      mockApiService.verificaCPF.mockResolvedValue({
        sucesso: true,
        nome: 'Maria Silva',
        email: '',
        celular: '',
        temContaNoApp: false,
        temSenhaCadastrada: false,
        beneficiario: true
      });

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const cpfInput = screen.getByPlaceholderText('000.000.000-00');
      const submitButton = screen.getByRole('button', { name: /continuar/i });

      await user.type(cpfInput, '12345678901');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Cadastro')).toBeInTheDocument();
        expect(screen.getByText('Maria Silva')).toBeInTheDocument();
      });
    });

    it('shows error for invalid CPF', async () => {
      const user = userEvent.setup();
      
      mockApiService.generateToken.mockResolvedValue('fake-token');
      mockApiService.verificaCPF.mockResolvedValue({
        sucesso: false,
        erro: 'CPF não encontrado',
        beneficiario: false
      });

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>
      );

      const cpfInput = screen.getByPlaceholderText('000.000.000-00');
      const submitButton = screen.getByRole('button', { name: /continuar/i });

      await user.type(cpfInput, '12345678901');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('CPF não encontrado')).toBeInTheDocument();
      });
    });
  });

  describe('Password Recovery Component', () => {
    it('renders password recovery form', () => {
      render(
        <TestWrapper>
          <PasswordRecovery />
        </TestWrapper>
      );

      expect(screen.getByText('Recuperar Senha')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('000.000.000-00')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('(00) 00000-0000')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviar código/i })).toBeInTheDocument();
    });

    it('handles recovery request successfully', async () => {
      const user = userEvent.setup();
      
      mockApiService.generateToken.mockResolvedValue('fake-token');
      mockApiService.recoverPassword.mockResolvedValue({
        sucesso: true,
        erro: null
      });

      render(
        <TestWrapper>
          <PasswordRecovery />
        </TestWrapper>
      );

      const cpfInput = screen.getByPlaceholderText('000.000.000-00');
      const phoneInput = screen.getByPlaceholderText('(00) 00000-0000');
      const submitButton = screen.getByRole('button', { name: /enviar código/i });

      await user.type(cpfInput, '12345678901');
      await user.type(phoneInput, '11999999999');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Verificar Código')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
      });
    });

    it('handles token validation', async () => {
      const user = userEvent.setup();
      
      // Setup mocks for successful flow
      mockApiService.generateToken.mockResolvedValue('fake-token');
      mockApiService.recoverPassword.mockResolvedValue({ sucesso: true });
      mockApiService.validateRecoveryToken.mockResolvedValue({ sucesso: true });

      render(
        <TestWrapper>
          <PasswordRecovery />
        </TestWrapper>
      );

      // First step - request recovery
      const cpfInput = screen.getByPlaceholderText('000.000.000-00');
      const phoneInput = screen.getByPlaceholderText('(00) 00000-0000');
      
      await user.type(cpfInput, '12345678901');
      await user.type(phoneInput, '11999999999');
      await user.click(screen.getByRole('button', { name: /enviar código/i }));

      // Second step - verify token
      await waitFor(() => {
        expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
      });

      const tokenInput = screen.getByPlaceholderText('000000');
      await user.type(tokenInput, '123456');
      await user.click(screen.getByRole('button', { name: /verificar código/i }));

      // Third step - change password
      await waitFor(() => {
        expect(screen.getByText('Nova Senha')).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText(/digite.*senha/i)).toHaveLength(2);
      });
    });

    it('formats phone input correctly', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <PasswordRecovery />
        </TestWrapper>
      );

      const phoneInput = screen.getByPlaceholderText('(00) 00000-0000');
      
      await user.type(phoneInput, '11999999999');
      
      expect(phoneInput).toHaveValue('(11) 99999-9999');
    });

    it('shows countdown timer for resend code', async () => {
      const user = userEvent.setup();
      
      mockApiService.generateToken.mockResolvedValue('fake-token');
      mockApiService.recoverPassword.mockResolvedValue({ sucesso: true });

      render(
        <TestWrapper>
          <PasswordRecovery />
        </TestWrapper>
      );

      // Navigate to verification step
      await user.type(screen.getByPlaceholderText('000.000.000-00'), '12345678901');
      await user.type(screen.getByPlaceholderText('(00) 00000-0000'), '11999999999');
      await user.click(screen.getByRole('button', { name: /enviar código/i }));

      await waitFor(() => {
        expect(screen.getByText(/reenviar em/i)).toBeInTheDocument();
      });
    });
  });
});