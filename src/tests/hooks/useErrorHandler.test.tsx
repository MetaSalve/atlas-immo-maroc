
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

// Mock de la fonction captureError
vi.mock('@/integrations/sentry', () => ({
  captureError: vi.fn(),
}));

// Mock de toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('useErrorHandler', () => {
  it('should handle network error', () => {
    // Simuler une déconnexion Internet
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
    
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      const error = new Error('Failed to fetch');
      result.current.handleError(error);
    });
    
    expect(result.current.lastError).not.toBeNull();
    
    // Rétablir la connexion Internet
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
  });
  
  it('should handle authentication error', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      const authError = { status: 401, message: 'Unauthorized' };
      result.current.handleError(authError);
    });
    
    expect(result.current.lastError).not.toBeNull();
  });
  
  it('should handle server error', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      const serverError = { status: 500, message: 'Internal Server Error' };
      result.current.handleError(serverError);
    });
    
    expect(result.current.lastError).not.toBeNull();
  });
});
