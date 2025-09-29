<template>
  <div class="timeline-atividades-container">
    <!-- Header -->
    <div class="timeline-header">
      <div class="header-left">
        <div class="icon-title">
          <div class="icon-area">⏳</div>
          <div class="text-content">
            <div class="titulo">Linha do Tempo de Atividades</div>
            <div class="descricao">
              Acompanhe as principais ações realizadas na loja ao longo do tempo
            </div>
          </div>
        </div>
      </div>
      <div class="header-controls">
        <div class="view-toggle">
          <button
            class="toggle-btn"
            :class="{ active: visualizacaoAtiva === 'todos' }"
            @click="visualizacaoAtiva = 'todos'"
          >
            📋 Todos
          </button>
          <button
            class="toggle-btn"
            :class="{ active: visualizacaoAtiva === 'auditorias' }"
            @click="visualizacaoAtiva = 'auditorias'"
          >
            ✅ Auditorias
          </button>
          <button
            class="toggle-btn"
            :class="{ active: visualizacaoAtiva === 'alertas' }"
            @click="visualizacaoAtiva = 'alertas'"
          >
            ⚠️ Alertas
          </button>
        </div>
        <select v-model="periodoSelecionado" class="filtro-select">
          <option value="hoje">Hoje</option>
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mês</option>
          <option value="trimestre">Este Trimestre</option>
        </select>
      </div>
    </div>

    <!-- Timeline -->
    <div class="timeline-content">
      <div class="timeline-line"></div>

      <div
        v-for="(evento, index) in eventosFiltrados"
        :key="evento.id"
        class="timeline-item"
        :class="[
          evento.tipo,
          { destaque: evento.destaque, compact: visualizacaoCompacta },
        ]"
        :style="{ '--item-order': index }"
      >
        <!-- Ponto da Timeline -->
        <div class="timeline-marker">
          <div class="marker-icon">{{ evento.icone }}</div>
          <div class="marker-line"></div>
        </div>

        <!-- Card do Evento -->
        <div class="evento-card">
          <div class="evento-header">
            <div class="evento-titulo">
              <span class="evento-icone">{{ evento.icone }}</span>
              <h3>{{ evento.titulo }}</h3>
              <span
                v-if="evento.prioridade"
                class="prioridade-badge"
                :class="evento.prioridade"
              >
                {{
                  evento.prioridade === "alta"
                    ? "🔥 Alta"
                    : evento.prioridade === "media"
                    ? "⚠️ Média"
                    : "📋 Baixa"
                }}
              </span>
              <span
                v-if="evento.status"
                class="status-badge"
                :class="evento.status"
              >
                {{
                  evento.status === "concluido"
                    ? "✅ Concluído"
                    : evento.status === "andamento"
                    ? "🔄 Em Andamento"
                    : "⏳ Pendente"
                }}
              </span>
            </div>
            <div class="evento-tempo">
              <span class="tempo-relativo">{{ evento.tempoRelativo }}</span>
              <span class="tempo-exato">{{ evento.tempoExato }}</span>
            </div>
          </div>

          <div class="evento-corpo">
            <p class="evento-descricao">{{ evento.descricao }}</p>

            <!-- Metadados do Evento -->
            <div v-if="evento.metadata" class="evento-metadata">
              <div
                v-for="(meta, key) in evento.metadata"
                :key="key"
                class="meta-item"
              >
                <span class="meta-label">{{ key }}:</span>
                <span class="meta-value">{{ meta }}</span>
              </div>
            </div>

            <!-- Ações do Evento -->
            <div
              v-if="evento.acoes && evento.acoes.length > 0"
              class="evento-acoes"
            >
              <button
                v-for="acao in evento.acoes"
                :key="acao.nome"
                class="acao-btn"
                :class="acao.tipo"
                @click="executarAcao(acao, evento)"
              >
                <span class="acao-icone">{{ acao.icone }}</span>
                {{ acao.nome }}
              </button>
            </div>

            <!-- Colaboradores Envolvidos -->
            <div
              v-if="evento.colaboradores && evento.colaboradores.length > 0"
              class="evento-colaboradores"
            >
              <span class="colaboradores-label">Envolvidos:</span>
              <div class="colaboradores-list">
                <div
                  v-for="colab in evento.colaboradores"
                  :key="colab.id"
                  class="colaborador-avatar"
                  :title="colab.nome"
                >
                  {{ colab.avatar }}
                </div>
              </div>
            </div>
          </div>

          <!-- Progresso (para eventos em andamento) -->
          <div
            v-if="evento.status === 'andamento' && evento.progresso"
            class="evento-progresso"
          >
            <div class="progresso-info">
              <span class="progresso-texto"
                >Progresso: {{ evento.progresso }}%</span
              >
              <span class="progresso-tempo">{{ evento.tempoRestante }}</span>
            </div>
            <div class="progresso-bar">
              <div
                class="progresso-fill"
                :style="{ width: evento.progresso + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros Avançados -->
    <div class="filtros-avancados">
      <div class="filtros-header">
        <span class="filtros-titulo">Filtros Avançados</span>
        <button
          class="filtros-toggle"
          @click="mostrarFiltros = !mostrarFiltros"
        >
          {{ mostrarFiltros ? "▲" : "▼" }}
        </button>
      </div>

      <div v-if="mostrarFiltros" class="filtros-conteudo">
        <div class="filtro-grupo">
          <label class="filtro-label">Status:</label>
          <div class="filtro-opcoes">
            <label
              v-for="status in opcoesStatus"
              :key="status"
              class="filtro-opcao"
            >
              <input type="checkbox" v-model="filtros.status" :value="status" />
              <span class="checkmark"></span>
              {{
                status === "concluido"
                  ? "✅ Concluído"
                  : status === "andamento"
                  ? "🔄 Em Andamento"
                  : "⏳ Pendente"
              }}
            </label>
          </div>
        </div>

        <div class="filtro-grupo">
          <label class="filtro-label">Prioridade:</label>
          <div class="filtro-opcoes">
            <label
              v-for="prioridade in opcoesPrioridade"
              :key="prioridade"
              class="filtro-opcao"
            >
              <input
                type="checkbox"
                v-model="filtros.prioridade"
                :value="prioridade"
              />
              <span class="checkmark"></span>
              {{
                prioridade === "alta"
                  ? "🔥 Alta"
                  : prioridade === "media"
                  ? "⚠️ Média"
                  : "📋 Baixa"
              }}
            </label>
          </div>
        </div>

        <div class="filtro-grupo">
          <label class="filtro-label">Setor:</label>
          <div class="filtro-opcoes">
            <label
              v-for="setor in opcoesSetor"
              :key="setor"
              class="filtro-opcao"
            >
              <input type="checkbox" v-model="filtros.setor" :value="setor" />
              <span class="checkmark"></span>
              {{ setor }}
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Carregando atividades...</span>
    </div>

    <!-- Empty State -->
    <div
      v-if="!carregando && eventosFiltrados.length === 0"
      class="empty-state"
    >
      <div class="empty-icon">📭</div>
      <h3>Nenhuma atividade encontrada</h3>
      <p>Tente ajustar os filtros ou período selecionado</p>
      <button class="reset-filtros-btn" @click="resetarFiltros">
        🔄 Redefinir Filtros
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const visualizacaoAtiva = ref("todos");
const periodoSelecionado = ref("semana");
const visualizacaoCompacta = ref(false);
const mostrarFiltros = ref(false);
const carregando = ref(true);

