<template>
  <div class="documentacao">
    <div class="header">
      <h1>Documentação do Sistema</h1>
      <p>
        Bem-vindo à documentação oficial. Aqui você encontrará informações
        detalhadas sobre todas as funcionalidades do sistema de Auditoria de
        Lojas.
      </p>
    </div>

    <!-- Seção de Uploads -->
    <section class="feature-section upload-section">
      <h2 class="section-title upload-title">
        <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" /> Upload de
        Dados
      </h2>
      <div class="features-grid">
        <div
          v-for="feature in uploadFeatures"
          :key="feature.title"
          class="feature-card upload-card"
        >
          <div class="feature-icon">
            <font-awesome-icon :icon="feature.icon" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Seção de Comunidade -->
    <section class="feature-section community-section">
      <h2 class="section-title community-title">
        <font-awesome-icon :icon="['fas', 'users']" /> Comunidade e Interações
      </h2>
      <div class="features-grid">
        <div
          v-for="feature in communityFeatures"
          :key="feature.title"
          class="feature-card community-card"
        >
          <div class="feature-icon">
            <font-awesome-icon :icon="feature.icon" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Seção de Análise e Visualização -->
    <section class="feature-section analysis-section">
      <h2 class="section-title analysis-title">
        <font-awesome-icon :icon="['fas', 'chart-line']" /> Análise e
        Visualização
      </h2>
      <div class="features-grid">
        <div
          v-for="feature in analysisFeatures"
          :key="feature.title"
          class="feature-card analysis-card"
        >
          <div class="feature-icon">
            <font-awesome-icon :icon="feature.icon" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Seção de Gerenciamento -->
    <section class="feature-section management-section">
      <h2 class="section-title management-title">
        <font-awesome-icon :icon="['fas', 'cog']" /> Gerenciamento
      </h2>
      <div class="features-grid">
        <div
          v-for="feature in managementFeatures"
          :key="feature.title"
          class="feature-card management-card"
        >
          <div class="feature-icon">
            <font-awesome-icon :icon="feature.icon" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Seção de Conquistas e Gamificação -->
    <section class="feature-section achievement-section">
      <h2 class="section-title achievement-title">
        <font-awesome-icon :icon="['fas', 'trophy']" /> Conquistas e Gamificação
      </h2>
      <div class="features-grid">
        <div
          v-for="feature in achievementFeatures"
          :key="feature.title"
          class="feature-card achievement-card"
        >
          <div class="feature-icon">
            <font-awesome-icon :icon="feature.icon" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Seção de Informações e Suporte -->
    <section class="feature-section info-section">
      <h2 class="section-title info-title">
        <font-awesome-icon :icon="['fas', 'circle-info']" /> Informações e
        Suporte
      </h2>
      <div class="features-grid">
        <div
          v-for="feature in infoFeatures"
          :key="feature.title"
          class="feature-card info-card"
        >
          <div class="feature-icon">
            <font-awesome-icon :icon="feature.icon" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCloudUploadAlt,
  faUsers,
  faChartBar,
  faCog,
  faTrophy,
  faInfoCircle,
  faFileCsv,
  faCheckCircle,
  faPrescriptionBottle,
  faExclamationTriangle,
  faDatabase,
  faComments,
  faHeart,
  faCommentAlt,
  faVoteYea,
  faSearch,
  faDownload,
  faMapMarkedAlt,
  faChartLine,
  faUserFriends,
  faStore,
  faUserTie,
  faMedal,
  faBox,
  faFilter,
  faUsersCog,
  faBuilding,
  faUserCircle,
  faStar,
  faAward,
  faCertificate,
  faBook,
  faHistory,
  faEnvelope,
  faBookOpen,
  faRoad,
  faLightbulb,
  faGraduationCap,
  faAddressCard,
  faPoll,
  faChartColumn,
} from "@fortawesome/free-solid-svg-icons";

// Adicionando os ícones ao library
library.add(
  faCloudUploadAlt,
  faUsers,
  faChartBar,
  faCog,
  faTrophy,
  faInfoCircle,
  faFileCsv,
  faCheckCircle,
  faPrescriptionBottle,
  faExclamationTriangle,
  faDatabase,
  faComments,
  faHeart,
  faCommentAlt,
  faVoteYea,
  faSearch,
  faDownload,
  faMapMarkedAlt,
  faChartLine,
  faUserFriends,
  faStore,
  faUserTie,
  faMedal,
  faBox,
  faFilter,
  faUsersCog,
  faBuilding,
  faUserCircle,
  faStar,
  faAward,
  faCertificate,
  faBook,
  faHistory,
  faEnvelope,
  faBookOpen,
  faRoad,
  faLightbulb,
  faGraduationCap,
  faAddressCard,
  faPoll,
  faChartColumn,
);

