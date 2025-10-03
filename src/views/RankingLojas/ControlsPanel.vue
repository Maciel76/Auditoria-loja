<template>
  <div class="unified-controls">
    <!-- View Mode Toggles -->
    <div class="view-toggles">
      <h3>
        <i class="fas fa-eye"></i>
        Visualização
      </h3>
      <div class="toggle-buttons">
        <button
          @click="$emit('view-mode-change', 'cards')"
          :class="{ active: viewMode === 'cards' }"
          class="toggle-btn"
        >
          <i class="fas fa-th"></i>
          <span>Cards</span>
        </button>
        <button
          @click="$emit('view-mode-change', 'table')"
          :class="{ active: viewMode === 'table' }"
          class="toggle-btn"
        >
          <i class="fas fa-list"></i>
          <span>Tabela</span>
        </button>
        <button
          @click="$emit('view-mode-change', 'chart')"
          :class="{ active: viewMode === 'chart' }"
          class="toggle-btn"
        >
          <i class="fas fa-chart-bar"></i>
          <span>Gráfico</span>
        </button>
      </div>
    </div>

    <!-- Smart Search -->
    <div class="smart-search">
      <h3>
        <i class="fas fa-search"></i>
        Busca Inteligente
      </h3>
      <div class="search-container">
        <div class="search-icon">
          <i class="fas fa-search"></i>
        </div>
        <input
          :value="searchTerm"
          @input="$emit('search-input', $event.target.value)"
          type="text"
          placeholder="Buscar por código, nome, região..."
          class="search-input"
        />
        <button v-if="searchTerm" @click="$emit('clear-search')" class="clear-search">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Search Suggestions -->
      <div class="search-suggestions" v-if="suggestions.length && searchTerm">
        <div
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          @click="$emit('select-suggestion', suggestion)"
          class="suggestion-item"
        >
          <i :class="suggestion.icon"></i>
          <span>{{ suggestion.label }}</span>
          <small>{{ suggestion.category }}</small>
        </div>
      </div>
    </div>

    <!-- Advanced Filters -->
    <div class="advanced-filters">
      <h3>
        <i class="fas fa-filter"></i>
        Filtros Avançados
      </h3>

      <!-- Filter Chips -->
      <div class="filter-chips">
        <div class="filter-chip-group">
          <span class="chip-label">Região:</span>
          <button
            v-for="regiao in regioes"
            :key="regiao.id"
            @click="$emit('toggle-regiao', regiao.id)"
            :class="{ active: regioesAtivas.includes(regiao.id) }"
            class="filter-chip"
          >
            {{ regiao.icon }} {{ regiao.nome }}
          </button>
        </div>

        <div class="filter-chip-group">
          <span class="chip-label">Liga:</span>
          <button
            v-for="liga in ligas"
            :key="liga.id"
            @click="$emit('toggle-liga', liga.id)"
            :class="{ active: ligasAtivas.includes(liga.id) }"
            class="filter-chip"
          >
            {{ liga.icon }} {{ liga.nome }}
          </button>
        </div>
      </div>

      <!-- Range Filters -->
      <div class="range-filters">
        <div class="range-filter">
          <label>Faixa de Itens:</label>
          <div class="range-input">
            <input
              type="range"
              :value="rangeItens.min"
              @input="$emit('range-change', 'itens', 'min', $event.target.value)"
              :max="rangeItens.max"
              min="0"
              class="range-slider"
            />
            <input
              type="range"
              :value="rangeItens.max"
              @input="$emit('range-change', 'itens', 'max', $event.target.value)"
              :min="rangeItens.min"
              max="50000"
              class="range-slider"
            />
          </div>
          <div class="range-values">
            <span>{{ Number(rangeItens.min).toLocaleString() }}</span>
            <span>-</span>
            <span>{{ Number(rangeItens.max).toLocaleString() }}</span>
          </div>
        </div>

        <div class="range-filter">
          <label>Eficiência Mínima:</label>
          <div class="range-input">
            <input
              type="range"
              :value="eficienciaMinima"
              @input="$emit('efficiency-change', $event.target.value)"
              min="0"
              max="100"
              class="range-slider"
            />
          </div>
          <div class="range-values">
            <span>{{ eficienciaMinima }}%</span>
          </div>
        </div>
      </div>

      <!-- Main Filters -->
      <div class="filters-main">
        <div class="filter-group">
          <label class="filter-label">
            <i class="fas fa-clipboard-check"></i>
            Tipo de Auditoria:
          </label>
          <select
            :value="filtroTipoAuditoria"
            @change="$emit('filter-change', 'tipo', $event.target.value)"
            class="filter-select"
          >
            <option value="todos">📋 Todas as Auditorias</option>
            <option value="etiqueta">🏷️ Etiqueta</option>
            <option value="presenca">👥 Presença</option>
            <option value="ruptura">📦 Ruptura</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <i class="fas fa-calendar-alt"></i>
            Período:
          </label>
          <select
            :value="filtroPeriodo"
            @change="$emit('filter-change', 'periodo', $event.target.value)"
            class="filter-select"
          >
            <option value="hoje">📅 Hoje</option>
            <option value="semana">📅 Esta Semana</option>
            <option value="mes">📅 Este Mês</option>
            <option value="todos">📅 Todos os Períodos</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <i class="fas fa-sort"></i>
            Ordenar por:
          </label>
          <select
            :value="filtroOrdenacao"
            @change="$emit('filter-change', 'ordenacao', $event.target.value)"
            class="filter-select"
          >
            <option value="itens">📊 Itens Auditados</option>
            <option value="usuarios">👥 Usuários Ativos</option>
            <option value="eficiencia">⚡ Eficiência</option>
            <option value="codigo">🏪 Código da Loja</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Export and Settings -->
    <div class="actions-toolbar">
      <div class="export-options">
        <button @click="$emit('export', 'pdf')" class="export-btn">
          <i class="fas fa-file-pdf"></i>
          <span>PDF</span>
        </button>
        <button @click="$emit('export', 'excel')" class="export-btn">
          <i class="fas fa-file-excel"></i>
          <span>Excel</span>
        </button>
        <button @click="$emit('share')" class="export-btn">
          <i class="fas fa-share"></i>
          <span>Compartilhar</span>
        </button>
      </div>

      <div class="settings-toggle">
        <button @click="$emit('toggle-settings')" class="settings-btn">
          <i class="fas fa-cog"></i>
          <span>Configurações</span>
        </button>
      </div>
    </div>

    <!-- Settings Panel -->
    <div class="settings-panel" v-if="showSettings">
      <h3>⚙️ Configurações da Visualização</h3>

      <div class="settings-grid">
        <div class="setting-group">
          <label>Itens por página:</label>
          <select
            :value="itemsPerPage"
            @change="$emit('setting-change', 'itemsPerPage', $event.target.value)"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div class="setting-group">
          <label>
            <input
              type="checkbox"
              :checked="autoRefresh"
              @change="$emit('setting-change', 'autoRefresh', $event.target.checked)"
            />
            Auto-refresh (30s)
          </label>
        </div>

        <div class="setting-group">
          <label>
            <input
              type="checkbox"
              :checked="showAnimations"
              @change="$emit('setting-change', 'showAnimations', $event.target.checked)"
            />
            Animações avançadas
          </label>
        </div>

        <div class="setting-group">
          <label>
            <input
              type="checkbox"
              :checked="compactMode"
              @change="$emit('setting-change', 'compactMode', $event.target.checked)"
            />
            Modo compacto
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  viewMode: {
    type: String,
    default: 'cards'
  },
  searchTerm: {
    type: String,
    default: ''
  },
  suggestions: {
    type: Array,
    default: () => []
  },
  regioes: {
    type: Array,
    default: () => []
  },
  ligas: {
    type: Array,
    default: () => []
  },
  regioesAtivas: {
    type: Array,
    default: () => []
  },
  ligasAtivas: {
    type: Array,
    default: () => []
  },
  rangeItens: {
    type: Object,
    default: () => ({ min: 0, max: 50000 })
  },
  eficienciaMinima: {
    type: Number,
    default: 0
  },
  filtroTipoAuditoria: {
    type: String,
    default: 'todos'
  },
  filtroPeriodo: {
    type: String,
    default: 'mes'
  },
  filtroOrdenacao: {
    type: String,
    default: 'itens'
  },
  showSettings: {
    type: Boolean,
    default: false
  },
  itemsPerPage: {
    type: Number,
    default: 25
  },
  autoRefresh: {
    type: Boolean,
    default: false
  },
  showAnimations: {
    type: Boolean,
    default: true
  },
  compactMode: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'view-mode-change',
  'search-input',
  'clear-search',
  'select-suggestion',
  'toggle-regiao',
  'toggle-liga',
  'range-change',
  'efficiency-change',
  'filter-change',
  'export',
  'share',
  'toggle-settings',
  'setting-change'
])
</script>

