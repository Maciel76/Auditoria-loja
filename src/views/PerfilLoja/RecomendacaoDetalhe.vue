<template>
  <div class="recomendacao-detalhe">
    <div class="detalhe-header">
      <span class="rec-icon">{{ getRecommendationIcon(dados.categoria) }}</span>
      <h3>{{ dados.titulo }}</h3>
      <span class="impact-badge" :class="dados.impacto">{{
        dados.impacto
      }}</span>
    </div>

    <div class="detalhe-body">
      <p class="rec-description">{{ dados.descricao }}</p>

      <div class="rec-metrics">
        <h4>📈 Métricas da Recomendação</h4>
        <div class="metrics-grid">
          <div class="metric-item">
            <span class="metric-label">ROI Estimado</span>
            <span class="metric-value">{{ dados.roi }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Nível de Esforço</span>
            <span class="metric-value" :class="dados.esforço">{{
              dados.esforço
            }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Prazo de Implementação</span>
            <span class="metric-value">{{ dados.prazo }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Custo Estimado</span>
            <span class="metric-value" :class="dados.custo">{{
              dados.custo
            }}</span>
          </div>
        </div>
      </div>

      <div class="rec-benefits">
        <h4>🎯 Benefícios Esperados</h4>
        <ul>
          <li v-for="beneficio in beneficios" :key="beneficio">
            {{ beneficio }}
          </li>
        </ul>
      </div>

      <div class="rec-steps">
        <h4>🛠️ Passos para Implementação</h4>
        <ol>
          <li v-for="passo in passos" :key="passo">{{ passo }}</li>
        </ol>
      </div>
    </div>

    <div class="detalhe-footer">
      <button class="btn-primary" @click="implementar">
        🚀 Implementar Recomendação
      </button>
      <button class="btn-outline" @click="agendar">
        📅 Agendar Implementação
      </button>
      <button class="btn-outline" @click="compartilhar">📤 Compartilhar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecomendacaoDetalhe",
  props: {
    dados: Object,
  },
  data() {
    return {
      beneficios: [
        "Aumento da produtividade da equipe",
        "Redução de custos operacionais",
        "Melhoria na qualidade dos dados",
        "Otimização do tempo de auditoria",
      ],
      passos: [
        "Realizar análise de viabilidade",
        "Alocar recursos necessários",
        "Treinar equipe envolvida",
        "Implementar em ambiente controlado",
        "Monitorar resultados e ajustar",
      ],
    };
  },
  methods: {
    getRecommendationIcon(categoria) {
      const icons = {
        processo: "🔄",
        tecnologia: "💻",
        treinamento: "🎓",
        estrategia: "🎯",
      };
      return icons[categoria] || "💡";
    },
    implementar() {
      console.log("Implementar recomendação:", this.dados);
      // Lógica para implementar
    },
    agendar() {
      console.log("Agendar recomendação:", this.dados);
      // Lógica para agendar
    },
    compartilhar() {
      console.log("Compartilhar recomendação:", this.dados);
      // Lógica para compartilhar
    },
  },
};
</script>

<style scoped>
.recomendacao-detalhe {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.detalhe-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 25px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  color: white;
}

.rec-icon {
  font-size: 2.5em;
}

.detalhe-header h3 {
  margin: 0;
  flex: 1;
  font-size: 1.5em;
}

.impact-badge {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.2);
}

.impact-badge.alto {
  background: rgba(16, 185, 129, 0.8);
}
.impact-badge.médio {
  background: rgba(245, 158, 11, 0.8);
}
.impact-badge.baixo {
  background: rgba(156, 163, 175, 0.8);
}

.detalhe-body {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.rec-description {
  font-size: 1.1em;
  line-height: 1.6;
  color: #6b7280;
  margin: 0;
}

.rec-metrics h4,
.rec-benefits h4,
.rec-steps h4 {
  margin: 0 0 20px 0;
  color: #374151;
  font-size: 1.3em;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 15px;
  border: 1px solid #e5e7eb;
  text-align: center;
}

.metric-label {
  font-size: 0.9em;
  color: #6b7280;
  margin-bottom: 10px;
}

.metric-value {
  font-size: 1.3em;
  font-weight: 700;
  color: #1f2937;
}

.metric-value.baixo {
  color: #10b981;
}
.metric-value.médio {
  color: #eab308;
}
.metric-value.alto {
  color: #ef4444;
}

.rec-benefits ul,
.rec-steps ol {
  margin: 0;
  padding-left: 20px;
  color: #6b7280;
  line-height: 1.6;
}

.rec-benefits li,
.rec-steps li {
  margin-bottom: 10px;
}

.detalhe-footer {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.btn-primary,
.btn-outline {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-outline {
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}
</style>
