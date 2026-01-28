<template>
  <div class="dashboard-analytics">
    <!-- Header com Filtros -->
    <div class="dashboard-header">
      <div class="filters-section">
        <div class="filter-group">
          <label>Período:</label>
          <select v-model="filters.periodo" @change="atualizarDados">
            <option value="diario">Diário</option>
            <option value="semanal">Semanal</option>
            <option value="mensal">Mensal</option>
          </select>
        </div>
        <!-- tetste -->
        <div class="filter-group">
          <label>Loja:</label>
          <select v-model="filters.loja" @change="atualizarDados">
            <option value="todas">Todas as Lojas</option>
            <option v-for="loja in lojas" :key="loja._id" :value="loja._id">
              {{ loja.nome }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Tipo Auditoria:</label>
          <select v-model="filters.tipoAuditoria" @change="atualizarDados">
            <option value="todos">Todos</option>
            <option value="etiqueta">Etiquetas</option>
            <option value="ruptura">Rupturas</option>
            <option value="presenca">Presenças</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Data Início:</label>
          <input
            type="date"
            v-model="filters.dataInicio"
            @change="atualizarDados"
          />
        </div>

        <div class="filter-group">
          <label>Data Fim:</label>
          <input
            type="date"
            v-model="filters.dataFim"
            @change="atualizarDados"
          />
        </div>
      </div>

      <div class="header-actions">
        <button class="btn-primary" @click="exportarRelatorio">
          📊 Exportar Relatório
        </button>
        <button class="btn-secondary" @click="atualizarDados">
          🔄 Atualizar
        </button>
      </div>
    </div>

    <!-- Cards de Métricas Principais -->
    <div class="metrics-cards">
      <div class="metric-card">
        <div class="metric-icon">📈</div>
        <div class="metric-info">
          <h3>
            {{
              formatarNumero(dashboardData.totais?.totalItensProcessados || 0)
            }}
          </h3>
          <p>Itens Processados</p>
        </div>
        <div
          class="metric-trend"
          :class="getTrendClass(dashboardData.tendencias?.crescimentoItens)"
        >
          {{ getTrendIcon(dashboardData.tendencias?.crescimentoItens) }}
          {{ Math.abs(dashboardData.tendencias?.crescimentoItens || 0) }}%
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">✅</div>
        <div class="metric-info">
          <h3>{{ dashboardData.totais?.percentualConclusaoGeral || 0 }}%</h3>
          <p>Conclusão Geral</p>
        </div>
        <div
          class="metric-trend"
          :class="getTrendClass(dashboardData.tendencias?.melhoriaQualidade)"
        >
          {{ getTrendIcon(dashboardData.tendencias?.melhoriaQualidade) }}
          {{ Math.abs(dashboardData.tendencias?.melhoriaQualidade || 0) }}%
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">👥</div>
        <div class="metric-info">
          <h3>
            {{ formatarNumero(dashboardData.totais?.usuariosAtivos || 0) }}
          </h3>
          <p>Usuários Ativos</p>
        </div>
        <div
          class="metric-trend"
          :class="getTrendClass(dashboardData.tendencias?.crescimentoUsuarios)"
        >
          {{ getTrendIcon(dashboardData.tendencias?.crescimentoUsuarios) }}
          {{ Math.abs(dashboardData.tendencias?.crescimentoUsuarios || 0) }}%
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">💰</div>
        <div class="metric-info">
          <h3>
            R$
            {{ formatarMoeda(dashboardData.rupturas?.custoTotalRuptura || 0) }}
          </h3>
          <p>Custo Ruptura</p>
        </div>
        <div class="metric-trend negative">📉 Economia Potencial</div>
      </div>
    </div>

    <!-- Gráficos Principais -->
    <div class="charts-grid">
      <!-- Gráfico de Conclusão por Tipo -->
      <div class="chart-container">
        <h3>Conclusão por Tipo de Auditoria</h3>
        <div class="chart-wrapper">
          <canvas ref="conclusaoChart"></canvas>
        </div>
      </div>

      <!-- Gráfico de Tendência Temporal -->
      <div class="chart-container">
        <h3>Evolução da Performance</h3>
        <div class="chart-wrapper">
          <canvas ref="tendenciaChart"></canvas>
        </div>
      </div>

      <!-- Gráfico de Distribuição por Situação -->
      <div class="chart-container">
        <h3>Distribuição de Situações - Etiquetas</h3>
        <div class="chart-wrapper">
          <canvas ref="situacaoChart"></canvas>
        </div>
      </div>

      <!-- Mapa de Calor de Locais -->
      <div class="chart-container full-width">
        <h3>Performance por Local/Setor</h3>
        <div class="chart-wrapper">
          <canvas ref="heatmapChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Rankings e Tabelas -->
    <div class="tables-section">
      <div class="table-container">
        <h3>🏆 Ranking de Lojas</h3>
        <div class="table-wrapper">
          <table class="ranking-table">
            <thead>
              <tr>
                <th>Posição</th>
                <th>Loja</th>
                <th>Conclusão</th>
                <th>Pontuação</th>
                <th>Usuários Ativos</th>
                <th>Tendência</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(loja, index) in dashboardData.rankingLojas"
                :key="loja._id"
              >
                <td class="position-cell">
                  <span
                    class="position-badge"
                    :class="getPositionClass(index + 1)"
                  >
                    {{ index + 1 }}
                  </span>
                </td>
                <td class="loja-info">
                  <strong>{{ loja.nome }}</strong>
                  <small>{{ loja.cidade }} - {{ loja.regiao }}</small>
                </td>
                <td>
                  <div class="progress-container">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: loja.percentualConclusao + '%' }"
                        :class="getProgressClass(loja.percentualConclusao)"
                      ></div>
                    </div>
                    <span>{{ loja.percentualConclusao }}%</span>
                  </div>
                </td>
                <td class="score">{{ loja.pontuacao }}</td>
                <td>{{ loja.usuariosAtivos }}</td>
                <td>
                  <span
                    class="trend-indicator"
                    :class="getTrendClass(loja.variacao)"
                  >
                    {{ getTrendIcon(loja.variacao) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="table-container">
        <h3>👤 Ranking de Usuários</h3>
        <div class="table-wrapper">
          <table class="ranking-table">
            <thead>
              <tr>
                <th>Posição</th>
                <th>Usuário</th>
                <th>Loja</th>
                <th>Itens Processados</th>
                <th>Conquistas</th>
                <th>Nível</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(usuario, index) in dashboardData.rankingUsuarios"
                :key="usuario.usuarioId"
              >
                <td class="position-cell">
                  <span
                    class="position-badge"
                    :class="getPositionClass(index + 1)"
                  >
                    {{ index + 1 }}
                  </span>
                </td>
                <td class="user-info">
                  <strong>{{ usuario.usuarioNome }}</strong>
                  <small>XP: {{ formatarNumero(usuario.xp) }}</small>
                </td>
                <td>{{ usuario.lojaNome }}</td>
                <td>{{ formatarNumero(usuario.itensProcessados) }}</td>
                <td>
                  <div class="achievements">
                    <span class="achievement-count">{{
                      usuario.conquistasDesbloqueadas
                    }}</span>
                    <span class="achievement-badge">🏆</span>
                  </div>
                </td>
                <td>
                  <div class="level-info">
                    <span class="level-badge">Nv. {{ usuario.nivel }}</span>
                    <span class="level-title">{{ usuario.tituloNivel }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Alertas e Insights -->
    <div class="alerts-section">
      <h3>🚨 Alertas Críticos</h3>
      <div class="alerts-grid">
        <div
          v-for="alerta in dashboardData.alertas"
          :key="alerta._id"
          class="alert-card"
          :class="'severity-' + alerta.severidade"
        >
          <div class="alert-icon">
            {{ getAlertIcon(alerta.tipo) }}
          </div>
          <div class="alert-content">
            <h4>{{ alerta.titulo }}</h4>
            <p>{{ alerta.descricao }}</p>
            <div class="alert-meta">
              <span class="severity-badge" :class="alerta.severidade">
                {{ alerta.severidade }}
              </span>
              <span class="alert-date">{{
                formatarData(alerta.dataDeteccao)
              }}</span>
            </div>
          </div>
          <div class="alert-actions">
            <button class="btn-sm" @click="verDetalhesAlerta(alerta)">
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <div v-if="modalAberto" class="modal-overlay" @click="fecharModal">
      <div class="modal-content" @click.stop>
        <h2>{{ modalDados.titulo }}</h2>
        <div v-html="modalDados.conteudo"></div>
        <button class="btn-close" @click="fecharModal">Fechar</button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="carregando" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Carregando dados...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";

export default {
  name: "DashboardAnalytics",
  setup() {
    // Refs para dados e estado
    const filters = ref({
      periodo: "mensal",
      loja: "todas",
      tipoAuditoria: "todos",
      dataInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split("T")[0],
      dataFim: new Date().toISOString().split("T")[0],
    });

    const dashboardData = ref({
      totais: {},
      tendencias: {},
      rankingLojas: [],
      rankingUsuarios: [],
      alertas: [],
      rupturas: {},
    });

    const lojas = ref([]);
    const carregando = ref(false);
    const modalAberto = ref(false);
    const modalDados = ref({});

    // Refs para gráficos
    const conclusaoChart = ref(null);
    const tendenciaChart = ref(null);
    const situacaoChart = ref(null);
    const heatmapChart = ref(null);

    // Instâncias dos gráficos
    let conclusaoChartInstance = null;
    let tendenciaChartInstance = null;
    let situacaoChartInstance = null;
    let heatmapChartInstance = null;

    // Métodos
    const carregarLojas = async () => {
      try {
        // Simulação - substituir por chamada real à API
        lojas.value = [
          {
            _id: "1",
            nome: "Loja Centro",
            cidade: "São Paulo",
            regiao: "Centro",
          },
          {
            _id: "2",
            nome: "Loja Norte",
            cidade: "São Paulo",
            regiao: "Norte",
          },
          { _id: "3", nome: "Loja Sul", cidade: "São Paulo", regiao: "Sul" },
        ];
      } catch (error) {
        console.error("Erro ao carregar lojas:", error);
      }
    };

    const carregarDadosDashboard = async () => {
      carregando.value = true;
      try {
        // Simulação de dados - substituir por chamadas reais à API
        const dados = await simularDadosDashboard();
        dashboardData.value = dados;

        // Atualizar gráficos após carregar dados
        setTimeout(() => {
          inicializarGraficos();
        }, 100);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        carregando.value = false;
      }
    };

    const simularDadosDashboard = async () => {
      // Dados simulados baseados nos modelos do banco
      return {
        totais: {
          totalItensProcessados: 15420,
          percentualConclusaoGeral: 78.5,
          usuariosAtivos: 45,
          lojasAtivas: 12,
        },
        tendencias: {
          crescimentoItens: 12.5,
          melhoriaQualidade: 8.2,
          crescimentoUsuarios: 5.7,
        },
        rupturas: {
          custoTotalRuptura: 125000,
          economiaEstimada: 87500,
        },
        rankingLojas: [
          {
            _id: "1",
            nome: "Loja Centro",
            cidade: "São Paulo",
            regiao: "Centro",
            percentualConclusao: 92,
            pontuacao: 456,
            usuariosAtivos: 8,
            variacao: 5.2,
          },
          {
            _id: "2",
            nome: "Loja Norte",
            cidade: "São Paulo",
            regiao: "Norte",
            percentualConclusao: 87,
            pontuacao: 423,
            usuariosAtivos: 6,
            variacao: 2.1,
          },
          {
            _id: "3",
            nome: "Loja Sul",
            cidade: "São Paulo",
            regiao: "Sul",
            percentualConclusao: 79,
            pontuacao: 398,
            usuariosAtivos: 7,
            variacao: -1.5,
          },
        ],
        rankingUsuarios: [
          {
            usuarioId: "1",
            usuarioNome: "João Silva",
            lojaNome: "Loja Centro",
            itensProcessados: 1245,
            xp: 2450,
            conquistasDesbloqueadas: 8,
            nivel: 12,
            tituloNivel: "Especialista",
          },
          {
            usuarioId: "2",
            usuarioNome: "Maria Santos",
            lojaNome: "Loja Norte",
            itensProcessados: 987,
            xp: 1870,
            conquistasDesbloqueadas: 6,
            nivel: 9,
            tituloNivel: "Experiente",
          },
          {
            usuarioId: "3",
            usuarioNome: "Pedro Oliveira",
            lojaNome: "Loja Sul",
            itensProcessados: 856,
            xp: 1620,
            conquistasDesbloqueadas: 5,
            nivel: 8,
            tituloNivel: "Competente",
          },
        ],
        alertas: [
          {
            _id: "1",
            tipo: "alta_ruptura",
            severidade: "alta",
            titulo: "Custo Elevado de Rupturas",
            descricao: "Custo total de rupturas acima do esperado",
            dataDeteccao: new Date(),
          },
          {
            _id: "2",
            tipo: "baixa_produtividade",
            severidade: "media",
            titulo: "Baixa Produtividade em Etiquetas",
            descricao: "Taxa de conclusão abaixo da meta em 3 lojas",
            dataDeteccao: new Date(Date.now() - 86400000),
          },
        ],
      };
    };

    const inicializarGraficos = () => {
      // Destruir gráficos existentes
      destruirGraficos();

      // Gráfico de Conclusão por Tipo
      if (conclusaoChart.value) {
        const ctx = conclusaoChart.value.getContext("2d");
        conclusaoChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Etiquetas", "Rupturas", "Presenças"],
            datasets: [
              {
                label: "Percentual de Conclusão",
                data: [85, 72, 78],
                backgroundColor: [
                  "rgba(75, 192, 192, 0.8)",
                  "rgba(255, 99, 132, 0.8)",
                  "rgba(54, 162, 235, 0.8)",
                ],
                borderColor: [
                  "rgb(75, 192, 192)",
                  "rgb(255, 99, 132)",
                  "rgb(54, 162, 235)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Performance por Tipo de Auditoria",
              },
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function (value) {
                    return value + "%";
                  },
                },
              },
            },
          },
        });
      }

      // Gráfico de Tendência Temporal
      if (tendenciaChart.value) {
        const ctx = tendenciaChart.value.getContext("2d");
        tendenciaChartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
            datasets: [
              {
                label: "Itens Processados",
                data: [1200, 1900, 1500, 2100, 1800, 2400],
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                tension: 0.4,
                fill: true,
              },
              {
                label: "Conclusão %",
                data: [65, 72, 68, 75, 78, 82],
                borderColor: "rgb(153, 102, 255)",
                backgroundColor: "rgba(153, 102, 255, 0.1)",
                tension: 0.4,
                fill: true,
                yAxisID: "y1",
              },
            ],
          },
          options: {
            responsive: true,
            interaction: {
              mode: "index",
              intersect: false,
            },
            scales: {
              y: {
                type: "linear",
                display: true,
                position: "left",
                title: {
                  display: true,
                  text: "Itens Processados",
                },
              },
              y1: {
                type: "linear",
                display: true,
                position: "right",
                max: 100,
                ticks: {
                  callback: function (value) {
                    return value + "%";
                  },
                },
                title: {
                  display: true,
                  text: "Percentual de Conclusão",
                },
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
          },
        });
      }

      // Gráfico de Situações
      if (situacaoChart.value) {
        const ctx = situacaoChart.value.getContext("2d");
        situacaoChartInstance = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: [
              "Atualizados",
              "Desatualizados",
              "Não Lidos",
              "Sem Estoque",
            ],
            datasets: [
              {
                data: [65, 15, 12, 8],
                backgroundColor: [
                  "rgba(75, 192, 192, 0.8)",
                  "rgba(255, 205, 86, 0.8)",
                  "rgba(255, 99, 132, 0.8)",
                  "rgba(201, 203, 207, 0.8)",
                ],
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          },
        });
      }

      // Mapa de Calor (simplificado)
      if (heatmapChart.value) {
        const ctx = heatmapChart.value.getContext("2d");
        heatmapChartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: [
              "G01A",
              "G01B",
              "G02A",
              "G02B",
              "G03A",
              "G03B",
              "FLV",
              "C01",
            ],
            datasets: [
              {
                label: "Percentual de Conclusão",
                data: [92, 85, 78, 88, 82, 79, 91, 76],
                backgroundColor: function (context) {
                  const value = context.raw;
                  if (value >= 90) return "rgba(75, 192, 192, 0.8)";
                  if (value >= 80) return "rgba(255, 205, 86, 0.8)";
                  if (value >= 70) return "rgba(255, 159, 64, 0.8)";
                  return "rgba(255, 99, 132, 0.8)";
                },
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Performance por Local/Corredor",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function (value) {
                    return value + "%";
                  },
                },
              },
            },
          },
        });
      }
    };

    const destruirGraficos = () => {
      [
        conclusaoChartInstance,
        tendenciaChartInstance,
        situacaoChartInstance,
        heatmapChartInstance,
      ].forEach((instance) => {
        if (instance) {
          instance.destroy();
        }
      });
    };

    const atualizarDados = () => {
      carregarDadosDashboard();
    };

    const exportarRelatorio = () => {
      // Implementar exportação de relatório
      console.log("Exportando relatório...");
    };

    const verDetalhesAlerta = (alerta) => {
      modalDados.value = {
        titulo: alerta.titulo,
        conteudo: `
          <div class="modal-alert-details">
            <p><strong>Descrição:</strong> ${alerta.descricao}</p>
            <p><strong>Severidade:</strong> <span class="severity-${alerta.severidade}">${
              alerta.severidade
            }</span></p>
            <p><strong>Detectado em:</strong> ${formatarData(alerta.dataDeteccao)}</p>
            <div class="recommendations">
              <h4>Ações Recomendadas:</h4>
              <ul>
                <li>Revisar processo de treinamento</li>
                <li>Alocar mais recursos na área</li>
                <li>Monitorar métricas diariamente</li>
              </ul>
            </div>
          </div>
        `,
      };
      modalAberto.value = true;
    };

    const fecharModal = () => {
      modalAberto.value = false;
      modalDados.value = {};
    };

    // Métodos auxiliares
    const formatarNumero = (numero) => {
      return new Intl.NumberFormat("pt-BR").format(numero);
    };

    const formatarMoeda = (valor) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
    };

    const formatarData = (data) => {
      return new Date(data).toLocaleDateString("pt-BR");
    };

    const getTrendClass = (valor) => {
      if (valor > 0) return "positive";
      if (valor < 0) return "negative";
      return "neutral";
    };

    const getTrendIcon = (valor) => {
      if (valor > 0) return "📈";
      if (valor < 0) return "📉";
      return "➡️";
    };

    const getPositionClass = (posicao) => {
      if (posicao === 1) return "gold";
      if (posicao === 2) return "silver";
      if (posicao === 3) return "bronze";
      return "other";
    };

    const getProgressClass = (percentual) => {
      if (percentual >= 90) return "excellent";
      if (percentual >= 80) return "good";
      if (percentual >= 70) return "warning";
      return "critical";
    };

    const getAlertIcon = (tipo) => {
      const icons = {
        alta_ruptura: "💰",
        baixa_produtividade: "📊",
        poucos_usuarios: "👥",
        qualidade_baixa: "🎯",
      };
      return icons[tipo] || "⚠️";
    };

    // Watchers
    watch(
      filters,
      () => {
        atualizarDados();
      },
      { deep: true },
    );

    // Lifecycle
    onMounted(() => {
      carregarLojas();
      carregarDadosDashboard();
    });

    return {
      filters,
      dashboardData,
      lojas,
      carregando,
      modalAberto,
      modalDados,
      conclusaoChart,
      tendenciaChart,
      situacaoChart,
      heatmapChart,
      atualizarDados,
      exportarRelatorio,
      verDetalhesAlerta,
      fecharModal,
      formatarNumero,
      formatarMoeda,
      formatarData,
      getTrendClass,
      getTrendIcon,
      getPositionClass,
      getProgressClass,
      getAlertIcon,
    };
  },
};
</script>

