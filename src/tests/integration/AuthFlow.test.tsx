
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthPage from '@/pages/AuthPage';

// Mock du hook d'authentification
vi.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue({}),
    signup: vi.fn().mockResolvedValue({}),
    isAuthenticated: false,
    user: null,
    isLoading: false,
  }),
}));

// Mock de i18n
vi.mock('@/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Renvoie la clé comme valeur
  }),
}));

// Mock des composants externes
vi.mock('@/components/auth/TwoFactorSetup', () => ({
  __esModule: true,
  default: () => <div>2FA Setup</div>,
}));

describe('Authentication Flow', () => {
  it('should render login form by default', () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );
    
    // Vérifier que le formulaire de connexion est affiché
    expect(screen.getByText(/auth.login/i)).toBeInTheDocument();
  });
  
  it('should switch to signup form when clicking signup link', async () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );
    
    // Trouver et cliquer sur le lien d'inscription
    fireEvent.click(screen.getByText(/auth.signup.link/i));
    
    // Vérifier que le formulaire d'inscription est affiché
    await waitFor(() => {
      expect(screen.getByText(/auth.signup/i)).toBeInTheDocument();
    });
  });
});
