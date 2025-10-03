<template>
  <div class="podium-section" v-if="topLojas.length >= 3">
    <h2 class="section-title">
      <i class="fas fa-trophy"></i>
      Top 3 Lojas
    </h2>
    <div class="podium-container">
      <!-- 2º Lugar -->
      <div class="podium-card second-place">
        <div class="podium-position">2º</div>
        <div class="podium-medal">🥈</div>
        <div class="loja-info">
          <div class="loja-codigo">{{ topLojas[1]?.codigo }}</div>
          <div class="loja-nome">{{ topLojas[1]?.nome || 'Loja ' + topLojas[1]?.codigo }}</div>
        </div>
        <div class="podium-stats">
          <div class="stat">
            <span class="stat-value">{{ topLojas[1]?.itensAuditados?.toLocaleString() || 0 }}</span>
            <span class="stat-label">Itens</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ topLojas[1]?.usuariosAtivos || 0 }}</span>
            <span class="stat-label">Usuários</span>
          </div>
        </div>
      </div>

      <!-- 1º Lugar -->
      <div class="podium-card first-place">
        <div class="podium-position">1º</div>
        <div class="podium-medal">🥇</div>
        <div class="loja-info">
          <div class="loja-codigo">{{ topLojas[0]?.codigo }}</div>
          <div class="loja-nome">{{ topLojas[0]?.nome || 'Loja ' + topLojas[0]?.codigo }}</div>
        </div>
        <div class="podium-stats">
          <div class="stat">
            <span class="stat-value">{{ topLojas[0]?.itensAuditados?.toLocaleString() || 0 }}</span>
            <span class="stat-label">Itens</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ topLojas[0]?.usuariosAtivos || 0 }}</span>
            <span class="stat-label">Usuários</span>
          </div>
        </div>
        <div class="crown">👑</div>
      </div>

      <!-- 3º Lugar -->
      <div class="podium-card third-place">
        <div class="podium-position">3º</div>
        <div class="podium-medal">🥉</div>
        <div class="loja-info">
          <div class="loja-codigo">{{ topLojas[2]?.codigo }}</div>
          <div class="loja-nome">{{ topLojas[2]?.nome || 'Loja ' + topLojas[2]?.codigo }}</div>
        </div>
        <div class="podium-stats">
          <div class="stat">
            <span class="stat-value">{{ topLojas[2]?.itensAuditados?.toLocaleString() || 0 }}</span>
            <span class="stat-label">Itens</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ topLojas[2]?.usuariosAtivos || 0 }}</span>
            <span class="stat-label">Usuários</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  topLojas: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.podium-section {
  margin-bottom: 2rem;
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

.podium-container {
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 1rem;
  padding: 2rem 0;
}

.podium-card {
  background: white;
  border-radius: 24px;
  padding: 2rem 1.5rem;
  text-align: center;
  border: 2px solid #f1f5f9;
  position: relative;
  transition: all 0.3s ease;
  min-width: 200px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.podium-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #e0e7ff;
}

.first-place {
  order: 2;
  transform: scale(1.1);
  border: 2px solid #fbbf24;
  background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
}

.second-place {
  order: 1;
  border: 2px solid #9ca3af;
  background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%);
}

.third-place {
  order: 3;
  border: 2px solid #d97706;
  background: linear-gradient(135deg, #fed7aa 0%, #f59e0b 100%);
}

.podium-position {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.podium-medal {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.crown {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
}

.loja-info {
  margin-bottom: 1.5rem;
}

.loja-codigo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.loja-nome {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.podium-stats {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.podium-stats .stat {
  text-align: center;
}

.podium-stats .stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
}

.podium-stats .stat-label {
  font-size: 0.8rem;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 1024px) {
  .podium-container {
    flex-direction: column;
    align-items: center;
  }

  .podium-card {
    order: unset !important;
    transform: none !important;
    max-width: 300px;
  }

  .first-place {
    transform: none !important;
  }
}

@media (max-width: 768px) {
  .podium-card {
    padding: 1.5rem 1rem;
    min-width: 160px;
  }

  .podium-medal {
    font-size: 2.5rem;
  }

  .loja-codigo {
    font-size: 1.3rem;
  }
}
</style>