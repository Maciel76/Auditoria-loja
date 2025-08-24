<template>
  <div class="ranking-controls">
    <div class="search-container">
      <span class="icon">🔍</span>
      <input
        :value="filtro"
        @input="$emit('update:filtro', $event.target.value)"
        type="text"
        placeholder="Buscar colaborador..."
        class="search-input"
      />
    </div>

    <div class="filters-container">
      <!-- Filtro por Tipo de Auditoria -->
      <div class="filter-group">
        <label class="filter-label">Tipo:</label>
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
        <label class="filter-label">Período:</label>
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
        <span class="icon">🔄</span> Atualizar
      </button>
    </div>

    <div class="view-options">
      <button
        @click="$emit('update:viewMode', 'podium')"
        :class="['view-btn', { active: viewMode === 'podium' }]"
      >
        <span class="icon">🏅</span> Pódio
      </button>
      <button
        @click="$emit('update:viewMode', 'all')"
        :class="['view-btn', { active: viewMode === 'all' }]"
      >
        <span class="icon">📋</span> Todos
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-container .icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-input {
  width: 100%;
  padding: 12px 20px 12px 45px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.filters-container {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
}

.filter-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
}

.view-options {
  display: flex;
  gap: 10px;
}

.view-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

@media (max-width: 768px) {
  .ranking-controls {
    flex-direction: column;
  }

  .search-container {
    min-width: 100%;
  }

  .filters-container {
    justify-content: center;
    width: 100%;
  }
}
</style>