export default {
  name: "Documentacao",
  data() {
    return {
      uploadFeatures: [
        {
          icon: ["fas", "file-csv"],
          title: "Upload de Etiquetas",
          description:
            "Durante a auditoria na loja, baixe os relatórios correspondentes no formato CSV e acesse o menu de upload de etiquetas para processar os dados. O sistema faz a mágica acontecer, relacionando dado por dado automaticamente.",
        },
        {
          icon: ["fas", "check-circle"],
          title: "Upload de Presença",
          description:
            "Registre a presença de produtos na prateleira com o upload de dados de presença. O sistema processa e integra automaticamente com os dados de auditoria existentes.",
        },
        {
          icon: ["fas", "exclamation-triangle"],
          title: "Upload de Ruptura",
          description:
            "Registre situações de ruptura de estoque com o upload de dados de ruptura. O sistema correlaciona essas informações com outros dados de auditoria para fornecer insights valiosos.",
        },
        {
          icon: ["fas", "cog"],
          title: "Processamento Automático",
          description:
            "Após o upload, o sistema processa automaticamente os dados, integrando-os com informações existentes e preparando para análise e relatórios.",
        },
      ],
      communityFeatures: [
        {
          icon: ["fas", "users"],
          title: "Feed de Comunidade",
          description:
            "A comunidade está disponível para administradores e auditores. Compartilhe ideias e posts sobre auditorias da loja, comente publicações e reaja às postagens. Essa funcionalidade torna o sistema mais interativo entre os colaboradores.",
        },
        {
          icon: ["fas", "heart"],
          title: "Reações e Interatividade",
          description:
            "Reaja às publicações com diferentes emojis (curtir, amar, fogo, triste) para aumentar a interatividade e engajamento entre os colaboradores.",
        },
        {
          icon: ["fas", "comments"],
          title: "Comentários e Discussões",
          description:
            "Comente em publicações para iniciar discussões, tirar dúvidas e compartilhar experiências com outros membros da equipe.",
        },
        {
          icon: ["fas", "poll"],
          title: "Votação em Melhorias",
          description:
            "Participe de votações sobre sugestões de melhoria, ajudando a priorizar as ideias mais importantes para o sistema e para as operações.",
        },
      ],
      analysisFeatures: [
        {
          icon: ["fas", "filter"],
          title: "Filtros Avançados",
          description:
            "Filtre os dados por data, loja, status, produto e outros critérios para uma análise detalhada e focada, encontrando exatamente o que você precisa.",
        },
        {
          icon: ["fas", "download"],
          title: "Exportação de Relatórios",
          description:
            "Exporte os dados filtrados para arquivos CSV ou PDF. Ideal para compartilhar resultados ou para análises em outras ferramentas.",
        },
        {
          icon: ["fas", "map-marked-alt"],
          title: "Mapa de Calor dos Setores",
          description:
            "Identifique visualmente os setores com maior incidência de problemas, ajudando a focar os esforços onde é mais necessário.",
        },
        {
          icon: ["fas", "chart-line"],
          title: "Gráficos e Métricas",
          description:
            "Visualize tendências e métricas importantes através de gráficos interativos que mostram o desempenho ao longo do tempo.",
        },
        {
          icon: ["fas", "user-friends"],
          title: "Acompanhamento de Colaboradores",
          description:
            "Monitore o desempenho individual dos colaboradores, visualizando o número de auditorias realizadas e o progresso geral.",
        },
        {
          icon: ["fas", "store"],
          title: "Perfil da Loja",
          description:
            "Acesse informações detalhadas sobre cada loja, incluindo histórico de auditorias, métricas e desempenho comparativo.",
        },
      ],
      managementFeatures: [
        {
          icon: ["fas", "users-cog"],
          title: "Gerenciamento de Usuários",
          description:
            "Cadastre, edite e gerencie os usuários do sistema, atribuindo permissões e acompanhando atividades.",
        },
        {
          icon: ["fas", "store"],
          title: "Lista de Lojas",
          description:
            "Visualize todas as lojas disponíveis no sistema, com informações básicas e status de auditoria.",
        },
        {
          icon: ["fas", "star"],
          title: "Ranking de Colaboradores",
          description:
            "Veja o ranking dos colaboradores com base em seu desempenho e contribuições para as auditorias.",
        },
        {
          icon: ["fas", "chart-column"],
          title: "Ranking de Lojas",
          description:
            "Compare o desempenho entre diferentes lojas com rankings baseados em métricas de auditoria.",
        },
        {
          icon: ["fas", "address-card"],
          title: "Perfis de Usuários",
          description:
            "Acesse perfis detalhados de cada usuário, com histórico de atividades, conquistas e contribuições.",
        },
      ],
      achievementFeatures: [
        {
          icon: ["fas", "trophy"],
          title: "Sistema de Conquistas",
          description:
            "Ganhe conquistas por completar tarefas, participar ativamente e contribuir para o sistema. Um sistema de gamificação para motivar os colaboradores.",
        },
        {
          icon: ["fas", "star"],
          title: "Pontuação e XP",
          description:
            "Acumule pontos de experiência (XP) ao completar auditorias, fazer uploads e participar da comunidade.",
        },
        {
          icon: ["fas", "award"],
          title: "Níveis e Progresso",
          description:
            "Suba de nível conforme acumula XP, desbloqueando novas conquistas e reconhecimento dentro do sistema.",
        },
        {
          icon: ["fas", "certificate"],
          title: "Certificados e Reconhecimentos",
          description:
            "Receba certificados por desempenho excepcional e contribuições significativas para o sistema de auditoria.",
        },
      ],
      infoFeatures: [
        {
          icon: ["fas", "book"],
          title: "Central de Ajuda",
          description:
            "Acesse a central de ajuda com perguntas frequentes, tutoriais e guias para utilizar todas as funcionalidades do sistema.",
        },
        {
          icon: ["fas", "history"],
          title: "Changelog",
          description:
            "Consulte o registro de todas as atualizações e novas funcionalidades implementadas no sistema.",
        },
        {
          icon: ["fas", "envelope"],
          title: "Contato",
          description:
            "Entre em contato com a equipe de suporte para resolver dúvidas, reportar problemas ou sugerir melhorias.",
        },
        {
          icon: ["fas", "book-open"],
          title: "Documentação Completa",
          description:
            "Acesse a documentação completa do sistema com instruções detalhadas para cada funcionalidade.",
        },
        {
          icon: ["fas", "road"],
          title: "Roadmap",
          description:
            "Veja o planejamento futuro do sistema com as próximas funcionalidades e melhorias planejadas.",
        },
        {
          icon: ["fas", "lightbulb"],
          title: "Sugestões",
          description:
            "Envie sugestões de melhorias para o sistema e vote nas sugestões de outros colaboradores.",
        },
        {
          icon: ["fas", "graduation-cap"],
          title: "Tutoriais",
          description:
            "Assista a tutoriais em vídeo que explicam como utilizar as principais funcionalidades do sistema.",
        },
        {
          icon: ["fas", "vote-yea"],
          title: "Votação de Funcionalidades",
          description:
            "Vote nas funcionalidades que você gostaria de ver implementadas no sistema nas próximas atualizações.",
        },
      ],
    };
  },
  mounted() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // A seção aparece quando 10% dela está visível
      },
    );

    // Observa cada seção de funcionalidades
    this.$el.querySelectorAll(".feature-section").forEach((section) => {
      observer.observe(section);
    });
  },
};
</script>

