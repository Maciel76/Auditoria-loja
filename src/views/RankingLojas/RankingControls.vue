<template>
  <div class="ranking-controls">
    <!-- Filtros -->
    <div class="filters-container">
      <!-- Filtro por Tipo de Auditoria -->
      <div class="filter-group">
        <select
          :value="filtroTipoAuditoria"
          @change="$emit('update:filtroTipoAuditoria', $event.target.value)"
          class="filter-select"
        >
          <!-- <option value="todos">📋 Todas as Auditorias</option> -->
          <option value="etiqueta">🏷️ Etiqueta</option>
          <option value="presenca">👥 Presença</option>
          <option value="ruptura">📦 Ruptura</option>
        </select>
      </div>

      <!-- Filtro por Período -->
      <div class="filter-group">
        <select
          :value="filtroPeriodo"
          @change="$emit('update:filtroPeriodo', $event.target.value)"
          class="filter-select"
        >
          <option value="hoje">📅 Hoje</option>
          <!-- Outros filtros de período serão implementados mais tarde
          <option value="semana">📊 Esta Semana</option>
          <option value="mes">📆 Este Mês</option>
          <option value="trimestre">📈 Este Trimestre</option>
          <option value="todos">🔄 Todos os Períodos</option>
          -->
        </select>
      </div>


      <!-- Botão para buscar dados -->
      <button @click="$emit('buscarDados')" class="filter-btn">
        <img
          src="../../assets/svg/icon-ranking/update.svg"
          alt="Atualizar"
          class="nav-icon-small"
        />
        Atualizar
      </button>

      <!-- Botão de compartilhar -->
      <button @click="$emit('compartilhar')" class="filter-btn share-btn">
        <i class="fas fa-share-alt nav-icon-small"></i>
        Compartilhar
      </button>
    </div>

    <!-- Visualização -->
    <div class="view-options">
      <button
        @click="$emit('update:viewMode', 'cards')"
        :class="['view-btn', { active: viewMode === 'cards' }]"
      >
        <img
          src="../../assets/svg/icon-ranking/medalgold.svg"
          alt="Visualização em cards"
          class="nav-icon-small"
        />
        Cards
      </button>
      <button
        @click="$emit('update:viewMode', 'table')"
        :class="['view-btn', { active: viewMode === 'table' }]"
      >
        <img
          src="../../assets/svg/icon-ranking/clipboard.svg"
          alt="Visualização em tabela"
          class="nav-icon-small"
        />
        Tabela
      </button>
      <button
        @click="$emit('update:viewMode', 'chart')"
        :class="['view-btn', { active: viewMode === 'chart' }]"
      >
        <i class="fas fa-chart-bar nav-icon-small"></i>
        Gráfico
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RankingControls",
  props: {
    viewMode: {
      type: String,
      default: "cards",
    },
    filtroTipoAuditoria: {
      type: String,
      default: "todos",
    },
    filtroPeriodo: {
      type: String,
      default: "mes",
    },
  },
  emits: [
    "update:viewMode",
    "update:filtroTipoAuditoria",
    "update:filtroPeriodo",
    "buscarDados",
    "compartilhar",
  ],
};
</script>

<style scoped>
.ranking-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding: 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex-wrap: wrap;
  font-family: "Inter", sans-serif;
}

.nav-icon-small {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.filters-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.filter-group {
  display: flex;
  align-items: center;
}

.filter-select {
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  background: white;
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
  min-width: 140px;
  height: 42px;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select:hover {
  border-color: #cbd5e1;
}

.filter-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  height: 42px;
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
  min-width: 120px;
  justify-content: center;
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.share-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.share-btn:hover {
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.view-options {
  display: flex;
  gap: 8px;
}

.view-btn {
  padding: 8px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  height: 42px;
  font-family: "Inter", sans-serif;
}

.view-btn:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f8fafc;
}

.view-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

/* Responsividade */
@media (max-width: 1200px) {
  .ranking-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .filters-container {
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }

  .view-options {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .ranking-controls {
    padding: 16px;
    gap: 14px;
  }

  .filters-container {
    flex-direction: column;
    gap: 12px;
  }

  .filter-group,
  .filter-btn {
    width: 100%;
  }

  .filter-select {
    width: 100%;
    min-width: auto;
  }

  .view-options {
    width: 100%;
    justify-content: stretch;
  }

  .view-btn {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .ranking-controls {
    padding: 12px;
    margin-bottom: 20px;
  }

  .filter-select,
  .filter-btn,
  .view-btn {
    height: 38px;
    font-size: 0.8rem;
  }

  .nav-icon-small {
    width: 14px;
    height: 14px;
  }
}
</style>