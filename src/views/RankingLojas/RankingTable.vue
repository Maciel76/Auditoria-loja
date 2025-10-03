<template>
  <div class="table-section">
    <div class="section-header">
      <h2 class="section-title">
        <i class="fas fa-table"></i>
        Tabela Completa
      </h2>
      <div class="table-controls">
        <div class="pagination-info">
          Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalLojas }}
        </div>
        <div class="pagination-controls">
          <button @click="$emit('previous-page')" :disabled="currentPage === 1" class="page-btn">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="$emit('next-page')" :disabled="currentPage === totalPages" class="page-btn">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="ranking-table">
        <thead>
          <tr>
            <th @click="$emit('sort', 'posicao')" class="sortable">
              <i class="fas fa-hashtag"></i>
              <span>Pos.</span>
              <i class="fas fa-sort" v-if="sortField !== 'posicao'"></i>
              <i :class="`fas fa-sort-${sortDirection}`" v-else></i>
            </th>
            <th @click="$emit('sort', 'codigo')" class="sortable">
              <i class="fas fa-store"></i>
              <span>Loja</span>
              <i class="fas fa-sort" v-if="sortField !== 'codigo'"></i>
              <i :class="`fas fa-sort-${sortDirection}`" v-else></i>
            </th>
            <th @click="$emit('sort', 'itens')" class="sortable">
              <i class="fas fa-chart-bar"></i>
              <span>Itens</span>
              <i class="fas fa-sort" v-if="sortField !== 'itens'"></i>
              <i :class="`fas fa-sort-${sortDirection}`" v-else></i>
            </th>
            <th @click="$emit('sort', 'usuarios')" class="sortable">
              <i class="fas fa-users"></i>
              <span>Usuários</span>
              <i class="fas fa-sort" v-if="sortField !== 'usuarios'"></i>
              <i :class="`fas fa-sort-${sortDirection}`" v-else></i>
            </th>
            <th @click="$emit('sort', 'eficiencia')" class="sortable">
              <i class="fas fa-tachometer-alt"></i>
              <span>Eficiência</span>
              <i class="fas fa-sort" v-if="sortField !== 'eficiencia'"></i>
              <i :class="`fas fa-sort-${sortDirection}`" v-else></i>
            </th>
            <th @click="$emit('sort', 'tendencia')" class="sortable">
              <i class="fas fa-trending-up"></i>
              <span>Tendência</span>
              <i class="fas fa-sort" v-if="sortField !== 'tendencia'"></i>
              <i :class="`fas fa-sort-${sortDirection}`" v-else></i>
            </th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(loja, index) in paginatedLojas"
            :key="loja.codigo"
            class="table-row"
            :class="{
              'gold': startIndex + index === 0,
              'silver': startIndex + index === 1,
              'bronze': startIndex + index === 2
            }"
          >
            <td class="position-cell">
              <span class="position-number">{{ startIndex + index + 1 }}</span>
              <span class="position-medal" v-if="startIndex + index < 3">
                {{ startIndex + index === 0 ? '🥇' : startIndex + index === 1 ? '🥈' : '🥉' }}
              </span>
            </td>
            <td class="loja-cell">
              <div class="loja-info-compact">
                <strong>{{ loja.codigo }}</strong>
                <small>{{ loja.nome || `Loja ${loja.codigo}` }}</small>
                <div class="loja-badges">
                  <span class="liga-badge" :class="getLiga(loja.itensAuditados)">
                    {{ getLigaIcon(loja.itensAuditados) }}
                  </span>
                </div>
              </div>
            </td>
            <td class="metric-cell">
              <div class="metric-value">{{ loja.itensAuditados?.toLocaleString() || 0 }}</div>
              <div class="mini-sparkline">
                <svg width="40" height="16" viewBox="0 0 40 16">
                  <polyline
                    :points="generateSparkline(loja.historico || [])"
                    fill="none"
                    stroke="#6366f1"
                    stroke-width="1.5"
                  />
                </svg>
              </div>
            </td>
            <td class="metric-cell">
              <div class="metric-value">{{ loja.usuariosAtivos || 0 }}</div>
              <div class="metric-subtitle">de {{ loja.totalUsuarios || 0 }}</div>
            </td>
            <td class="metric-cell">
              <div class="efficiency-ring-small">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="#e5e7eb"
                    stroke-width="2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="#6366f1"
                    stroke-width="2"
                    stroke-linecap="round"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="circumference - (calcularEficiencia(loja) / 100) * circumference"
                    transform="rotate(-90 12 12)"
                  />
                </svg>
                <span class="efficiency-text-small">{{ calcularEficiencia(loja) }}%</span>
              </div>
            </td>
            <td class="trend-cell">
              <div class="trend-indicator">
                <i
                  :class="getTrendIcon(loja.tendencia || 0)"
                  :style="{ color: getTrendColor(loja.tendencia || 0) }"
                ></i>
                <span>{{ Math.abs(loja.tendencia || 0) }}%</span>
              </div>
            </td>
            <td class="actions-cell">
              <div class="table-actions">
                <button @click="$emit('view-details', loja)" class="action-btn small">
                  <i class="fas fa-chart-line"></i>
                </button>
                <button @click="$emit('compare', loja)" class="action-btn small">
                  <i class="fas fa-balance-scale"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  lojas: {
    type: Array,
    default: () => []
  },
  currentPage: {
    type: Number,
    default: 1
  },
  itemsPerPage: {
    type: Number,
    default: 25
  },
  sortField: {
    type: String,
    default: 'itens'
  },
  sortDirection: {
    type: String,
    default: 'desc'
  }
})

