<template>
  <div class="community-feed">
    <div class="section-header">
      <h2>📰 Mural da Comunidade</h2>
      <span class="see-all">Ver tudo</span>
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
          <span v-if="item.badge" class="card-badge" :class="item.badge">
            {{ getBadgeText(item.badge) }}
          </span>
          <div v-else-if="item.user" class="user-info">
            <div class="user-avatar">{{ item.user.avatar }}</div>
            <span class="user-name">{{ item.user.name }}</span>
          </div>
          <span class="card-time">{{ item.time }}</span>
        </div>

        <div class="card-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>

          <!-- Sistema de Reações -->
          <div class="card-reactions">
            <button
              v-for="(reaction, type) in getReactions(item)"
              :key="type"
              class="reaction-btn"
              :class="{ 'user-reacted': hasUserReacted(item, type) }"
              @click="handleReaction(item.id, type)"
            >
              <span class="reaction-emoji">{{ getReactionEmoji(type) }}</span>
              <span class="reaction-count">{{ reaction.count }}</span>
            </button>
          </div>

          <!-- Ações adicionais -->
          <div class="card-actions">
            <button class="action-btn">
              <i class="fas fa-comment"></i>
              <span>{{ item.comments || 0 }}</span>
            </button>
            <button class="action-btn">
              <i class="fas fa-share"></i>
              <span>Compartilhar</span>
            </button>
          </div>

          <div v-if="item.adminResponse" class="admin-response">
            <span class="response-badge">{{ item.adminResponse.badge }}</span>
            <p>{{ item.adminResponse.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  feedItems: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(["vote-submitted"]);

const getBadgeText = (badge) => {
  const badges = {
    new: "NOVO",
    update: "ATUALIZAÇÃO",
  };
  return badges[badge] || badge;
};

const handleVote = (itemId) => {
  emit("vote-submitted", itemId);
};
</script>

<style scoped>
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
  transition: transform 0.2s, box-shadow 0.2s;
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

.card-engagement {
  display: flex;
  gap: 1rem;
}

.engagement-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.engagement-btn:hover,
.engagement-btn.voted {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
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
</style>
