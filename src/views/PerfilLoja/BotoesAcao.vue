<template>
  <div class="acoes-rapidas-container">
    <!-- Header da Seção -->
    <div class="section-header">
      <div class="header-main">
        <div class="title-section">
          <div class="title-icon">⚡</div>
          <div class="title-content">
            <h2>Ações Rápidas</h2>
            <p>Atalhos para as principais funcionalidades do sistema</p>
          </div>
        </div>
        <div class="header-controls">
          <div class="search-box">
            <input
              v-model="termoBusca"
              type="text"
              placeholder="Buscar ação..."
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>
          <div class="view-toggle">
            <button
              class="toggle-btn"
              :class="{ active: visualizacao === 'grid' }"
              @click="visualizacao = 'grid'"
            >
              ▦ Grid
            </button>
            <button
              class="toggle-btn"
              :class="{ active: visualizacao === 'lista' }"
              @click="visualizacao = 'lista'"
            >
              ☰ Lista
            </button>
          </div>
        </div>
      </div>

      <!-- Cards de Estatísticas Rápidas -->
      <div class="stats-rapidas">
        <div class="stat-rapida">
          <div class="stat-icon pendente">⏱️</div>
          <div class="stat-content">
            <div class="stat-value">{{ auditoriasPendentes }}</div>
            <div class="stat-label">Auditorias Pendentes</div>
          </div>
        </div>
        <div class="stat-rapida">
          <div class="stat-icon urgente">⚠️</div>
          <div class="stat-content">
            <div class="stat-value">{{ ncsPendentes }}</div>
            <div class="stat-label">NCs para Corrigir</div>
          </div>
        </div>
        <div class="stat-rapida">
          <div class="stat-icon concluido">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ auditoriasHoje }}</div>
            <div class="stat-label">Realizadas Hoje</div>
          </div>
        </div>
        <div class="stat-rapida">
          <div class="stat-icon meta">🎯</div>
          <div class="stat-content">
            <div class="stat-value">{{ percentualConclusao }}%</div>
            <div class="stat-label">Meta do Dia</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid de Ações -->
    <div class="acoes-content">
      <div class="acoes-grid" :class="visualizacao">
        <div
          v-for="botao in botoesFiltrados"
          :key="botao.titulo"
          class="acao-card"
          :class="{
            destaque: botao.destaque,
            urgente: botao.urgente,
            nova: botao.nova,
          }"
          @click="executarAcao(botao)"
          @mouseenter="hoverAcao = botao.titulo"
          @mouseleave="hoverAcao = null"
        >
          <div class="acao-header">
            <div class="acao-icon" :class="botao.categoria">
              {{ botao.icone }}
            </div>
            <div class="acao-badges">
              <span v-if="botao.destaque" class="badge destaque">🌟</span>
              <span v-if="botao.urgente" class="badge urgente">⚠️</span>
              <span v-if="botao.nova" class="badge nova">🆕</span>
            </div>
          </div>

          <div class="acao-content">
            <h3 class="acao-titulo">{{ botao.titulo }}</h3>
            <p class="acao-descricao">{{ botao.descricao }}</p>

            <div class="acao-meta">
              <span class="meta-tempo">{{ botao.tempo }}</span>
              <span class="meta-uso">{{ botao.uso }}</span>
            </div>
          </div>

          <div class="acao-footer">
            <div class="acao-stats">
              <span class="stat">
                <span class="stat-icon">👥</span>
                {{ botao.popularidade }}
              </span>
              <span class="stat">
                <span class="stat-icon">⭐</span>
                {{ botao.avaliacao }}
              </span>
            </div>
            <div class="acao-arrow">
              <span class="arrow-icon">→</span>
            </div>
          </div>

          <!-- Efeito de Hover -->
          <div class="acao-hover-effect"></div>
        </div>
      </div>

      <!-- Estado Vazio -->
      <div v-if="botoesFiltrados.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Nenhuma ação encontrada</h3>
        <p>Tente ajustar os termos da busca ou verificar a ortografia</p>
        <button class="reset-btn" @click="termoBusca = ''">Limpar Busca</button>
      </div>
    </div>

    <!-- Quick Actions Footer -->
    <div class="quick-actions-footer">
      <div class="footer-content">
        <div class="footer-info">
          <span class="info-text">
            💡 <strong>Dica rápida:</strong> Use o atalho Ctrl+K para abrir o
            menu de ações
          </span>
        </div>
        <div class="footer-actions">
          <button class="footer-btn" @click="mostrarTodosAtalhos">
            ⌨️ Ver Todos os Atalhos
          </button>
          <button class="footer-btn" @click="personalizarAcoes">
            ⚙️ Personalizar Ações
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação -->
    <div v-if="acaoSelecionada" class="modal-overlay" @click="fecharModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-icon">{{ acaoSelecionada.icone }}</div>
          <h3>{{ acaoSelecionada.titulo }}</h3>
          <button class="modal-close" @click="fecharModal">×</button>
        </div>

        <div class="modal-body">
          <p>{{ acaoSelecionada.descricao }}</p>

          <div class="modal-details">
            <div class="detail-item">
              <span class="detail-label">Tempo estimado:</span>
              <span class="detail-value">{{ acaoSelecionada.tempo }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Frequência de uso:</span>
              <span class="detail-value">{{ acaoSelecionada.uso }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Popularidade:</span>
              <span class="detail-value">{{
                acaoSelecionada.popularidade
              }}</span>
            </div>
          </div>

          <div class="modal-actions">
            <button class="modal-btn secondary" @click="fecharModal">
              Cancelar
            </button>
            <button class="modal-btn primary" @click="confirmarAcao">
              Executar Ação
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

// Estado do componente
const termoBusca = ref("");
const visualizacao = ref("grid");
const hoverAcao = ref(null);
const acaoSelecionada = ref(null);

// Dados das ações
const botoes = ref([
  {
    titulo: "Agendar Nova Auditoria",
    descricao: "Abrir formulário para agendar uma nova auditoria na loja",
    icone: "📅",
    categoria: "agendamento",
    tempo: "2-5 min",
    uso: "Frequente",
    popularidade: "85%",
    avaliacao: "4.8",
    destaque: true,
    urgente: false,
    nova: false,
  },
  {
    titulo: "Baixar Relatório",
    descricao:
      "Exportar relatório completo das auditorias do período selecionado",
    icone: "📊",
    categoria: "relatorio",
    tempo: "1-2 min",
    uso: "Muito Frequente",
    popularidade: "92%",
    avaliacao: "4.9",
    destaque: true,
    urgente: false,
    nova: false,
  },
  {
    titulo: "Notificar Equipe",
    descricao:
      "Enviar alertas para responsáveis sobre não conformidades identificadas",
    icone: "🔔",
    categoria: "comunicacao",
    tempo: "3-7 min",
    uso: "Frequente",
    popularidade: "78%",
    avaliacao: "4.6",
    destaque: false,
    urgente: true,
    nova: false,
  },
  {
    titulo: "Corrigir Não Conformidades",
    descricao: "Acessar lista de NCs pendentes e registrar ações corretivas",
    icone: "⚡",
    categoria: "correcao",
    tempo: "5-15 min",
    uso: "Diário",
    popularidade: "88%",
    avaliacao: "4.7",
    destaque: false,
    urgente: true,
    nova: false,
  },
  {
    titulo: "Ver Auditorias Pendentes",
    descricao:
      "Visualizar e filtrar auditorias em aberto por setor e prioridade",
    icone: "📋",
    categoria: "visualizacao",
    tempo: "1-3 min",
    uso: "Muito Frequente",
    popularidade: "90%",
    avaliacao: "4.8",
    destaque: false,
    urgente: false,
    nova: true,
  },
  {
    titulo: "Adicionar Observação",
    descricao: "Registrar observação rápida sobre a loja ou setor específico",
    icone: "📝",
    categoria: "registro",
    tempo: "1-2 min",
    uso: "Ocasional",
    popularidade: "65%",
    avaliacao: "4.3",
    destaque: false,
    urgente: false,
    nova: false,
  },
  {
    titulo: "Exportar Dados",
    descricao: "Exportar dados completos em Excel/CSV para análise externa",
    icone: "📤",
    categoria: "exportacao",
    tempo: "2-4 min",
    uso: "Semanal",
    popularidade: "72%",
    avaliacao: "4.5",
    destaque: false,
    urgente: false,
    nova: false,
  },
  {
    titulo: "Comparar Períodos",
    descricao: "Comparar métricas e KPIs com períodos anteriores",
    icone: "📈",
    categoria: "analise",
    tempo: "3-8 min",
    uso: "Semanal",
    popularidade: "68%",
    avaliacao: "4.4",
    destaque: false,
    urgente: false,
    nova: true,
  },
  {
    titulo: "Configurar Metas",
    descricao: "Definir e ajustar metas de desempenho por setor",
    icone: "🎯",
    categoria: "configuracao",
    tempo: "5-10 min",
    uso: "Mensal",
    popularidade: "55%",
    avaliacao: "4.2",
    destaque: false,
    urgente: false,
    nova: false,
  },
  {
    titulo: "Gerar Insights",
    descricao: "Gerar análise automática de insights e recomendações",
    icone: "💡",
    categoria: "analise",
    tempo: "1-3 min",
    uso: "Diário",
    popularidade: "82%",
    avaliacao: "4.7",
    destaque: true,
    urgente: false,
    nova: true,
  },
  {
    titulo: "Reconhecer Colaborador",
    descricao: "Enviar reconhecimento por bom desempenho nas auditorias",
    icone: "🏆",
    categoria: "gestao",
    tempo: "2-4 min",
    uso: "Semanal",
    popularidade: "75%",
    avaliacao: "4.6",
    destaque: false,
    urgente: false,
    nova: false,
  },
  {
    titulo: "Sincronizar Dados",
    descricao: "Sincronizar dados offline com o sistema central",
    icone: "🔄",
    categoria: "sincronizacao",
    tempo: "3-6 min",
    uso: "Ocasional",
    popularidade: "60%",
    avaliacao: "4.1",
    destaque: false,
    urgente: false,
    nova: false,
  },
]);

// Estatísticas rápidas
const auditoriasPendentes = ref(12);
const ncsPendentes = ref(8);
const auditoriasHoje = ref(5);
const percentualConclusao = ref(65);

// Computed properties
const botoesFiltrados = computed(() => {
  if (!termoBusca.value) return botoes.value;

  const termo = termoBusca.value.toLowerCase();
  return botoes.value.filter(
    (botao) =>
      botao.titulo.toLowerCase().includes(termo) ||
      botao.descricao.toLowerCase().includes(termo) ||
      botao.categoria.toLowerCase().includes(termo)
  );
});

// Métodos
const executarAcao = (botao) => {
  acaoSelecionada.value = botao;
  // Em uma implementação real, aqui iria a lógica específica de cada ação
  console.log(`Executando ação: ${botao.titulo}`);
};

const confirmarAcao = () => {
  if (acaoSelecionada.value) {
    // Simular execução da ação
    console.log(`Ação confirmada: ${acaoSelecionada.value.titulo}`);

    // Feedback visual
    const feedback = {
      "Agendar Nova Auditoria": "📅 Auditoria agendada com sucesso!",
      "Baixar Relatório": "📊 Relatório sendo gerado...",
      "Notificar Equipe": "🔔 Notificação enviada para a equipe",
      "Corrigir Não Conformidades": "⚡ Abertura de NCs para correção",
      "Ver Auditorias Pendentes": "📋 Carregando auditorias pendentes...",
      "Adicionar Observação": "📝 Observação registrada com sucesso",
      "Exportar Dados": "📤 Exportação iniciada...",
      "Comparar Períodos": "📈 Gerando comparação...",
      "Configurar Metas": "🎯 Metas atualizadas com sucesso",
      "Gerar Insights": "💡 Analisando dados para insights...",
      "Reconhecer Colaborador": "🏆 Reconhecimento enviado!",
      "Sincronizar Dados": "🔄 Sincronização em andamento...",
    };

    alert(
      feedback[acaoSelecionada.value.titulo] || "Ação executada com sucesso!"
    );
  }

  fecharModal();
};

const fecharModal = () => {
  acaoSelecionada.value = null;
};

const mostrarTodosAtalhos = () => {
  console.log("Abrindo modal com todos os atalhos de teclado...");
  alert("📋 Modal de atalhos de teclado aberto!");
};

const personalizarAcoes = () => {
  console.log("Abrindo personalização de ações...");
  alert("⚙️ Personalização de ações rápidas aberta!");
};

// Teclas de atalho
const handleKeyPress = (event) => {
  if (event.ctrlKey && event.key === "k") {
    event.preventDefault();
    termoBusca.value = "";
    document.querySelector(".search-input")?.focus();
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyPress);
});
</script>

<style scoped>
.acoes-rapidas-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin: 1rem 0;
}

