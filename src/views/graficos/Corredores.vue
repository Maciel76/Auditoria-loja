<template>
  <div class="dashboard-corredores">
    <!-- Header do Dashboard -->
    <div class="dashboard-header">
      <h2 class="dashboard-title">
        <i class="fas fa-chart-network"></i> Desempenho por Corredor
      </h2>
      <p class="dashboard-subtitle">
        Visualização gráfica da taxa de leitura por localização
      </p>

      <div class="dashboard-controls">
        <div class="control-group">
          <label for="data-select">Data de Auditoria:</label>
          <select
            id="data-select"
            v-model="dataSelecionada"
            @change="carregarDados"
            class="control-select"
          >
            <option value="">Todas as datas</option>
            <option v-for="data in datasAuditoria" :key="data" :value="data">
              {{ formatarData(data) }}
            </option>
          </select>
        </div>

        <div class="control-group">
          <label for="visualizacao-select">Tipo de visualização:</label>
          <select
            id="visualizacao-select"
            v-model="tipoVisualizacao"
            class="control-select"
          >
            <option value="barras">Gráfico de Barras</option>
            <option value="radar">Gráfico de Radar</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando dados de desempenho...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="erro" class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3>Erro ao carregar dados</h3>
      <p>{{ erro }}</p>
      <button @click="carregarDados" class="btn-retry">
        <i class="fas fa-redo"></i> Tentar Novamente
      </button>
    </div>

    <!-- Mensagem de dados vazios -->
    <div v-else-if="locaisComEstatisticas.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-database"></i>
      </div>
      <h3>Nenhum dado encontrado</h3>
      <p>Não há dados de auditoria para os filtros selecionados.</p>
      <p>Faça o upload de uma planilha para começar.</p>
    </div>

    <!-- Conteúdo Principal -->
    <div v-else class="dashboard-content">
      <!-- Estatísticas Gerais -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-map-marked-alt"></i>
          </div>
          <div class="stat-content">
            <h3>{{ locaisComEstatisticas.length }}</h3>
            <p>Corredores Auditados</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-content">
            <h3>{{ percentualGeral }}%</h3>
            <p>Taxa de Leitura Geral</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="stat-content">
            <h3>{{ melhorCorredor.nome }}</h3>
            <p>Melhor Desempenho ({{ melhorCorredor.percentual }}%)</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="stat-content">
            <h3>{{ piorCorredor.nome }}</h3>
            <p>Necessita Atenção ({{ piorCorredor.percentual }}%)</p>
          </div>
        </div>
      </div>

      <!-- Gráfico Principal -->
      <div class="grafico-container">
        <div class="grafico-wrapper">
          <canvas ref="graficoCanvas" class="grafico"></canvas>
        </div>

        <div class="legenda-container">
          <h3 class="legenda-titulo">Legenda de Desempenho</h3>
          <div class="legenda-items">
            <div class="legenda-item">
              <span class="legenda-cor excelente"></span>
              <span>Excelente (90-100%)</span>
            </div>
            <div class="legenda-item">
              <span class="legenda-cor bom"></span>
              <span>Bom (70-89%)</span>
            </div>
            <div class="legenda-item">
              <span class="legenda-cor medio"></span>
              <span>Médio (50-69%)</span>
            </div>
            <div class="legenda-item">
              <span class="legenda-cor baixo"></span>
              <span>Baixo (30-49%)</span>
            </div>
            <div class="legenda-item">
              <span class="legenda-cor critico"></span>
              <span>Crítico (0-29%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabela de Detalhes -->
      <div class="tabela-detalhes">
        <h3>Detalhamento por Corredor</h3>
        <div class="tabela-wrapper">
          <table>
            <thead>
              <tr>
                <th @click="ordenarTabela('nome')" class="sortable">
                  Corredor <i class="fas fa-sort"></i>
                </th>
                <th @click="ordenarTabela('total')" class="sortable">
                  Total de Itens <i class="fas fa-sort"></i>
                </th>
                <th @click="ordenarTabela('lidos')" class="sortable">
                  Itens Lidos <i class="fas fa-sort"></i>
                </th>
                <th @click="ordenarTabela('percentual')" class="sortable">
                  % de Leitura <i class="fas fa-sort"></i>
                </th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="local in locaisOrdenados" :key="local.nome">
                <td>
                  <span class="local-nome">{{ local.nome }}</span>
                </td>
                <td>{{ local.total }}</td>
                <td>{{ local.lidos }}</td>
                <td>
                  <div class="percentual-bar">
                    <div class="percentual-text">{{ local.percentual }}%</div>
                    <div class="percentual-visual">
                      <div
                        :class="[
                          'percentual-fill',
                          getStatusClass(local.percentual),
                        ]"
                        :style="{ width: local.percentual + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    :class="['status-badge', getStatusClass(local.percentual)]"
                  >
                    {{ getStatusText(local.percentual) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DashboardCorredores",
  data() {
    return {
      carregando: false,
      erro: null,
      datasAuditoria: [],
      dataSelecionada: "",
      tipoVisualizacao: "barras",
      ordenacao: "percentual",
      ordemTabela: "desc",
      locaisComEstatisticas: [],
      grafico: null,
    };
  },
  computed: {
    // Ordenar locais para exibição
    locaisOrdenados() {
      const ordenados = [...this.locaisComEstatisticas];

      switch (this.ordenacao) {
        case "nome":
          return ordenados.sort((a, b) => a.nome.localeCompare(b.nome));
        case "itens":
          return ordenados.sort((a, b) =>
            this.ordemTabela === "asc" ? a.total - b.total : b.total - a.total
          );
        case "percentual":
        default:
          return ordenados.sort((a, b) =>
            this.ordemTabela === "asc"
              ? a.percentual - b.percentual
              : b.percentual - a.percentual
          );
      }
    },

    // Calcular percentual geral de leitura
    percentualGeral() {
      if (this.locaisComEstatisticas.length === 0) return 0;

      const totalItens = this.locaisComEstatisticas.reduce(
        (acc, local) => acc + local.total,
        0
      );
      const totalLidos = this.locaisComEstatisticas.reduce(
        (acc, local) => acc + local.lidos,
        0
      );

      return totalItens > 0 ? Math.round((totalLidos / totalItens) * 100) : 0;
    },

    // Encontrar o corredor com melhor desempenho
    melhorCorredor() {
      if (this.locaisComEstatisticas.length === 0) {
        return { nome: "N/A", percentual: 0 };
      }

      const melhor = this.locaisComEstatisticas.reduce((prev, current) =>
        prev.percentual > current.percentual ? prev : current
      );

      return {
        nome:
          melhor.nome.length > 15
            ? melhor.nome.substring(0, 15) + "..."
            : melhor.nome,
        percentual: melhor.percentual,
      };
    },

    // Encontrar o corredor com pior desempenho
    piorCorredor() {
      if (this.locaisComEstatisticas.length === 0) {
        return { nome: "N/A", percentual: 0 };
      }

      const pior = this.locaisComEstatisticas.reduce((prev, current) =>
        prev.percentual < current.percentual ? prev : current
      );

      return {
        nome:
          pior.nome.length > 15
            ? pior.nome.substring(0, 15) + "..."
            : pior.nome,
        percentual: pior.percentual,
      };
    },
  },
  watch: {
    // Atualizar gráfico quando os dados mudam
    locaisComEstatisticas: {
      handler() {
        this.inicializarGrafico();
      },
      deep: true,
    },

    // Atualizar gráfico quando o tipo de visualização muda
    tipoVisualizacao() {
      this.inicializarGrafico();
    },
  },
  async mounted() {
    await this.carregarDatasAuditoria();
    await this.carregarDados();
  },
  beforeUnmount() {
    // Destruir gráfico para evitar vazamento de memória
    if (this.grafico) {
      this.grafico.destroy();
    }
  },
  methods: {
    // Carregar datas de auditoria disponíveis
    async carregarDatasAuditoria() {
      try {
        const response = await axios.get("/api/datas-auditoria");
        this.datasAuditoria = response.data;
        if (this.datasAuditoria.length > 0) {
          this.dataSelecionada = this.datasAuditoria[0];
        }
      } catch (error) {
        console.error("Erro ao carregar datas de auditoria:", error);
        // Fallback para datas de exemplo
        this.datasAuditoria = [new Date().toISOString().split("T")[0]];
        this.dataSelecionada = this.datasAuditoria[0];
      }
    },

    // Carregar dados dos corredores
    async carregarDados() {
      try {
        this.carregando = true;
        this.erro = null;

        // Buscar dados da API - usando o endpoint correto para estatísticas de setores
        const params = this.dataSelecionada
          ? { data: this.dataSelecionada }
          : {};
        const response = await axios.get("/api/estatisticas-setores", {
          params,
        });

        if (response.data && Array.isArray(response.data)) {
          this.locaisComEstatisticas = response.data.map((item) => ({
            nome: item.local,
            total: item.totalItens,
            lidos: item.itensLidos,
            percentual: item.percentualLidos,
          }));
        } else {
          throw new Error("Formato de dados inválido");
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        this.erro = "Falha ao carregar dados dos corredores";

        // Dados de exemplo para demonstração
        this.locaisComEstatisticas = [
          { nome: "C01 - Corredor 1", total: 150, lidos: 135, percentual: 90 },
          { nome: "C02 - Corredor 2", total: 200, lidos: 160, percentual: 80 },
          { nome: "C03 - Corredor 3", total: 180, lidos: 126, percentual: 70 },
          { nome: "C04 - Corredor 4", total: 120, lidos: 72, percentual: 60 },
          { nome: "C05 - Corredor 5", total: 90, lidos: 45, percentual: 50 },
        ];
      } finally {
        this.carregando = false;
      }
    },

    // Inicializar o gráfico
    inicializarGrafico() {
      if (this.grafico) {
        this.grafico.destroy();
      }

      if (this.locaisComEstatisticas.length === 0) return;

      const ctx = this.$refs.graficoCanvas;
      if (!ctx) return;

      const { labels, dados, cores } = this.prepararDadosGrafico();

      // Configuração básica do gráfico
      const config = {
        type: this.tipoVisualizacao,
        data: {
          labels: labels,
          datasets: [
            {
              data: dados,
              backgroundColor: cores,
              borderColor: "#ffffff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `Taxa de leitura: ${context.raw}%`;
                },
              },
            },
          },
        },
      };

      this.grafico = new Chart(ctx, config);
    },

    // Preparar dados para o gráfico
    prepararDadosGrafico() {
      const locaisOrdenados = [...this.locaisComEstatisticas].sort(
        (a, b) => b.percentual - a.percentual
      );

      const labels = locaisOrdenados.map((local) =>
        local.nome.length > 12
          ? local.nome.substring(0, 12) + "..."
          : local.nome
      );

      const dados = locaisOrdenados.map((local) => local.percentual);

      const cores = locaisOrdenados.map((local) =>
        this.getCorStatus(local.percentual)
      );

      return { labels, dados, cores };
    },

    // Métodos auxiliares para classificação por status
    getStatusClass(percentual) {
      if (percentual >= 90) return "excelente";
      if (percentual >= 70) return "bom";
      if (percentual >= 50) return "medio";
      if (percentual >= 30) return "baixo";
      return "critico";
    },

    getStatusText(percentual) {
      if (percentual >= 90) return "Excelente";
      if (percentual >= 70) return "Bom";
      if (percentual >= 50) return "Médio";
      if (percentual >= 30) return "Baixo";
      return "Crítico";
    },

    getCorStatus(percentual) {
      if (percentual >= 90) return "#51cf66";
      if (percentual >= 70) return "#74c0fc";
      if (percentual >= 50) return "#ffd43b";
      if (percentual >= 30) return "#ff922b";
      return "#ff6b6b";
    },

    // Ordenar tabela
    ordenarTabela(campo) {
      if (this.ordenacao === campo) {
        this.ordemTabela = this.ordemTabela === "asc" ? "desc" : "asc";
      } else {
        this.ordenacao = campo;
        this.ordemTabela = "desc";
      }
    },

    formatarData(data) {
      return new Date(data).toLocaleDateString("pt-BR");
    },
  },
};
</script>

