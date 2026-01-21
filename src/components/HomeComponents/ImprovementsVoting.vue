<template>
  <div class="improvements-voting">
    <div class="section-header">
      <h2>
        <i class="fas fa-lightbulb"></i>
        Melhorias em Votação
      </h2>
      <span class="see-all">Ver Tudo</span>
    </div>

    <div v-if="carregando" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Carregando votações...</p>
    </div>

    <div v-else class="voting-list">
      <div
        v-for="item in votacoesAtivas"
        :key="item.id"
        class="voting-item"
        @click="openVotingDetails(item)"
      >
        <div class="vote-content">
          <div class="voting-header">
            <span v-if="item.autor" class="author-name"
              >📝 {{ item.autor }}</span
            >
            <span class="status-badge" :class="item.status">
              {{ getStatusText(item.status) }}
            </span>
          </div>
          <h4>{{ item.title }}</h4>
          <p>{{ getDescriptionPreview(item.description) }}</p>
        </div>

        <!-- Sistema de Reações -->
        <div class="reactions-section">
          <div class="card-reactions">
            <button
              v-for="(reaction, type) in getReactions(item)"
              :key="type"
              class="reaction-btn"
              :class="{ 'user-reacted': hasUserReacted(item, type) }"
              @click.stop="handleReaction(item.originalId || item.id, type)"
            >
              <i :class="getReactionIcon(type)"></i>
              <span class="reaction-count">{{ reaction.count }}</span>
            </button>
          </div>
          <!-- <div class="total-votes">
            <span>💬 {{ getTotalReactions(item) }} reações totais</span>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes da Votação -->
    <div
      v-if="showDetailsModal"
      class="modal-overlay"
      @click="closeDetailsModal"
    >
      <div class="details-modal" @click.stop>
        <div class="modal-header">
          <h2>📋 Detalhes da Votação</h2>
          <button class="close-btn" @click="closeDetailsModal">×</button>
        </div>

        <div class="modal-content" v-if="selectedVoting">
          <div class="voting-info">
            <div class="voting-status">
              <span class="status-badge" :class="selectedVoting.status">
                {{ getStatusText(selectedVoting.status) }}
              </span>
            </div>

            <h3>{{ selectedVoting.title }}</h3>

            <div class="description-section">
              <h4>📝 Descrição Completa</h4>
              <p class="full-description">{{ selectedVoting.description }}</p>
            </div>

            <div v-if="selectedVoting.benefits" class="benefits-section">
              <h4>✨ Benefícios Esperados</h4>
              <p>{{ selectedVoting.benefits }}</p>
            </div>

            <div v-if="selectedVoting.autor" class="author-section">
              <h4>👤 Autor</h4>
              <p>{{ selectedVoting.autor }}</p>
            </div>

            <!-- Sistema de Reações no Modal -->
            <div class="reactions-section-modal">
              <h4>💬 Reações da Comunidade</h4>
              <div class="card-reactions-modal">
                <button
                  v-for="(reaction, type) in getReactions(selectedVoting)"
                  :key="type"
                  class="reaction-btn-modal"
                  :class="{
                    'user-reacted': hasUserReacted(selectedVoting, type),
                  }"
                  @click.stop="
                    handleReaction(
                      selectedVoting.originalId || selectedVoting.id,
                      type,
                    )
                  "
                >
                  <i :class="getReactionIcon(type)"></i>
                  <span class="reaction-count">{{ reaction.count }}</span>
                </button>
              </div>

              <div class="reaction-stats">
                <div class="total-reactions">
                  <strong
                    >Total de reações:
                    {{ getTotalReactions(selectedVoting) }}</strong
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-close" @click="closeDetailsModal">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, computed } from "vue";
import { useVotingStore } from "../../stores/voting.js";