<style scoped>
.documentacao {
  padding: 2rem;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 4rem;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header h1 {
  font-size: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  margin-bottom: 1rem;
}

.header p {
  font-size: 1.2rem;
  color: #5a6c7d;
  max-width: 750px;
  margin: 0.5rem auto 0;
  line-height: 1.6;
}

.feature-section {
  margin-bottom: 4rem;
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.section-title:hover {
  transform: translateX(10px);
}

.feature-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Cores específicas para cada seção */
.upload-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.community-title {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.analysis-title {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.management-title {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.achievement-title {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.info-title {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
  color: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  align-items: start;
}

.feature-card {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-top: 5px solid;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.feature-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.feature-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.feature-card:hover::before {
  opacity: 1;
}

/* Cores específicas para cards de cada seção */
.upload-card {
  border-top-color: #667eea;
}

.upload-card .feature-icon {
  color: #667eea;
}

.community-card {
  border-top-color: #f5576c;
}

.community-card .feature-icon {
  color: #f5576c;
}

.analysis-card {
  border-top-color: #00f2fe;
}

.analysis-card .feature-icon {
  color: #00f2fe;
}

.management-card {
  border-top-color: #43e97b;
}

.management-card .feature-icon {
  color: #43e97b;
}

.achievement-card {
  border-top-color: #fa709a;
}

.achievement-card .feature-icon {
  color: #fa709a;
}

.info-card {
  border-top-color: #30cfd0;
}

.info-card .feature-icon {
  color: #30cfd0;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.2) rotate(5deg);
}

.feature-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.feature-description {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #5a6c7d;
  text-align: justify;
  margin-top: auto;
}

/* Estilo responsivo para dispositivos móveis */
@media (max-width: 768px) {
  .documentacao {
    padding: 1rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .header p {
    font-size: 1rem;
    padding: 0 1rem;
  }

  .feature-section h2 {
    font-size: 1.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 0.5rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .feature-icon {
    font-size: 2rem;
  }

  .feature-title {
    font-size: 1.2rem;
  }

  .feature-description {
    font-size: 0.95rem;
  }
}

/* Estilo para tablets */
@media (min-width: 769px) and (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Estilo para telas muito pequenas */
@media (max-width: 480px) {
  .header h1 {
    font-size: 1.8rem;
  }

  .feature-section h2 {
    font-size: 1.3rem;
  }

  .feature-card {
    padding: 1.2rem;
  }

  .feature-title {
    font-size: 1.1rem;
  }

  .feature-description {
    font-size: 0.9rem;
  }
}
</style>
