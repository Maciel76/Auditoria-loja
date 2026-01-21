<template>
  <div class="community-feed">
    <div class="section-header">
      <h2>
        <i class="fas fa-users"></i>
        Comunidade
      </h2>
      <!-- <span class="see-all">Ver tudo</span> -->
    </div>

    <div class="feed-content">
      <div
        v-for="item in feedItems"
        :key="item.id"
        class="feed-card"
        :class="{
          'feature-update': item.type === 'feature',
          'user-suggestion': item.type === 'suggestion',
          'system-update': item.type === 'update',
        }"
      >
        <div class="card-header">
          <div class="user-info">
            <div class="user-avatar">{{ item.user?.avatar || "?" }}</div>
            <span class="user-name">{{ item.user?.name || "Anônimo" }}</span>
          </div>
          <!-- <span class="card-time">{{ item.time }}</span> -->
        </div>

        <div class="card-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>

          <!-- Ações e Reações -->
          <div class="card-actions">
            <!-- Reações -->
            <div class="card-reactions">
              <button
                v-for="reactionType in ['like', 'dislike', 'fire', 'heart']"
                :key="reactionType"
                class="reaction-btn"
                :class="{
                  'user-reacted': hasUserReacted(item, reactionType),
                  [`reaction-${reactionType}`]: true,
                }"
                @click="
                  handleReaction(item.originalId || item.id, reactionType)
                "
              >
                <i :class="getReactionIcon(reactionType)"></i>
                <span class="reaction-count">{{
                  getReactionCount(item, reactionType)
                }}</span>
              </button>
            </div>

            <!-- Botão Ver Comentários -->
            <button
              class="action-btn comment-btn"
              @click="toggleComments(item)"
            >
              <i class="fas fa-comment"></i>
              <span>{{ getCommentCount(item) }}</span>
            </button>
          </div>

          <!-- Seção de comentários -->
          <transition name="slide-fade">
            <div v-if="item.showComments" class="comments-section">
              <div class="comments-header">
                <h4>
                  <i class="fas fa-comments"></i>
                  Comentários ({{ getCommentCount(item) }})
                </h4>
                <button
                  class="btn-add-comment-header"
                  @click="openCommentModal(item)"
                >
                  <i class="fas fa-plus"></i>
                  Novo Comentário
                </button>
              </div>

              <!-- Lista de comentários -->
              <div class="comments-list">
                <transition-group name="comment-slide" tag="div">
                  <div
                    v-for="comment in getCommentsForItem(item)"
                    :key="comment.id"
                    class="comment-item"
                  >
                    <div class="comment-header">
                      <div class="comment-user-info">
                        <div class="comment-user-avatar">
                          {{ comment.user?.avatar || "?" }}
                        </div>
                        <div class="comment-user-details">
                          <span class="comment-user-name">{{
                            comment.user?.name || "Anônimo"
                          }}</span>
                          <span class="comment-time">{{
                            formatDate(comment.createdAt)
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="comment-content">{{ comment.content }}</div>
                  </div>
                </transition-group>
              </div>
            </div>
          </transition>

          <div v-if="item.adminResponse" class="admin-response">
            <span class="response-badge">{{ item.adminResponse.badge }}</span>
            <p>{{ item.adminResponse.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Adicionar Comentário -->
    <div
      v-if="showCommentModal"
      class="modal-overlay"
      @click="closeCommentModal"
    >
      <div class="comment-modal" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="fas fa-comment-alt"></i>
            Adicionar Comentário
          </h3>
          <button class="close-btn" @click="closeCommentModal">×</button>
        </div>

        <div class="modal-body" v-if="selectedItemForComment">
          <div class="comment-input-section">
            <label for="user-name">Seu Nome *</label>
            <input
              id="user-name"
              v-model="commentInputs[selectedItemForComment.id].userName"
              type="text"
              placeholder="Digite seu nome"
              class="comment-name-input"
              required
            />

            <label for="comment-content">Comentário *</label>
            <textarea
              id="comment-content"
              v-model="commentInputs[selectedItemForComment.id].content"
              placeholder="Escreva seu comentário..."
              class="comment-textarea"
              rows="4"
            ></textarea>
          </div>
        </div>

        <div class="modal-footer" v-if="selectedItemForComment">
          <button class="btn-cancel" @click="closeCommentModal">
            Cancelar
          </button>
          <button
            class="btn-submit-comment"
            @click="addComment(selectedItemForComment)"
            :disabled="!canSubmitComment(selectedItemForComment)"
          >
            <i class="fas fa-paper-plane"></i>
            Enviar Comentário
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  feedItems: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits([
  "vote-submitted",
  "reaction-submitted",
  "comment-added",
]);

const userIdentifier = ref(`user_${Date.now()}`);

const getBadgeText = (badge) => {
  const badges = {
    new: "NOVO",
    update: "ATUALIZAÇÃO",
  };
  return badges[badge] || badge;
};

const getReactions = (item) => {
  const defaultReactions = {
    like: { count: 0, users: [] },
    dislike: { count: 0, users: [] },
    fire: { count: 0, users: [] },
    heart: { count: 0, users: [] },
  };
  return item.reactions || defaultReactions;
};

const getReactionIcon = (type) => {
  const icons = {
    like: "fas fa-thumbs-up",
    dislike: "fas fa-thumbs-down",
    fire: "fas fa-fire",
    heart: "fas fa-heart",
  };
  return icons[type];
};

const getReactionCount = (item, reactionType) => {
  const reactions = getReactions(item);
  return reactions[reactionType]?.count || 0;
};

const getTotalReactions = (item) => {
  const reactions = getReactions(item);
  return Object.values(reactions).reduce(
    (total, reaction) => total + (reaction.count || 0),
    0,
  );
};

const hasUserReacted = (item, reactionType) => {
  const reactions = getReactions(item);
  return (
    reactions[reactionType]?.users?.includes(userIdentifier.value) || false
  );
};

const handleReaction = (itemId, reactionType) => {
  emit("reaction-submitted", {
    itemId,
    reactionType,
    userIdentifier: userIdentifier.value,
  });
};

const handleVote = (itemId) => {
  emit("vote-submitted", itemId);
};

// Estado para controle de comentários
const commentInputs = ref({});
const showCommentModal = ref(false);
const selectedItemForComment = ref(null);

// Função para inicializar estado de comentários para um item
const initializeCommentInput = (item) => {
  if (!commentInputs.value[item.id]) {
    commentInputs.value[item.id] = {
      userName: "",
      content: "",
    };
  }
  // Adiciona a propriedade showComments aos itens se não existir
  if (!item.hasOwnProperty("showComments")) {
    item.showComments = false;
  }
};

// Inicializar estado de comentários para cada item existente
props.feedItems.forEach((item) => {
  initializeCommentInput(item);
});

// Watch for changes in feedItems to initialize new items
watch(
  () => props.feedItems,
  (newFeedItems) => {
    newFeedItems.forEach((item) => {
      initializeCommentInput(item);
    });
  },
  { deep: true },
);

// Função para alternar visibilidade dos comentários
const toggleComments = (item) => {
  item.showComments = !item.showComments;

  // Garante que o estado do input existe
  if (!commentInputs.value[item.id]) {
    commentInputs.value[item.id] = {
      userName: "",
      content: "",
    };
  }
};

// Funções do modal de comentários
const openCommentModal = (item) => {
  selectedItemForComment.value = item;
  showCommentModal.value = true;

  // Garante que o estado do input existe
  if (!commentInputs.value[item.id]) {
    commentInputs.value[item.id] = {
      userName: "",
      content: "",
    };
  }
};

const closeCommentModal = () => {
  showCommentModal.value = false;
  selectedItemForComment.value = null;
};

// Função para obter contagem de comentários
const getCommentCount = (item) => {
  // Conta comentários do banco de dados e locais
  const dbCommentCount = item.comentarios ? item.comentarios.length : 0;
  const localCommentCount = item.comments ? item.comments.length : 0;
  return dbCommentCount + localCommentCount;
};

// Função para obter comentários do item
const getCommentsForItem = (item) => {
  // Verifica se o item tem comentários do banco de dados (campo 'comentarios')
  if (item.comentarios && Array.isArray(item.comentarios)) {
    // Mapeia os comentários do banco de dados para o formato esperado pelo frontend
    const dbComments = item.comentarios.map((dbComment) => ({
      id: dbComment._id || Date.now(),
      content: dbComment.conteudo || dbComment.content,
      createdAt: dbComment.data || dbComment.createdAt,
      user: {
        name: dbComment.autor || dbComment.user?.name || "Anônimo",
        avatar: dbComment.avatar || dbComment.user?.avatar || "?",
      },
    }));

    // Combina com os comentários locais (se houver)
    const localComments = item.comments || [];
    return [...dbComments, ...localComments];
  }

  return item.comments || [];
};

// Função para verificar se pode submeter comentário
const canSubmitComment = (item) => {
  return (
    commentInputs.value[item.id]?.userName.trim() &&
    commentInputs.value[item.id]?.content.trim()
  );
};

// Função para adicionar comentário
const addComment = async (item) => {
  if (!canSubmitComment(item)) return;

  const commentData = {
    id: Date.now(), // ID temporário
    content: commentInputs.value[item.id].content.trim(),
    createdAt: new Date().toISOString(),
    user: {
      name: commentInputs.value[item.id].userName.trim(),
      avatar: commentInputs.value[item.id].userName.charAt(0).toUpperCase(),
    },
  };

  // Limpa os campos de input
  commentInputs.value[item.id].content = "";
  commentInputs.value[item.id].userName = "";

  // Fecha o modal
  closeCommentModal();

  // Emite evento para salvar o comentário no backend
  // O backend retornará o comentário e ele será adicionado à lista
  emit("comment-added", {
    itemId: item.originalId || item.id, // Usa originalId se disponível para identificação no backend
    comment: {
      conteudo: commentData.content,
      autor: commentData.user.name,
      avatar: commentData.user.avatar,
    },
  });
};

// Função para formatar data
const formatDate = (dateString) => {
  if (!dateString) return "Agora";

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Agora";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;

  return date.toLocaleDateString("pt-BR");
};
</script>

<style scoped>
/* Animações de transição */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Animação dos comentários individuais */
.comment-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.comment-slide-leave-active {
  transition: all 0.3s ease;
}

.comment-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px) scale(0.95);
}

.comment-slide-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}

.comment-slide-move {
  transition: transform 0.4s ease;
}

.community-feed {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-header h2 i {
  color: #667eea;
  font-size: 1.4rem;
}

.see-all {
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
}

.feed-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feed-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.feed-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-badge.new {
  background: #dcfce7;
  color: #16a34a;
}

.card-badge.update {
  background: #dbeafe;
  color: #2563eb;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
}

.user-name {
  font-weight: 500;
  color: #374151;
}

.card-time {
  color: #9ca3af;
  font-size: 0.875rem;
}

.card-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.card-content p {
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 1rem;
}

/* Botões de Reação */
.reaction-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: white;
  border: 2px solid #e2e8f0;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.875rem;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  min-width: 50px;
}

.reaction-btn i {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.reaction-btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.2);
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}

