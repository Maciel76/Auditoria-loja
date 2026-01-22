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
          @comment-added="handleCommentAdded"
        />
      </div>

      <div class="right-column">
        <ImprovementsVoting
          :votingItems="dashboardStore.realVotingItems"
          @vote-submitted="handleVoteSubmit"
          @reaction-submitted="handleVotingReaction"
        />
        <AvisosSistema :stats="dashboardStore.systemStats" />
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
import AvisosSistema from "@/components/HomeComponents/UserAchievements.vue";
import FooterComponent from "@/components/HomeComponents/FooterComponent.vue";

// Usar o store do Pinia
const dashboardStore = useDashboardStore();

// Métodos
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
      },
    );

    if (response.data.reactions) {
      // Atualizar item local no feed
      const item = dashboardStore.feedItems.find(
        (item) => item.id === itemId || item.originalId === itemId,
      );
      if (item) {
        item.reactions = response.data.reactions;
      }
      console.log(`✅ Reação ${reactionType} salva no banco de dados!`);
    }
  } catch (error) {
    console.warn(
      "⚠️ API não disponível, usando simulação local:",
      error.message,
    );

    // Fallback: Simular reação local nas publicações da Home
    const item = dashboardStore.feedItems.find(
      (item) => item.id === itemId || item.originalId === itemId,
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
          item.reactions[reactionType].count - 1,
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
      `🗳️ Reagindo em item de votação: ${reactionType} para item ${itemId}`,
    );
    const result = await dashboardStore.reactToVotingItem(
      itemId,
      reactionType,
      userIdentifier,
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

// Manipular adição de comentários
const handleCommentAdded = async ({ itemId, comment }) => {
  console.log(`💬 Comentário adicionado ao item ${itemId}:`, comment);

  try {
    // Enviar comentário para o backend (comment já vem com userId do CommunityFeed)
    const response = await axios.post(
      `http://localhost:3000/api/sugestoes/${itemId}/comentarios`,
      {
        conteudo: comment.conteudo,
        userId: comment.userId,
      },
    );

    if (response.data.success) {
      console.log("✅ Comentário salvo no backend com sucesso!");

      // Atualizar o item localmente com o comentário completo retornado do backend
      const feedItem = dashboardStore.feedItems.find(
        (item) => item.id === itemId || item.originalId === itemId,
      );

      if (feedItem) {
        // Inicializar array de comentários se não existir
        if (!feedItem.comentarios) {
          feedItem.comentarios = [];
        }

        // Adicionar o comentário retornado do backend
        if (response.data.comentario) {
          feedItem.comentarios.push(response.data.comentario);
          console.log("📝 Comentário adicionado à lista local");
        }
      }
    } else {
      console.error(
        "❌ Erro ao salvar comentário no backend:",
        response.data.message,
      );
    }
  } catch (error) {
    console.error(
      "❌ Erro ao enviar comentário para o backend:",
      error.message,
    );

    // Em caso de erro, tentar usar o store para atualizar o feed
    try {
      const result = await dashboardStore.addCommentToItem(itemId, comment);
      if (!result.success) {
        console.error(
          "❌ Erro ao adicionar comentário via store:",
          result.message,
        );
      }
    } catch (storeError) {
      console.error(
        "❌ Erro ao usar store para adicionar comentário:",
        storeError,
      );
    }
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
  background: #f8f9fa;
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    system-ui,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main-grid {
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

/* ============================================
   MOBILE FIRST - APP-LIKE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .home-container {
    background: #ffffff;
    padding-bottom: env(safe-area-inset-bottom, 60px);
  }

  .main-grid {
    grid-template-columns: 1fr;
    padding: 0;
    gap: 0;
    margin: 0;
  }

  .left-column {
    order: 1;
    width: 100%;
    padding: 0;
  }

  .right-column {
    order: 2;
    width: 100%;
    padding: 0 0.75rem 1rem;
    background: #f8f9fa;
    border-radius: 20px 20px 0 0;
    margin-top: 1rem;
  }
}

/* Tablet responsivo */
@media (min-width: 769px) and (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
    max-width: 800px;
    padding: 1.5rem;
  }

  .left-column,
  .right-column {
    width: 100%;
  }
}

/* Desktop - mantém layout em colunas */
@media (min-width: 1025px) {
  .main-grid {
    max-width: 1400px;
    padding: 2rem;
    gap: 2rem;
  }
}

/* Melhorias para iOS/Safari */
@supports (-webkit-touch-callout: none) {
  .home-container {
    min-height: -webkit-fill-available;
  }
}

/* Scroll suave em todo app */
* {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* Remover tap highlight no mobile */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* Garantir que inputs não causem zoom no iOS */
@media (max-width: 768px) {
  input,
  textarea,
  select {
    font-size: 16px !important;
  }
}
</style>
