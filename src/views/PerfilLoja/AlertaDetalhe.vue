<template>
  <div class="alerta-detalhe">
    <div class="detalhe-header" :class="'severity-' + dados.severidade">
      <span class="alert-icon">{{ getAlertIcon(dados.tipo) }}</span>
      <h3>{{ dados.titulo }}</h3>
      <span class="severity-badge" :class="dados.severidade">{{
        dados.severidade
      }}</span>
    </div>

    <div class="detalhe-body">
      <p class="alert-description">{{ dados.descricao }}</p>

      <div class="alert-metrics">
        <h4>Métricas Afetadas</h4>
        <div class="metrics-grid">
          <div
            v-for="metric in dados.metricas"
            :key="metric.nome"
            class="metric-item"
          >
            <span class="metric-name">{{ metric.nome }}</span>
            <span class="metric-value" :class="getValueClass(metric.valor)">{{
              metric.valor
            }}</span>
          </div>
        </div>
      </div>

      <div class="alert-context">
        <h4>Contexto</h4>
        <p>
          Este alerta foi gerado com base em anomalias detectadas nos dados de
          auditoria. Recomenda-se uma investigação profunda para identificar as
          causas raízes.
        </p>
      </div>
    </div>

    <div class="detalhe-footer">
      <button class="btn-primary" @click="investigar">
        🔍 Investigar Alerta
      </button>
      <button class="btn-outline" @click="ignorar">❌ Ignorar</button>
      <button class="btn-outline" @click="criarTarefa">📋 Criar Tarefa</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AlertaDetalhe",
  props: {
    dados: Object,
  },
  methods: {
    getAlertIcon(tipo) {
      const icons = {
        performance: "⚡",
        ruptura: "💰",
        oportunidade: "💡",
        qualidade: "🎯",
        usuario: "👥",
      };
      return icons[tipo] || "⚠️";
    },
    getValueClass(valor) {
      if (typeof valor === "string" && valor.includes("-")) return "negative";
      if (typeof valor === "string" && valor.includes("+")) return "positive";
      return "";
    },
    investigar() {
      console.log("Investigar alerta:", this.dados);
      // Lógica para investigar o alerta
    },
    ignorar() {
      console.log("Ignorar alerta:", this.dados);
      // Lógica para ignorar o alerta
    },
    criarTarefa() {
      console.log("Criar tarefa para alerta:", this.dados);
      // Lógica para criar tarefa
    },
  },
};
</script>

<style scoped>
.alerta-detalhe {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detalhe-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border-radius: 15px;
  color: white;
}

.detalhe-header.severity-critica {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}
.detalhe-header.severity-alta {
  background: linear-gradient(135deg, #f97316, #ea580c);
}
.detalhe-header.severity-media {
  background: linear-gradient(135deg, #eab308, #ca8a04);
}
.detalhe-header.severity-baixa {
  background: linear-gradient(135deg, #84cc16, #65a30d);
}

.alert-icon {
  font-size: 2em;
}

.detalhe-header h3 {
  margin: 0;
  flex: 1;
}

.severity-badge {
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.2);
}

.detalhe-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.alert-description {
  font-size: 1.1em;
  line-height: 1.6;
  color: #6b7280;
}

.alert-metrics h4,
.alert-context h4 {
  margin: 0 0 15px 0;
  color: #374151;
  font-size: 1.2em;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.metric-name {
  color: #6b7280;
  font-weight: 500;
}

.metric-value {
  font-weight: 700;
  font-size: 1.1em;
}

.metric-value.positive {
  color: #10b981;
}
.metric-value.negative {
  color: #ef4444;
}

.alert-context p {
  margin: 0;
  line-height: 1.6;
  color: #6b7280;
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
