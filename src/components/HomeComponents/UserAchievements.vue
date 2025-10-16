<template>
  <div class="user-achievements">
    <div class="section-header">
      <h2>⚠️Avisos importantes</h2>
      <span class="user-level">4</span>
    </div>

    <div class="achievements-grid">
      <div
        v-for="achievement in achievements"
        :key="achievement.id"
        class="achievement-card"
        :class="achievement.type"
      >
        <div class="achievement-icon">{{ achievement.icon }}</div>
        <div class="achievement-info">
          <h4>{{ achievement.title }}</h4>
          <p>{{ achievement.description }}</p>
          <div v-if="achievement.progress" class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: achievement.progress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <span>Ver tudo</span>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  achievements: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>

<style scoped>
.user-achievements {
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

.user-level {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
}

.achievements-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.achievement-card {
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.achievement-card.unlocked {
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.achievement-card.locked {
  opacity: 0.5;
  background: #f8fafc;
}

.achievement-card.progress {
  border-color: #bae6fd;
  background: #f0f9ff;
}

.achievement-icon {
  font-size: 1.5rem;
}

.achievement-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.achievement-info p {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.3s ease;
}
</style>