const filtros = ref({
  status: ["concluido", "andamento", "pendente"],
  prioridade: ["alta", "media", "baixa"],
  setor: ["Todos"],
});

const opcoesStatus = ["concluido", "andamento", "pendente"];
const opcoesPrioridade = ["alta", "media", "baixa"];
const opcoesSetor = [
  "Todos",
  "Atendimento",
  "Estoque",
  "Caixa",
  "Limpeza",
  "Qualidade",
];

const eventos = ref([
  {
    id: 1,
    tipo: "auditoria",
    icone: "📋",
    titulo: "Auditoria de Estoque Concluída",
    descricao: "Auditoria completa do setor de estoque realizada com sucesso",
    tempoRelativo: "Há 2 horas",
    tempoExato: "10:30 AM",
    status: "concluido",
    prioridade: "media",
    destaque: true,
    metadata: {
      Setor: "Estoque",
      Conformidade: "94%",
      "Itens Verificados": "156",
    },
    acoes: [
      { nome: "Ver Relatório", icone: "📊", tipo: "primario" },
      { nome: "Exportar", icone: "📥", tipo: "secundario" },
    ],
    colaboradores: [
      { id: 1, nome: "Maria Silva", avatar: "👩‍💼" },
      { id: 2, nome: "João Santos", avatar: "👨‍💼" },
    ],
  },
  {
    id: 2,
    tipo: "alerta",
    icone: "⚠️",
    titulo: "Alerta: Baixo Estoque",
    descricao: "Produtos em falta detectados no setor de alimentos",
    tempoRelativo: "Há 4 horas",
    tempoExato: "08:45 AM",
    status: "pendente",
    prioridade: "alta",
    destaque: true,
    metadata: {
      Setor: "Alimentos",
      "Produtos Afetados": "5",
      Urgência: "Alta",
    },
    acoes: [
      { nome: "Resolver", icone: "🔧", tipo: "alerta" },
      { nome: "Adiar", icone: "⏰", tipo: "secundario" },
    ],
  },
  {
    id: 3,
    tipo: "manutencao",
    icone: "🔧",
    titulo: "Manutenção Preventiva",
    descricao: "Manutenção programada dos equipamentos de caixa",
    tempoRelativo: "Hoje",
    tempoExato: "07:00 AM",
    status: "andamento",
    prioridade: "media",
    progresso: 65,
    tempoRestante: "~2 horas restantes",
    metadata: {
      Setor: "Caixa",
      Equipamentos: "3",
      Técnico: "Carlos Lima",
    },
    acoes: [{ nome: "Acompanhar", icone: "👀", tipo: "primario" }],
  },
  {
    id: 4,
    tipo: "treinamento",
    icone: "🎓",
    titulo: "Treinamento de Equipe",
    descricao: "Capacitação sobre novos procedimentos de atendimento",
    tempoRelativo: "Ontem",
    tempoExato: "14:00 PM",
    status: "concluido",
    prioridade: "baixa",
    metadata: {
      Participantes: "12",
      Duração: "3 horas",
      Instrutor: "Ana Costa",
    },
    colaboradores: [
      { id: 3, nome: "Pedro Alves", avatar: "👨‍💻" },
      { id: 4, nome: "Juliana Rocha", avatar: "👩‍🍳" },
      { id: 5, nome: "Ricardo Souza", avatar: "👨‍🚒" },
    ],
  },
  {
    id: 5,
    tipo: "auditoria",
    icone: "📋",
    titulo: "Auditoria de Limpeza",
    descricao: "Verificação dos padrões de higiene e organização",
    tempoRelativo: "2 dias atrás",
    tempoExato: "09:15 AM",
    status: "concluido",
    prioridade: "media",
    metadata: {
      Setor: "Limpeza",
      Pontuação: "98%",
      Observações: "Excelente",
    },
    acoes: [{ nome: "Ver Detalhes", icone: "📊", tipo: "primario" }],
  },
  {
    id: 6,
    tipo: "reuniao",
    icone: "👥",
    titulo: "Reunião de Performance",
    descricao: "Análise dos resultados do último trimestre",
    tempoRelativo: "3 dias atrás",
    tempoExato: "16:30 PM",
    status: "concluido",
    prioridade: "baixa",
    metadata: {
      Participantes: "8",
      Duração: "1.5 horas",
      Local: "Sala de Reuniões",
    },
  },
]);

