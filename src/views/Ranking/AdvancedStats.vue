<template>
  <div class="advanced-stats">
    <h2 class="section-title">Estatísticas Detalhadas</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <span class="icon">👔</span>
        </div>
        <h3>Top Performer</h3>
        <p class="stat-value">{{ topPerformer.nome }}</p>
        <p class="stat-label">{{ topPerformer.contador }} itens verificados</p>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <span class="icon">⚡</span>
        </div>
        <h3>Maior Média</h3>
        <p class="stat-value">{{ mediaItensPorUsuario }} itens/colaborador</p>
        <p class="stat-label">Desempenho médio da equipe</p>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <span class="icon">🎯</span>
        </div>
        <h3>Meta Coletiva</h3>
        <p class="stat-value">{{ totalItensLidos }} itens</p>
        <p class="stat-label">Total verificado pelo time</p>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <span class="icon">📈</span>
        </div>
        <h3>Eficiência</h3>
        <p class="stat-value">{{ percentualAboveAverage }}%</p>
        <p class="stat-label">Acima da média</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdvancedStats",
  props: {
    topPerformer: {
      type: Object,
      default: () => ({ nome: "N/A", contador: 0 }),
    },
    mediaItensPorUsuario: {
      type: Number,
      default: 0,
    },
    totalItensLidos: {
      type: Number,
      default: 0,
    },
    percentualAboveAverage: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped>
.advanced-stats {
  margin: 40px 0;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  color: #2c3e50;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin: 0 auto 15px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 10px 0;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
}
</style>