defineEmits(['previous-page', 'next-page', 'sort', 'view-details', 'compare'])

// Computed properties
const totalLojas = computed(() => props.lojas.length)
const totalPages = computed(() => Math.ceil(totalLojas.value / props.itemsPerPage))
const startIndex = computed(() => (props.currentPage - 1) * props.itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + props.itemsPerPage, totalLojas.value))

const paginatedLojas = computed(() => {
  return props.lojas.slice(startIndex.value, endIndex.value)
})

const circumference = computed(() => 2 * Math.PI * 10)

// Helper methods
const calcularEficiencia = (loja) => {
  if (!loja.usuariosAtivos || loja.usuariosAtivos === 0) return 0

  // Se a eficiência já vem calculada da API, usar ela
  if (loja.eficiencia !== undefined) {
    return Math.min(loja.eficiencia, 100)
  }

  // Caso contrário, calcular baseado na média por usuário
  const mediaPorUsuario = loja.itensAuditados / loja.usuariosAtivos
  // Normalizar para uma escala de 0-100 (considerando 1000 itens como 100%)
  const eficiencia = Math.min((mediaPorUsuario / 1000) * 100, 100)
  return Math.round(eficiencia)
}

const getLiga = (itens) => {
  if (itens >= 8000) return 'diamante'
  if (itens >= 5000) return 'ouro'
  if (itens >= 2000) return 'prata'
  return 'bronze'
}

const getLigaIcon = (itens) => {
  const liga = getLiga(itens)
  const icons = {
    diamante: '💎',
    ouro: '🥇',
    prata: '🥈',
    bronze: '🥉'
  }
  return icons[liga] || '🏪'
}

const generateSparkline = (historico) => {
  if (!historico || historico.length === 0) {
    // Gerar dados mock
    const points = []
    for (let i = 0; i < 7; i++) {
      const x = (i / 6) * 40
      const y = 8 + Math.random() * 8
      points.push(`${x},${y}`)
    }
    return points.join(' ')
  }

  return historico.map((valor, index) => {
    const x = (index / (historico.length - 1)) * 40
    const y = 16 - ((valor / Math.max(...historico)) * 16)
    return `${x},${y}`
  }).join(' ')
}

const getTrendIcon = (tendencia) => {
  if (tendencia > 5) return 'fas fa-arrow-up'
  if (tendencia < -5) return 'fas fa-arrow-down'
  return 'fas fa-minus'
}

const getTrendColor = (tendencia) => {
  if (tendencia > 5) return '#10b981'
  if (tendencia < -5) return '#ef4444'
  return '#6b7280'
}
</script>

<style scoped>
.table-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-btn {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #374151;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #6366f1;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  padding: 0 0.75rem;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.table-container {
  overflow-x: auto;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
}

.ranking-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ranking-table th:hover {
  background: #f1f5f9;
}

.ranking-table th.sortable {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ranking-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.ranking-table tr:hover {
  background: #f8fafc;
}

.table-row.gold {
  background: linear-gradient(135deg, #fef3c7 0%, rgba(251, 191, 36, 0.1) 100%);
}

.table-row.silver {
  background: linear-gradient(135deg, #f3f4f6 0%, rgba(156, 163, 175, 0.1) 100%);
}

.table-row.bronze {
  background: linear-gradient(135deg, #fed7aa 0%, rgba(217, 119, 6, 0.1) 100%);
}

.position-cell {
  text-align: center;
  font-weight: 700;
  color: #1f2937;
}

.position-medal {
  font-size: 1.1rem;
  margin-left: 0.25rem;
}

.loja-info-compact {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.loja-info-compact strong {
  color: #1f2937;
  font-size: 1rem;
}

.loja-info-compact small {
  color: #6b7280;
  font-size: 0.875rem;
}

.loja-badges {
  margin-top: 0.25rem;
}

.liga-badge {
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.liga-badge.diamante {
  background: linear-gradient(135deg, #a5b4fc, #c7d2fe);
  color: #3730a3;
}

.liga-badge.ouro {
  background: linear-gradient(135deg, #fcd34d, #fde68a);
  color: #92400e;
}

.liga-badge.prata {
  background: linear-gradient(135deg, #d1d5db, #e5e7eb);
  color: #374151;
}

.liga-badge.bronze {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: #ffffff;
}

.metric-cell {
  text-align: center;
}

.metric-value {
  font-weight: 700;
  color: #1f2937;
  font-size: 1rem;
}

.metric-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
}

.mini-sparkline {
  margin-top: 0.25rem;
}

.efficiency-ring-small {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.efficiency-text-small {
  position: absolute;
  font-size: 0.7rem;
  font-weight: 600;
  color: #374151;
}

.trend-cell {
  text-align: center;
}

.trend-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.actions-cell {
  text-align: center;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn.small {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6366f1;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.small:hover {
  background: #f8fafc;
  border-color: #6366f1;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }

  .ranking-table {
    min-width: 800px;
  }

  .table-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>