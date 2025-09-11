import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Login } from '../../pages/Login';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the API service
vi.mock('../../services/api', () => ({
  apiService: {
    generateToken: vi.fn(),
    authenticate: vi.fn(),
    getAccountProfiles: vi.fn(),
    setToken: vi.fn(),
    clearToken: vi.fn(),
    getStoredToken: vi.fn(),
  },
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

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    expect(getByText('Bensaude Saúde')).toBeInTheDocument();
    expect(getByText('Portal do Beneficiário')).toBeInTheDocument();
    expect(getByText('Entrar')).toBeInTheDocument();
    expect(getByPlaceholderText('000.000.000-00')).toBeInTheDocument();
    expect(getByPlaceholderText('Digite sua senha')).toBeInTheDocument();
  });

  it('formats CPF input correctly', async () => {
    const user = userEvent.setup();
    const { getByPlaceholderText } = render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const cpfInput = getByPlaceholderText('000.000.000-00');
    
    await user.type(cpfInput, '12345678901');
    
    expect(cpfInput).toHaveValue('123.456.789-01');
  });

  it('shows submit button in correct state', () => {
    const { getByRole } = render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const submitButton = getByRole('button', { name: /entrar/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });
});