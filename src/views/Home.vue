<template>
  <div class="home-container">
    <!-- <HeaderComponent /> -->
    <HeroSection />

    <div class="main-grid">
      <div class="left-column">
        <!-- <PostCreator @post-created="onPostCreated" /> -->
        <CommunityFeed
          :feedItems="dashboardStore.feedItems"
          @vote-submitted="handleFeedVote"
          @reaction-submitted="handleFeedReaction"
        />
        <QuickSuggestion
          v-model="novaSugestao"
          @suggestion-submitted="handleSuggestionSubmit"
        />
      </div>

      <div class="right-column">
        <ImprovementsVoting
          :votingItems="dashboardStore.realVotingItems"
          @vote-submitted="handleVoteSubmit"
          @reaction-submitted="handleVotingReaction"
        />
        <SystemSummary :stats="dashboardStore.systemStats" />
        <!-- <OnlineUsersList /> -->
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useDashboardStore } from "@/store/dashboardStore";
import axios from "axios";
// import HeaderComponent from "@/components/HomeComponents/HeaderComponent.vue";
import HeroSection from "@/components/HomeComponents/HeroSection.vue";
// import OnlineUsersList from "@/components/HomeComponents/OnlineUsersList.vue";
import CommunityFeed from "@/components/HomeComponents/CommunityFeed.vue";
import ImprovementsVoting from "@/components/HomeComponents/ImprovementsVoting.vue";
import SystemSummary from "@/components/HomeComponents/SystemSummary.vue";
import QuickSuggestion from "@/components/HomeComponents/QuickSuggestion.vue";
import PostCreator from "@/components/HomeComponents/PostCreator.vue";
import FooterComponent from "@/components/HomeComponents/FooterComponent.vue";

// Usar o store do Pinia
const dashboardStore = useDashboardStore();

// Estado reativo para dados globais
const novaSugestao = ref("");

// Métodos
const handleSuggestionSubmit = async (suggestion) => {
  console.log("Nova sugestão enviada:", suggestion);

  try {
    // Usar o store para enviar a sugestão
    const result = await dashboardStore.submitSuggestion(suggestion);

    if (result.success) {
      console.log("✅ Sugestão enviada com sucesso!");
      novaSugestao.value = "";
    } else {
      console.error("❌ Erro ao enviar sugestão:", result.message);
    }
  } catch (error) {
    console.error("❌ Erro interno:", error);
  }
};

const handleVoteSubmit = async (itemId) => {
  try {
    const result = await dashboardStore.submitVote(itemId);
    if (result.success) {
      console.log("✅ Voto registrado!");
    }
  } catch (error) {
    console.error("❌ Erro ao votar:", error);
  }
};

const handleFeedVote = async (itemId) => {
  try {
    const result = await dashboardStore.submitVote(itemId);
    if (result.success) {
      console.log("✅ Voto no feed registrado!");
    }
  } catch (error) {
    console.error("❌ Erro ao votar no feed:", error);
  }
};

const handleFeedReaction = async ({ itemId, reactionType, userIdentifier }) => {
  try {
    console.log(`📡 Reagindo no feed: ${reactionType} para item ${itemId}`);

    // Tentar usar a API primeiro
    const response = await axios.post(
      `http://localhost:3000/api/sugestoes/${itemId}/react`,
      {
        reaction: reactionType,
        userIdentifier: userIdentifier,
      }
    );

    if (response.data.reactions) {
      // Atualizar item local no feed
      const item = dashboardStore.feedItems.find(
        (item) => item.id === itemId || item.originalId === itemId
      );
      if (item) {
        item.reactions = response.data.reactions;
      }
      console.log(`✅ Reação ${reactionType} salva no banco de dados!`);
    }
  } catch (error) {
    console.warn(
      "⚠️ API não disponível, usando simulação local:",
      error.message
    );

    // Fallback: Simular reação local nas publicações da Home
    const item = dashboardStore.feedItems.find(
      (item) => item.id === itemId || item.originalId === itemId
    );
    if (item) {
      // Inicializar reactions se não existir
      if (!item.reactions) {
        item.reactions = {
          like: { count: 0, users: [] },
          dislike: { count: 0, users: [] },
          fire: { count: 0, users: [] },
          heart: { count: 0, users: [] },
        };
      }

      // Verificar se usuário já reagiu
      const hasReacted =
        item.reactions[reactionType].users.includes(userIdentifier);

      if (hasReacted) {
        // Remover reação
        item.reactions[reactionType].count = Math.max(
          0,
          item.reactions[reactionType].count - 1
        );
        item.reactions[reactionType].users = item.reactions[
          reactionType
        ].users.filter((user) => user !== userIdentifier);
        console.log(`✅ Reação ${reactionType} removida (local)!`);
      } else {
        // Adicionar reação
        item.reactions[reactionType].count += 1;
        item.reactions[reactionType].users.push(userIdentifier);
        console.log(`✅ Reação ${reactionType} adicionada (local)!`);
      }
    }
  }
};

const handleVotingReaction = async ({
  itemId,
  reactionType,
  userIdentifier,
}) => {
  try {
    console.log(
      `🗳️ Reagindo em item de votação: ${reactionType} para item ${itemId}`
    );
    const result = await dashboardStore.reactToVotingItem(
      itemId,
      reactionType,
      userIdentifier
    );

    if (result.success) {
      console.log(`✅ Reação em votação salva: ${result.message}`);
    } else {
      console.error(`❌ Erro ao reagir em votação: ${result.message}`);
    }
  } catch (error) {
    console.error("❌ Erro ao reagir em item de votação:", error);
  }
};

const onPostCreated = (post) => {
  console.log("✅ Post criado via PostCreator:", post);
  // O post já foi adicionado ao feed pelo store
  // Aqui podemos adicionar notificações ou outras ações se necessário
};

// Carregar dados quando componente for montado
onMounted(async () => {
  console.log("HomePage carregada com sucesso!");

  try {
    // Carregar dados do dashboard
    console.log("🔄 Carregando dados do dashboard...");
    await dashboardStore.loadDashboardData();
    console.log("📊 Dados do dashboard carregados!");
    console.log("📰 Feed items:", dashboardStore.feedItems.length);
  } catch (error) {
    console.error("❌ Erro ao carregar dashboard:", error);
  }
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
