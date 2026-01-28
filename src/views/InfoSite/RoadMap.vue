<template>
  <div class="roadmap">
    <div class="header">
      <h1>Roadmap do Projeto</h1>
      <p>
        Acompanhe nosso histórico de implementações, o que está em andamento e os planos futuros para o sistema de Auditoria de Lojas.
      </p>
    </div>

    <!-- Status Filters -->
    <div class="filters">
      <button
        @click="activeTab = 'all'"
        :class="['filter-btn', { active: activeTab === 'all' }]"
      >
        <i class="fas fa-list"></i> Tudo
      </button>
      <button
        @click="activeTab = 'done'"
        :class="['filter-btn', { active: activeTab === 'done' }]"
      >
        <i class="fas fa-check-circle"></i> Concluídos
      </button>
      <button
        @click="activeTab = 'in-progress'"
        :class="['filter-btn', { active: activeTab === 'in-progress' }]"
      >
        <i class="fas fa-sync-alt"></i> Em Andamento
      </button>
      <button
        @click="activeTab = 'future'"
        :class="['filter-btn', { active: activeTab === 'future' }]"
      >
        <i class="fas fa-calendar-plus"></i> Futuro
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="card done-card">
        <div class="card-icon">✅</div>
        <div class="card-content">
          <h3>{{ doneFeatures.length }}</h3>
          <p>Recursos Concluídos</p>
        </div>
      </div>
      <div class="card progress-card">
        <div class="card-icon">🔄</div>
        <div class="card-content">
          <h3>{{ inProgressFeatures.length }}</h3>
          <p>Em Desenvolvimento</p>
        </div>
      </div>
      <div class="card future-card">
        <div class="card-icon">🔮</div>
        <div class="card-content">
          <h3>{{ futureFeatures.length }}</h3>
          <p>Planejados</p>
        </div>
      </div>
    </div>

    <!-- Features Timeline -->
    <div class="timeline-container">
      <div class="timeline">
        <div
          v-for="(item, index) in filteredFeatures"
          :key="index"
          class="timeline-item"
          :class="item.status"
        >
          <div class="timeline-marker">
            <div class="marker-inner" :class="item.status">
              <i :class="getIcon(item.status)"></i>
            </div>
          </div>
          <div class="timeline-content">
            <div class="feature-header">
              <div class="feature-status-badge" :class="item.status">
                {{ getStatusText(item.status) }}
              </div>
              <h3>{{ item.title }}</h3>
            </div>
            <p class="feature-description">{{ item.description }}</p>
            <div class="feature-meta">
              <span class="feature-category">{{ item.category }}</span>
              <span class="feature-date">{{ item.date }}</span>
            </div>
            <div v-if="item.details" class="feature-details">
              <h4>Detalhes:</h4>
              <ul>
                <li v-for="(detail, idx) in item.details" :key="idx">{{ detail }}</li>
              </ul>
            </div>
          </div>
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
      activeTab: 'all',
      features: [
        // COMPLETED FEATURES
        {
          title: "Sistema de Autenticação",
          description: "Implementação completa do sistema de login e autenticação JWT para proteger as rotas e dados do sistema",
          category: "Segurança",
          status: "done",
          date: "2025-01",
          details: [
            "Login com validação de credenciais",
            "Token JWT com expiração configurável",
            "Middleware de proteção de rotas",
            "Recuperação de senha por email"
          ]
        },
        {
          title: "Upload de Planilhas Otimizado",
          description: "Sistema otimizado para processamento de planilhas de auditoria com armazenamento eficiente",
          category: "Processamento",
          status: "done",
          date: "2025-01",
          details: [
            "Upload de etiquetas, rupturas e presenças",
            "Processamento em memória (sem armazenamento individual)",
            "Armazenamento em métricas diárias agregadas",
            "Economia de 90% de espaço no banco de dados"
          ]
        },
        {
          title: "Sistema de Conquistas e Gamificação",
          description: "Implementação completa do sistema de conquistas, XP e níveis para engajar os colaboradores",
          category: "Gamificação",
          status: "done",
          date: "2025-01",
          details: [
            "Modelo UserAchievement com conquistas e XP",
            "10 conquistas pré-definidas (primeira auditoria, coletor de itens, etc.)",
            "Sistema de XP e níveis progressivos",
            "Ranking por XP e nível",
            "Conquistas de consistência e semanais"
          ]
        },
        {
          title: "Dashboard de Métricas",
          description: "Interface completa para visualização de métricas de auditoria por usuário, loja e período",
          category: "Visualização",
          status: "done",
          date: "2024-12",
          details: [
            "Métricas por usuário e loja",
            "Comparativos entre períodos",
            "Gráficos interativos de desempenho",
            "Indicadores de produtividade"
          ]
        },
        {
          title: "Rankings de Desempenho",
          description: "Sistema de rankings por tipo de auditoria (etiqueta, ruptura, presença) com posições e pontuação",
          category: "Competição",
          status: "done",
          date: "2024-12",
          details: [
            "Ranking por etiquetas, rupturas e presenças",
            "Posicionamento por loja e geral",
            "Histórico de desempenho",
            "Comparação entre colaboradores"
          ]
        },
        {
          title: "Sistema de Métricas Diárias",
          description: "Armazenamento e processamento eficiente de métricas diárias de auditoria",
          category: "Dados",
          status: "done",
          date: "2025-01",
          details: [
            "Armazenamento otimizado por usuário/dia",
            "Atualização incremental de métricas",
            "Cache de dados para melhor performance",
            "Consulta rápida de histórico"
          ]
        },
        {
          title: "Interface Responsiva",
          description: "Design adaptável para dispositivos móveis e tablets",
          category: "UI/UX",
          status: "done",
          date: "2024-12",
          details: [
            "Layout adaptável para telas pequenas",
            "Componentes touch-friendly",
            "Navegação otimizada para mobile",
            "Experiência consistente em todos os dispositivos"
          ]
        },
        {
          title: "Sistema de Perfis de Loja",
          description: "Páginas dedicadas para visualização de métricas e desempenho por loja",
          category: "Visualização",
          status: "done",
          date: "2024-12",
          details: [
            "Página de perfil para cada loja",
            "Métricas consolidadas por loja",
            "Ranking de colaboradores da loja",
            "Histórico de auditorias"
          ]
        },
        {
          title: "Análise de Ruptura por Loja",
          description: "Ferramenta para análise detalhada de dados de ruptura por loja",
          category: "Análise",
          status: "done",
          date: "2025-01",
          details: [
            "Visualização de dados de ruptura",
            "Comparativos entre períodos",
            "Identificação de padrões",
            "Relatórios de tendências"
          ]
        },
        {
          title: "Sistema de Upload em Lote",
          description: "Capacidade de upload simultâneo de múltiplos tipos de auditoria",
          category: "Funcionalidade",
          status: "done",
          date: "2025-01",
          details: [
            "Upload de etiquetas, rupturas e presenças simultaneamente",
            "Processamento em paralelo",
            "Feedback em tempo real",
            "Validação de dados antes do processamento"
          ]
        },
        {
          title: "Central de Ajuda",
          description: "Seção com perguntas frequentes e guias de uso do sistema",
          category: "Suporte",
          status: "done",
          date: "2024-12",
          details: [
            "Perguntas e respostas comuns",
            "Guia de funcionalidades",
            "Dicas de uso",
            "Contato para suporte"
          ]
        },
        {
          title: "Sistema de Contato",
          description: "Página com informações de contato e redes sociais",
          category: "Comunicação",
          status: "done",
          date: "2024-12",
          details: [
            "Informações de contato",
            "Links para redes sociais",
            "Canais de comunicação",
            "Informações do desenvolvedor"
          ]
        },
        {
          title: "Documentação do Sistema",
          description: "Seção com guias e manuais para uso do sistema",
          category: "Documentação",
          status: "done",
          date: "2024-12",
          details: [
            "Guia de funcionalidades",
            "Manual de uso",
            "Boas práticas",
            "FAQ"
          ]
        },
        {
          title: "Sistema de Tutoriais",
          description: "Série de tutoriais para orientar os usuários no uso do sistema",
          category: "Treinamento",
          status: "done",
          date: "2024-12",
          details: [
            "Vídeos explicativos",
            "Passo a passo de funcionalidades",
            "Dicas de produtividade",
            "Melhores práticas"
          ]
        },

        // IN PROGRESS FEATURES
        {
          title: "Sistema de Níveis e XP",
          description: "Implementação de um sistema de progressão com níveis baseados em XP acumulado",
          category: "Gamificação",
          status: "in-progress",
          date: "2025-02",
          details: [
            "Sistema de progressão por XP",
            "Níveis com recompensas exclusivas",
            "Badge de conquistas por nível",
            "Integração com conquistas existentes"
          ]
        },
        {
          title: "Ranking Global",
          description: "Sistema de ranking que compara desempenho entre todas as lojas do sistema",
          category: "Competição",
          status: "in-progress",
          date: "2025-02",
          details: [
            "Ranking por loja e por colaborador",
            "Comparativos entre unidades",
            "Sistema de troféus por posição",
            "Histórico de desempenho"
          ]
        },
        {
          title: "Análise de Tendências",
          description: "Ferramenta para identificar padrões e tendências nos dados de auditoria",
          category: "Análise",
          status: "in-progress",
          date: "2025-02",
          details: [
            "Identificação de padrões sazonais",
            "Previsões baseadas em dados históricos",
            "Alertas de anomalias",
            "Relatórios automatizados"
          ]
        },
        {
          title: "Notificações em Tempo Real",
          description: "Sistema de notificações para alertar sobre conquistas, rankings e atualizações",
          category: "Comunicação",
          status: "in-progress",
          date: "2025-02",
          details: [
            "Notificações push para conquistas",
            "Alertas de mudança de ranking",
            "Atualizações em tempo real",
            "Personalização de preferências"
          ]
        },
        {
          title: "Dashboard Administrativo",
          description: "Painel completo para administração do sistema com métricas e configurações",
          category: "Administração",
          status: "in-progress",
          date: "2025-02",
          details: [
            "Visão geral do sistema",
            "Métricas de uso",
            "Configurações avançadas",
            "Gestão de usuários e lojas"
          ]
        },
        {
          title: "Sistema de Conquistas por Loja",
          description: "Implementação de conquistas específicas para lojas e não apenas para usuários",
          category: "Gamificação",
          status: "in-progress",
          date: "2025-02",
          details: [
            "Conquistas coletivas por loja",
            "Metas de desempenho por unidade",
            "Competição entre lojas",
            "Recompensas por equipe"
          ]
        },

        // FUTURE FEATURES
        {
          title: "Aplicativo Móvel",
          description: "Desenvolvimento de aplicativo nativo para iOS e Android para auditorias em campo",
          category: "Mobile",
          status: "future",
          date: "2025-06",
          details: [
            "Aplicativo nativo para iOS e Android",
            "Sincronização offline",
            "Câmera para captura de dados",
            "GPS para localização"
          ]
        },
        {
          title: "Integração com Sistemas ERP",
          description: "Conectividade com sistemas de gestão empresarial para troca de dados",
          category: "Integração",
          status: "future",
          date: "2025-08",
          details: [
            "Conexão com SAP, Oracle, etc.",
            "Sincronização de dados em tempo real",
            "API RESTful padronizada",
            "Automação de processos"
          ]
        },
        {
          title: "Inteligência Artificial",
          description: "Implementação de IA para análise preditiva e sugestões automáticas",
          category: "IA",
          status: "future",
          date: "2025-10",
          details: [
            "Análise preditiva de tendências",
            "Sugestões de ações corretivas",
            "Detecção automática de anomalias",
            "Relatórios inteligentes"
          ]
        },
        {
          title: "Relatórios Personalizados",
          description: "Ferramenta para criação de relatórios sob medida com gráficos e filtros",
          category: "Relatórios",
          status: "future",
          date: "2025-07",
          details: [
            "Designer de relatórios arrastar e soltar",
            "Gráficos personalizáveis",
            "Agendamento de relatórios",
            "Exportação em múltiplos formatos"
          ]
        },
        {
          title: "Sistema de Treinamento",
          description: "Plataforma de treinamento com cursos e certificações para colaboradores",
          category: "Treinamento",
          status: "future",
          date: "2025-09",
          details: [
            "Cursos online sobre auditoria",
            "Certificações por desempenho",
            "Progresso de aprendizado",
            "Gamificação do aprendizado"
          ]
        },
        {
          title: "Análise de Sentimento",
          description: "Análise de feedback e sentimentos dos colaboradores sobre o processo de auditoria",
          category: "Análise",
          status: "future",
          date: "2025-11",
          details: [
            "Coleta de feedback dos usuários",
            "Análise de sentimentos",
            "Identificação de pontos de melhoria",
            "Relatórios de satisfação"
          ]
        },
        {
          title: "Sistema de Recompensas",
          description: "Programa de recompensas baseado em conquistas e desempenho",
          category: "Gamificação",
          status: "future",
          date: "2025-08",
          details: [
            "Pontos resgatáveis por recompensas",
            "Parcerias com programas de benefícios",
            "Sistema de cashback por desempenho",
            "Catálogo de recompensas"
          ]
        },
        {
          title: "Dashboard Executivo",
          description: "Painel de controle com métricas estratégicas para tomada de decisão",
          category: "Visualização",
          status: "future",
          date: "2025-07",
          details: [
            "Indicadores-chave de desempenho",
            "Comparativos entre períodos",
            "Alertas de KPIs críticos",
            "Relatórios executivos automatizados"
          ]
        },
        {
          title: "Suporte Multi-idioma",
          description: "Adaptação da interface para múltiplos idiomas",
          category: "Internacionalização",
          status: "future",
          date: "2025-09",
          details: [
            "Traduções para inglês e espanhol",
            "Sistema de internacionalização",
            "Cultura localizada",
            "Interface multilíngue"
          ]
        },
        {
          title: "Análise de Dados Avançada",
          description: "Ferramentas avançadas de análise estatística e visualização de dados",
          category: "Análise",
          status: "future",
          date: "2025-10",
          details: [
            "Modelos estatísticos avançados",
            "Visualizações interativas",
            "Análise de correlação",
            "Identificação de padrões complexos"
          ]
        }
      ]
    };
  },
  computed: {
    doneFeatures() {
      return this.features.filter(feature => feature.status === 'done');
    },
    inProgressFeatures() {
      return this.features.filter(feature => feature.status === 'in-progress');
    },
    futureFeatures() {
      return this.features.filter(feature => feature.status === 'future');
    },
    filteredFeatures() {
      if (this.activeTab === 'all') return this.features;
      if (this.activeTab === 'done') return this.doneFeatures;
      if (this.activeTab === 'in-progress') return this.inProgressFeatures;
      if (this.activeTab === 'future') return this.futureFeatures;
      return this.features;
    }
  },
  methods: {
    getIcon(status) {
      switch(status) {
        case 'done': return 'fas fa-check';
        case 'in-progress': return 'fas fa-sync-alt';
        case 'future': return 'fas fa-calendar-plus';
        default: return 'fas fa-circle';
      }
    },
    getStatusText(status) {
      switch(status) {
        case 'done': return 'Concluído';
        case 'in-progress': return 'Em Andamento';
        case 'future': return 'Planejado';
        default: return 'Status';
      }
    }
  }
};
</script>

