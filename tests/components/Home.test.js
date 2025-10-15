import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { setActivePinia, createPinia } from 'pinia';
import Home from '@/views/Home.vue';
import { useLojaStore } from '@/store/lojaStore';
import { useDashboardStore } from '@/store/dashboardStore';

// Mock dos componentes filhos
vi.mock('@/components/HomeComponents/CommunityFeed.vue', () => ({
  default: {
    name: 'CommunityFeed',
    template: '<div data-testid="community-feed">Community Feed Mock</div>',
    props: ['feedItems']
  }
}));

vi.mock('@/components/HomeComponents/ImprovementsVoting.vue', () => ({
  default: {
    name: 'ImprovementsVoting',
    template: '<div data-testid="improvements-voting">Improvements Voting Mock</div>',
    props: ['votingItems']
  }
}));

vi.mock('@/components/HomeComponents/UserAchievements.vue', () => ({
  default: {
    name: 'UserAchievements',
    template: '<div data-testid="user-achievements">User Achievements Mock</div>',
    props: ['achievements']
  }
}));

vi.mock('@/components/HomeComponents/SystemSummary.vue', () => ({
  default: {
    name: 'SystemSummary',
    template: '<div data-testid="system-summary">System Summary Mock</div>',
    props: ['stats']
  }
}));

vi.mock('@/components/HomeComponents/QuickSuggestion.vue', () => ({
  default: {
    name: 'QuickSuggestion',
    template: '<div data-testid="quick-suggestion">Quick Suggestion Mock</div>',
    props: ['modelValue'],
    emits: ['suggestion-submitted']
  }
}));

describe('Home Component', () => {
  let router;
  let pinia;
  let lojaStore;
  let dashboardStore;

  beforeEach(() => {
    // Setup router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'Home', component: Home },
        { path: '/perfil', name: 'Perfil', component: { template: '<div>Perfil</div>' } },
        { path: '/selecionar-auditoria', name: 'SelecionarAuditoria', component: { template: '<div>Auditoria</div>' } },
        { path: '/ranking', name: 'Ranking', component: { template: '<div>Ranking</div>' } }
      ]
    });

    // Setup Pinia
    pinia = createPinia();
    setActivePinia(pinia);

    // Setup stores
    lojaStore = useLojaStore();
    dashboardStore = useDashboardStore();

    // Mock store data
    lojaStore.lojaSelecionada = {
      codigo: '056',
      nome: 'Loja 056 - Goiânia Burits',
      cidade: 'Goiânia'
    };

    dashboardStore.loadMockFeed();
    dashboardStore.loadMockVoting();
    dashboardStore.loadMockAchievements();
    dashboardStore.loadMockStats();

    // Mock loadDashboardData method
    vi.spyOn(dashboardStore, 'loadDashboardData').mockResolvedValue();
  });

  const createWrapper = (options = {}) => {
    return mount(Home, {
      global: {
        plugins: [router, pinia],
        stubs: {
          'router-link': true,
          'router-view': true
        }
      },
      ...options
    });
  };

  describe('Renderização', () => {
    it('deve renderizar corretamente', async () => {
      const wrapper = createWrapper();
      await router.isReady();

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.home-container').exists()).toBe(true);
    });

    it('deve mostrar header principal com informações da loja', async () => {
      const wrapper = createWrapper();
      await router.isReady();

      const header = wrapper.find('.main-header');
      expect(header.exists()).toBe(true);

      const lojaInfo = wrapper.find('.loja-info');
      expect(lojaInfo.exists()).toBe(true);
      expect(lojaInfo.text()).toContain('Loja 056 - Goiânia Burits');
    });

    it('deve renderizar seção hero com botões de ação', async () => {
      const wrapper = createWrapper();
      await router.isReady();

      const heroSection = wrapper.find('.hero-section');
      expect(heroSection.exists()).toBe(true);

      const actionButtons = wrapper.findAll('.action-btn');
      expect(actionButtons).toHaveLength(2);
    });

    it('deve renderizar todos os componentes filhos', async () => {
      const wrapper = createWrapper();
      await router.isReady();

      expect(wrapper.find('[data-testid="community-feed"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="improvements-voting"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="user-achievements"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="system-summary"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="quick-suggestion"]').exists()).toBe(true);
    });
  });

  describe('Interações', () => {
    it('deve navegar para auditoria ao clicar no botão', async () => {
      const wrapper = createWrapper();
      await router.isReady();

      const routerPushSpy = vi.spyOn(router, 'push');

      const auditButton = wrapper.find('.action-btn.primary');
      await auditButton.trigger('click');

      expect(routerPushSpy).toHaveBeenCalledWith('/selecionar-auditoria');
    });

    it('deve navegar para rankings ao clicar no botão', async () => {
      const wrapper = createWrapper();
      await router.isReady();

      const routerPushSpy = vi.spyOn(router, 'push');

      const rankingButton = wrapper.find('.action-btn.secondary');
      await rankingButton.trigger('click');

      expect(routerPushSpy).toHaveBeenCalledWith('/ranking');
    });

    it('deve navegar para perfil ao clicar no botão do header', async () => {
      const wrapper = createWrapper();
      await router.isReady();

      const routerPushSpy = vi.spyOn(router, 'push');

      const profileButton = wrapper.find('.btn-profile');
      await profileButton.trigger('click');

      expect(routerPushSpy).toHaveBeenCalledWith('/perfil');
    });
  });

  describe('Lifecycle', () => {
    it('deve carregar dados do dashboard no mount', async () => {
      createWrapper();
      await router.isReady();

      expect(dashboardStore.loadDashboardData).toHaveBeenCalled();
    });
  });

  describe('Responsividade', () => {
    it('deve ter classes CSS para layout responsivo', async () => {
      const wrapper = createWrapper();
      await router.isReady();

      const contentGrid = wrapper.find('.content-grid');
      expect(contentGrid.exists()).toBe(true);

      // Verificar se tem as colunas definidas
      expect(wrapper.find('.left-column').exists()).toBe(true);
      expect(wrapper.find('.right-column').exists()).toBe(true);
    });
  });

  describe('Estados de Loading', () => {
    it('deve mostrar conteúdo após carregamento', async () => {
      dashboardStore.loading.stats = false;
      dashboardStore.loading.feed = false;

      const wrapper = createWrapper();
      await router.isReady();

      // Todos os componentes devem estar visíveis
      expect(wrapper.find('[data-testid="community-feed"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="system-summary"]').exists()).toBe(true);
    });
  });

  describe('Integração com Stores', () => {
    it('deve usar dados do dashboardStore', async () => {
      const wrapper = createWrapper();
      await router.isReady();

      // Verificar se os dados dos stores estão sendo utilizados
      expect(dashboardStore.feedItems.length).toBeGreaterThan(0);
      expect(dashboardStore.votingItems.length).toBeGreaterThan(0);
      expect(dashboardStore.userAchievements.length).toBeGreaterThan(0);
    });

    it('deve usar dados do lojaStore', async () => {
      const wrapper = createWrapper();
      await router.isReady();

      expect(lojaStore.lojaSelecionada).toBeTruthy();
      expect(wrapper.text()).toContain(lojaStore.lojaSelecionada.nome);
    });
  });
});