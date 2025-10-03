<template>
  <div class="insights-panel" v-if="insights.length">
    <h2 class="section-title">
      <i class="fas fa-lightbulb"></i>
      Insights Inteligentes
    </h2>
    <div class="insights-grid">
      <div
        v-for="insight in insights"
        :key="insight.id"
        class="insight-card"
        :class="insight.type"
        @click="$emit('insight-click', insight)"
      >
        <div class="insight-icon">{{ insight.icon }}</div>
        <div class="insight-content">
          <h4>{{ insight.title }}</h4>
          <p>{{ insight.description }}</p>
          <span class="insight-value">{{ insight.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  insights: {
    type: Array,
    default: () => []
  }
})

defineEmits(['insight-click'])
</script>

<style scoped>
.insights-panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.insight-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.25rem;
  border-left: 4px solid #6366f1;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.insight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
}

.insight-card.success {
  border-left-color: #10b981;
  background: #f0fdf4;
}

.insight-card.warning {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.insight-card.danger {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.insight-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.insight-content {
  flex: 1;
}

.insight-content h4 {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.insight-content p {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.insight-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

/* Responsive */
@media (max-width: 768px) {
  .insights-grid {
    grid-template-columns: 1fr;
  }

  .insight-card {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .insight-icon {
    font-size: 1.75rem;
  }
}
</style>