const eventosFiltrados = computed(() => {
  return eventos.value.filter((evento) => {
    // Filtro por tipo de visualização
    if (
      visualizacaoAtiva.value !== "todos" &&
      evento.tipo !== visualizacaoAtiva.value
    ) {
      return false;
    }

    // Filtro por status
    if (!filtros.value.status.includes(evento.status)) {
      return false;
    }

    // Filtro por prioridade
    if (!filtros.value.prioridade.includes(evento.prioridade)) {
      return false;
    }

    // Filtro por setor (se aplicável)
    if (
      filtros.value.setor.length > 0 &&
      !filtros.value.setor.includes("Todos")
    ) {
      const setorEvento = evento.metadata?.Setor;
      if (setorEvento && !filtros.value.setor.includes(setorEvento)) {
        return false;
      }
    }

    return true;
  });
});

const executarAcao = (acao, evento) => {
  console.log(`Executando ação: ${acao.nome} no evento: ${evento.titulo}`);
  // Aqui você implementaria a lógica específica para cada ação
};

const resetarFiltros = () => {
  filtros.value = {
    status: ["concluido", "andamento", "pendente"],
    prioridade: ["alta", "media", "baixa"],
    setor: ["Todos"],
  };
  visualizacaoAtiva.value = "todos";
};

onMounted(() => {
  setTimeout(() => {
    carregando.value = false;
  }, 2000);
});
</script>

<style scoped>
.timeline-atividades-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(67, 97, 238, 0.12);
  padding: 2rem;
  margin: 1.5rem auto;
  max-width: 900px;
  position: relative;
  overflow: hidden;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-left {
  flex: 1;
}