<style scoped>
.dashboard-analytics {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filters-section {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 600;
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
}

.filter-group select,
.filter-group input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn-primary,
.btn-secondary,
.btn-sm,
.btn-close {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.metrics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.metric-icon {
  font-size: 2em;
}

.metric-info h3 {
  font-size: 1.8em;
  margin: 0;
  color: #2c3e50;
}

.metric-info p {
  margin: 5px 0 0 0;
  color: #7f8c8d;
  font-size: 0.9em;
}

.metric-trend {
  margin-left: auto;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 600;
}

.metric-trend.positive {
  background: #d4edda;
  color: #155724;
}

.metric-trend.negative {
  background: #f8d7da;
  color: #721c24;
}

.metric-trend.neutral {
  background: #e2e3e5;
  color: #383d41;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chart-container.full-width {
  grid-column: 1 / -1;
}

.chart-container h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.1em;
}

.chart-wrapper {
  position: relative;
  height: 300px;
}

.tables-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.table-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table-container h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.table-wrapper {
  overflow-x: auto;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
}

.ranking-table th {
  background: #f8f9fa;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.ranking-table td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
}

.position-cell {
  text-align: center;
}

.position-badge {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  font-weight: 600;
  color: white;
}

.position-badge.gold {
  background: linear-gradient(135deg, #ffd700, #ffa500);
}

.position-badge.silver {
  background: linear-gradient(135deg, #c0c0c0, #a9a9a9);
}

.position-badge.bronze {
  background: linear-gradient(135deg, #cd7f32, #8b4513);
}

.position-badge.other {
  background: #6c757d;
}

.loja-info,
.user-info {
  display: flex;
  flex-direction: column;
}

.loja-info small,
.user-info small {
  color: #6c757d;
  font-size: 0.8em;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-fill.excellent {
  background: linear-gradient(90deg, #28a745, #20c997);
}

.progress-fill.good {
  background: linear-gradient(90deg, #20c997, #17a2b8);
}

.progress-fill.warning {
  background: linear-gradient(90deg, #ffc107, #fd7e14);
}

.progress-fill.critical {
  background: linear-gradient(90deg, #dc3545, #e83e8c);
}

.score {
  font-weight: 600;
  color: #495057;
}

.trend-indicator {
  font-size: 1.2em;
}

.achievements {
  display: flex;
  align-items: center;
  gap: 5px;
}

.achievement-count {
  font-weight: 600;
  color: #495057;
}

.achievement-badge {
  font-size: 1.2em;
}

.level-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.level-badge {
  background: #007bff;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 600;
}

.level-title {
  font-size: 0.8em;
  color: #6c757d;
}

.alerts-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.alerts-section h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
}

.alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.alert-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-card.severity-critica {
  border-left-color: #dc3545;
  background: #f8d7da;
}

.alert-card.severity-alta {
  border-left-color: #fd7e14;
  background: #fff3cd;
}

.alert-card.severity-media {
  border-left-color: #ffc107;
  background: #fff3cd;
}

.alert-card.severity-baixa {
  border-left-color: #28a745;
  background: #d4edda;
}

.alert-icon {
  font-size: 1.5em;
}

.alert-content {
  flex: 1;
}

.alert-content h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.alert-content p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9em;
}

.alert-meta {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  align-items: center;
}

.severity-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7em;
  font-weight: 600;
  text-transform: uppercase;
}

.severity-badge.critica {
  background: #dc3545;
  color: white;
}

.severity-badge.alta {
  background: #fd7e14;
  color: white;
}

.severity-badge.media {
  background: #ffc107;
  color: #212529;
}

.severity-badge.baixa {
  background: #28a745;
  color: white;
}

.alert-date {
  font-size: 0.8em;
  color: #6c757d;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 0.8em;
  background: #6c757d;
  color: white;
}

.btn-sm:hover {
  background: #545b62;
}

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
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
}

.btn-close {
  margin-top: 20px;
  background: #6c757d;
  color: white;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #007bff;
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
  .charts-grid,
  .tables-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 15px;
  }

  .filters-section {
    justify-content: center;
  }

  .metrics-cards {
    grid-template-columns: 1fr;
  }

  .alerts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