<style scoped>
/* Estilos mantidos do componente anterior */
.dashboard-corredores {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.dashboard-header {
  margin-bottom: 25px;
}

.dashboard-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dashboard-title i {
  color: #667eea;
}

.dashboard-subtitle {
  color: #7f8c8d;
  margin-bottom: 20px;
}

.dashboard-controls {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-weight: 500;
  color: #2c3e50;
}

.control-select {
  padding: 10px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.control-select:focus {
  outline: none;
  border-color: #667eea;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e1e5e9;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-container {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.error-icon {
  font-size: 3rem;
  color: #e74c3c;
  margin-bottom: 20px;
}

.error-container h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.error-container p {
  color: #7f8c8d;
  margin-bottom: 20px;
}

.btn-retry {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 3rem;
  color: #bdc3c7;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.empty-state p {
  color: #7f8c8d;
  margin-bottom: 5px;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-content h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 5px;
}

.stat-content p {
  color: #7f8c8d;
  margin: 0;
}

.grafico-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.grafico-wrapper {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  height: 400px;
}

.grafico {
  width: 100%;
  height: 100%;
}

.legenda-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

.legenda-titulo {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

.legenda-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legenda-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legenda-cor {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legenda-cor.excelente {
  background: #51cf66;
}
.legenda-cor.bom {
  background: #74c0fc;
}
.legenda-cor.medio {
  background: #ffd43b;
}
.legenda-cor.baixo {
  background: #ff922b;
}
.legenda-cor.critico {
  background: #ff6b6b;
}

.tabela-detalhes {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.tabela-detalhes h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

.tabela-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  cursor: pointer;
}

th.sortable:hover {
  background-color: #e9ecef;
}

.local-nome {
  font-weight: 500;
  color: #2c3e50;
}

.percentual-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.percentual-text {
  min-width: 40px;
  font-weight: 500;
}

.percentual-visual {
  flex-grow: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.percentual-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.percentual-fill.excelente {
  background: #51cf66;
}
.percentual-fill.bom {
  background: #74c0fc;
}
.percentual-fill.medio {
  background: #ffd43b;
}
.percentual-fill.baixo {
  background: #ff922b;
}
.percentual-fill.critico {
  background: #ff6b6b;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.excelente {
  background: #d3f9d8;
  color: #2b8a3e;
}

.status-badge.bom {
  background: #d0ebff;
  color: #1864ab;
}

.status-badge.medio {
  background: #fff3bf;
  color: #e67700;
}

.status-badge.baixo {
  background: #ffe8cc;
  color: #d9480f;
}

.status-badge.critico {
  background: #ffe3e3;
  color: #c92a2a;
}

/* Responsividade */
@media (max-width: 968px) {
  .grafico-container {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .dashboard-controls {
    flex-direction: column;
    gap: 15px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .grafico-wrapper {
    height: 300px;
  }
}
</style>
