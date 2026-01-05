<template>
  <div class="tutorias">
    <div class="header">
      <h1>Tutoriais em Vídeo e Texto</h1>
      <p>
        Aprenda a usar o sistema de Auditoria de Lojas com nossos guias passo a
        passo.
      </p>
    </div>

    <div class="tutorials-section">
      <div
        v-for="(tutorial, index) in tutorials"
        :key="index"
        class="tutorial-card"
      >
        <div class="tutorial-header" @click="toggleTutorial(index)">
          <div class="tutorial-info">
            <h2>{{ tutorial.title }}</h2>
            <p>{{ tutorial.description }}</p>
          </div>
          <span
            class="tutorial-icon"
            :class="{ 'is-open': activeIndex === index }"
          >
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

        <div v-if="activeIndex === index" class="tutorial-content">
          <div class="video-container">
            <iframe
              :src="'https://www.youtube.com/embed/' + tutorial.videoId"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <ol class="steps-list">
            <li v-for="(step, i) in tutorial.steps" :key="i" class="step-item">
              <strong>{{ step.title }}</strong>
              <p v-if="step.text" v-html="step.text"></p>
              <code v-if="step.code" v-html="step.code"></code>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tutorias",
  data() {
    return {
      activeIndex: null,
      tutorials: [
        {
          title: "Como Iniciar o Sistema Localmente",
          description:
            "Aprenda a configurar e rodar o ambiente de desenvolvimento no seu computador.",
          videoId: "p_I07j2gE-c", // Substitua pelo ID do seu vídeo no YouTube
          steps: [
            {
              title: "1. Pré-requisitos",
              text: "Certifique-se de ter <strong>Node.js (v18+)</strong>, <strong>npm</strong>, <strong>MongoDB</strong> e <strong>Git</strong> instalados.",
            },
            {
              title: "2. Clonar os Repositórios",
              text: "Abra o terminal e clone os projetos do frontend e backend:",
              code: `git clone https://github.com/Maciel76/Auditoria-loja.git<br>git clone https://github.com/Maciel76/Backend-auditoria-loja.git`,
            },
            {
              title: "3. Instalar Dependências",
              text: "Navegue até a pasta de cada projeto e instale as dependências:",
              code: `cd Backend-auditoria-loja && npm install<br><br># Em outro terminal<br>cd Auditoria-loja && npm install`,
            },
            {
              title: "4. Iniciar o Backend",
              text: "Certifique-se de que o MongoDB está rodando. Em seguida, inicie o servidor:",
              code: `cd Backend-auditoria-loja && node server.js`,
            },
            {
              title: "5. Iniciar o Frontend",
              text: "No terminal do frontend, inicie o servidor de desenvolvimento:",
              code: `cd Auditoria-loja && npm run dev`,
            },
            {
              title: "6. Acessar o Sistema",
              text: `Abra seu navegador e acesse <a href="http://localhost:5173" target="_blank">http://localhost:5173</a> para usar o sistema.`,
            },
          ],
        },
        // Você pode adicionar mais tutoriais aqui
      ],
    };
  },
  methods: {
    toggleTutorial(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },
  },
};
</script>

<style scoped>
.tutorias {
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

.tutorial-section {
  max-width: 900px;
  margin: 2rem auto;
}

.tutorial-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.tutorial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  cursor: pointer;
}

.tutorial-info h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #34495e;
}

.tutorial-info p {
  margin: 0.25rem 0 0;
  color: #7f8c8d;
}

.tutorial-icon {
  color: #7f8c8d;
  transition: transform 0.3s ease;
}

.tutorial-icon.is-open {
  transform: rotate(180deg);
  color: #3498db;
}

.tutorial-content {
  padding: 0 2rem 2rem;
  border-top: 1px solid #f0f0f0;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  margin: 2rem 0;
  border-radius: 8px;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.steps-list {
  list-style: none;
  padding-left: 0;
}

.step-item {
  margin-bottom: 2rem;
  line-height: 1.7;
  color: #555;
}

.step-item strong {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 0.5rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

code {
  background-color: #2d3748;
  color: #e2e8f0;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: block;
  margin-top: 0.75rem;
  font-family: "Fira Code", "Courier New", Courier, monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>
