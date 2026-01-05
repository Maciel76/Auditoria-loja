<template>
  <div class="ranking-info">
    <div class="header">
      <h1>Entendendo o Ranking de Lojas</h1>
      <p>
        Descubra como a pontuação é calculada e como sua loja pode chegar ao
        topo!
      </p>
    </div>

    <div class="explanation-grid">
      <div
        v-for="criterion in criteria"
        :key="criterion.title"
        class="info-card"
      >
        <div class="info-icon">{{ criterion.icon }}</div>
        <h3 class="info-title">{{ criterion.title }}</h3>
        <p class="info-description" v-html="criterion.description"></p>
      </div>
    </div>

    <div class="summary-section">
      <h2>Resumindo:</h2>
      <p>
        O ranking é um reflexo do <strong>desempenho consistente</strong>, da
        <strong>qualidade do trabalho</strong> e do
        <strong>engajamento da equipe</strong>. Lojas que se destacam em todas
        essas áreas naturalmente sobem na classificação. Boa sorte!
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComoFuncionaRanking",
  data() {
    return {
      criteria: [
        {
          icon: "🎯",
          title: "Pontuação Base: Desempenho",
          description:
            "A maior parte da pontuação vem da <strong>taxa de conclusão</strong> das auditorias (etiqueta e presença). Quanto mais itens forem verificados em relação ao total, maior a pontuação.",
        },
        {
          icon: "✨",
          title: "Bônus de Qualidade e Precisão",
          description:
            "Auditorias realizadas com alta precisão, como as que geram a conquista <strong>'Mira Certa'</strong>, adicionam pontos extras. Menos erros significam mais pontos.",
        },
        {
          icon: "🔄",
          title: "Fator de Consistência",
          description:
            "Manter um bom desempenho por vários dias consecutivos, como na conquista <strong>'Fôlego de Aço'</strong>, aplica um multiplicador à sua pontuação. A regularidade é recompensada!",
        },
        {
          icon: "👥",
          title: "Engajamento da Equipe",
          description:
            "O número de <strong>colaboradores ativos</strong> e o trabalho em equipe, refletido em conquistas como <strong>'Dupla Dinâmica'</strong>, também contribuem para a pontuação final da loja.",
        },
      ],
    };
  },
};
</script>

<style scoped>
.ranking-info {
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

.explanation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
  text-align: center;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
}

.info-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  line-height: 1;
}

.info-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 0.75rem;
}

.info-description {
  font-size: 1rem;
  line-height: 1.7;
  color: #555;
}

.summary-section {
  max-width: 800px;
  margin: 4rem auto 2rem;
  padding: 2rem;
  background-color: #eaf5fc;
  border-left: 5px solid #3498db;
  border-radius: 8px;
}

.summary-section h2 {
  margin-top: 0;
  color: #2c3e50;
}

.summary-section p {
  line-height: 1.7;
  color: #34495e;
  font-size: 1.1rem;
}
</style>
