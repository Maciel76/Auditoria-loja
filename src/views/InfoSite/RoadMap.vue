<template>
  <div class="roadmap">
    <div class="header">
      <h1>Roadmap do Projeto</h1>
      <p>
        Acompanhe nossos planos para o futuro do sistema de Auditoria de Lojas.
      </p>
    </div>

    <div class="timeline">
      <div v-for="item in roadmapItems" :key="item.title" class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="roadmap-header">
            <span class="roadmap-icon">{{ item.icon }}</span>
            <div>
              <h2>{{ item.title }}</h2>
              <span class="roadmap-timeframe">{{ item.timeframe }}</span>
            </div>
          </div>
          <ul class="features-list">
            <li
              v-for="(feature, index) in item.features"
              :key="index"
              class="feature-item"
            >
              <strong>{{ feature.title }}:</strong> {{ feature.description }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoadMap",
  data() {
    return {
      roadmapItems: [
        {
          title: "Curto Prazo",
          timeframe: "Próximos 3 meses",
          icon: "🕒",
          features: [
            {
              title: "Melhorias na UI",
              description:
                "Refinamento do design do dashboard e das páginas de visualização de dados.",
            },
            {
              title: "Notificações em Tempo Real",
              description:
                "Implementação de notificações para alertar sobre novas auditorias ou problemas críticos.",
            },
            {
              title: "Testes Automatizados",
              description:
                "Aumento da cobertura de testes para garantir a estabilidade do sistema.",
            },
          ],
        },
        {
          title: "Médio Prazo",
          timeframe: "Próximos 6 meses",
          icon: "📅",
          features: [
            {
              title: "Aplicativo Móvel",
              description:
                "Desenvolvimento de um aplicativo (Android e iOS) para facilitar a auditoria em campo.",
            },
            {
              title: "Integração com Sistemas",
              description:
                "Possibilidade de integração com sistemas de ERP e outros softwares de gestão.",
            },
            {
              title: "Relatórios Personalizados",
              description:
                "Ferramenta para criar relatórios com gráficos e tabelas customizáveis.",
            },
          ],
        },
        {
          title: "Longo Prazo",
          timeframe: "Próximo ano",
          icon: "🔭",
          features: [
            {
              title: "Inteligência Artificial",
              description:
                "Uso de IA para prever tendências e sugerir ações corretivas com base nos dados.",
            },
            {
              title: "Gamificação",
              description:
                "Introdução de elementos de gamificação para engajar colaboradores e aumentar a produtividade.",
            },
            {
              title: "Suporte Multi-idioma",
              description:
                "Adaptação da interface do sistema para múltiplos idiomas.",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped>
.roadmap {
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.header p {
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0.5rem auto 0;
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: 2rem auto;
  padding-left: 2rem;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #e9ecef;
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 2.5rem;
}

h2 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #34495e;
  margin: 0;
}

.timeline-marker {
  position: absolute;
  left: -2rem;
  top: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #3498db;
  border: 4px solid #f8f9fa;
  z-index: 1;
}

.timeline-content {
  background-color: #ffffff;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
  position: relative;
}

.roadmap-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.roadmap-icon {
  font-size: 2rem;
}

.roadmap-timeframe {
  font-size: 0.9rem;
  font-weight: 500;
  color: #7f8c8d;
}

.features-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  padding: 0.75rem 0;
  color: #555;
  line-height: 1.7;
  border-bottom: 1px solid #f0f0f0;
}

.feature-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.feature-item strong {
  color: #34495e;
}
</style>
