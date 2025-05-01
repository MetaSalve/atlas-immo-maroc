
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Étendre les assertions Vitest avec celles de testing-library
expect.extend(matchers);

// Nettoyer après chaque test
afterEach(() => {
  cleanup();
});

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => {
      return store[key] || null;
    },
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

// Remplacer localStorage par notre mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock de navigator.language
Object.defineProperty(window, 'navigator', {
  value: {
    ...window.navigator,
    language: 'fr',
  },
  writable: true
});

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
  writable: true
});

// Mock de fetch
global.fetch = vi.fn().mockImplementation(() => 
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
    headers: new Headers(),
    redirected: false,
    statusText: 'OK',
    type: 'basic',
    url: 'http://localhost',
  })
);

// Mock pour IntersectionObserver
const mockIntersectionObserver = vi.fn().mockImplementation((callback) => {
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  };
});

window.IntersectionObserver = mockIntersectionObserver;