.icon-title {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.icon-area {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 0.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-content {
  display: flex;
  flex-direction: column;
}

.titulo {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.25rem 0;
}

.descricao {
  font-size: 1.1rem;
  color: #718096;
  margin: 0;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.view-toggle {
  display: flex;
  background: #f7fafc;
  border-radius: 12px;
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
}

.toggle-btn.active {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #667eea;
}

.filtro-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filtro-select:hover {
  border-color: #667eea;
}

/* Timeline Content */
.timeline-content {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-line {
  position: absolute;
  left: 40px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #667eea, #764ba2, #e2e8f0);
  z-index: 1;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
  animation: slideIn 0.5s ease-out;
  animation-delay: calc(var(--item-order) * 0.1s);
  animation-fill-mode: both;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Timeline Marker */
.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  position: relative;
}

.marker-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: 3px solid #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  z-index: 3;
  transition: all 0.3s ease;
}

.timeline-item:hover .marker-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.marker-line {
  width: 2px;
  flex: 1;
  background: #e2e8f0;
  margin-top: 0.5rem;
}

/* Evento Card */
.evento-card {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 2px solid #f1f5f9;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.evento-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #667eea;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.timeline-item:hover .evento-card::before {
  opacity: 1;
}

.timeline-item:hover .evento-card {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(67, 97, 238, 0.15);
}

/* Destaque para eventos importantes */
.timeline-item.destaque .evento-card {
  border-color: #ffd700;
  background: linear-gradient(135deg, #fffaf0, #fff);
}

.timeline-item.destaque .marker-icon {
  border-color: #ffd700;
  background: #fffaf0;
}

/* Cores por tipo de evento */
.timeline-item.auditoria .marker-icon {
  border-color: #48bb78;
  background: #f0fff4;
}

.timeline-item.alerta .marker-icon {
  border-color: #e53e3e;
  background: #fed7d7;
}

.timeline-item.manutencao .marker-icon {
  border-color: #ed8936;
  background: #fef5e7;
}

.timeline-item.treinamento .marker-icon {
  border-color: #4299e1;
  background: #ebf8ff;
}

.timeline-item.reuniao .marker-icon {
  border-color: #9f7aea;
  background: #faf5ff;
}

/* Evento Header */
.evento-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.evento-titulo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.evento-icone {
  font-size: 1.5rem;
}

.evento-titulo h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
}

.prioridade-badge,
.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.prioridade-badge.alta {
  background: #fed7d7;
  color: #c53030;
}

.prioridade-badge.media {
  background: #fef5e7;
  color: #dd6b20;
}

.prioridade-badge.baixa {
  background: #e6fffa;
  color: #234e52;
}

.status-badge.concluido {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.andamento {
  background: #bee3f8;
  color: #1a365d;
}

.status-badge.pendente {
  background: #fef5e7;
  color: #744210;
}

.evento-tempo {
  text-align: right;
  min-width: 100px;
}

.tempo-relativo {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.tempo-exato {
  font-size: 0.9rem;
  color: #718096;
}

/* Evento Corpo */
.evento-descricao {
  color: #4a5568;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.evento-metadata {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.meta-value {
  font-weight: 500;
  color: #2d3748;
}

.evento-acoes {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.acao-btn {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.acao-btn.primario {
  background: #667eea;
  color: white;
}

.acao-btn.primario:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.acao-btn.secundario {
  background: #e2e8f0;
  color: #4a5568;
}

.acao-btn.secundario:hover {
  background: #cbd5e0;
}

.acao-btn.alerta {
  background: #fed7d7;
  color: #c53030;
}

.acao-btn.alerta:hover {
  background: #feb2b2;
}

.evento-colaboradores {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.colaboradores-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
}

.colaboradores-list {
  display: flex;
  gap: 0.5rem;
}

.colaborador-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.colaborador-avatar:hover {
  transform: scale(1.1);
}

/* Progresso */
.evento-progresso {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.progresso-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progresso-texto {
  font-weight: 600;
  color: #2d3748;
}

.progresso-tempo {
  font-size: 0.9rem;
  color: #718096;
}

.progresso-bar {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progresso-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78, #68d391);
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* Filtros Avançados */
.filtros-avancados {
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.filtros-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filtros-titulo {
  font-weight: 600;
  color: #2d3748;
}

.filtros-toggle {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #718096;
  padding: 0.25rem;
}

.filtros-conteudo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filtro-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.filtro-opcoes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filtro-opcao {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.filtro-opcao input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.filtro-opcao input:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.filtro-opcao input:checked + .checkmark::after {
  content: "✓";
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
}

/* Loading State */
.loading-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: 20px;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #718096;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #4a5568;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
}

.reset-filtros-btn {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-filtros-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

/* Responsividade */
@media (max-width: 768px) {
  .timeline-atividades-container {
    padding: 1.5rem;
    margin: 1rem;
  }

  .timeline-header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-controls {
    width: 100%;
    flex-direction: column;
  }

  .view-toggle {
    width: 100%;
  }

  .toggle-btn {
    flex: 1;
    text-align: center;
  }

  .timeline-item {
    flex-direction: column;
    gap: 1rem;
  }

  .timeline-marker {
    flex-direction: row;
    min-width: auto;
    width: 100%;
    gap: 1rem;
  }

  .marker-line {
    width: 100%;
    height: 2px;
    margin-top: 0;
  }

  .timeline-line {
    display: none;
  }

  .evento-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .evento-tempo {
    text-align: left;
  }

  .evento-metadata {
    grid-template-columns: 1fr;
  }

  .filtros-conteudo {
    grid-template-columns: 1fr;
  }

  .evento-acoes {
    justify-content: center;
  }
}
</style>
