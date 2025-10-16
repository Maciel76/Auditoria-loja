<template>
  <div class="improvements-voting">
    <div class="section-header">
      <h2>🚀 Melhorias em Votação</h2>
      <span class="see-all">Ver ranking</span>
    </div>

    <div class="voting-list">
      <div
        v-for="item in votingItems"
        :key="item.id"
        class="voting-item"
        @click="handleVote(item.id)"
      >
        <div class="vote-content">
          <span class="status-badge" :class="item.status">
            {{ getStatusText(item.status) }}
          </span>
          <h4>{{ item.title }}</h4>
          <p>{{ item.description }}</p>
        </div>

        <!-- Sistema de Reações -->
        <div class="reactions-section">
          <div class="reactions-grid">
            <button
              v-for="(reaction, type) in getReactions(item)"
              :key="type"
              class="reaction-btn"
              :class="{ 'user-reacted': hasUserReacted(item, type) }"
              @click.stop="handleReaction(item.originalId || item.id, type)"
            >
              <span class="reaction-emoji">{{ getReactionEmoji(type) }}</span>
              <span class="reaction-count">{{ reaction.count }}</span>
            </button>
          </div>
          <div class="total-votes">
            <span>👍 {{ item.votes }} votos totais</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";

const props = defineProps({
  votingItems: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(["vote-submitted", "reaction-submitted"]);

const userIdentifier = ref(`user_${Date.now()}`);

const getStatusText = (status) => {
  const statusMap = {
    "in-progress": "🟢 Em andamento",
    "under-review": "🟡 Em análise",
    implemented: "✅ Implementada",
    "new-idea": "💡 Nova ideia",
  };
  return statusMap[status] || status;
};

const handleVote = (itemId) => {
  emit("vote-submitted", itemId);
};

// Sistema de reações
const getReactions = (item) => {
  const defaultReactions = {
    like: { count: 0, users: [] },
    dislike: { count: 0, users: [] },
    fire: { count: 0, users: [] },
    heart: { count: 0, users: [] }
  };
  return item.reactions || defaultReactions;
};

const getReactionEmoji = (type) => {
  const emojis = {
    like: "👍",
    dislike: "👎",
    fire: "🔥",
    heart: "💚"
  };
  return emojis[type];
};

const hasUserReacted = (item, reactionType) => {
  const reactions = getReactions(item);
  return reactions[reactionType]?.users?.includes(userIdentifier.value) || false;
};

const handleReaction = (itemId, reactionType) => {
  emit("reaction-submitted", { itemId, reactionType, userIdentifier: userIdentifier.value });
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: border-color 0.2s;
  cursor: pointer;
}

.voting-item:hover {
  border-color: #3b82f6;
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
  margin-bottom: 0.5rem;
  display: inline-block;
}

.in-progress {
  color: #16a34a;
}
.under-review {
  color: #d97706;
}
.implemented {
  color: #059669;
}
.new-idea {
  color: #7c3aed;
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
  background: #f8fafc;
  border-radius: 8px;
  border-top: 1px solid #e2e8f0;
}

.reactions-grid {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.reaction-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
}

.reaction-btn:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.reaction-btn.user-reacted {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.reaction-emoji {
  font-size: 1rem;
}

.reaction-count {
  font-weight: 600;
  font-size: 0.8rem;
}

.total-votes {
  text-align: center;
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 600;
}
</style>
