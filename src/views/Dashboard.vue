<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-title">
          <div class="title-icon">⚡</div>
          <div class="title-section">
            <h1>Gerenciamento de Postagens</h1>
            <p>Administre, edite e monitore todas as postagens da comunidade</p>
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

    <!-- Gerenciamento de Postagens -->
    <div class="posts-management">
      <!-- Loading state -->
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
              <span class="post-date">{{ formatDate(post.createdAt) }}</span>
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
                <span class="reaction-emoji">{{ getReactionEmoji(type) }}</span>
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

        <!-- Empty state -->
        <div v-if="filteredPosts.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>Nenhuma postagem encontrada</h3>
          <p>Não há postagens com os filtros selecionados.</p>
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
    const userIdentifier = ref(`user_${Date.now()}`); // Identificador único do usuário

    const filteredPosts = computed(() => {
      if (!statusFilter.value) return posts.value;
      return posts.value.filter((post) => post.status === statusFilter.value);
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
        // Tenta usar a API primeiro
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

        // Simulação local da funcionalidade
        const post = posts.value.find((p) => p._id === postId);
        if (post) {
          // Inicializar reactions se não existir
          if (!post.reactions) {
            post.reactions = {
              like: { count: 0, users: [] },
              dislike: { count: 0, users: [] },
              fire: { count: 0, users: [] },
              heart: { count: 0, users: [] },
            };
          }

          // Verificar se usuário já reagiu
          const hasReacted = post.reactions[reactionType].users.includes(
            userIdentifier.value
          );

          if (hasReacted) {
            // Remover reação
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
            // Adicionar reação
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
      // Por enquanto, apenas focar no textarea de resposta
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
    };
  },
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.posts-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.loading-state {
  text-align: center;
  padding: 60px;
  color: #6c757d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f8f9fa;
  border-top: 4px solid #4361ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #e9ecef;
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
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
  gap: 16px;
}

.post-type {
  font-weight: 600;
  color: #4361ee;
  background: rgba(67, 97, 238, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.post-date {
  color: #6c757d;
  font-size: 0.9rem;
}

.post-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
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
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
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
  margin-bottom: 20px;
}

.post-title {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.post-description {
  margin: 0;
  color: #6c757d;
  line-height: 1.6;
}

.reactions-section {
  margin: 20px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.reactions-section h4 {
  margin: 0 0 12px 0;
  font-size: 1rem;
  color: #495057;
}

.reactions-grid {
  display: flex;
  gap: 12px;
}

.reaction-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
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
  font-size: 1.2rem;
}

.reaction-count {
  font-size: 0.9rem;
  font-weight: 600;
}

.admin-response {
  margin: 20px 0;
  padding: 16px;
  background: linear-gradient(
    135deg,
    rgba(40, 167, 69, 0.1),
    rgba(32, 201, 151, 0.05)
  );
  border-left: 4px solid #28a745;
  border-radius: 8px;
}

.admin-response h4 {
  margin: 0 0 8px 0;
  color: #28a745;
  font-size: 1rem;
}

.admin-response p {
  margin: 0;
  color: #495057;
  font-style: italic;
}

.admin-actions {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.admin-textarea {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 12px;
}

.admin-textarea:focus {
  outline: none;
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.admin-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.status-select {
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
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
}

.btn-update:hover {
  background: #218838;
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.success-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(40, 167, 69, 0.4);
  z-index: 1000;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-refresh {
  padding: 8px 16px;
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
}

.status-filter {
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
}

.status-filter option {
  background: #4361ee;
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .posts-management {
    padding: 16px;
  }

  .post-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .post-meta {
    flex-wrap: wrap;
    gap: 8px;
  }

  .reactions-grid {
    flex-wrap: wrap;
  }

  .admin-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
    gap: 8px;
  }
}

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  font-size: 2.5rem;
}

.title-section h1 {
  margin: 0 0 4px 0;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.title-section p {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
}

.header-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.8;
}

.dashboard-main {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 24px;
  max-width: 1400px;
  margin: 24px auto;
  padding: 0 24px;
}

.dashboard-sidebar,
.dashboard-right-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.sidebar-section h3 {
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-create-post,
.btn-action {
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  text-align: left;
}

.btn-create-post {
  background: linear-gradient(135deg, #4361ee, #764ba2);
  color: white;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.btn-create-post:hover,
.btn-create-post.active {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(67, 97, 238, 0.4);
}

.btn-action {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #e9ecef;
}

.btn-action:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(
    135deg,
    rgba(67, 97, 238, 0.1),
    rgba(102, 126, 234, 0.05)
  );
  border-radius: 12px;
  border: 1px solid rgba(67, 97, 238, 0.1);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #4361ee;
}

.stat-label {
  font-size: 0.8rem;
  color: #6c757d;
}

.achievements-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
}

.achievement-icon {
  font-size: 1.2rem;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post-form-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.btn-close-form {
  margin-top: 16px;
  padding: 10px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #6c757d;
  transition: all 0.3s ease;
}

.btn-close-form:hover {
  background: #e9ecef;
}

.feed-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.feed-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.btn-refresh {
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-refresh:hover {
  background: #e9ecef;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f8f9fa;
  border-top: 4px solid #4361ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.feed-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feed-item {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  background: #fafbfc;
}

.feed-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #4361ee;
}

.feed-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
}

.item-type {
  font-weight: 600;
  color: #4361ee;
}

.item-time {
  color: #6c757d;
}

.item-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.item-badge.new {
  background: #d4edda;
  color: #155724;
}

.item-badge.update {
  background: #fff3cd;
  color: #856404;
}

.item-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: #4361ee;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
}

.feed-item-title {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
}

.feed-item-description {
  margin: 0 0 16px 0;
  color: #495057;
  line-height: 1.5;
}

.admin-response {
  background: linear-gradient(
    135deg,
    rgba(40, 167, 69, 0.1),
    rgba(32, 201, 151, 0.05)
  );
  border-left: 4px solid #28a745;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.response-badge {
  font-weight: 600;
  color: #28a745;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.response-text {
  margin: 0;
  color: #495057;
  font-style: italic;
}

.feed-item-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

.vote-btn.voted {
  background: #4361ee;
  color: white;
  border-color: #4361ee;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #495057;
}

.btn-create-first {
  margin-top: 16px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4361ee, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-create-first:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(67, 97, 238, 0.4);
}

.voting-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.voting-item {
  padding: 16px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  background: #fafbfc;
}

.voting-item h4 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #2c3e50;
}

.voting-item p {
  margin: 0 0 12px 0;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
}

.voting-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vote-button {
  padding: 6px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.vote-button:hover:not(:disabled) {
  background: #f8f9fa;
}

.vote-button.voted {
  background: #4361ee;
  color: white;
  border-color: #4361ee;
}

.vote-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.vote-status {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.vote-status.new-idea {
  background: #e7f3ff;
  color: #0056b3;
}

.vote-status.under-review {
  background: #fff3cd;
  color: #856404;
}

.vote-status.in-progress {
  background: #d1ecf1;
  color: #0c5460;
}

.vote-status.implemented {
  background: #d4edda;
  color: #155724;
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-link {
  padding: 10px 12px;
  color: #4361ee;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  font-weight: 500;
}

.quick-link:hover {
  background: rgba(67, 97, 238, 0.1);
  transform: translateX(4px);
}

.success-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(40, 167, 69, 0.4);
  z-index: 1000;
}

/* Animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsividade */
@media (max-width: 1200px) {
  .dashboard-main {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 16px;
  }

  .dashboard-sidebar,
  .dashboard-right-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header-stats {
    gap: 16px;
  }

  .feed-controls {
    flex-direction: column;
    gap: 8px;
  }

  .feed-item-actions {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
