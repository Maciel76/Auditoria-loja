import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useDashboardStore } from '@/store/dashboardStore';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('Dashboard Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('State inicial', () => {
    it('deve ter estado inicial correto', () => {
      const store = useDashboardStore();

      expect(store.systemStats).toEqual({
        activeAudits: 0,
        onlineUsers: 0,
        acceptedSuggestions: 0,
        inDevelopment: 0,
        totalLojas: 0,
        lastUpdate: null,
      });

      expect(store.feedItems).toEqual([]);
      expect(store.votingItems).toEqual([]);
      expect(store.userAchievements).toEqual([]);
    });
  });

  describe('Getters', () => {
    it('deve formatar estatísticas corretamente', () => {
      const store = useDashboardStore();

      // Set some test data
      store.systemStats = {
        activeAudits: 5,
        onlineUsers: 10,
        acceptedSuggestions: 3,
        inDevelopment: 2,
        totalLojas: 8,
        lastUpdate: new Date().toISOString()
      };

      const formatted = store.formattedStats;

      expect(formatted.activeAudits.value).toBe(5);
      expect(formatted.activeAudits.label).toBe('Auditorias Ativas');
      expect(formatted.onlineUsers.value).toBe(10);
      expect(formatted.acceptedSuggestions.value).toBe(3);
      expect(formatted.inDevelopment.value).toBe(2);
    });

    it('deve calcular progresso de conquistas', () => {
      const store = useDashboardStore();

      store.userAchievements = [
        { unlocked: true },
        { unlocked: false },
        { unlocked: true },
        { unlocked: false }
      ];

      expect(store.achievementProgress).toBe(50);
    });

    it('deve filtrar conquistas desbloqueadas', () => {
      const store = useDashboardStore();

      store.userAchievements = [
        { id: 1, unlocked: true, title: 'Primeira' },
        { id: 2, unlocked: false, title: 'Segunda' },
        { id: 3, unlocked: true, title: 'Terceira' }
      ];

      const unlocked = store.unlockedAchievements;
      expect(unlocked).toHaveLength(2);
      expect(unlocked[0].title).toBe('Primeira');
      expect(unlocked[1].title).toBe('Terceira');
    });
  });

  describe('Actions', () => {
    it('deve submeter sugestão com sucesso', async () => {
      const store = useDashboardStore();
      const suggestion = 'Minha sugestão de teste';

      // Mock axios success response
      const axios = await import('axios');
      axios.default.post.mockResolvedValueOnce({
        data: { success: true }
      });

      const result = await store.submitSuggestion(suggestion);

      expect(result.success).toBe(true);
      expect(store.feedItems).toHaveLength(1);
      expect(store.feedItems[0].description).toBe(suggestion);
    });

    it('deve votar em item com sucesso', async () => {
      const store = useDashboardStore();

      // Setup voting item
      store.votingItems = [
        { id: 1, votes: 5, userVoted: false }
      ];

      // Mock axios success response
      const axios = await import('axios');
      axios.default.post.mockResolvedValueOnce({
        data: { success: true }
      });

      const result = await store.submitVote(1);

      expect(result.success).toBe(true);
      expect(store.votingItems[0].votes).toBe(6);
      expect(store.votingItems[0].userVoted).toBe(true);
    });

    it('deve carregar dados mock quando API falha', async () => {
      const store = useDashboardStore();

      // Mock axios to fail
      const axios = await import('axios');
      axios.default.get.mockRejectedValueOnce(new Error('Network error'));

      await store.loadSystemStats();

      // Should fall back to mock data
      expect(store.systemStats.activeAudits).toBeGreaterThan(0);
      expect(store.systemStats.onlineUsers).toBeGreaterThan(0);
    });

    it('deve limpar dados corretamente', () => {
      const store = useDashboardStore();

      // Add some data
      store.feedItems = [{ id: 1 }];
      store.votingItems = [{ id: 1 }];
      store.userAchievements = [{ id: 1 }];
      store.systemStats.activeAudits = 5;

      store.clearData();

      expect(store.feedItems).toEqual([]);
      expect(store.votingItems).toEqual([]);
      expect(store.userAchievements).toEqual([]);
      expect(store.systemStats.activeAudits).toBe(0);
    });
  });

  describe('Mock Data', () => {
    it('deve carregar dados mock de feed', () => {
      const store = useDashboardStore();

      store.loadMockFeed();

      expect(store.feedItems.length).toBeGreaterThan(0);
      expect(store.feedItems[0]).toHaveProperty('title');
      expect(store.feedItems[0]).toHaveProperty('description');
      expect(store.feedItems[0]).toHaveProperty('type');
    });

    it('deve carregar dados mock de votação', () => {
      const store = useDashboardStore();

      store.loadMockVoting();

      expect(store.votingItems.length).toBeGreaterThan(0);
      expect(store.votingItems[0]).toHaveProperty('title');
      expect(store.votingItems[0]).toHaveProperty('status');
      expect(store.votingItems[0]).toHaveProperty('votes');
    });

    it('deve carregar dados mock de conquistas', () => {
      const store = useDashboardStore();

      store.loadMockAchievements();

      expect(store.userAchievements.length).toBeGreaterThan(0);
      expect(store.userAchievements[0]).toHaveProperty('title');
      expect(store.userAchievements[0]).toHaveProperty('unlocked');
      expect(store.userAchievements[0]).toHaveProperty('icon');
    });
  });
});