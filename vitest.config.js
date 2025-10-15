import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/', import.meta.url)),
    },
  },

  test: {
    // Configurações do Vitest
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],

    // Cobertura de testes
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.js',
        '*.config.ts',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        'src/main.js' // Arquivo de bootstrap
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },

    // Incluir/excluir arquivos de teste
    include: [
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],

    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache'
    ],

    // Timeout para testes
    testTimeout: 10000,

    // Configurações específicas para Vue
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi']
    },

    // Configurações do ambiente de teste
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    }
  },

  // Configurações para resolver dependências durante os testes
  optimizeDeps: {
    include: [
      'vue',
      '@vue/test-utils',
      'vue-router',
      'pinia'
    ]
  }
});