.reaction-btn:active::before {
  width: 100px;
  height: 100px;
}

.reaction-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.reaction-btn:hover i {
  transform: scale(1.2);
}

/* Cores específicas para cada reação */
.reaction-btn.reaction-like:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.reaction-btn.reaction-dislike:hover {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.reaction-btn.reaction-fire:hover {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.reaction-btn.reaction-heart:hover {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.reaction-btn.user-reacted {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transform: scale(1.05);
}

.reaction-btn.user-reacted.reaction-like {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-color: #3b82f6;
}

.reaction-btn.user-reacted.reaction-dislike {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: #ef4444;
}

.reaction-btn.user-reacted.reaction-fire {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-color: #f59e0b;
}

.reaction-btn.user-reacted.reaction-heart {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #10b981;
}

/* Animação dos ícones de reação */
.reaction-btn.user-reacted i {
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(0.9);
  }
  75% {
    transform: scale(1.1);
  }
}

.reaction-count {
  font-weight: 600;
  font-size: 0.8rem;
}

/* Ações do Card */
.card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 2px solid #f1f5f9;
}

.card-reactions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
}

.comment-btn {
  margin-left: auto;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  padding: 0.5rem 1rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 24px;
  white-space: nowrap;
}

.action-btn:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.action-btn i {
  transition: transform 0.3s ease;
}

