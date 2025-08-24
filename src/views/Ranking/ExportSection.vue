<template>
  <div class="export-section">
    <button @click="$emit('exportarRanking')" class="export-btn">
      <span class="icon">📤</span> Exportar Ranking
    </button>
  </div>
</template>

<script>
export default {
  name: "ExportSection",
  emits: ["exportarRanking"],
};
</script>

<style scoped>
.export-section {
  text-align: center;
  margin: 40px 0;
}

.export-btn {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
}

.export-btn:hover {
  transform: translateY(-2px);
}
</style>
