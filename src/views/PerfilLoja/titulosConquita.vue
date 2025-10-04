<template>
  <div class="titulos-conquistas-container">
    <!-- Header -->
    <div class="section-header">
      <div class="header-main">
        <div class="title-section">
          <div class="title-icon">🏆</div>
          <div class="title-content">
            <h2>Títulos e Conquistas</h2>
            <p>Celebre as vitórias e reconhecimentos conquistados pela loja</p>
          </div>
        </div>
        <div class="header-controls">
          <div class="filter-group">
            <div class="filter-item">
              <label class="filter-label">Filtrar por:</label>
              <select v-model="filtroSelecionado" class="filter-select">
                <option value="todos">Todos os Títulos</option>
                <option value="qualidade">Qualidade</option>
                <option value="desempenho">Desempenho</option>
                <option value="atendimento">Atendimento</option>
                <option value="sustentabilidade">Sustentabilidade</option>
                <option value="inovacao">Inovação</option>
              </select>
            </div>
            <div class="filter-item">
              <label class="filter-label">Ordenar por:</label>
              <select v-model="ordenacaoSelecionada" class="filter-select">
                <option value="recente">Mais Recentes</option>
                <option value="antigo">Mais Antigos</option>
                <option value="nivel">Nível de Conquista</option>
                <option value="alfabeto">Ordem Alfabética</option>
              </select>
            </div>
          </div>
          <div class="header-actions">
            <button
              class="action-btn secondary"
              @click="compartilharConquistas"
            >
              📤 Compartilhar
            </button>
            <button class="action-btn primary" @click="alternarVisualizacao">
              {{
                visualizacaoGaleria
                  ? "Visualização em Lista"
                  : "Visualização em Galeria"
              }}
            </button>
          </div>
        </div>
      </div>

      <!-- Cards de Resumo -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon total">🏆</div>
          <div class="summary-content">
            <div class="summary-value">{{ totalConquistas }}</div>
            <div class="summary-label">Total de Conquistas</div>
            <div class="summary-trend positive">
              +{{ novasConquistas }} este ano
            </div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon ouro">🥇</div>
          <div class="summary-content">
            <div class="summary-value">{{ conquistasOuro }}</div>
            <div class="summary-label">Conquistas de Ouro</div>
            <div class="summary-trend positive">Nível Máximo</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon sequencia">📅</div>
          <div class="summary-content">
            <div class="summary-value">{{ sequenciaAtual }} dias</div>
            <div class="summary-label">Sequência Atual</div>
            <div class="summary-trend positive">+{{ variacaoSequencia }}%</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon proxima">🎯</div>
          <div class="summary-content">
            <div class="summary-value">{{ proximasConquistas }}</div>
            <div class="summary-label">Próximas Conquistas</div>
            <div class="summary-trend">{{ progressoProximas }}% próximo</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conquistas em Destaque -->
    <div class="destaques-section">
      <div class="section-subheader">
        <h3>⭐ Conquistas em Destaque</h3>
        <span class="subheader-desc"
          >Títulos mais recentes e significativos</span
        >
      </div>

      <div class="destaques-grid">
        <div
          v-for="conquista in conquistasDestaque"
          :key="conquista.id"
          class="destaque-card"
          :class="conquista.nivel"
          @click="verDetalhesConquista(conquista)"
        >
          <div class="destaque-badge">
            <div class="badge-icon">{{ conquista.icone }}</div>
            <div class="badge-level" :class="conquista.nivel">
              {{ getNivelTexto(conquista.nivel) }}
            </div>
          </div>
          <div class="destaque-content">
            <h4>{{ conquista.titulo }}</h4>
            <p>{{ conquista.descricao }}</p>
            <div class="destaque-meta">
              <span class="meta-data">🏅 {{ conquista.categoria }}</span>
              <span class="meta-data"
                >📅 {{ formatarData(conquista.dataConquista) }}</span
              >
            </div>
          </div>
          <div class="destaque-actions">
            <button
              class="action-btn small"
              @click.stop="compartilharConquista(conquista)"
            >
              📤
            </button>
          </div>
          <div class="destaque-ribbon" v-if="conquista.recente">NOVO</div>
        </div>
      </div>
    </div>

    <!-- Todas as Conquistas -->
    <div class="conquistas-section">
      <div class="section-subheader">
        <h3>📜 Todas as Conquistas</h3>
        <div class="list-controls">
          <span class="total-conquistas"
            >{{ conquistasFiltradas.length }} conquistas</span
          >
          <div class="view-options">
            <button
              class="view-option"
              :class="{ active: visualizacaoGaleria }"
              @click="visualizacaoGaleria = true"
            >
              🖼️ Galeria
            </button>
            <button
              class="view-option"
              :class="{ active: !visualizacaoGaleria }"
              @click="visualizacaoGaleria = false"
            >
              📋 Lista
            </button>
          </div>
        </div>
      </div>

      <!-- Visualização em Galeria -->
      <div v-if="visualizacaoGaleria" class="conquistas-grid">
        <div
          v-for="conquista in conquistasFiltradas"
          :key="conquista.id"
          class="conquista-card"
          :class="[
            conquista.nivel,
            {
              recente: conquista.recente,
              selecionada: conquistaSelecionada?.id === conquista.id,
            },
          ]"
          @click="verDetalhesConquista(conquista)"
        >
          <div class="conquista-header">
            <div class="conquista-icon">{{ conquista.icone }}</div>
            <div class="conquista-level" :class="conquista.nivel">
              {{ getNivelTexto(conquista.nivel) }}
            </div>
          </div>

          <div class="conquista-content">
            <h4>{{ conquista.titulo }}</h4>
            <p>{{ conquista.descricao }}</p>

            <div class="conquista-stats">
              <div class="stat">
                <span class="stat-value">{{ conquista.pontos }}</span>
                <span class="stat-label">Pontos</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ conquista.duracao }}</span>
                <span class="stat-label">Dias</span>
              </div>
            </div>

            <div class="conquista-meta">
              <span class="meta-item">
                <span class="meta-icon">🏷️</span>
                {{ conquista.categoria }}
              </span>
              <span class="meta-item">
                <span class="meta-icon">📅</span>
                {{ formatarData(conquista.dataConquista) }}
              </span>
            </div>
          </div>

          <div class="conquista-footer">
            <div class="conquista-progress" v-if="conquista.proximoNivel">
              <div class="progress-label">
                <span
                  >Próximo nível:
                  {{ conquista.proximoNivel.pontosNecessarios }} pontos</span
                >
                <span>{{ conquista.proximoNivel.progresso }}%</span>
              </div>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: conquista.proximoNivel.progresso + '%' }"
                ></div>
              </div>
            </div>
            <div class="conquista-actions">
              <button
                class="action-btn small"
                @click.stop="compartilharConquista(conquista)"
              >
                📤
              </button>
              <button
                class="action-btn small"
                @click.stop="verDetalhesConquista(conquista)"
              >
                🔍
              </button>
            </div>
          </div>

          <div class="conquista-badge" v-if="conquista.recente">
            <span>NOVO</span>
          </div>
        </div>
      </div>

      <!-- Visualização em Lista -->
      <div v-else class="conquistas-list">
        <div
          v-for="conquista in conquistasFiltradas"
          :key="conquista.id"
          class="conquista-list-item"
          :class="[conquista.nivel, { recente: conquista.recente }]"
          @click="verDetalhesConquista(conquista)"
        >
          <div class="list-icon">{{ conquista.icone }}</div>

          <div class="list-content">
            <div class="list-header">
              <h4>{{ conquista.titulo }}</h4>
              <div class="list-badges">
                <span class="level-badge" :class="conquista.nivel">
                  {{ getNivelTexto(conquista.nivel) }}
                </span>
                <span v-if="conquista.recente" class="recente-badge">NOVO</span>
              </div>
            </div>
            <p class="list-description">{{ conquista.descricao }}</p>
            <div class="list-meta">
              <span class="meta-item">
                <span class="meta-icon">🏷️</span>
                {{ conquista.categoria }}
              </span>
              <span class="meta-item">
                <span class="meta-icon">📅</span>
                {{ formatarData(conquista.dataConquista) }}
              </span>
              <span class="meta-item">
                <span class="meta-icon">⭐</span>
                {{ conquista.pontos }} pontos
              </span>
            </div>
          </div>

          <div class="list-actions">
            <button
              class="action-btn small"
              @click.stop="compartilharConquista(conquista)"
            >
              📤
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Conquistas em Andamento -->
    <div class="andamento-section">
      <div class="section-subheader">
        <h3>🚀 Em Busca da Próxima Conquista</h3>
        <span class="subheader-desc"
          >Títulos que estão próximos de serem alcançados</span
        >
      </div>

      <div class="andamento-grid">
        <div
          v-for="conquista in conquistasAndamento"
          :key="conquista.id"
          class="andamento-card"
        >
          <div class="andamento-header">
            <div class="andamento-icon">{{ conquista.icone }}</div>
            <div class="andamento-info">
              <h4>{{ conquista.titulo }}</h4>
              <span class="andamento-categoria">{{ conquista.categoria }}</span>
            </div>
          </div>

          <div class="andamento-progress">
            <div class="progress-info">
              <span class="progress-text"
                >Progresso: {{ conquista.progresso }}%</span
              >
              <span class="progress-remaining"
                >{{ conquista.restante }} restantes</span
              >
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: conquista.progresso + '%' }"
              ></div>
            </div>
          </div>

          <div class="andamento-meta">
            <div class="meta-item">
              <span class="meta-label">Próximo Nível:</span>
              <span class="meta-value">{{ conquista.proximoNivel }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Recompensa:</span>
              <span class="meta-value">{{ conquista.recompensa }}</span>
            </div>
          </div>

          <div class="andamento-actions">
            <button
              class="action-btn small"
              @click="verDetalhesAndamento(conquista)"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes da Conquista -->
    <div v-if="conquistaSelecionada" class="modal-overlay" @click="fecharModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <div class="modal-icon">{{ conquistaSelecionada.icone }}</div>
            <div class="modal-info">
              <h3>{{ conquistaSelecionada.titulo }}</h3>
              <div class="modal-meta">
                <span class="modal-level" :class="conquistaSelecionada.nivel">
                  {{ getNivelTexto(conquistaSelecionada.nivel) }}
                </span>
                <span class="modal-categoria">{{
                  conquistaSelecionada.categoria
                }}</span>
              </div>
            </div>
          </div>
          <button class="modal-close" @click="fecharModal">×</button>
        </div>

        <div class="modal-body">
          <div class="conquista-detalhes">
            <div class="detalhes-header">
              <div class="detalhes-stats">
                <div class="stat-card">
                  <div class="stat-icon">⭐</div>
                  <div class="stat-content">
                    <span class="stat-value">{{
                      conquistaSelecionada.pontos
                    }}</span>
                    <span class="stat-label">Pontos Conquistados</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">📅</div>
                  <div class="stat-content">
                    <span class="stat-value">{{
                      formatarData(conquistaSelecionada.dataConquista)
                    }}</span>
                    <span class="stat-label">Data da Conquista</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">⏱️</div>
                  <div class="stat-content">
                    <span class="stat-value"
                      >{{ conquistaSelecionada.duracao }} dias</span
                    >
                    <span class="stat-label">Duração para Conquistar</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="detalhes-content">
              <h4>📝 Descrição</h4>
              <p>{{ conquistaSelecionada.descricao }}</p>

              <div
                class="detalhes-criterios"
                v-if="conquistaSelecionada.criterios"
              >
                <h4>🎯 Critérios de Conquista</h4>
                <ul class="criterios-list">
                  <li
                    v-for="(criterio, index) in conquistaSelecionada.criterios"
                    :key="index"
                    class="criterio-item"
                  >
                    <span class="criterio-icon">✅</span>
                    <span>{{ criterio }}</span>
                  </li>
                </ul>
              </div>

              <div
                class="detalhes-beneficios"
                v-if="conquistaSelecionada.beneficios"
              >
                <h4>💎 Benefícios Obtidos</h4>
                <div class="beneficios-grid">
                  <div
                    v-for="(
                      beneficio, index
                    ) in conquistaSelecionada.beneficios"
                    :key="index"
                    class="beneficio-item"
                  >
                    <div class="beneficio-icon">✨</div>
                    <span class="beneficio-text">{{ beneficio }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="detalhes-acoes">
              <h4>🎉 Celebrar Conquista</h4>
              <div class="acoes-grid">
                <button
                  class="acao-btn primary"
                  @click="compartilharConquista(conquistaSelecionada)"
                >
                  📤 Compartilhar nas Redes
                </button>
                <button
                  class="acao-btn secondary"
                  @click="baixarCertificado(conquistaSelecionada)"
                >
                  📄 Baixar Certificado
                </button>
                <button
                  class="acao-btn secondary"
                  @click="compartilharTime(conquistaSelecionada)"
                >
                  👥 Compartilhar com Time
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-state">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <span>Carregando conquistas...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

// Estado do componente
const filtroSelecionado = ref("todos");
const ordenacaoSelecionada = ref("recente");
const visualizacaoGaleria = ref(true);
const conquistaSelecionada = ref(null);
const carregando = ref(true);

// Dados das conquistas
const conquistas = ref([
  {
    id: 1,
    titulo: "Excelência em Qualidade",
    descricao: "Mantido 95%+ de conformidade por 3 meses consecutivos",
    icone: "⭐",
    nivel: "ouro",
    categoria: "qualidade",
    pontos: 1000,
    dataConquista: "2024-01-15",
    duracao: 90,
    recente: true,
    criterios: [
      "Conformidade acima de 95% por 3 meses",
      "Zero reclamações de qualidade",
      "Auditorias internas com nota máxima",
    ],
    beneficios: [
      "Certificado de Excelência",
      "Destaque no ranking regional",
      "Bonificação especial para equipe",
    ],
  },
  {
    id: 2,
    titulo: "Atendimento 5 Estrelas",
    descricao: "Avaliação máxima em satisfação do cliente por 6 meses",
    icone: "💫",
    nivel: "ouro",
    categoria: "atendimento",
    pontos: 950,
    dataConquista: "2024-01-10",
    duracao: 180,
    recente: false,
    criterios: [
      "Avaliação 5 estrelas consecutivas",
      "Tempo de espera abaixo de 2 minutos",
      "100% de resolução no primeiro contato",
    ],
    beneficios: [
      "Certificado de Atendimento",
      "Reconhecimento na rede",
      "Treinamento especializado",
    ],
  },
  {
    id: 3,
    titulo: "Líder em Sustentabilidade",
    descricao: "Implementação completa de práticas sustentáveis",
    icone: "🌱",
    nivel: "prata",
    categoria: "sustentabilidade",
    pontos: 800,
    dataConquista: "2024-01-05",
    duracao: 120,
    recente: false,
    criterios: [
      "Redução de 40% no consumo energético",
      "100% de reciclagem de resíduos",
      "Uso de materiais sustentáveis",
    ],
  },
  {
    id: 4,
    titulo: "Inovação em Processos",
    descricao: "Implementação de 5 melhorias significativas nos processos",
    icone: "💡",
    nivel: "prata",
    categoria: "inovacao",
    pontos: 750,
    dataConquista: "2023-12-20",
    duracao: 60,
    recente: false,
  },
  {
    id: 5,
    titulo: "Segurança Exemplar",
    descricao: "365 dias sem acidentes ou incidentes de segurança",
    icone: "🛡️",
    nivel: "bronze",
    categoria: "desempenho",
    pontos: 600,
    dataConquista: "2023-12-15",
    duracao: 365,
    recente: false,
  },
  {
    id: 6,
    titulo: "Eficiência Operacional",
    descricao: "Redução de 25% no tempo dos processos operacionais",
    icone: "⚡",
    nivel: "bronze",
    categoria: "desempenho",
    pontos: 550,
    dataConquista: "2023-12-10",
    duracao: 90,
    recente: false,
  },
  {
    id: 7,
    titulo: "Compromisso com a Comunidade",
    descricao: "Mais de 100 horas de trabalho voluntário da equipe",
    icone: "🤝",
    nivel: "bronze",
    categoria: "sustentabilidade",
    pontos: 500,
    dataConquista: "2023-12-05",
    duracao: 365,
    recente: false,
  },
  {
    id: 8,
    titulo: "Padrão Ouro em Limpeza",
    descricao: "Avaliação perfeita em todas as inspeções de limpeza",
    icone: "✨",
    nivel: "ouro",
    categoria: "qualidade",
    pontos: 900,
    dataConquista: "2024-01-20",
    duracao: 30,
    recente: true,
  },
]);

// Conquistas em andamento
const conquistasAndamento = ref([
  {
    id: 101,
    titulo: "Mestre da Qualidade",
    icone: "🏅",
    categoria: "qualidade",
    progresso: 75,
    restante: "25%",
    proximoNivel: "Diamante",
    recompensa: "Certificado Premium + Bonificação",
  },
  {
    id: 102,
    titulo: "Líder em Vendas",
    icone: "📈",
    categoria: "desempenho",
    progresso: 60,
    restante: "40%",
    proximoNivel: "Ouro",
    recompensa: "Reconhecimento Nacional",
  },
  {
    id: 103,
    titulo: "Sustentabilidade Total",
    icone: "🌍",
    categoria: "sustentabilidade",
    progresso: 45,
    restante: "55%",
    proximoNivel: "Platina",
    recompensa: "Certificação Green Business",
  },
]);

// Computed properties
const conquistasFiltradas = computed(() => {
  let filtradas = [...conquistas.value];

  // Filtro por categoria
  if (filtroSelecionado.value !== "todos") {
    filtradas = filtradas.filter(
      (conquista) => conquista.categoria === filtroSelecionado.value
    );
  }

  // Ordenação
  switch (ordenacaoSelecionada.value) {
    case "antigo":
      return filtradas.sort(
        (a, b) => new Date(a.dataConquista) - new Date(b.dataConquista)
      );
    case "nivel":
      const nivelOrder = { ouro: 3, prata: 2, bronze: 1 };
      return filtradas.sort(
        (a, b) => nivelOrder[b.nivel] - nivelOrder[a.nivel]
      );
    case "alfabeto":
      return filtradas.sort((a, b) => a.titulo.localeCompare(b.titulo));
    case "recente":
    default:
      return filtradas.sort(
        (a, b) => new Date(b.dataConquista) - new Date(a.dataConquista)
      );
  }
});

const conquistasDestaque = computed(() => {
  return conquistasFiltradas.value
    .filter((conquista) => conquista.recente || conquista.nivel === "ouro")
    .slice(0, 3);
});

const totalConquistas = computed(() => conquistas.value.length);

const conquistasOuro = computed(() => {
  return conquistas.value.filter((conquista) => conquista.nivel === "ouro")
    .length;
});

const novasConquistas = computed(() => {
  const currentYear = new Date().getFullYear();
  return conquistas.value.filter(
    (conquista) =>
      new Date(conquista.dataConquista).getFullYear() === currentYear
  ).length;
});

const sequenciaAtual = computed(() => 45); // Exemplo
const variacaoSequencia = computed(() => 12); // Exemplo

const proximasConquistas = computed(() => conquistasAndamento.value.length);
const progressoProximas = computed(() => {
  const totalProgress = conquistasAndamento.value.reduce(
    (sum, conquista) => sum + conquista.progresso,
    0
  );
  return Math.round(totalProgress / conquistasAndamento.value.length);
});

// Métodos
const getNivelTexto = (nivel) => {
  const niveis = {
    ouro: "Ouro",
    prata: "Prata",
    bronze: "Bronze",
  };
  return niveis[nivel] || nivel;
};

const formatarData = (data) => {
  return new Date(data).toLocaleDateString("pt-BR");
};

const verDetalhesConquista = (conquista) => {
  conquistaSelecionada.value = conquista;
};

const fecharModal = () => {
  conquistaSelecionada.value = null;
};

const alternarVisualizacao = () => {
  visualizacaoGaleria.value = !visualizacaoGaleria.value;
};

const compartilharConquistas = () => {
  console.log("Compartilhando todas as conquistas...");
  alert("Conquistas compartilhadas com sucesso!");
};

const compartilharConquista = (conquista) => {
  console.log("Compartilhando conquista:", conquista.titulo);
  alert(`Conquista "${conquista.titulo}" compartilhada!`);
};

const baixarCertificado = (conquista) => {
  console.log("Baixando certificado para:", conquista.titulo);
  alert(`Certificado da conquista "${conquista.titulo}" baixado!`);
};

const compartilharTime = (conquista) => {
  console.log("Compartilhando com o time:", conquista.titulo);
  alert(`Conquista "${conquista.titulo}" compartilhada com o time!`);
};

const verDetalhesAndamento = (conquista) => {
  console.log("Vendo detalhes da conquista em andamento:", conquista.titulo);
  alert(`Detalhes da conquista "${conquista.titulo}"`);
};

onMounted(() => {
  // Simular carregamento de dados
  setTimeout(() => {
    carregando.value = false;
  }, 2000);
});
</script>

<style scoped>
.titulos-conquistas-container {
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
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  gap: 1.5rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  color: #4a5568;
  cursor: pointer;
  min-width: 160px;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.primary:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-btn.secondary {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
}

.action-btn.secondary:hover {
  background: #f8fafc;
}

.action-btn.small {
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.action-btn.small:hover {
  background: #f7fafc;
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.summary-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.summary-icon.total {
  background: rgba(102, 126, 234, 0.1);
}

.summary-icon.ouro {
  background: rgba(255, 215, 0, 0.1);
}

.summary-icon.sequencia {
  background: rgba(76, 175, 80, 0.1);
}

.summary-icon.proxima {
  background: rgba(156, 39, 176, 0.1);
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.summary-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.summary-trend {
  font-size: 0.8rem;
  font-weight: 600;
}

.summary-trend.positive {
  color: #4caf50;
}

/* Destaques Section */
.destaques-section {
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.section-subheader {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}

.section-subheader h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.subheader-desc {
  color: #718096;
  font-size: 0.9rem;
}

.destaques-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.destaque-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.destaque-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(67, 97, 238, 0.15);
}

.destaque-card.ouro {
  border-color: #ffd700;
  background: linear-gradient(135deg, #fff9e6, #fff);
}

.destaque-card.prata {
  border-color: #c0c0c0;
  background: linear-gradient(135deg, #f8f8f8, #fff);
}

.destaque-card.bronze {
  border-color: #cd7f32;
  background: linear-gradient(135deg, #fdf6e6, #fff);
}

.destaque-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.badge-icon {
  font-size: 2.5rem;
}

.badge-level {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.badge-level.ouro {
  background: #ffd700;
  color: #000;
}

.badge-level.prata {
  background: #c0c0c0;
  color: #000;
}

.badge-level.bronze {
  background: #cd7f32;
  color: #fff;
}

.destaque-content h4 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.destaque-content p {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 1rem 0;
}

.destaque-meta {
  display: flex;
  gap: 1rem;
}

.meta-data {
  font-size: 0.8rem;
  color: #a0aec0;
}

.destaque-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.destaque-ribbon {
  position: absolute;
  top: 1rem;
  left: -2rem;
  background: #667eea;
  color: white;
  padding: 0.25rem 2rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  transform: rotate(-45deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Conquistas Section */
.conquistas-section {
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.list-controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.total-conquistas {
  color: #718096;
  font-weight: 500;
}

.view-options {
  display: flex;
  background: #f7fafc;
  border-radius: 8px;
  padding: 4px;
}

.view-option {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.view-option.active {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #667eea;
}

/* Grid de Conquistas */
.conquistas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.conquista-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.conquista-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.conquista-card.selecionada {
  border-color: #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

.conquista-card.ouro {
  border-left: 4px solid #ffd700;
}

.conquista-card.prata {
  border-left: 4px solid #c0c0c0;
}

.conquista-card.bronze {
  border-left: 4px solid #cd7f32;
}

.conquista-card.recente {
  background: linear-gradient(135deg, #f0fff4, #fff);
}

.conquista-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.conquista-icon {
  font-size: 2.5rem;
}

.conquista-level {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.conquista-level.ouro {
  background: #ffd700;
  color: #000;
}

.conquista-level.prata {
  background: #c0c0c0;
  color: #000;
}

.conquista-level.bronze {
  background: #cd7f32;
  color: #fff;
}

.conquista-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.conquista-content p {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 1rem 0;
}

.conquista-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-weight: 700;
  color: #2d3748;
  font-size: 1.1rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #718096;
}

.conquista-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #a0aec0;
}

.meta-icon {
  font-size: 0.9rem;
}

.conquista-footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

.conquista-progress {
  margin-bottom: 1rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: #718096;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #667eea;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.conquista-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.conquista-badge {
  position: absolute;
  top: 1rem;
  right: -2rem;
  background: #667eea;
  color: white;
  padding: 0.25rem 2rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  transform: rotate(45deg);
}

/* Lista de Conquistas */
.conquistas-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.conquista-list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.conquista-list-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.conquista-list-item.ouro {
  border-left-color: #ffd700;
  background: linear-gradient(135deg, #fff9e6, #fff);
}

.conquista-list-item.prata {
  border-left-color: #c0c0c0;
  background: linear-gradient(135deg, #f8f8f8, #fff);
}

.conquista-list-item.bronze {
  border-left-color: #cd7f32;
  background: linear-gradient(135deg, #fdf6e6, #fff);
}

.conquista-list-item.recente {
  background: linear-gradient(135deg, #f0fff4, #fff);
}

.list-icon {
  font-size: 2rem;
  min-width: 40px;
}

.list-content {
  flex: 1;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.list-header h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.list-badges {
  display: flex;
  gap: 0.5rem;
}

.level-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.level-badge.ouro {
  background: #ffd700;
  color: #000;
}

.level-badge.prata {
  background: #c0c0c0;
  color: #000;
}

.level-badge.bronze {
  background: #cd7f32;
  color: #fff;
}

.recente-badge {
  padding: 0.25rem 0.75rem;
  background: #667eea;
  color: white;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.list-description {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 0.5rem 0;
}

.list-meta {
  display: flex;
  gap: 1.5rem;
}

.list-actions {
  display: flex;
  gap: 0.5rem;
}

/* Andamento Section */
.andamento-section {
  padding: 2rem;
}

.andamento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.andamento-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.andamento-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.andamento-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.andamento-icon {
  font-size: 2rem;
}

.andamento-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}

.andamento-categoria {
  font-size: 0.9rem;
  color: #718096;
}

.andamento-progress {
  margin-bottom: 1rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #718096;
}

.andamento-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-label {
  font-size: 0.8rem;
  color: #718096;
}

.meta-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
}

.andamento-actions {
  display: flex;
  justify-content: flex-end;
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
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalAppear 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
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
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-icon {
  font-size: 3rem;
}

.modal-info h3 {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.modal-meta {
  display: flex;
  gap: 1rem;
}

.modal-level {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.modal-level.ouro {
  background: #ffd700;
  color: #000;
}

.modal-level.prata {
  background: #c0c0c0;
  color: #000;
}

.modal-level.bronze {
  background: #cd7f32;
  color: #fff;
}

.modal-categoria {
  color: #718096;
  font-size: 0.9rem;
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

.detalhes-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  text-align: center;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.25rem;
  display: block;
}

.stat-label {
  font-size: 0.8rem;
  color: #718096;
}

.detalhes-content {
  margin-bottom: 2rem;
}

.detalhes-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
}

.detalhes-content p {
  color: #718096;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.criterios-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.criterio-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.criterio-item:last-child {
  border-bottom: none;
}

.criterio-icon {
  font-size: 1rem;
  margin-top: 0.1rem;
}

.beneficios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.beneficio-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f0fff4;
  border-radius: 8px;
  border: 1px solid #c6f6d5;
}

.beneficio-icon {
  font-size: 1.2rem;
}

.beneficio-text {
  font-size: 0.9rem;
  color: #22543d;
  font-weight: 500;
}

.detalhes-acoes {
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
}

.detalhes-acoes h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  text-align: center;
}

.acoes-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
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
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  z-index: 100;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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

/* Responsividade */
@media (max-width: 1024px) {
  .destaques-grid,
  .conquistas-grid,
  .andamento-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .detalhes-stats {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .section-header,
  .destaques-section,
  .conquistas-section,
  .andamento-section {
    padding: 1.5rem;
  }

  .header-main {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-controls {
    align-items: stretch;
    width: 100%;
  }

  .filter-group {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    justify-content: space-between;
  }

  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-subheader {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .list-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .conquista-list-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }

  .list-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .detalhes-stats {
    grid-template-columns: 1fr;
  }

  .beneficios-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }
}

@media (max-width: 480px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .destaques-grid,
  .conquistas-grid,
  .andamento-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
  }

  .view-options {
    flex-direction: column;
  }
}
</style>