/* Header Section */
.section-header {
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title-section {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.title-icon {
  font-size: 2.5rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 0.75rem;
}

.title-content h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.title-content p {
  margin: 0;
  color: #718096;
  font-size: 1rem;
}

.header-controls {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.search-box {
  position: relative;
  min-width: 280px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.view-toggle {
  display: flex;
  background: #f7fafc;
  border-radius: 10px;
  padding: 4px;
  border: 1px solid #e2e8f0;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.toggle-btn.active {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #667eea;
}

/* Stats Rápidas */
.stats-rapidas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-rapida {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.stat-rapida:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.pendente {
  background: rgba(255, 152, 0, 0.1);
}

.stat-icon.urgente {
  background: rgba(244, 67, 54, 0.1);
}

.stat-icon.concluido {
  background: rgba(76, 175, 80, 0.1);
}

.stat-icon.meta {
  background: rgba(156, 39, 176, 0.1);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
}

/* Ações Content */
.acoes-content {
  padding: 2rem;
}

.acoes-grid {
  display: grid;
  gap: 1.5rem;
}

.acoes-grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.acoes-grid.lista {
  grid-template-columns: 1fr;
}

.acao-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.acao-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(67, 97, 238, 0.15);
  border-color: #667eea;
}

.acao-card.destaque {
  border-color: #ffd700;
  background: linear-gradient(135deg, #fffaf0, #fff);
}

.acao-card.urgente {
  border-color: #f44336;
  background: linear-gradient(135deg, #fff5f5, #fff);
}

.acao-card.nova {
  border-color: #667eea;
  background: linear-gradient(135deg, #f0f4ff, #fff);
}

.acao-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.acao-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  transition: transform 0.3s ease;
}

.acao-card:hover .acao-icon {
  transform: scale(1.1);
}

.acao-icon.agendamento {
  background: rgba(102, 126, 234, 0.1);
}

.acao-icon.relatorio {
  background: rgba(76, 175, 80, 0.1);
}

.acao-icon.comunicacao {
  background: rgba(255, 152, 0, 0.1);
}

.acao-icon.correcao {
  background: rgba(244, 67, 54, 0.1);
}

.acao-icon.visualizacao {
  background: rgba(156, 39, 176, 0.1);
}

.acao-icon.registro {
  background: rgba(33, 150, 243, 0.1);
}

.acao-icon.exportacao {
  background: rgba(0, 188, 212, 0.1);
}

.acao-icon.analise {
  background: rgba(255, 193, 7, 0.1);
}

.acao-icon.configuracao {
  background: rgba(121, 85, 72, 0.1);
}

.acao-icon.gestao {
  background: rgba(233, 30, 99, 0.1);
}

.acao-icon.sincronizacao {
  background: rgba(0, 150, 136, 0.1);
}

.acao-badges {
  display: flex;
  gap: 0.25rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.badge.destaque {
  background: #fef5e7;
  color: #dd6b20;
}

.badge.urgente {
  background: #fed7d7;
  color: #c53030;
}

.badge.nova {
  background: #bee3f8;
  color: #1a365d;
}

.acao-content {
  margin-bottom: 1rem;
}

.acao-titulo {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.acao-descricao {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.acao-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
}

.meta-tempo {
  color: #4caf50;
  font-weight: 600;
}

.meta-uso {
  color: #667eea;
  font-weight: 600;
}

.acao-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.acao-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #718096;
}

.stat-icon {
  font-size: 0.9rem;
}

.acao-arrow {
  opacity: 0;
  transform: translateX(-5px);
  transition: all 0.3s ease;
}

.acao-card:hover .acao-arrow {
  opacity: 1;
  transform: translateX(0);
}

.arrow-icon {
  font-size: 1.2rem;
  color: #667eea;
  font-weight: 700;
}

.acao-hover-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(102, 126, 234, 0.05),
    transparent
  );
  transition: left 0.6s ease;
}

.acao-card:hover .acao-hover-effect {
  left: 100%;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #4a5568;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  margin: 0 0 2rem 0;
  font-size: 1rem;
}

.reset-btn {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
}

/* Quick Actions Footer */
.quick-actions-footer {
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-text {
  color: #4a5568;
  font-size: 0.9rem;
}

.footer-actions {
  display: flex;
  gap: 1rem;
}

.footer-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.footer-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalAppear 0.3s ease;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.modal-icon {
  font-size: 2.5rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 0.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-header h3 {
  flex: 1;
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #f7fafc;
  color: #4a5568;
}

.modal-body p {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.modal-details {
  background: #f7fafc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: #718096;
  font-weight: 500;
}

.detail-value {
  color: #2d3748;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn.primary {
  background: #667eea;
  color: white;
}

.modal-btn.primary:hover {
  background: #5a67d8;
}

.modal-btn.secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.modal-btn.secondary:hover {
  background: #cbd5e0;
}

/* Responsividade */
@media (max-width: 1024px) {
  .acoes-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .section-header {
    padding: 1.5rem;
  }

  .header-main {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-controls {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
  }

  .search-box {
    min-width: auto;
  }

  .stats-rapidas {
    grid-template-columns: repeat(2, 1fr);
  }

  .acoes-content {
    padding: 1.5rem;
  }

  .acoes-grid.grid {
    grid-template-columns: 1fr;
  }

  .footer-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .footer-actions {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .stats-rapidas {
    grid-template-columns: 1fr;
  }

  .acao-card {
    padding: 1rem;
  }

  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
