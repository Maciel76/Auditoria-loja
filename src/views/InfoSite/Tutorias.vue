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
              allow="
                accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture;
              "
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
              text: `Abra seu navegador e acesse <a href="https://auditorias.site" target="_blank">https://auditorias.site</a> para usar o sistema. Em desenvolvimento local, acesse <code>http://localhost:5173</code>.`,
            },
          ],
        },
        {
          title: "Como Fazer Upload de Planilhas de Auditoria",
          description:
            "Aprenda a enviar planilhas de etiquetas, rupturas e presenças para processamento.",
          videoId: "dQw4w9WgXcQ", // Substitua pelo ID do seu vídeo no YouTube
          steps: [
            {
              title: "1. Acessar a página de upload",
              text: "Navegue até a página de upload no menu principal do sistema.",
            },
            {
              title: "2. Selecionar o tipo de auditoria",
              text: "Escolha entre etiquetas, rupturas ou presenças.",
            },
            {
              title: "3. Selecionar o arquivo",
              text: "Clique no botão para selecionar o arquivo Excel ou CSV.",
            },
            {
              title: "4. Confirmar o upload",
              text: "Verifique os dados e clique em enviar para processar a planilha.",
            },
            {
              title: "5. Monitorar o processamento",
              text: "Acompanhe o progresso do processamento na tela de status.",
            },
          ],
        },
        {
          title: "Como Visualizar Métricas e Rankings",
          description:
            "Aprenda a navegar pelas páginas de métricas e rankings para acompanhar o desempenho.",
          videoId: "dQw4w9WgXcQ", // Substitua pelo ID do seu vídeo no YouTube
          steps: [
            {
              title: "1. Acessar o dashboard",
              text: "Navegue até a página de dashboard para ver as métricas principais.",
            },
            {
              title: "2. Explorar os rankings",
              text: "Visualize os rankings por etiquetas, rupturas e presenças.",
            },
            {
              title: "3. Filtrar por período",
              text: "Use os filtros de data para analisar métricas em diferentes períodos.",
            },
            {
              title: "4. Comparar desempenho",
              text: "Compare o desempenho entre diferentes lojas e colaboradores.",
            },
          ],
        },
        {
          title: "Como Utilizar o Sistema de Conquistas",
          description:
            "Descubra como ganhar conquistas e subir de nível no sistema de gamificação.",
          videoId: "dQw4w9WgXcQ", // Substitua pelo ID do seu vídeo no YouTube
          steps: [
            {
              title: "1. Acessar a página de conquistas",
              text: "Navegue até a página de conquistas para ver suas conquistas atuais.",
            },
            {
              title: "2. Ver conquistas pendentes",
              text: "Veja quais conquistas você ainda não desbloqueou.",
            },
            {
              title: "3. Acompanhar progresso",
              text: "Monitore seu progresso em cada conquista específica.",
            },
            {
              title: "4. Subir de nível",
              text: "Ganhe XP para subir de nível e desbloquear novas conquistas.",
            },
          ],
        },
        {
          title: "Como Acessar o Perfil da Loja",
          description:
            "Aprenda a visualizar as métricas e informações específicas de cada loja.",
          videoId: "dQw4w9WgXcQ", // Substitua pelo ID do seu vídeo no YouTube
          steps: [
            {
              title: "1. Navegar até a página de lojas",
              text: "Acesse a lista de lojas disponíveis no sistema.",
            },
            {
              title: "2. Selecionar uma loja",
              text: "Clique na loja desejada para acessar seu perfil.",
            },
            {
              title: "3. Visualizar métricas",
              text: "Veja as métricas consolidadas da loja selecionada.",
            },
            {
              title: "4. Analisar dados históricos",
              text: "Acesse os dados históricos e tendências da loja.",
            },
          ],
        },
        {
          title: "Como Utilizar a Central de Ajuda",
          description:
            "Aprenda a encontrar respostas para perguntas frequentes e obter suporte.",
          videoId: "dQw4w9WgXcQ", // Substitua pelo ID do seu vídeo no YouTube
          steps: [
            {
              title: "1. Acessar a central de ajuda",
              text: "Navegue até a página de central de ajuda no menu.",
            },
            {
              title: "2. Pesquisar perguntas",
              text: "Use a barra de pesquisa para encontrar respostas específicas.",
            },
            {
              title: "3. Navegar pelas categorias",
              text: "Explore as diferentes categorias de perguntas e respostas.",
            },
            {
              title: "4. Entrar em contato",
              text: "Encontre informações de contato para suporte adicional.",
            },
          ],
        },
        {
          title: "Como Acessar e Interpretar Relatórios",
          description:
            "Aprenda a gerar e interpretar relatórios de auditoria e desempenho.",
          videoId: "dQw4w9WgXcQ", // Substitua pelo ID do seu vídeo no YouTube
          steps: [
            {
              title: "1. Acessar a seção de relatórios",
              text: "Navegue até a página de relatórios no menu principal.",
            },
            {
              title: "2. Selecionar tipo de relatório",
              text: "Escolha entre relatórios de desempenho, métricas ou tendências.",
            },
            {
              title: "3. Configurar filtros",
              text: "Aplique filtros de data, loja e tipo de auditoria.",
            },
            {
              title: "4. Gerar e exportar",
              text: "Gere o relatório e exporte em diferentes formatos.",
            },
          ],
        },
        {
          title: "Como Personalizar o Perfil de Usuário",
          description:
            "Aprenda a atualizar suas informações pessoais e preferências no sistema.",
          videoId: "dQw4w9WgXcQ", // Substitua pelo ID do seu vídeo no YouTube
          steps: [
            {
              title: "1. Acessar as configurações",
              text: "Clique no ícone de perfil no canto superior direito.",
            },
            {
              title: "2. Editar informações",
              text: "Atualize seu nome, foto e outras informações pessoais.",
            },
            {
              title: "3. Configurar notificações",
              text: "Defina suas preferências de notificação.",
            },
            {
              title: "4. Salvar alterações",
              text: "Confirme as alterações para que elas sejam aplicadas.",
            },
          ],
        }
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
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
}

.header p {
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 700px;
  margin: 0.5rem auto 0;
  line-height: 1.6;
}

.tutorials-section {
  max-width: 900px;
  margin: 0 auto;
}

.tutorial-card {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.tutorial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.tutorial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  cursor: pointer;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e9ecef;
}

.tutorial-header:hover {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
}

.tutorial-info h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.tutorial-info p {
  margin: 0.25rem 0 0;
  color: #6c757d;
  font-size: 0.95rem;
}

.tutorial-icon {
  color: #6c757d;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f8f9fa;
}

.tutorial-icon.is-open {
  transform: rotate(180deg);
  color: #3498db;
  background: #e3f2fd;
}

.tutorial-content {
  padding: 0 2rem 2rem;
  background: #ffffff;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  margin: 2rem 0;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
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
  margin-bottom: 1.8rem;
  line-height: 1.7;
  color: #555;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .tutorias {
    padding: 1rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .tutorial-header {
    padding: 1.2rem 1.5rem;
  }

  .tutorial-info h2 {
    font-size: 1.1rem;
  }

  .tutorial-content {
    padding: 0 1.5rem 1.5rem;
  }
}
</style>
