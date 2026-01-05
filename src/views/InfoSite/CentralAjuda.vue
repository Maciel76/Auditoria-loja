<template>
  <div class="central-ajuda">
    <div class="header">
      <h1>Central de Ajuda</h1>
      <p>
        Encontre respostas para as perguntas mais frequentes sobre o sistema de
        Auditoria de Lojas.
      </p>
    </div>

    <div class="faq-section">
      <div v-for="(item, index) in faqItems" :key="index" class="faq-item">
        <div class="faq-question" @click="toggleFaq(index)">
          <h2>{{ item.question }}</h2>
          <span class="faq-icon" :class="{ 'is-open': activeIndex === index }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>
        <div v-if="activeIndex === index" class="faq-answer">
          <p>{{ item.answer }}</p>
          <ol v-if="item.steps">
            <li v-for="(step, i) in item.steps" :key="i">{{ step }}</li>
          </ol>
          <p v-if="item.details">{{ item.details }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CentralAjuda",
  data() {
    return {
      activeIndex: null, // Controla qual item do FAQ está aberto
      faqItems: [
        {
          question: "O que é este sistema?",
          answer:
            "Este sistema é uma aplicação web para auditoria em lojas, permitindo o controle, análise e monitoramento de produtos, colaboradores e locais auditados. O usuário pode visualizar estatísticas, filtrar dados por data, local, status e produto, exportar relatórios e acompanhar o progresso da auditoria.",
        },
        {
          question: "Quais tecnologias são utilizadas?",
          answer:
            "O frontend é construído com Vue.js e Vite. Para as requisições HTTP, utilizamos Axios. O backend é desenvolvido em Node.js com Express e MongoDB como banco de dados.",
        },
        {
          question: "Como posso rodar o projeto localmente?",
          answer:
            "Para rodar o projeto localmente, você precisa ter Node.js, npm, MongoDB e Git instalados. Siga os passos abaixo:",
          steps: [
            "Clone os repositórios do frontend e backend.",
            "Instale as dependências de cada um com `npm install`.",
            "Inicie o servidor do backend com `node server.js`.",
            "Inicie o servidor do frontend com `npm run dev`.",
            "Acesse o sistema em `http://localhost:5173`.",
          ],
          details: "Para mais detalhes, consulte a documentação completa.",
        },
      ],
    };
  },
  methods: {
    toggleFaq(index) {
      // Se o item clicado já estiver aberto, fecha-o. Caso contrário, abre o novo item.
      this.activeIndex = this.activeIndex === index ? null : index;
    },
  },
};
</script>

<style scoped>
.central-ajuda {
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
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

.faq-section {
  max-width: 800px;
  margin: 2rem auto;
}

.faq-item {
  margin-bottom: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

h2 {
  font-size: 1.2rem;
  font-weight: 500;
  color: #34495e;
  margin: 0;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
}

.faq-icon {
  color: #7f8c8d;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.faq-icon.is-open {
  transform: rotate(180deg);
  color: #3498db;
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: #555;
  line-height: 1.7;
  border-top: 1px solid #f0f0f0;
}

.faq-answer ol {
  padding-left: 20px;
  margin-top: 1rem;
}

.faq-answer li {
  margin-bottom: 0.5rem;
}
</style>
