
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthPage } from '@/pages/AuthPage';
import { supabase } from '@/integrations/supabase/client';

// Mock du client Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      resetPasswordForEmail: vi.fn()
    }
  }
}));

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should display login form by default', () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
  });

  it('should switch to signup form when clicking on signup link', async () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    // Trouver et cliquer sur le lien d'inscription
    const signupLink = screen.getByText(/Créer un compte/i);
    fireEvent.click(signupLink);

    // Vérifier que le formulaire d'inscription est affiché
    await waitFor(() => {
      expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
    });
  });

  it('should attempt to login with the provided credentials', async () => {
    // Mock de la fonction signInWithPassword
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' }, session: {} },
      error: null
    } as any);

    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    // Remplir et soumettre le formulaire
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'password123' } });
    
    const loginButton = screen.getByRole('button', { name: /Connexion/i });
    fireEvent.click(loginButton);

    // Vérifier que la fonction signInWithPassword a été appelée avec les bons arguments
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('should display forgot password form when clicking on forgot password link', async () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    // Trouver et cliquer sur le lien de mot de passe oublié
    const forgotPasswordLink = screen.getByText(/Mot de passe oublié/i);
    fireEvent.click(forgotPasswordLink);

    // Vérifier que le formulaire de réinitialisation est affiché
    await waitFor(() => {
      expect(screen.getByText(/Réinitialisation du mot de passe/i)).toBeInTheDocument();
    });
  });
});
