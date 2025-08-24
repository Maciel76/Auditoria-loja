<template>
  <div class="faltantes-section">
    <h2 class="section-title">⚠️ Itens com Baixo Estoque</h2>
    <div class="faltantes-grid">
      <div
        v-for="item in itensFaltantes.slice(0, 6)"
        :key="item.Código"
        class="faltante-card"
      >
        <div class="faltante-header">
          <span class="faltante-codigo">{{ item.Código }}</span>
          <span class="faltante-alerta">⚠️</span>
        </div>
        <h4 class="faltante-nome">{{ item.Produto }}</h4>
        <div class="faltante-details">
          <div class="detail">
            <span class="icon">📦</span>
            <span>Estoque: {{ item["Estoque atual"] }}</span>
          </div>
          <div class="detail">
            <span class="icon">📍</span>
            <span>{{ item.Local }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItensFaltantes",
  props: {
    itensFaltantes: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
/* Copiar os estilos relacionados a itens faltantes do arquivo original */
.faltantes-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.faltantes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.faltante-card {
  background: #fff9db;
  border: 2px solid #ffd43b;
  border-radius: 12px;
  padding: 15px;
  transition: all 0.3s ease;
}

.faltante-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 212, 59, 0.3);
}

.faltante-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.faltante-codigo {
  font-weight: 600;
  color: #2c3e50;
}

.faltante-alerta {
  font-size: 1.2rem;
}

.faltante-nome {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1rem;
}

.faltante-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.faltante-details .detail {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #7f8c8d;
}
</style>
