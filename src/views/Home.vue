<template>
  <div class="home-container">
    <HeaderComponent />
    <HeroSection />

    <div class="main-grid">
      <div class="left-column">
        <CommunityFeed :feedItems="feedItems" />
        <QuickSuggestion
          v-model="novaSugestao"
          @suggestion-submitted="handleSuggestionSubmit"
        />
      </div>

      <div class="right-column">
        <ImprovementsVoting
          :votingItems="votingItems"
          @vote-submitted="handleVoteSubmit"
        />
        <UserAchievements :achievements="achievements" />
        <SystemSummary :stats="systemStats" />
        <OnlineUsersList />
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import HeaderComponent from "@/components/HomeComponents/HeaderComponent.vue";
import HeroSection from "@/components/HomeComponents/HeroSection.vue";
import OnlineUsersList from "@/components/HomeComponents/OnlineUsersList.vue";
import CommunityFeed from "@/components/HomeComponents/CommunityFeed.vue";
import ImprovementsVoting from "@/components/HomeComponents/ImprovementsVoting.vue";
import UserAchievements from "@/components/HomeComponents/UserAchievements.vue";
import SystemSummary from "@/components/HomeComponents/SystemSummary.vue";
import QuickSuggestion from "@/components/HomeComponents/QuickSuggestion.vue";
import FooterComponent from "@/components/HomeComponents/FooterComponent.vue";

// Estado reativo para dados globais
const novaSugestao = ref("");

// Dados do feed da comunidade
const feedItems = ref([
  {
    id: 1,
    type: "feature",
    title: "🚀 Auditoria em Tempo Real",
    description:
      "Nova funcionalidade permite acompanhar auditorias em tempo real com atualizações instantâneas",
    votes: 24,
    comments: 8,
    time: "2 horas",
    badge: "new",
    user: null,
    adminResponse: null,
  },
  {
    id: 2,
    type: "suggestion",
    title: "💡 Sugestão: Relatórios Personalizados",
    description:
      "Seria ótimo poder criar relatórios personalizados com filtros específicos por departamento",
    votes: 42,
    comments: 15,
    time: "1 dia",
    badge: null,
    user: {
      name: "João Silva",
      avatar: "JS",
    },
    adminResponse: {
      text: "Ótima ideia! Já estamos desenvolvendo essa funcionalidade para a próxima atualização.",
      badge: "📋 Equipe respondeu:",
    },
  },
  {
    id: 3,
    type: "update",
    title: "🛠️ Melhorias no Dashboard",
    description:
      "Otimizamos a performance do dashboard e adicionamos novos gráficos de tendência",
    votes: 31,
    comments: 12,
    time: "3 dias",
    badge: "update",
    user: null,
    adminResponse: null,
  },
]);

// Dados de votação
const votingItems = ref([
  {
    id: 1,
    title: "Integração com Power BI",
    description: "Exportação de dados direto para dashboards do Power BI",
    status: "in-progress",
    votes: 127,
    userVoted: true,
  },
  {
    id: 2,
    title: "App Mobile Nativo",
    description: "Aplicativo dedicado para auditorias em campo",
    status: "under-review",
    votes: 89,
    userVoted: false,
  },
  {
    id: 3,
    title: "Relatórios Automáticos",
    description: "Geração automática de relatórios semanais",
    status: "implemented",
    votes: 56,
    userVoted: false,
  },
  {
    id: 4,
    title: "Sistema de Gamificação",
    description: "Badges e recompensas por participação ativa",
    status: "new-idea",
    votes: 34,
    userVoted: false,
  },
]);

// Conquistas do usuário
const achievements = ref([
  {
    id: 1,
    title: "Primeira Auditoria",
    description: "Concluiu sua primeira auditoria",
    unlocked: true,
    icon: "🔍",
    type: "unlocked",
  },
  {
    id: 2,
    title: "Sugestor Ativo",
    description: "Enviou 5+ sugestões",
    unlocked: true,
    icon: "💡",
    type: "unlocked",
  },
  {
    id: 3,
    title: "Top Colaborador",
    description: "Fique entre os 3 melhores do mês",
    unlocked: false,
    icon: "🏅",
    type: "locked",
  },
  {
    id: 4,
    title: "Auditor Experiente",
    description: "3/10 auditorias concluídas",
    unlocked: true,
    icon: "📊",
    type: "progress",
    progress: 30,
  },
]);

// Estatísticas do sistema
const systemStats = reactive({
  activeAudits: 12,
  onlineUsers: 28,
  acceptedSuggestions: 15,
  inDevelopment: 7,
});

// Métodos
const handleSuggestionSubmit = (suggestion) => {
  console.log("Nova sugestão enviada:", suggestion);
  // Aqui você faria a chamada API
  novaSugestao.value = "";

  // Simular adição ao feed
  feedItems.value.unshift({
    id: Date.now(),
    type: "suggestion",
    title: `💡 ${suggestion.substring(0, 30)}...`,
    description: suggestion,
    votes: 0,
    comments: 0,
    time: "Agora",
    badge: null,
    user: {
      name: "Você",
      avatar: "VC",
    },
    adminResponse: null,
  });
};

const handleVoteSubmit = (itemId) => {
  const item = votingItems.value.find((item) => item.id === itemId);
  if (item && !item.userVoted) {
    item.votes++;
    item.userVoted = true;
  }
};

// Simular carregamento de dados
onMounted(() => {
  console.log("HomePage carregada com sucesso!");
});
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: "Inter", system-ui, sans-serif;
}

.main-grid {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .main-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}
</style>
