<template>
  <div class="status-chart">
    <div class="panel-header">
      <h2>Status da Auditoria</h2>
      <div class="info-icon">
        <i class="fas fa-info-circle"></i>
      </div>
    </div>

    <!-- Seletor de Data -->
    <div class="date-selector">
      <label for="data-auditoria-select">Data de auditoria:</label>
      <select
        id="data-auditoria-select"
        v-model="dataSelecionada"
        @change="trocarDataAuditoria"
        :disabled="carregando"
      >
        <option v-if="datasAuditoria.length === 0" value="" disabled>
          Carregando datas...
        </option>
        <option v-for="data in datasAuditoria" :key="data" :value="data">
          {{ formatarDataParaExibicao(data) }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando dados...</p>
    </div>

    <div v-else>
      <div class="summary-info">
        <p>
          Total de itens: <strong>{{ total }}</strong>
        </p>
        <p v-if="erroDetectado" class="error-text">
          ⚠️ Foram detectadas situações não categorizadas. Verifique o console.
        </p>
      </div>

      <div class="chart-container">
        <canvas ref="chartCanvas" v-if="!carregando"></canvas>
      </div>

      <div class="status-details">
        <div class="status-item">
          <div class="status-color" style="background-color: #4caf50"></div>
          <div class="status-info">
            <div class="status-value">{{ atualizado }}</div>
            <div class="status-label">Etiquetas Atualizadas</div>
          </div>
          <div class="status-percentage">{{ atualizadoPercentage }}%</div>
        </div>

        <div class="status-item">
          <div class="status-color" style="background-color: #ff9800"></div>
          <div class="status-info">
            <div class="status-value">{{ desatualizado }}</div>
            <div class="status-label">Etiquetas Desatualizadas</div>
          </div>
          <div class="status-percentage">{{ desatualizadoPercentage }}%</div>
        </div>

        <div class="status-item">
          <div class="status-color" style="background-color: #2196f3"></div>
          <div class="status-info">
            <div class="status-value">{{ lidoNaoPertence }}</div>
            <div class="status-label">Lido não pertence a auditoria</div>
          </div>
          <div class="status-percentage">{{ lidoNaoPertencePercentage }}%</div>
        </div>

        <div class="status-item">
          <div class="status-color" style="background-color: #9c27b0"></div>
          <div class="status-info">
            <div class="status-value">{{ lidoSemEstoque }}</div>
            <div class="status-label">Etiquetas Lidos e sem estoque</div>
          </div>
          <div class="status-percentage">{{ lidoSemEstoquePercentage }}%</div>
        </div>

        <div class="status-item">
          <div class="status-color" style="background-color: #f44336"></div>
          <div class="status-info">
            <div class="status-value">{{ naoLidosComEstoque }}</div>
            <div class="status-label">Etiquetas Não Lidos e com estoque</div>
          </div>
          <div class="status-percentage">
            {{ naoLidosComEstoquePercentage }}%
          </div>
        </div>

        <div class="status-item">
          <div class="status-color" style="background-color: #9e9e9e"></div>
          <div class="status-info">
            <div class="status-value">{{ semEstoque }}</div>
            <div class="status-label">Etiquetas sem estoque</div>
          </div>
          <div class="status-percentage">{{ semEstoquePercentage }}%</div>
        </div>

        <div class="status-item" v-if="outros > 0">
          <div class="status-color" style="background-color: #607d8b"></div>
          <div class="status-info">
            <div class="status-value">{{ outros }}</div>
            <div class="status-label">Outras situações</div>
          </div>
          <div class="status-percentage">{{ outrosPercentage }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import axios from "axios";

export default {
  name: "StatusChart",
  data() {
    return {
      carregando: true,
      erro: null,
      erroDetectado: false,
      dadosPlanilha: [],
      datasAuditoria: [],
      dataSelecionada: "",
      atualizado: 0,
      desatualizado: 0,
      lidoNaoPertence: 0,
      lidoSemEstoque: 0,
      naoLidosComEstoque: 0,
      semEstoque: 0,
      outros: 0,
      chart: null,
    };
  },
  computed: {
    total() {
      return (
        this.atualizado +
        this.desatualizado +
        this.lidoNaoPertence +
        this.lidoSemEstoque +
        this.naoLidosComEstoque +
        this.semEstoque +
        this.outros
      );
    },
    atualizadoPercentage() {
      return this.total > 0
        ? ((this.atualizado / this.total) * 100).toFixed(2)
        : 0;
    },
    desatualizadoPercentage() {
      return this.total > 0
        ? ((this.desatualizado / this.total) * 100).toFixed(2)
        : 0;
    },
    lidoNaoPertencePercentage() {
      return this.total > 0
        ? ((this.lidoNaoPertence / this.total) * 100).toFixed(2)
        : 0;
    },
    lidoSemEstoquePercentage() {
      return this.total > 0
        ? ((this.lidoSemEstoque / this.total) * 100).toFixed(2)
        : 0;
    },
    naoLidosComEstoquePercentage() {
      return this.total > 0
        ? ((this.naoLidosComEstoque / this.total) * 100).toFixed(2)
        : 0;
    },
    semEstoquePercentage() {
      return this.total > 0
        ? ((this.semEstoque / this.total) * 100).toFixed(2)
        : 0;
    },
    outrosPercentage() {
      return this.total > 0 ? ((this.outros / this.total) * 100).toFixed(2) : 0;
    },
  },
  async mounted() {
    await this.carregarDatasAuditoria();
    await this.carregarDados();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  watch: {
    atualizado() {
      this.$nextTick(() => {
        this.renderChart();
      });
    },
    desatualizado() {
      this.$nextTick(() => {
        this.renderChart();
      });
    },
    lidoNaoPertence() {
      this.$nextTick(() => {
        this.renderChart();
      });
    },
    lidoSemEstoque() {
      this.$nextTick(() => {
        this.renderChart();
      });
    },
    naoLidosComEstoque() {
      this.$nextTick(() => {
        this.renderChart();
      });
    },
    semEstoque() {
      this.$nextTick(() => {
        this.renderChart();
      });
    },
    outros() {
      this.$nextTick(() => {
        this.renderChart();
      });
    },
  },
  methods: {
    async carregarDatasAuditoria() {
      try {
        const response = await axios.get(
          "http://localhost:3000/datas-auditoria"
        );
        this.datasAuditoria = response.data;
        if (this.datasAuditoria.length > 0) {
          this.dataSelecionada = this.datasAuditoria[0];
        }
      } catch (error) {
        console.error("Erro ao carregar datas:", error);
        // Fallback para datas de exemplo
        this.datasAuditoria = [
          new Date().toISOString().split("T")[0],
          new Date(Date.now() - 86400000).toISOString().split("T")[0],
        ];
        this.dataSelecionada = this.datasAuditoria[0];
      }
    },

    formatarDataParaExibicao(data) {
      return new Date(data).toLocaleDateString("pt-BR");
    },

    async trocarDataAuditoria() {
      if (!this.dataSelecionada) return;
      await this.carregarDados();
    },

    async carregarDados() {
      try {
        this.carregando = true;
        this.erro = null;
        this.erroDetectado = false;
        const params = this.dataSelecionada
          ? { data: this.dataSelecionada }
          : {};
        const response = await axios.get(
          "http://localhost:3000/dados-setores",
          { params }
        );

        if (response.data && Array.isArray(response.data)) {
          this.dadosPlanilha = response.data;
          this.calcularEstatisticas();
        } else {
          throw new Error("Formato de dados inválido");
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        this.erro = "Falha ao carregar dados da auditoria";
        // Dados de exemplo para fallback
        this.dadosPlanilha = this.getDadosExemplo();
        this.calcularEstatisticas();
      } finally {
        this.carregando = false;
      }
    },

    calcularEstatisticas() {
      // Reiniciar contadores
      this.atualizado = 0;
      this.desatualizado = 0;
      this.lidoNaoPertence = 0;
      this.lidoSemEstoque = 0;
      this.naoLidosComEstoque = 0;
      this.semEstoque = 0;
      this.outros = 0;
      this.erroDetectado = false;

      const situacoesNaoCategorizadas = new Set();

      this.dadosPlanilha.forEach((item) => {
        // Verificar diferentes campos onde a situação pode estar
        const situacao = (
          item.Situacao ||
          item.Situação ||
          item.situacao ||
          "Não especificado"
        )
          .toString()
          .trim();
        const estoque = parseInt(
          item["Estoque atual"] || item.estoque || item.Estoque || 0
        );

        // DEBUG: Log para verificar os dados
        console.log("Item:", {
          codigo: item.Código || item.codigo,
          produto: item.Produto || item.produto,
          situacao: situacao,
          estoque: estoque,
        });

        // Classificar por situação (busca exata primeiro)
        if (situacao === "Atualizado") {
          this.atualizado++;
        } else if (situacao === "Desatualizado") {
          this.desatualizado++;
        } else if (
          situacao === "Lido não pertence" ||
          situacao === "Lido nao pertence"
        ) {
          this.lidoNaoPertence++;
        } else if (situacao === "Lido sem estoque") {
          this.lidoSemEstoque++;
        } else if (
          situacao === "Não lidos com estoque" ||
          situacao === "Nao lidos com estoque"
        ) {
          this.naoLidosComEstoque++;
        } else if (situacao === "Sem Estoque") {
          this.semEstoque++;
        }
        // Busca por conteúdo (case insensitive)
        else if (situacao.toLowerCase().includes("atualizado")) {
          this.atualizado++;
        } else if (situacao.toLowerCase().includes("desatualizado")) {
          this.desatualizado++;
        } else if (
          situacao.toLowerCase().includes("não pertence") ||
          situacao.toLowerCase().includes("nao pertence")
        ) {
          this.lidoNaoPertence++;
        } else if (situacao.toLowerCase().includes("sem estoque")) {
          this.semEstoque++;
        } else if (
          situacao.toLowerCase().includes("não lido") ||
          situacao.toLowerCase().includes("nao lido")
        ) {
          this.naoLidosComEstoque++;
        } else {
          // Para situações não categorizadas
          this.outros++;
          situacoesNaoCategorizadas.add(situacao);
          this.erroDetectado = true;
        }
      });

      // Log das situações não categorizadas para debug
      if (situacoesNaoCategorizadas.size > 0) {
        console.log(
          "Situações não categorizadas encontradas:",
          Array.from(situacoesNaoCategorizadas)
        );
      }

      // Log dos resultados para debug
      console.log("Estatísticas calculadas:", {
        atualizado: this.atualizado,
        desatualizado: this.desatualizado,
        lidoNaoPertence: this.lidoNaoPertence,
        lidoSemEstoque: this.lidoSemEstoque,
        naoLidosComEstoque: this.naoLidosComEstoque,
        semEstoque: this.semEstoque,
        outros: this.outros,
        total: this.total,
      });

      // Renderizar gráfico após calcular estatísticas
      this.$nextTick(() => {
        this.renderChart();
      });
    },

    renderChart() {
      // Verificar se o canvas está disponível
      if (!this.$refs.chartCanvas) {
        console.warn("Canvas não está disponível para renderização");
        return;
      }

      // Destruir gráfico existente
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.chartCanvas.getContext("2d");

      this.chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: [
            "Atualizado",
            "Desatualizado",
            "Lido não pertence",
            "Lido sem estoque",
            "Não lidos com estoque",
            "Sem Estoque",
            ...(this.outros > 0 ? ["Outros"] : []),
          ],
          datasets: [
            {
              data: [
                this.atualizado,
                this.desatualizado,
                this.lidoNaoPertence,
                this.lidoSemEstoque,
                this.naoLidosComEstoque,
                this.semEstoque,
                ...(this.outros > 0 ? [this.outros] : []),
              ],
              backgroundColor: [
                "#4CAF50",
                "#FF9800",
                "#2196F3",
                "#9C27B0",
                "#F44336",
                "#9E9E9E",
                ...(this.outros > 0 ? ["#607D8B"] : []),
              ],
              borderColor: [
                "#4CAF50",
                "#FF9800",
                "#2196F3",
                "#9C27B0",
                "#F44336",
                "#9E9E9E",
                ...(this.outros > 0 ? ["#607D8B"] : []),
              ],
              borderWidth: 1,
              borderRadius: 4,
              hoverOffset: 10,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              callbacks: {
                label: function (context) {
                  const value = context.raw;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage =
                    total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                  return `${context.label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    },

    getDadosExemplo() {
      return [
        {
          Código: "1197824",
          Produto: "CHALEIRA ELET BRITANIA 1,8L BCH02PI 220V",
          Local: "G04A - G04A",
          Usuario: "2692473 (NEILTON PEREIRA LIMA)",
          Situacao: "Desatualizado",
          "Estoque atual": "21",
          "Última compra": "19/07/2025",
        },
        {
          Código: "1062218",
          Produto: "CTGARRO CHESTERFIELD BLUE BOX C/10 KS RGB",
          Local: "C01 - C01",
          Usuario: "3642445 (ADILSON CESAR SILVA DOS REIS)",
          Situacao: "Atualizado",
          "Estoque atual": "24",
          "Última compra": "45744",
        },
        {
          Código: "1062220",
          Produto: "PRODUTO EXEMPLO 3",
          Local: "C03 - C03",
          Usuario: "3642447 (OUTRO FUNCIONARIO)",
          Situacao: "Lido não pertence",
          "Estoque atual": "30",
          "Última compra": "45746",
        },
      ];
    },
  },
};
</script>

<style>
.status-chart {
  background: white;
  border-radius: 12px;
  border-top: #e7c91c 4px solid;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.info-icon {
  color: #90a4ae;
  cursor: pointer;
}

.info-icon:hover {
  color: #546e7a;
}

.date-selector {
  margin-bottom: 15px;
}

.date-selector label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #546e7a;
}

.date-selector select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.loading-container {
  text-align: center;
  padding: 40px 0;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e1e5e9;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.summary-info {
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
}

.summary-info p {
  margin: 5px 0;
  font-size: 0.9rem;
}

.error-text {
  color: #d32f2f;
  font-weight: 500;
}

.chart-container {
  height: 180px;
  position: relative;
  margin-bottom: 20px;
}

.status-details {
  max-height: 300px;
  overflow-y: auto;
}

.status-details .status-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.status-details .status-item:last-child {
  border-bottom: none;
}

.status-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 12px;
}

.status-info {
  flex: 1;
}

.status-value {
  font-weight: 600;
  font-size: 1.1rem;
}

.status-label {
  font-size: 0.8rem;
  color: #78909c;
}

.status-percentage {
  font-weight: 600;
  color: #546e7a;
  min-width: 50px;
  text-align: right;
}
</style>