<style scoped>
/* Reusing the exact same styles from the original component */
/* Controls */
.unified-controls {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

/* View Mode Toggles */
.view-toggles {
  margin-bottom: 2rem;
}

.view-toggles h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-buttons {
  display: flex;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 0.25rem;
  gap: 0.25rem;
  width: fit-content;
}

.toggle-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  min-width: 80px;
  justify-content: center;
}

.toggle-btn:hover {
  color: #374151;
  background: rgba(255, 255, 255, 0.5);
}

.toggle-btn.active {
  background: #ffffff;
  color: #6366f1;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.toggle-btn i {
  font-size: 1rem;
}

/* Smart Search */
.smart-search {
  margin-bottom: 2rem;
}

.smart-search h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-container {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6366f1;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background: white;
}

.clear-search {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.clear-search:hover {
  background: #f3f4f6;
  color: #6b7280;
}

/* Search Suggestions */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  border-bottom: 1px solid #f3f4f6;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: #f8fafc;
}

.suggestion-item i {
  color: #6366f1;
  width: 16px;
  text-align: center;
}

.suggestion-item span {
  flex: 1;
  color: #374151;
  font-weight: 500;
}

.suggestion-item small {
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

/* Advanced Filters */
.advanced-filters {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  border: 1px solid #e5e7eb;
}

.advanced-filters h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Filter Chip Groups */
.filter-chip-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.chip-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
  min-width: 60px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  font-size: 0.875rem;
  color: #374151;
  transition: all 0.2s ease;
  cursor: pointer;
  font-weight: 500;
}

