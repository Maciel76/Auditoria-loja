<template>
  <div class="ranking-controls">
    <!-- Busca -->
    <div class="search-container">
      <div class="search-icon">
        <img
          src="../../../assets/svg/icon-ranking/search.svg"
          alt="Buscar"
          class="nav-icon"
        />
      </div>
      <input
        :value="filtro"
        @input="$emit('update:filtro', $event.target.value)"
        type="text"
        placeholder="Buscar colaborador..."
        class="search-input"
      />
    </div>

    <!-- Filtros -->
    <div class="filters-container">
      <!-- Filtro por Tipo de Auditoria -->
      <div class="filter-group">
        <select
          :value="filtroTipo"
          @change="$emit('update:filtroTipo', $event.target.value)"
          class="filter-select"
        >
          <option value="todos">Todos</option>
          <option value="etiqueta">Etiqueta</option>
          <option value="presenca">Presença</option>
          <option value="ruptura">Ruptura</option>
        </select>
      </div>

      <!-- Filtro por Período -->
      <div class="filter-group">
        <select
          :value="filtroPeriodo"
          @change="$emit('update:filtroPeriodo', $event.target.value)"
          class="filter-select"
        >
          <option value="hoje">Hoje</option>
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mês</option>
          <option value="todos">Todos</option>
        </select>
      </div>

      <!-- Botão para buscar dados -->
      <button @click="$emit('buscarDados')" class="filter-btn">
        <img
          src="../../../assets/svg/icon-ranking/update.svg"
          alt="Atualizar"
          class="nav-icon-small"
        />
        Atualizar
      </button>
    </div>

    <!-- Visualização -->
    <div class="view-options">
      <button
        @click="$emit('update:viewMode', 'podium')"
        :class="['view-btn', { active: viewMode === 'podium' }]"
      >
        <img
          src="../../../assets/svg/icon-ranking/medalgold.svg"
          alt="Visualização em pódio"
          class="nav-icon-small"
        />
        Pódio
      </button>
      <button
        @click="$emit('update:viewMode', 'all')"
        :class="['view-btn', { active: viewMode === 'all' }]"
      >
        <img
          src="../../../assets/svg/icon-ranking/clipboard.svg"
          alt="Visualização completa"
          class="nav-icon-small"
        />
        Todos
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RankingControls",
  props: {
    filtro: {
      type: String,
      default: "",
    },
    viewMode: {
      type: String,
      default: "podium",
    },
    filtroTipo: {
      type: String,
      default: "todos",
    },
    filtroPeriodo: {
      type: String,
      default: "hoje",
    },
  },
  emits: [
    "update:filtro",
    "update:viewMode",
    "update:filtroTipo",
    "update:filtroPeriodo",
    "buscarDados",
  ],
};
</script>

<style scoped>
.ranking-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.nav-icon {
  width: 16px;
  height: 16px;
  opacity: 0.6;
}

.nav-icon-small {
  width: 25px;
  height: auto;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 35px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  background: rgb(218, 216, 216);
  height: 36px;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.filters-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group {
  display: flex;
  align-items: center;
}

.filter-select {
  padding: 6px 10px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #495057;
  cursor: pointer;
  background: white;
  height: 36px;
  min-width: 110px;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.filter-btn {
  padding: 8px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  height: 36px;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

.view-options {
  display: flex;
  gap: 8px;
}

.view-btn {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  height: 36px;
}

.view-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.view-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.2);
}

@media (max-width: 768px) {
  .ranking-controls {
    gap: 12px;
    padding: 12px;
  }

  .search-container {
    min-width: 100%;
    max-width: 100%;
    order: 1;
  }

  .filters-container {
    order: 3;
    width: 100%;
    justify-content: space-between;
  }

  .view-options {
    order: 2;
    flex: 1;
    justify-content: flex-end;
  }

  .filter-select {
    min-width: 100px;
    flex: 1;
  }
}

@media (max-width: 480px) {
  .ranking-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container,
  .filters-container,
  .view-options {
    width: 100%;
  }

  .filters-container {
    flex-direction: column;
    gap: 8px;
  }

  .filter-group,
  .filter-btn {
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .view-options {
    justify-content: stretch;
  }

  .view-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
