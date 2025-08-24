<template>
  <div class="timeline-section">
    <h2 class="section-title">⏰ Atividades Recentes</h2>
    <div class="timeline">
      <div
        v-for="(atividade, index) in atividadesRecentes"
        :key="index"
        class="timeline-item"
      >
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <h4>{{ atividade.descricao }}</h4>
          <p class="timeline-time">
            {{ formatarTempo(atividade.timestamp) }}
          </p>
          <p class="timeline-details" v-if="atividade.detalhes">
            {{ atividade.detalhes }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimelineAtividades",
  props: {
    atividadesRecentes: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatarTempo(timestamp) {
      const agora = new Date();
      const diferenca = agora - timestamp;
      const horas = Math.floor(diferenca / (1000 * 60 * 60));

      if (horas < 1) return "Há poucos minutos";
      if (horas === 1) return "Há 1 hora";
      if (horas < 24) return `Há ${horas} horas`;

      const dias = Math.floor(horas / 24);
      if (dias === 1) return "Há 1 dia";
      return `Há ${dias} dias`;
    },
  },
};
</script>

<style scoped>
/* Copiar os estilos relacionados a timeline do arquivo original */
.timeline-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e9ecef;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-marker {
  position: absolute;
  left: -30px;
  top: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  border: 3px solid white;
  box-shadow: 0 0 0 3px #667eea;
}

.timeline-content {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
}

.timeline-content h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.timeline-time {
  margin: 0 0 5px 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.timeline-details {
  margin: 0;
  color: #495057;
  font-size: 0.9rem;
}
</style>
