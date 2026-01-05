<template>
  <div class="documentacao">
    <div class="header">
      <h1>Documentação do Sistema</h1>
      <p>
        Bem-vindo à documentação oficial. Aqui você encontrará informações
        detalhadas sobre as funcionalidades do sistema de Auditoria de Lojas.
      </p>
    </div>

    <div class="features-grid">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="feature-card"
      >
        <div class="feature-icon">{{ feature.icon }}</div>
        <h3 class="feature-title">{{ feature.title }}</h3>
        <p class="feature-description">{{ feature.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Documentacao",
  data() {
    return {
      features: [
        {
          icon: "📥",
          title: "Importação de Dados",
          description:
            "Importe dados de auditoria via planilhas CSV. Acesse a tela de upload, selecione o arquivo e processe as informações rapidamente.",
        },
        {
          icon: "📊",
          title: "Dashboard de Estatísticas",
          description:
            "Visualize o progresso da auditoria e o desempenho da equipe em tempo real, com gráficos de conformidade e produtividade.",
        },
        {
          icon: "🔍",
          title: "Filtros Avançados",
          description:
            "Filtre os dados por data, loja, status e produto para uma análise detalhada e focada, encontrando exatamente o que você precisa.",
        },
        {
          icon: "📤",
          title: "Exportação de Relatórios",
          description:
            "Exporte os dados filtrados para um arquivo CSV. Ideal para compartilhar resultados ou para análises em outras ferramentas.",
        },
        {
          icon: "🗺️",
          title: "Mapa de Calor dos Setores",
          description:
            "Identifique visualmente os setores com maior incidência de problemas, ajudando a focar os esforços onde é mais necessário.",
        },
        {
          icon: "👥",
          title: "Acompanhamento de Colaboradores",
          description:
            "Monitore o desempenho individual dos colaboradores, visualizando o número de auditorias realizadas e o progresso geral.",
        },
      ],
    };
  },
};
</script>

<style scoped>
.documentacao {
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
  max-width: 700px;
  margin: 0.5rem auto 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
  border-top: 4px solid #3498db;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 0.75rem;
}

.feature-description {
  font-size: 1rem;
  line-height: 1.7;
  color: #555;
}
</style>