<style scoped>
.roadmap {
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  min-height: 100vh;
  color: #333;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 0 1rem;
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
  margin: 0 auto;
  line-height: 1.6;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn:hover {
  border-color: #3498db;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.filter-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 2.5rem;
}

.card-content h3 {
  font-size: 2rem;
  margin: 0;
  font-weight: 700;
  color: #2c3e50;
}

.card-content p {
  margin: 0;
  color: #6c757d;
  font-size: 0.95rem;
}

.done-card {
  border-left: 5px solid #2ecc71;
}

.progress-card {
  border-left: 5px solid #f39c12;
}

.future-card {
  border-left: 5px solid #9b59b6;
}

.timeline-container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.timeline-container::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #3498db, #9b59b6);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 2.5rem;
  padding-left: 50px;
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

.timeline-item.done {
  animation-delay: 0.1s;
}

.timeline-item.in-progress {
  animation-delay: 0.2s;
}

.timeline-item.future {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-inner {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
}

.marker-inner.done {
  background: #2ecc71;
}

.marker-inner.in-progress {
  background: #f39c12;
  animation: pulse 2s infinite;
}

.marker-inner.future {
  background: #9b59b6;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.timeline-content {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  position: relative;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.timeline-content:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.feature-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.feature-status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.feature-status-badge.done {
  background: #e8f5e9;
  color: #2ecc71;
}

.feature-status-badge.in-progress {
  background: #fff8e1;
  color: #f39c12;
}

.feature-status-badge.future {
  background: #f3e5f5;
  color: #9b59b6;
}

h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  flex: 1;
}

.feature-description {
  color: #555;
  line-height: 1.7;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.feature-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-category {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.feature-date {
  color: #6c757d;
  font-size: 0.85rem;
  font-weight: 500;
}

.feature-details {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #3498db;
}

.feature-details h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1rem;
}

.feature-details ul {
  margin: 0;
  padding-left: 1.2rem;
  list-style-type: disc;
}

.feature-details li {
  margin-bottom: 0.3rem;
  color: #555;
  line-height: 1.5;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .roadmap {
    padding: 1rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .filters {
    flex-direction: column;
    align-items: center;
  }

  .filter-btn {
    width: 100%;
    max-width: 300px;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }

  .timeline-container::before {
    left: 15px;
  }

  .timeline-item {
    padding-left: 40px;
  }

  .timeline-marker {
    left: 0;
    width: 30px;
    height: 30px;
  }

  .marker-inner {
    width: 20px;
    height: 20px;
    font-size: 0.7rem;
  }
}
</style>
