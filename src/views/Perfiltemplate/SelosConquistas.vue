<template>
  <div class="selos-section">
    <h2 class="section-title">🏆 Conquistas e Selos</h2>
    <div class="selos-grid">
      <div
        v-for="selo in selosAtualizados"
        :key="selo.id"
        :class="['selo-card', { desbloqueado: selo.desbloqueado }]"
      >
        <div class="selo-icon">
          <span class="icon">{{ selo.icone }}</span>
        </div>
        <div class="selo-info">
          <h3>{{ selo.nome }}</h3>
          <p>{{ selo.descricao }}</p>
        </div>
        <div class="selo-status">
          <span v-if="selo.desbloqueado" class="desbloqueado"
            >✅ Desbloqueado</span
          >
          <span v-else class="bloqueado">🔒 Bloqueado</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelosConquistas",
  props: {
    selos: {
      type: Array,
      required: true,
    },
    usuario: {
      type: Object,
      required: true,
    },
    corredoresUnicos: {
      type: Array,
      default: () => [],
    },
    mediaGeral: {
      type: Number,
      default: 0,
    },
    itensFaltantes: {
      type: Array,
      default: () => [],
    },
    atividadesRecentes: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    selosAtualizados() {
      return this.selos.map((selo) => ({
        ...selo,
        desbloqueado: selo.condicao(
          this.usuario,
          this.corredoresUnicos,
          this.mediaGeral,
          this.itensFaltantes,
          this.atividadesRecentes
        ),
      }));
    },
  },
};
</script>

<style scoped>
/* Copiar os estilos relacionados a selos do arquivo original */
.selos-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.selos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.selo-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
  border-left: 4px solid #dee2e6;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
}

.selo-card.desbloqueado {
  background: linear-gradient(135deg, #fff9db 0%, #ffec99 100%);
  border-left-color: #ffd43b;
}

.selo-icon {
  font-size: 2.5rem;
}

.selo-info {
  flex: 1;
}

.selo-info h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.selo-info p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.selo-status {
  font-size: 0.9rem;
}

.desbloqueado {
  color: #51cf66;
  font-weight: 600;
}

.bloqueado {
  color: #868e96;
}
</style>
