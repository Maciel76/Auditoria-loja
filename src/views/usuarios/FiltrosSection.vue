<template>
  <div class="filtros-section">
    <div class="search-box">
      <i class="fas fa-search"></i>
      <input
        type="text"
        :value="filtro"
        @input="$emit('update:filtro', $event.target.value)"
        placeholder="Buscar por nome ou matrícula..."
        class="search-input"
      />
    </div>

    <div class="filtro-data">
      <label>Filtrar por data:</label>
      <select
        :value="dataFiltro"
        @change="$emit('update:dataFiltro', $event.target.value)"
      >
        <option value="">Todas as datas</option>
        <option v-for="data in datasAuditoria" :key="data" :value="data">
          {{ formatarData(data) }}
        </option>
      </select>
    </div>

    <div class="actions">
      <button @click="$emit('carregar-dados')" class="btn btn-refresh">
        <i class="fas fa-sync-alt"></i> Atualizar
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  filtro: String,
  dataFiltro: String,
  datasAuditoria: Array,
});

defineEmits(["update:filtro", "update:dataFiltro", "carregar-dados"]);

const formatarData = (dataString) => {
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR");
};
</script>

<style scoped>
.filtros-section {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-input {
  width: 100%;
  padding: 12px 20px 12px 45px;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.filtro-data {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filtro-data label {
  font-weight: bold;
}

.filtro-data select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-refresh {
  background: #17a2b8;
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .search-box {
    min-width: 100%;
  }
}
</style>
