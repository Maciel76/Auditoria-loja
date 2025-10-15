import { beforeAll, afterEach, vi } from 'vitest';
import { config } from '@vue/test-utils';
import { createRouterMock, injectRouterMock } from 'vue-router-mock';

// Setup global test configuration

// Configure Vue Test Utils globally
config.global.stubs = {
  // Stub router components
  RouterLink: true,
  RouterView: true,

  // Stub FontAwesome icons
  FontAwesomeIcon: true,
  'font-awesome-icon': true,
};

// Mock window methods and properties
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress Vue warnings in tests
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
});

// Router mock setup
const router = createRouterMock({
  spy: {
    create: fn => vi.fn(fn),
    reset: spy => spy.mockReset(),
  },
});

beforeAll(() => {
  injectRouterMock(router);
});

// Custom matchers (if needed)
expect.extend({
  toBeInTheDocument(received) {
    if (received && received.element) {
      const pass = document.body.contains(received.element);
      return {
        pass,
        message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
      };
    }
    return {
      pass: false,
      message: () => 'expected element to exist',
    };
  },
});

// Cleanup function
export function cleanup() {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
}