<template>
  <div class="perfil-navegacao">
    <div class="nav-tabs">
      <button
        class="nav-tab"
        :class="{ active: abaAtiva === 'conquistas' }"
        @click="$emit('mudar-aba', 'conquistas')"
      >
        <i class="fas fa-trophy"></i>
        <span>Conquistas</span>
      </button>
      <button
        class="nav-tab"
        :class="{ active: abaAtiva === 'progresso' }"
        @click="$emit('mudar-aba', 'progresso')"
      >
        <i class="fas fa-bolt"></i>
        <span>Progresso</span>
      </button>
      <button
        class="nav-tab"
        :class="{ active: abaAtiva === 'auditoria' }"
        @click="$emit('mudar-aba', 'auditoria')"
      >
        <i class="fas fa-clipboard-check"></i>
        <span>Auditoria</span>
      </button>
      <button
        class="nav-tab"
        :class="{ active: abaAtiva === 'tarefas' }"
        @click="$emit('mudar-aba', 'tarefas')"
      >
        <i class="fas fa-tasks"></i>
        <span>Tarefas</span>
      </button>
      <button
        class="nav-tab"
        :class="{ active: abaAtiva === 'colegas' }"
        @click="$emit('mudar-aba', 'colegas')"
      >
        <i class="fas fa-users"></i>
        <span>Colegas</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  abaAtiva: {
    type: String,
    default: "conquistas",
  },
});

defineEmits(["mudar-aba"]);
</script>

<style scoped>
.perfil-navegacao {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  position: sticky;
  top: 20px;
  z-index: 100;
  transition: all 0.3s ease;
}

.nav-tabs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-tab {
  flex: 1;
  min-width: 120px;
  padding: 0.7rem 1rem;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-family: "Poppins", sans-serif;
  flex-direction: row;
}

.nav-tab i {
  font-size: 0.95rem;
}

.nav-tab:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.nav-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.nav-tab.active:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

/* Mobile responsivo */
@media (max-width: 768px) {
  .perfil-navegacao {
    border-radius: 12px;
    padding: 0.75rem;
    margin-bottom: 1rem;
    top: 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  .nav-tabs {
    gap: 0.4rem;
  }

  .nav-tab {
    min-width: auto;
    padding: 0.6rem 0.75rem;
    font-size: 0.75rem;
    flex-direction: row;
    gap: 0.3rem;
  }

  .nav-tab i {
    font-size: 0.85rem;
  }

  .nav-tab span {
    font-size: 0.75rem;
  }
}

/* Mobile pequeno */
@media (max-width: 480px) {
  .nav-tab {
    padding: 0.5rem 0.6rem;
    min-width: 80px;
  }

  .nav-tab i {
    font-size: 0.8rem;
  }

  .nav-tab span {
    font-size: 0.65rem;
  }
}
</style>
