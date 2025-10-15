import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useLojaStore } from '@/store/lojaStore';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    defaults: {
      headers: {
        common: {}
      }
    }
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Loja Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('State inicial', () => {
    it('deve ter estado inicial correto', () => {
      const store = useLojaStore();

      expect(store.lojaSelecionada).toBe(null);
      expect(store.lojas).toHaveLength(10);
      expect(store.loading).toBe(false);
      expect(store.error).toBe(null);
    });

    it('deve ter lista de lojas predefinidas', () => {
      const store = useLojaStore();

      expect(store.lojas[0]).toHaveProperty('codigo');
      expect(store.lojas[0]).toHaveProperty('nome');
      expect(store.lojas[0]).toHaveProperty('cidade');
      expect(store.lojas[0]).toHaveProperty('imagem');
    });
  });

  describe('Getters', () => {
    it('deve verificar se loja está selecionada', () => {
      const store = useLojaStore();

      expect(store.isLojaSelected).toBe(false);

      store.lojaSelecionada = store.lojas[0];
      expect(store.isLojaSelected).toBe(true);
    });

    it('deve retornar nome da loja atual', () => {
      const store = useLojaStore();

      expect(store.nomeLojaAtual).toBe('Nenhuma loja selecionada');

      store.lojaSelecionada = store.lojas[0];
      expect(store.nomeLojaAtual).toBe(store.lojas[0].nome);
    });

    it('deve retornar código da loja atual', () => {
      const store = useLojaStore();

      expect(store.codigoLojaAtual).toBe(null);

      store.lojaSelecionada = store.lojas[0];
      expect(store.codigoLojaAtual).toBe(store.lojas[0].codigo);
    });

    it('deve gerar caminho de imagem corretamente', () => {
      const store = useLojaStore();

      // Com loja selecionada que tem imagem
      store.lojaSelecionada = store.lojas[0];
      expect(store.imagemLojaAtual).toBe(store.lojas[0].imagem);

      // Com loja sem imagem mas com código
      store.lojaSelecionada = { codigo: '123', nome: 'Teste' };
      expect(store.imagemLojaAtual).toBe('/images/lojas/123.jpg');

      // Sem loja selecionada
      store.lojaSelecionada = null;
      expect(store.imagemLojaAtual).toBe('/images/lojas/default.jpg');
    });
  });

  describe('Actions', () => {
    it('deve selecionar loja com sucesso', async () => {
      const store = useLojaStore();

      // Mock axios success response
      const axios = await import('axios');
      axios.default.get.mockResolvedValueOnce({
        status: 200,
        data: { success: true }
      });

      const loja = store.lojas[0];
      const result = await store.selecionarLoja(loja);

      expect(result).toBe(true);
      expect(store.lojaSelecionada).toEqual(loja);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'lojaSelecionada',
        JSON.stringify(loja)
      );
    });

    it('deve selecionar loja por código string', async () => {
      const store = useLojaStore();

      // Mock axios success response
      const axios = await import('axios');
      axios.default.get.mockResolvedValueOnce({
        status: 200,
        data: { success: true }
      });

      const result = await store.selecionarLoja('056');

      expect(result).toBe(true);
      expect(store.lojaSelecionada.codigo).toBe('056');
    });

    it('deve falhar ao selecionar loja inexistente', async () => {
      const store = useLojaStore();

      const result = await store.selecionarLoja('999');

      expect(result).toBe(false);
      expect(store.error).toContain('não encontrada');
    });

    it('deve falhar quando API retorna erro', async () => {
      const store = useLojaStore();

      // Mock axios error response
      const axios = await import('axios');
      axios.default.get.mockRejectedValueOnce({
        response: {
          data: { mensagem: 'Loja inválida' }
        }
      });

      const loja = store.lojas[0];
      const result = await store.selecionarLoja(loja);

      expect(result).toBe(false);
      expect(store.error).toBe('Loja inválida');
    });

    it('deve carregar loja do localStorage', () => {
      const store = useLojaStore();
      const lojaTesteSalva = store.lojas[0];

      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify(lojaTesteSalva)
      );

      store.carregarLoja();

      expect(store.lojaSelecionada).toEqual(lojaTesteSalva);
    });

    it('deve lidar com erro ao carregar do localStorage', () => {
      const store = useLojaStore();

      localStorageMock.getItem.mockReturnValueOnce('json inválido');

      store.carregarLoja();

      expect(store.lojaSelecionada).toBe(null);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('lojaSelecionada');
    });

    it('deve limpar seleção de loja', () => {
      const store = useLojaStore();

      // Set some loja first
      store.lojaSelecionada = store.lojas[0];

      store.limparLoja();

      expect(store.lojaSelecionada).toBe(null);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('lojaSelecionada');
    });

    it('deve configurar header do axios', () => {
      const store = useLojaStore();

      store.configurarAxiosHeader('056');

      const axios = require('axios');
      expect(axios.default.defaults.headers.common['x-loja']).toBe('056');
    });

    it('deve verificar se loja é válida', async () => {
      const store = useLojaStore();
      store.lojaSelecionada = store.lojas[0];

      // Mock axios success response
      const axios = await import('axios');
      axios.default.get.mockResolvedValueOnce({
        status: 200
      });

      const result = await store.verificarLoja();

      expect(result).toBe(true);
    });

    it('deve limpar loja quando verificação falha', async () => {
      const store = useLojaStore();
      store.lojaSelecionada = store.lojas[0];

      // Mock axios error response
      const axios = await import('axios');
      axios.default.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await store.verificarLoja();

      expect(result).toBe(false);
      expect(store.lojaSelecionada).toBe(null);
    });
  });
});