const props = defineProps({
  votingItems: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const emit = defineEmits(["vote-submitted", "reaction-submitted"]);

const votingStore = useVotingStore();

// Modal de detalhes
const showDetailsModal = ref(false);
const selectedVoting = ref(null);

// Computed properties para usar dados da store
const votacoesAtivas = computed(() => votingStore.getVotacoesOrdenadas);
const carregando = computed(() => votingStore.loading);

// Usar a store para carregar votações
const carregarVotacoes = () => {
  votingStore.carregarVotacoes();
};

const getStatusText = (status) => {
  const statusMap = {
    ativo: "🟢 Votação Ativa",
    finalizado: "✅ Finalizada",
    pendente: "🟡 Pendente",
    rejeitado: "❌ Rejeitada",
  };
  return statusMap[status] || status;
};

const getDescriptionPreview = (description) => {
  if (!description) return "";
  return description.length > 200
    ? description.substring(0, 200) + "..."
    : description;
};

// Sistema de reações
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

const getReactionText = (type) => {
  const texts = {
    like: "Curtir",
    dislike: "Não curtir",
    fire: "Incrível",
    heart: "Amei",
  };
  return texts[type];
};

const handleVote = (itemId) => {
  emit("vote-submitted", itemId);
};

// Carregar votações ao montar componente
onMounted(() => {
  carregarVotacoes();
});

const hasUserReacted = (item, reactionType) => {
  return votingStore.hasUserReacted(item.id || item.originalId, reactionType);
};

const handleReaction = async (itemId, reactionType) => {
  await votingStore.reagirVotacao(itemId, reactionType);

  // Atualizar votação selecionada se for a mesma
  if (
    selectedVoting.value &&
    (selectedVoting.value.id === itemId ||
      selectedVoting.value.originalId === itemId)
  ) {
    const votacaoAtualizada = votingStore.getVotacaoById(itemId);
    if (votacaoAtualizada) {
      selectedVoting.value = { ...votacaoAtualizada };
    }
  }

  emit("reaction-submitted", {
    itemId,
    reactionType,
    userIdentifier: votingStore.userIdentifier,
  });
};

// Funções do modal de detalhes
const openVotingDetails = (voting) => {
  selectedVoting.value = { ...voting };
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedVoting.value = null;
};

// Funções auxiliares para reações
const getTotalReactions = (voting) => {
  return votingStore.getTotalReactions(voting);
};
</script>

<style scoped>
.improvements-voting {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
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
  color: #f59e0b;
  font-size: 1.4rem;
}

.see-all {
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
}

.voting-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.voting-item {
  align-items: center;
  padding: 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background: white;
  position: relative;
  overflow: hidden;
}

.voting-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.voting-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.voting-item:hover::before {
  opacity: 1;
}

.voting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.author-name {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  background: #f8fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.vote-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.vote-content p {
  color: #6b7280;
  font-size: 0.875rem;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  display: inline-block;
}

.status-badge.ativo {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.pendente {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.finalizado {
  background: #dbeafe;
  color: #2563eb;
}

.status-badge.rejeitado {
  background: #fee2e2;
  color: #dc2626;
}

.status-badge.aprovado {
  background: #ecfdf5;
  color: #059669;
}

.vote-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.vote-btn:hover,
.vote-btn.voted {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.vote-btn.disabled {
  background: #dcfce7;
  color: #16a34a;
  border-color: #bbf7d0;
  cursor: default;
}

/* Sistema de Reações */
.reactions-section {
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.reactions-section:hover {
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Sistema de Reações - Estilo horizontal do CommunityFeed */
.card-reactions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  justify-content: center;
}

.reaction-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: white;
  border: 2px solid #e2e8f0;
  padding: 0.5rem 0.85rem;
  border-radius: 24px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.875rem;
  font-weight: 600;
  min-width: 55px;
  position: relative;
  overflow: hidden;
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
  border-color: #667eea;
}

.reaction-btn:hover i {
  transform: scale(1.2);
}

.reaction-btn.user-reacted {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transform: scale(1.05);
}

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

.total-votes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 600;
}

.vote-btn {
  background: #22c55e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vote-btn:hover {
  background: #16a34a;
  transform: translateY(-1px);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Estilos do Modal de Detalhes */
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
}

.details-modal {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 700px;
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
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 20px 20px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
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
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-content {
  padding: 30px 24px;
}

.voting-info h3 {
  font-size: 1.5rem;
  color: #1a202c;
  margin: 1rem 0;
}

.voting-info h4 {
  font-size: 1.1rem;
  color: #4a5568;
  margin: 1.5rem 0 0.5rem 0;
  font-weight: 600;
}

.description-section,
.benefits-section,
.author-section {
  margin-bottom: 1.5rem;
}

.full-description {
  line-height: 1.6;
  color: #4a5568;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.reactions-section-modal {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

/* Reações no Modal - Estilo horizontal */
.card-reactions-modal {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.reaction-btn-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  background: white;
  border: 2px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
  border-radius: 20px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  min-width: 90px;
  position: relative;
  overflow: hidden;
}

.reaction-btn-modal::before {
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

.reaction-btn-modal:hover {
  border-color: #667eea;
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.reaction-btn-modal:hover::before {
  left: 100%;
}

.reaction-btn-modal.user-reacted {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.reaction-btn-modal i {
  font-size: 1.8rem;
  transition: transform 0.3s ease;
}

.reaction-btn-modal:hover i {
  transform: scale(1.2) rotate(5deg);
}

.reaction-btn-modal.user-reacted i {
  animation: bounce 0.6s ease;
}

.reaction-btn-modal .reaction-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  min-width: 25px;
  text-align: center;
}

.reaction-btn-modal:not(.user-reacted) .reaction-count {
  background: #f1f5f9;
  color: #64748b;
}

.reaction-stats {
  margin-top: 1.5rem;
  text-align: center;
}

.total-reactions {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #4a5568;
}

.reaction-percentages {
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 1rem;
  font-weight: 600;
}

.percentage-sim {
  color: #22c55e;
}

.percentage-nao {
  color: #ef4444;
}

.modal-footer {
  display: flex;
  justify-content: center;
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0 0 20px 20px;
}

.btn-close {
  padding: 12px 24px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

.reaction-percentages {
  font-size: 0.875rem;
  color: #6b7280;
}

/* ============================================
   MOBILE FIRST - APP-LIKE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .improvements-voting {
    padding: 0;
    background: transparent;
    border-radius: 0;
  }

  .section-header {
    padding: 1rem;
    margin-bottom: 0.5rem;
    background: white;
    border-radius: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .section-header h2 {
    font-size: 1.15rem;
  }

  .voting-list {
    gap: 0.75rem;
  }

  .voting-item {
    padding: 1rem;
    border-radius: 12px;
    margin: 0 0.75rem;
  }

  .voting-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .author-name {
    font-size: 0.8rem;
  }

  .status-badge {
    font-size: 0.7rem;
    padding: 0.3rem 0.75rem;
  }

  .vote-content h4 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .vote-content p {
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .reactions-section {
    margin-top: 0.875rem;
    padding-top: 0.875rem;
  }

  .card-reactions {
    gap: 0.5rem;
    justify-content: flex-start;
  }

  .reaction-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    border-radius: 20px;
  }

  .reaction-btn i {
    font-size: 0.95rem;
  }

  .reaction-count {
    font-size: 0.75rem;
  }

  /* Modal mobile */
  .modal-overlay {
    align-items: flex-end;
    padding: 0;
  }

  .details-modal {
    width: 100%;
    max-width: 100%;
    max-height: 90vh;
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

  .modal-header {
    padding: 1.25rem 1rem;
    position: relative;
  }

  /* Indicador de arraste */
  .modal-header::before {
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

  .modal-header h2 {
    font-size: 1.2rem;
    margin-top: 8px;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    font-size: 1.5rem;
  }

  .modal-content {
    padding: 1.25rem 1rem;
    max-height: calc(90vh - 150px);
    overflow-y: auto;
  }

  .voting-info h3 {
    font-size: 1.15rem;
    margin-bottom: 1rem;
  }

  .description-section h4,
  .benefits-section h4,
  .author-section h4,
  .reactions-section-modal h4 {
    font-size: 0.95rem;
    margin-bottom: 0.75rem;
  }

  .full-description,
  .benefits-section p,
  .author-section p {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .card-reactions-modal {
    gap: 0.5rem;
    justify-content: flex-start;
  }

  .reaction-btn-modal {
    padding: 0.75rem 1rem;
    min-width: auto;
    flex: 0 0 auto;
  }

  .reaction-btn-modal .reaction-emoji {
    font-size: 1.25rem;
  }

  .reaction-btn-modal .reaction-info {
    gap: 0.25rem;
  }

  .reaction-btn-modal .reaction-count-modal {
    font-size: 1rem;
  }

  .reaction-btn-modal .reaction-label {
    font-size: 0.75rem;
  }

  .modal-footer {
    padding: 1rem;
    position: sticky;
    bottom: 0;
    background: white;
    border-top: 1px solid #e5e7eb;
  }

  .btn-close {
    width: 100%;
    padding: 1rem;
    font-size: 0.95rem;
  }

  .reaction-percentages {
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }
}

/* Mobile muito pequeno */
@media (max-width: 480px) {
  .section-header h2 {
    font-size: 1.05rem;
  }

  .voting-item {
    padding: 0.875rem;
  }

  .vote-content h4 {
    font-size: 0.95rem;
  }

  .reaction-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
  }

  .reaction-btn i {
    font-size: 0.9rem;
  }

  .reaction-count {
    font-size: 0.7rem;
  }

  .reaction-btn-modal {
    padding: 0.625rem 0.875rem;
  }

  .reaction-btn-modal .reaction-emoji {
    font-size: 1.1rem;
  }

  .reaction-btn-modal .reaction-count-modal {
    font-size: 0.9rem;
  }
}
</style>
