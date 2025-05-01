
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { captureError } from '@/integrations/sentry';

// Mock des dépendances
vi.mock('@/integrations/sentry', () => ({
  captureError: vi.fn()
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}));

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should handle network error correctly', () => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
    
    const { result } = renderHook(() => useErrorHandler());
    
    const testError = new Error('Test network error');
    
    act(() => {
      result.current.handleError(testError);
    });
    
    expect(result.current.lastError).toBe(testError);
    expect(captureError).toHaveBeenCalledWith(testError, { errorType: 'network' });
  });

  it('should handle authentication error correctly', () => {
    // Restore online status
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
    
    const { result } = renderHook(() => useErrorHandler());
    
    const authError = { status: 401, message: 'Unauthorized' };
    
    act(() => {
      result.current.handleError(authError);
    });
    
    expect(result.current.lastError).toBe(authError);
    expect(captureError).toHaveBeenCalled();
  });

  it('should respect options for not showing toast', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('Test error');
    
    act(() => {
      result.current.handleError(testError, { showToast: false });
    });
    
    expect(result.current.lastError).toBe(testError);
    // Vérifier que toast.error n'a pas été appelé
    expect(require('sonner').toast.error).not.toHaveBeenCalled();
  });
});