.filter-chip:hover {
  background: #f9fafb;
  border-color: #6366f1;
  transform: translateY(-1px);
}

.filter-chip.active {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
}

/* Range Filters */
.range-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.range-filter {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.range-filter label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
  display: block;
  margin-bottom: 0.75rem;
}

.range-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.range-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  cursor: pointer;
}

.range-slider:hover {
  opacity: 1;
}

.range-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.range-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.range-values {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.filters-main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.75rem;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  font-size: 1rem;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background: white;
}

/* Actions Toolbar */
.actions-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 1rem;
}

.export-options {
  display: flex;
  gap: 0.5rem;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.export-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.export-btn:active {
  transform: translateY(0);
}

.settings-toggle {
  display: flex;
}

.settings-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.settings-btn:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

/* Settings Panel */
.settings-panel {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-group label {
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting-group select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.setting-group select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.setting-group input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  accent-color: #6366f1;
}

/* Responsive */
@media (max-width: 1024px) {
  .toggle-buttons {
    width: 100%;
    justify-content: center;
  }

  .actions-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .export-options {
    justify-content: center;
  }

  .filter-chip-group {
    justify-content: center;
  }

  .range-filters {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .unified-controls {
    padding: 1.5rem;
  }

  .filters-main {
    grid-template-columns: 1fr;
  }

  .advanced-filters {
    padding: 1rem;
  }

  .filter-chip-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .chip-label {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .toggle-buttons {
    flex-direction: column;
  }

  .toggle-btn {
    width: 100%;
  }

  .export-options {
    flex-wrap: wrap;
  }

  .search-input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style>