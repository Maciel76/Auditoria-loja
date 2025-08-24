<template>
  <div class="actions-section">
    <button class="action-btn primary" @click="$emit('exportarRelatorio')">
      <span class="icon">📊</span> Exportar Relatório
    </button>
    <button class="action-btn secondary" @click="$emit('compartilharPerfil')">
      <span class="icon">📤</span> Compartilhar Perfil
    </button>
  </div>
</template>

<script>
export default {
  name: "BotoesAcao",
  emits: ["exportarRelatorio", "compartilharPerfil"],
};
</script>

<style scoped>
/* Copiar os estilos relacionados aos botões de ação do arquivo original */
.actions-section {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.secondary {
  background: #e9ecef;
  color: #495057;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .actions-section {
    flex-direction: column;
  }
}
</style>
