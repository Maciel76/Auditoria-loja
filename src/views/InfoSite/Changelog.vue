<template>
  <div class="changelog">
    <div class="header">
      <h1>Histórico de Versões</h1>
      <p>Acompanhe as últimas atualizações e melhorias do sistema.</p>
    </div>

    <div class="timeline">
      <div
        v-for="version in versions"
        :key="version.version"
        class="timeline-item"
      >
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="version-header">
            <h2>{{ version.version }} - {{ version.title }}</h2>
            <span class="version-date">{{ version.date }}</span>
          </div>
          <ul class="changes-list">
            <li
              v-for="(change, index) in version.changes"
              :key="index"
              class="change-item"
            >
              <span class="change-icon">{{ getChangeIcon(change.type) }}</span>
              <span class="change-text">{{ change.description }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Changelog",
  data() {
    return {
      versions: [
        {
          version: "v1.1.0",
          title: "Melhorias e Correções",
          date: "Em Breve",
          changes: [
            {
              type: "improvement",
              description: "Melhoria na performance do mapa de calor.",
            },
            {
              type: "fix",
              description: "Correção de bugs na importação de dados.",
            },
            {
              type: "feature",
              description: "Adição de novas visualizações de dados.",
            },
          ],
        },
        {
          version: "v1.0.0",
          title: "Lançamento Inicial",
          date: "15 de Dezembro de 2025",
          changes: [
            {
              type: "feature",
              description: "Lançamento inicial do sistema de auditoria.",
            },
            {
              type: "feature",
              description:
                "Funcionalidades de upload de planilhas e visualização de dados.",
            },
            {
              type: "feature",
              description: "Dashboard com estatísticas gerais.",
            },
            {
              type: "feature",
              description: "Filtros por data, local, status e produto.",
            },
            {
              type: "feature",
              description: "Exportação de relatórios em CSV.",
            },
          ],
        },
      ],
    };
  },
  methods: {
    getChangeIcon(type) {
      const icons = {
        feature: "✨", // Novidade
        fix: "🐛", // Correção de bug
        improvement: "🚀", // Melhoria
      };
      return icons[type] || "➡️";
    },
  },
};
</script>

<style scoped>
.changelog {
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

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.version-date {
  font-size: 0.9rem;
  font-weight: 500;
  color: #7f8c8d;
  background-color: #f1f3f5;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.changes-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.change-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: #555;
  line-height: 1.6;
}

.change-icon {
  font-size: 1.1rem;
  margin-top: 2px;
}
</style>