.action-btn:hover i {
  transform: scale(1.2) rotate(-5deg);
}

.admin-response {
  margin-top: 1rem;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.response-badge {
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.875rem;
}

/* Animações de transição */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Animação dos comentários individuais */
.comment-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.comment-slide-leave-active {
  transition: all 0.3s ease;
}

.comment-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px) scale(0.95);
}

.comment-slide-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}

.comment-slide-move {
  transition: transform 0.4s ease;
}

/* Seção de Comentários */
.comments-section {
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
}

.comments-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.comments-header h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comments-header i {
  color: #667eea;
  font-size: 1.1rem;
}

.btn-add-comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-add-comment-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-add-comment-header i {
  font-size: 0.9rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 0.5rem;
  scroll-behavior: smooth;
}

/* Estilização da scrollbar */
.comments-list::-webkit-scrollbar {
  width: 6px;
}

.comments-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.comments-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  transition: background 0.3s ease;
}

.comments-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #764ba2 0%, #667eea 100%);
}

.comment-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.comment-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.comment-item:hover {
  transform: translateX(3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.comment-item:hover::before {
  opacity: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.comment-user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.comment-user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
}

.comment-user-details {
  display: flex;
  flex-direction: column;
}

.comment-user-name {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.comment-time {
  color: #9ca3af;
  font-size: 0.75rem;
}

.comment-content {
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.4;
}

.add-comment-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.comment-input-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comment-name-input {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  transition: all 0.3s ease;
  background: white;
}

.comment-name-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.comment-textarea {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
}

.comment-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.btn-add-comment {
  align-self: flex-end;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 24px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-add-comment::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s;
}

.btn-add-comment:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-add-comment:hover:not(:disabled)::before {
  left: 100%;
}

.btn-add-comment:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.btn-add-comment:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}

/* Animação de atenção para campos vazios */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

.comment-name-input.error,
.comment-textarea.error {
  border-color: #ef4444;
  animation: shake 0.5s ease;
}

/* Animação de sucesso ao adicionar comentário */
@keyframes successPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.comment-item.new {
  animation: successPulse 0.6s ease;
}

/* Efeito de brilho no contador de reações */
.reaction-count {
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.reaction-btn.user-reacted .reaction-count {
  font-size: 0.9rem;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

/* Indicador de comentários novos */
@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 5px rgba(102, 126, 234, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
  }
}

.action-btn.has-new-comments {
  animation: glow 2s ease-in-out infinite;
}

/* Modal de Comentários */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.comment-modal {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px 20px 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-header i {
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem 1.5rem;
}

.comment-input-section label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.modal-body .comment-name-input,
.modal-body .comment-textarea {
  width: 100%;
  margin-bottom: 1.5rem;
}

.modal-body .comment-textarea {
  min-height: 120px;
  font-family: inherit;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 2px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0 0 20px 20px;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #6b7280;
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.btn-cancel:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.btn-submit-comment {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-submit-comment:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-submit-comment:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}

.btn-submit-comment i {
  font-size: 0.9rem;
}

/* ============================================
   MOBILE FIRST - APP-LIKE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .community-feed {
    padding: 0;
    background: transparent;
  }

  .section-header {
    padding: 1rem;
    margin-bottom: 0.5rem;
    background: white;
    border-radius: 0;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .section-header h2 {
    font-size: 1.25rem;
  }

  .feed-content {
    gap: 0.5rem;
  }

  .feed-card {
    border-radius: 0;
    padding: 1rem;
    margin: 0;
    border-left: none;
    border-right: none;
    border-top: 1px solid #f1f5f9;
    box-shadow: none;
  }

  .feed-card:first-child {
    border-top: none;
  }

  .card-header {
    margin-bottom: 0.875rem;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }

  .user-name {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .card-content h3 {
    font-size: 1.05rem;
    margin-bottom: 0.5rem;
  }

  .card-content p {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  /* Ações em layout horizontal mais compacto */
  .card-actions {
    flex-direction: row;
    gap: 0.75rem;
    padding-top: 1rem;
    margin-top: 1rem;
    border-top: 1px solid #f1f5f9;
  }

  .card-reactions {
    flex: 1;
    gap: 0.5rem;
    justify-content: flex-start;
    flex-wrap: nowrap;
  }

  .reaction-btn {
    flex: 1;
    padding: 0.75rem 0.875rem;
    font-size: 0.9rem;
    border-radius: 24px;
    min-width: 60px;
    max-width: 80px;
    border-width: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .reaction-btn i {
    font-size: 1.15rem;
  }

  .reaction-count {
    font-size: 0.85rem;
    font-weight: 700;
  }

  .comment-btn {
    flex: 0;
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
    border-radius: 24px;
    margin-left: auto;
    min-width: 90px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .comment-btn i {
    font-size: 1rem;
  }

  /* Comentários */
  .comments-section {
    margin-top: 1rem;
    padding: 0.875rem;
    border-radius: 12px;
  }

  .comments-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
    margin-bottom: 0.875rem;
  }

  .comments-header h4 {
    font-size: 1rem;
  }

  .btn-add-comment-header {
    width: 100%;
    padding: 0.75rem;
    font-size: 0.9rem;
    justify-content: center;
  }

  .comment-item {
    padding: 0.875rem;
    margin-bottom: 0.75rem;
  }

  .comment-user-avatar {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }

  .comment-user-name {
    font-size: 0.85rem;
  }

  .comment-text {
    font-size: 0.85rem;
    line-height: 1.5;
  }

  /* Modal de comentário mobile */
  .modal-overlay {
    align-items: flex-end;
    padding: 0;
  }

  .comment-modal {
    width: 100%;
    max-width: 100%;
    max-height: 85vh;
    margin: 0;
    border-radius: 20px 20px 0 0;
    animation: modalSlideUp 0.3s ease-out;
  }

  @keyframes modalSlideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .comment-modal-header {
    padding: 1rem;
    position: relative;
  }

  /* Indicador de arraste */
  .comment-modal-header::before {
    content: "";
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
  }

  .comment-modal-header h3 {
    font-size: 1.15rem;
    margin-top: 8px;
  }

  .btn-close-modal {
    width: 32px;
    height: 32px;
    font-size: 1.5rem;
  }

  .comment-modal-body {
    padding: 1rem;
  }

  .form-textarea-comment {
    min-height: 120px;
    font-size: 1rem; /* 16px para evitar zoom no iOS */
  }

  .comment-modal-footer {
    padding: 1rem;
    position: sticky;
    bottom: 0;
    background: white;
    border-top: 1px solid #e9ecef;
  }

  .btn-cancel-comment,
  .btn-submit-comment {
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
  }
}

/* Mobile pequeno */
@media (max-width: 480px) {
  .section-header h2 {
    font-size: 1.15rem;
  }

  .section-header i {
    font-size: 1rem;
  }

  .feed-card {
    padding: 0.875rem;
  }

  .card-content h3 {
    font-size: 1rem;
  }

  .card-content p {
    font-size: 0.85rem;
  }

  .reaction-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }

  .reaction-btn i {
    font-size: 0.95rem;
  }

  .reaction-count {
    font-size: 0.75rem;
  }

  .comment-btn {
    padding: 0.4rem 0.875rem;
    font-size: 0.8rem;
  }
}
</style>
