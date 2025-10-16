<template>
  <div class="dashboard-layout">
    <!-- Area #2 - Top -->
    <div class="area-top">
      <div class="dashboard-header">
        <div class="header-content">
          <div class="header-title">
            <div class="title-icon">⚡</div>
            <div class="title-section">
              <h1>Gerenciamento de Postagens</h1>
              <p>
                Administre, edite e monitore todas as postagens da comunidade
              </p>
            </div>
          </div>
          <div class="header-actions">
            <button @click="loadPosts" class="btn-refresh">🔄 Atualizar</button>
            <select v-model="statusFilter" class="status-filter">
              <option value="">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="analisando">Analisando</option>
              <option value="implementado">Implementado</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content-wrapper">
      <!-- Area #1 - Left -->
      <div class="area-left">
        <!-- Navigation Cards -->
        <div class="navigation-section">
          <div class="section-header">
            <h2>📂 Tipos de Postagem</h2>
            <p>Filtre por categoria</p>
          </div>
          <div class="nav-cards-grid">
            <div
              v-for="type in postTypes"
              :key="type.key"
              class="nav-card"
              :class="{ active: typeFilter === type.key }"
              @click="setTypeFilter(type.key)"
            >
              <div class="nav-card-icon">{{ type.icon }}</div>
              <div class="nav-card-content">
                <h3>{{ type.title }}</h3>
                <p>{{ type.description }}</p>
                <span class="nav-card-count"
                  >{{ getPostCountByType(type.key) }} postagens</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Voting System -->
        <div class="voting-section">
          <div class="section-header">
            <h2>🗳️ Sistema de Votação</h2>
            <p>Vote nas melhorias preferidas</p>
          </div>

          <div class="voting-cards-grid">
            <div
              v-for="item in votingItems"
              :key="item.id"
              class="voting-card"
              :class="`status-${item.status}`"
            >
              <div class="voting-card-header">
                <h4>{{ item.title }}</h4>
                <span class="voting-status" :class="item.status">{{
                  getVotingStatusText(item.status)
                }}</span>
              </div>

              <p class="voting-description">{{ item.description }}</p>

              <div class="voting-actions">
                <button
                  class="vote-btn"
                  :class="{ voted: item.userVoted }"
                  @click="voteOnItem(item.id)"
                  :disabled="item.userVoted"
                >
                  {{ item.userVoted ? "✓ Votado" : "👍 Votar" }}
                </button>
                <span class="vote-count">{{ item.votes }} votos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Area #3 - Right -->
      <div class="area-right">
        <!-- Posts Management -->
        <div class="posts-management">
          <div class="management-header">
            <h2>📝 Gerenciamento de Postagens</h2>
            <p>Gerencie todas as sugestões da comunidade</p>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Carregando postagens...</p>
          </div>

          <!-- Posts List -->
          <div v-else class="posts-list">
            <div
              v-for="post in filteredPosts"
              :key="post._id"
              class="post-card"
              :class="[`status-${post.status}`]"
            >
              <!-- Post Header -->
              <div class="post-header">
                <div class="post-meta">
                  <span class="post-type"
                    >{{ getTypeIcon(post.tipo) }}
                    {{ post.tipo.toUpperCase() }}</span
                  >
                  <span class="post-date">{{
                    formatDate(post.createdAt)
                  }}</span>
                  <span class="post-status" :class="post.status">{{
                    getStatusText(post.status)
                  }}</span>
                </div>
                <div class="post-actions">
                  <button @click="editPost(post)" class="btn-edit">
                    ✏️ Editar
                  </button>
                  <button @click="deletePost(post._id)" class="btn-delete">
                    🗑️ Excluir
                  </button>
                </div>
              </div>

              <!-- Post Content -->
              <div class="post-content">
                <h3 class="post-title">{{ getPostTitle(post.sugestao) }}</h3>
                <p class="post-description">
                  {{ getPostDescription(post.sugestao) }}
                </p>
              </div>

              <!-- Reactions System -->
              <div class="reactions-section">
                <h4>Reações da Comunidade:</h4>
                <div class="reactions-grid">
                  <div
                    v-for="(reaction, type) in getReactions(post)"
                    :key="type"
                    class="reaction-item"
                    @click="toggleReaction(post._id, type)"
                    :class="{ active: hasUserReacted(post, type) }"
                  >
                    <span class="reaction-emoji">{{
                      getReactionEmoji(type)
                    }}</span>
                    <span class="reaction-count">{{ reaction.count }}</span>
                  </div>
                </div>
              </div>

              <!-- Admin Response -->
              <div v-if="post.comentarioAdmin" class="admin-response">
                <h4>📋 Resposta do Admin:</h4>
                <p>{{ post.comentarioAdmin }}</p>
              </div>

              <!-- Admin Actions -->
              <div class="admin-actions">
                <textarea
                  v-model="post.newResponse"
                  placeholder="Responder como administrador..."
                  class="admin-textarea"
                ></textarea>
                <div class="admin-controls">
                  <select v-model="post.newStatus" class="status-select">
                    <option value="pendente">Pendente</option>
                    <option value="analisando">Analisando</option>
                    <option value="implementado">Implementado</option>
                    <option value="rejeitado">Rejeitado</option>
                  </select>
                  <button @click="updatePost(post)" class="btn-update">
                    💾 Atualizar
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredPosts.length === 0" class="empty-state">
              <div class="empty-icon">📭</div>
              <h3>Nenhuma postagem encontrada</h3>
              <p>Não há postagens com os filtros selecionados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Area #4 - Bottom -->
    <div class="area-bottom">
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <span class="stat-value">{{ posts.length }}</span>
            <span class="stat-label">Total de Postagens</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <span class="stat-value">{{
              getPostsByStatus("pendente").length
            }}</span>
            <span class="stat-label">Pendentes</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔍</div>
          <div class="stat-info">
            <span class="stat-value">{{
              getPostsByStatus("analisando").length
            }}</span>
            <span class="stat-label">Em Análise</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <span class="stat-value">{{
              getPostsByStatus("implementado").length
            }}</span>
            <span class="stat-label">Implementadas</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">❌</div>
          <div class="stat-info">
            <span class="stat-value">{{
              getPostsByStatus("rejeitado").length
            }}</span>
            <span class="stat-label">Rejeitadas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <transition name="fade">
      <div v-if="successMessage" class="success-notification">
        {{ successMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

export default {
  name: "PostsManagement",
  setup() {
    const posts = ref([]);
    const loading = ref(false);
    const statusFilter = ref("");
    const successMessage = ref("");
    const userIdentifier = ref(`user_${Date.now()}`);
    const typeFilter = ref("");

    // Tipos de postagem
    const postTypes = ref([
      {
        key: "Postagem",
        title: "Postagem",
        icon: "📰",
        description: "Publicação Geral ",
      },
      {
        key: "Sugestões ",
        title: "Sugestões ",
        icon: "💡",
        description: "Supetões e melhorias",
      },
      {
        key: "Votação",
        title: "Votação",
        icon: "🚀",
        description: "Avisos impotantes",
      },
      {
        key: "implementação",
        title: "Implementação",
        icon: "✔ ",
        description: "Processos de auditoria",
      },
      {
        key: "relatorios",
        title: "Relatórios",
        icon: "📋",
        description: "Geração de relatórios",
      },
    ]);

    // Items de votação
    const votingItems = ref([
      {
        id: 1,
        title: "Integração com Power BI",
        description: "Exportação de dados direto para dashboards do Power BI",
        status: "in-progress",
        votes: 127,
        userVoted: false,
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
        userVoted: true,
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

    const filteredPosts = computed(() => {
      let filtered = posts.value;

      if (statusFilter.value) {
        filtered = filtered.filter(
          (post) => post.status === statusFilter.value
        );
      }

      if (typeFilter.value) {
        filtered = filtered.filter((post) => post.tipo === typeFilter.value);
      }

      return filtered;
    });

    // Carregar postagens
    const loadPosts = async () => {
      loading.value = true;
      try {
        const response = await axios.get("http://localhost:3000/api/sugestoes");
        posts.value = response.data.sugestoes.map((post) => ({
          ...post,
          newResponse: post.comentarioAdmin || "",
          newStatus: post.status,
        }));
        console.log(`✅ ${posts.value.length} postagens carregadas`);
      } catch (error) {
        console.error("Erro ao carregar postagens:", error);
        showMessage("Erro ao carregar postagens", "error");
      } finally {
        loading.value = false;
      }
    };

    // Utilitários
    const getTypeIcon = (type) => {
      const icons = {
        geral: "💡",
        dashboard: "📊",
        ranking: "🏆",
        auditoria: "🔍",
        relatorios: "📋",
      };
      return icons[type] || "📝";
    };

    const getStatusText = (status) => {
      const statusTexts = {
        pendente: "Pendente",
        analisando: "Em Análise",
        implementado: "Implementado",
        rejeitado: "Rejeitado",
      };
      return statusTexts[status] || status;
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const getPostTitle = (sugestao) => {
      const lines = sugestao.split("\n\n");
      return lines[0] || sugestao.substring(0, 50) + "...";
    };

    const getPostDescription = (sugestao) => {
      const lines = sugestao.split("\n\n");
      if (lines.length > 1) {
        return lines.slice(1).join("\n\n");
      }
      return sugestao.length > 100
        ? sugestao.substring(0, 100) + "..."
        : sugestao;
    };

    // Sistema de reações
    const getReactions = (post) => {
      const defaultReactions = {
        like: { count: 0, users: [] },
        dislike: { count: 0, users: [] },
        fire: { count: 0, users: [] },
        heart: { count: 0, users: [] },
      };
      return post.reactions || defaultReactions;
    };

    const getReactionEmoji = (type) => {
      const emojis = {
        like: "👍",
        dislike: "👎",
        fire: "🔥",
        heart: "💚",
      };
      return emojis[type];
    };

    const hasUserReacted = (post, reactionType) => {
      const reactions = getReactions(post);
      return (
        reactions[reactionType]?.users?.includes(userIdentifier.value) || false
      );
    };

    const toggleReaction = async (postId, reactionType) => {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/sugestoes/${postId}/react`,
          {
            reaction: reactionType,
            userIdentifier: userIdentifier.value,
          }
        );

        if (response.data.reactions) {
          const post = posts.value.find((p) => p._id === postId);
          if (post) {
            post.reactions = response.data.reactions;
          }
          showMessage(response.data.message, "success");
        }
      } catch (error) {
        console.warn(
          "API não disponível, usando simulação local:",
          error.message
        );

        const post = posts.value.find((p) => p._id === postId);
        if (post) {
          if (!post.reactions) {
            post.reactions = {
              like: { count: 0, users: [] },
              dislike: { count: 0, users: [] },
              fire: { count: 0, users: [] },
              heart: { count: 0, users: [] },
            };
          }

          const hasReacted = post.reactions[reactionType].users.includes(
            userIdentifier.value
          );

          if (hasReacted) {
            post.reactions[reactionType].count = Math.max(
              0,
              post.reactions[reactionType].count - 1
            );
            post.reactions[reactionType].users = post.reactions[
              reactionType
            ].users.filter((user) => user !== userIdentifier.value);
            showMessage(
              `Reação ${getReactionEmoji(reactionType)} removida!`,
              "success"
            );
          } else {
            post.reactions[reactionType].count += 1;
            post.reactions[reactionType].users.push(userIdentifier.value);
            showMessage(
              `Reação ${getReactionEmoji(reactionType)} adicionada!`,
              "success"
            );
          }
        }
      }
    };

    // Gerenciamento de posts
    const updatePost = async (post) => {
      try {
        const updateData = {
          status: post.newStatus,
        };

        if (post.newResponse && post.newResponse.trim()) {
          updateData.comentarioAdmin = post.newResponse.trim();
        }

        const response = await axios.put(
          `http://localhost:3000/api/sugestoes/${post._id}/status`,
          updateData
        );

        if (response.data.message) {
          post.status = post.newStatus;
          if (updateData.comentarioAdmin) {
            post.comentarioAdmin = updateData.comentarioAdmin;
          }
          showMessage("Post atualizado com sucesso!", "success");
        }
      } catch (error) {
        console.error("Erro ao atualizar post:", error);
        showMessage("Erro ao atualizar post", "error");
      }
    };

    const deletePost = async (postId) => {
      if (!confirm("Tem certeza que deseja excluir esta postagem?")) return;

      try {
        const response = await axios.delete(
          `http://localhost:3000/api/sugestoes/${postId}`
        );

        if (response.data.message) {
          posts.value = posts.value.filter((p) => p._id !== postId);
          showMessage("Post excluído com sucesso!", "success");
        }
      } catch (error) {
        console.error("Erro ao excluir post:", error);
        showMessage("Erro ao excluir post", "error");
      }
    };

    const editPost = (post) => {
      const textarea = document.querySelector(
        `textarea[data-post-id="${post._id}"]`
      );
      if (textarea) textarea.focus();
    };

    const showMessage = (text, type = "success") => {
      successMessage.value = text;
      setTimeout(() => {
        successMessage.value = "";
      }, 3000);
    };

    // Funções para navegação por tipos
    const setTypeFilter = (type) => {
      typeFilter.value = typeFilter.value === type ? "" : type;
    };

    const getPostCountByType = (type) => {
      return posts.value.filter((post) => post.tipo === type).length;
    };

    // Funções para votação
    const getVotingStatusText = (status) => {
      const statusTexts = {
        "new-idea": "Nova Ideia",
        "under-review": "Em Análise",
        "in-progress": "Em Desenvolvimento",
        implemented: "Implementado",
      };
      return statusTexts[status] || status;
    };

    const voteOnItem = (itemId) => {
      const item = votingItems.value.find((item) => item.id === itemId);
      if (item && !item.userVoted) {
        item.votes++;
        item.userVoted = true;
        showMessage(`Voto registrado em "${item.title}"!`, "success");
      }
    };

    // Função para estatísticas
    const getPostsByStatus = (status) => {
      return posts.value.filter((post) => post.status === status);
    };

    // Carregar dados quando componente for montado
    onMounted(() => {
      loadPosts();
    });

    return {
      posts,
      loading,
      statusFilter,
      successMessage,
      filteredPosts,
      loadPosts,
      getTypeIcon,
      getStatusText,
      formatDate,
      getPostTitle,
      getPostDescription,
      getReactions,
      getReactionEmoji,
      hasUserReacted,
      toggleReaction,
      updatePost,
      deletePost,
      editPost,
      typeFilter,
      postTypes,
      votingItems,
      setTypeFilter,
      getPostCountByType,
      getVotingStatusText,
      voteOnItem,
      getPostsByStatus,
    };
  },
};
</script>

<style scoped>
/* Layout Principal */
.dashboard-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  gap: 0;
}

.area-top {
  grid-area: 1 / 1 / 2 / 2;
}

.main-content-wrapper {
  grid-area: 2 / 1 / 3 / 2;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 0;
  min-height: calc(100vh - 140px);
}

.area-left {
  background: white;
  border-right: 1px solid #e9ecef;
  overflow-y: auto;
  height: 100%;
}

.area-right {
  background: #f8f9fa;
  overflow-y: auto;
  height: 100%;
}

.area-bottom {
  grid-area: 3 / 1 / 4 / 2;
  background: white;
  border-top: 1px solid #e9ecef;
  padding: 0;
}

/* Header Styles */
.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  font-size: 2.2rem;
}

.title-section h1 {
  margin: 0 0 4px 0;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.title-section p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-refresh {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-refresh:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.status-filter {
  padding: 10px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  font-weight: 500;
}

.status-filter option {
  background: #4361ee;
  color: white;
}

/* Left Area Styles */
.area-left {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.navigation-section,
.voting-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

.section-header {
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0 0 6px 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.section-header p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Navigation Cards */
.nav-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.8)
  );
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.nav-card.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: #667eea;
  transform: translateY(-1px);
}

.nav-card-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.nav-card-content {
  flex: 1;
}

.nav-card-content h3 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
}

.nav-card-content p {
  margin: 0 0 6px 0;
  opacity: 0.8;
  font-size: 0.85rem;
  line-height: 1.3;
}

.nav-card-count {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: inline-block;
}

.nav-card.active .nav-card-count {
  background: rgba(255, 255, 255, 0.3);
}

/* Voting Cards */
.voting-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.voting-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.voting-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.voting-card.status-new-idea::before {
  background: linear-gradient(90deg, #3b82f6, #1e40af);
}

.voting-card.status-under-review::before {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.voting-card.status-in-progress::before {
  background: linear-gradient(90deg, #06b6d4, #0891b2);
}

.voting-card.status-implemented::before {
  background: linear-gradient(90deg, #10b981, #059669);
}

.voting-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.voting-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  gap: 8px;
}

.voting-card-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  flex: 1;
  line-height: 1.3;
}

.voting-status {
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}

.voting-status.new-idea {
  background: #e0f2fe;
  color: #0277bd;
}

.voting-status.under-review {
  background: #fff8e1;
  color: #f57c00;
}

.voting-status.in-progress {
  background: #e0f7fa;
  color: #00838f;
}

.voting-status.implemented {
  background: #e8f5e8;
  color: #2e7d32;
}

.voting-description {
  margin: 0 0 14px 0;
  color: #6c757d;
  line-height: 1.4;
  font-size: 0.85rem;
}

.voting-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vote-btn {
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.vote-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.vote-btn.voted {
  background: linear-gradient(135deg, #10b981, #059669);
  cursor: default;
}

.vote-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.vote-count {
  font-weight: 600;
  color: #495057;
  font-size: 0.8rem;
}

/* Right Area Styles */
.area-right {
  padding: 24px;
}

.posts-management {
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.management-header {
  padding: 24px 24px 0 24px;
  margin-bottom: 0;
}

.management-header h2 {
  margin: 0 0 6px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.management-header p {
  margin: 0 0 20px 0;
  color: #6c757d;
  font-size: 0.95rem;
}

.posts-list {
  padding: 0 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  overflow-y: auto;
}

/* Post Card Styles */
.post-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #e9ecef;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.post-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.post-card.status-pendente {
  border-left-color: #ffc107;
}

.post-card.status-analisando {
  border-left-color: #17a2b8;
}

.post-card.status-implementado {
  border-left-color: #28a745;
}

.post-card.status-rejeitado {
  border-left-color: #dc3545;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.post-type {
  font-weight: 600;
  color: #4361ee;
  background: rgba(67, 97, 238, 0.1);
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 0.8rem;
}

.post-date {
  color: #6c757d;
  font-size: 0.85rem;
}

.post-status {
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.post-status.pendente {
  background: #fff3cd;
  color: #856404;
}

.post-status.analisando {
  background: #d1ecf1;
  color: #0c5460;
}

.post-status.implementado {
  background: #d4edda;
  color: #155724;
}

.post-status.rejeitado {
  background: #f8d7da;
  color: #721c24;
}

.post-actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-edit:hover {
  background: #bbdefb;
}

.btn-delete {
  background: #ffebee;
  color: #d32f2f;
}

.btn-delete:hover {
  background: #ffcdd2;
}

.post-content {
  margin-bottom: 16px;
}

.post-title {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.3;
}

.post-description {
  margin: 0;
  color: #6c757d;
  line-height: 1.5;
  font-size: 0.95rem;
}

.reactions-section {
  margin: 16px 0;
  padding: 14px;
  background: #f8f9fa;
  border-radius: 10px;
}

.reactions-section h4 {
  margin: 0 0 10px 0;
  font-size: 0.95rem;
  color: #495057;
  font-weight: 600;
}

.reactions-grid {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.reaction-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.85rem;
}

.reaction-item:hover {
  border-color: #4361ee;
  transform: translateY(-1px);
}

.reaction-item.active {
  background: #4361ee;
  color: white;
  border-color: #4361ee;
}

.reaction-emoji {
  font-size: 1rem;
}

.reaction-count {
  font-size: 0.8rem;
  font-weight: 600;
}

.admin-response {
  margin: 16px 0;
  padding: 14px;
  background: linear-gradient(
    135deg,
    rgba(40, 167, 69, 0.1),
    rgba(32, 201, 151, 0.05)
  );
  border-left: 4px solid #28a745;
  border-radius: 8px;
}

.admin-response h4 {
  margin: 0 0 6px 0;
  color: #28a745;
  font-size: 0.95rem;
  font-weight: 600;
}

.admin-response p {
  margin: 0;
  color: #495057;
  font-style: italic;
  font-size: 0.9rem;
  line-height: 1.4;
}

.admin-actions {
  margin-top: 16px;
  padding: 14px;
  background: #f8f9fa;
  border-radius: 10px;
}

.admin-textarea {
  width: 100%;
  min-height: 70px;
  padding: 10px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.admin-textarea:focus {
  outline: none;
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.admin-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.status-select {
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  flex: 1;
}

.btn-update {
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  white-space: nowrap;
}

.btn-update:hover {
  background: #218838;
  transform: translateY(-1px);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f8f9fa;
  border-top: 4px solid #4361ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #495057;
  font-size: 1.3rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.95rem;
}

/* Bottom Area Styles */
.area-bottom {
  padding: 20px 32px;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  max-width: 100%;
  margin: 0 auto;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.stat-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-top: 4px;
  font-weight: 500;
}

/* Success Notification */
.success-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  padding: 14px 20px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(40, 167, 69, 0.4);
  z-index: 1000;
  font-size: 0.9rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .main-content-wrapper {
    grid-template-columns: 300px 1fr;
  }

  .stats-overview {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content-wrapper {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .area-left {
    border-right: none;
    border-bottom: 1px solid #e9ecef;
    height: auto;
    max-height: 50vh;
    overflow-y: auto;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-refresh,
  .status-filter {
    width: 100%;
  }

  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .post-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .post-meta {
    gap: 8px;
  }

  .admin-controls {
    flex-direction: column;
  }

  .status-select {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 16px 20px;
  }

  .area-left,
  .area-right {
    padding: 16px;
  }

  .stats-overview {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 14px;
  }

  .title-section h1 {
    font-size: 1.4rem;
  }

  .title-icon {
    font-size: 1.8rem;
  }
}
</style>
