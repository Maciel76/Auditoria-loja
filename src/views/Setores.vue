<template>
  <div class="setores-container">
    <!-- Header -->
    <div class="header-section">
      <h1 class="header-title">
        <span class="icon">🏢</span> Análise por Setores
      </h1>
      <p class="header-subtitle">
        Controle e monitoramento de auditoria por localização
      </p>
    </div>

    <!-- Filtros -->
    <div class="filters-section">
      <div class="filter-group">
        <label class="filter-label">
          <span class="icon">📍</span> Filtrar por Local/Corredor:
        </label>
        <select v-model="filtroLocal" class="filter-select">
          <option value="">Todos os locais</option>
          <option v-for="local in locaisUnicos" :key="local" :value="local">
            {{ local }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">
          <span class="icon">📊</span> Status:
        </label>
        <select v-model="filtroStatus" class="filter-select">
          <option value="">Todos os status</option>
          <option value="Atualizado">Itens Lidos</option>
          <option value="Não lido">Itens Não Lidos</option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">
          <span class="icon">🔍</span> Buscar produto:
        </label>
        <input
          v-model="filtroProduto"
          type="text"
          placeholder="Digite o nome do produto..."
          class="filter-input"
        />
      </div>
    </div>

    <!-- Estatísticas do Local -->
    <div v-if="filtroLocal" class="local-stats-section">
      <h2 class="stats-title">Estatísticas do Local: {{ filtroLocal }}</h2>
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">
            <span class="icon">📦</span>
          </div>
          <div class="stat-content">
            <h3>{{ totalItensLocal }}</h3>
            <p>Total de Itens</p>
          </div>
        </div>

        <div class="stat-card success">
          <div class="stat-icon">
            <span class="icon">✅</span>
          </div>
          <div class="stat-content">
            <h3>{{ itensLidosLocal }}</h3>
            <p>Itens Lidos</p>
            <span class="stat-percentage">{{ percentualLidos }}%</span>
          </div>
        </div>

        <div class="stat-card warning">
          <div class="stat-icon">
            <span class="icon">⏳</span>
          </div>
          <div class="stat-content">
            <h3>{{ itensNaoLidosLocal }}</h3>
            <p>Itens Não Lidos</p>
            <span class="stat-percentage">{{ percentualNaoLidos }}%</span>
          </div>
        </div>

        <div class="stat-card info">
          <div class="stat-icon">
            <span class="icon">📋</span>
          </div>
          <div class="stat-content">
            <h3>{{ colaboradoresLocal.length }}</h3>
            <p>Colaboradores Atuantes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs de Visualização -->
    <div class="tabs-section">
      <div class="tabs-header">
        <button
          @click="abaAtiva = 'todos'"
          :class="['tab-btn', { active: abaAtiva === 'todos' }]"
        >
          <span class="icon">📋</span> Todos os Itens
        </button>
        <button
          @click="abaAtiva = 'lidos'"
          :class="['tab-btn', { active: abaAtiva === 'lidos' }]"
        >
          <span class="icon">✅</span> Itens Lidos
        </button>
        <button
          @click="abaAtiva = 'naoLidos'"
          :class="['tab-btn', { active: abaAtiva === 'naoLidos' }]"
        >
          <span class="icon">⏳</span> Itens Não Lidos
        </button>
      </div>

      <div class="tab-content">
        <!-- Resumo -->
        <div class="resumo-section">
          <h3>Resumo do Local</h3>
          <div class="progress-container">
            <div class="progress-bar">
              <div
                class="progress-fill lidos"
                :style="{ width: percentualLidos + '%' }"
              ></div>
              <div
                class="progress-fill nao-lidos"
                :style="{ width: percentualNaoLidos + '%' }"
              ></div>
            </div>
            <div class="progress-labels">
              <span>✅ {{ percentualLidos }}% Lidos</span>
              <span>⏳ {{ percentualNaoLidos }}% Não Lidos</span>
            </div>
          </div>
        </div>

        <!-- Lista de Itens -->
        <div class="itens-section">
          <h3>{{ tituloAbaAtiva }}</h3>

          <div class="itens-grid">
            <div
              v-for="item in itensFiltrados"
              :key="item.Código"
              :class="[
                'item-card',
                { 'nao-lido': item.Situacao !== 'Atualizado' },
              ]"
            >
              <div class="item-header">
                <span class="item-codigo">{{ item.Código }}</span>
                <span
                  :class="[
                    'item-status',
                    item.Situacao === 'Atualizado' ? 'lido' : 'nao-lido',
                  ]"
                >
                  {{
                    item.Situacao === "Atualizado" ? "✅ Lido" : "⏳ Não Lido"
                  }}
                </span>
              </div>

              <div class="item-body">
                <h4 class="item-nome">{{ item.Produto }}</h4>
                <div class="item-details">
                  <div class="detail">
                    <span class="icon">📦</span>
                    <span>Estoque: {{ item["Estoque atual"] || 0 }}</span>
                  </div>
                  <div class="detail">
                    <span class="icon">👤</span>
                    <span>{{ item.Usuario || "N/A" }}</span>
                  </div>
                  <div class="detail">
                    <span class="icon">📅</span>
                    <span
                      >Última compra:
                      {{ formatarData(item["Última compra"]) }}</span
                    >
                  </div>
                </div>
              </div>

              <div class="item-actions">
                <button
                  class="action-btn primary"
                  v-if="item.Situacao !== 'Atualizado'"
                >
                  <span class="icon">✏️</span> Marcar como Lido
                </button>
                <button class="action-btn secondary">
                  <span class="icon">📊</span> Detalhes
                </button>
              </div>
            </div>
          </div>

          <div v-if="itensFiltrados.length === 0" class="empty-state">
            <span class="icon">🔍</span>
            <p>Nenhum item encontrado para os filtros selecionados.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mapa de Calor dos Corredores -->
    <div class="heatmap-section">
      <h2 class="section-title">Mapa de Calor por Corredor</h2>
      <div class="heatmap-grid">
        <div
          v-for="local in locaisComEstatisticas"
          :key="local.nome"
          :class="['heatmap-item', getHeatmapClass(local.percentualLidos)]"
          @click="filtroLocal = local.nome"
        >
          <div class="heatmap-header">
            <span class="heatmap-title">{{ local.nome }}</span>
            <span class="heatmap-percentage">{{ local.percentualLidos }}%</span>
          </div>
          <div class="heatmap-progress">
            <div
              class="heatmap-progress-bar"
              :style="{ width: local.percentualLidos + '%' }"
            ></div>
          </div>
          <div class="heatmap-stats">
            <span>{{ local.lidos }}/{{ local.total }} itens</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Exportar Relatório -->
    <div class="export-section">
      <button @click="exportarRelatorio" class="export-btn">
        <span class="icon">📤</span> Exportar Relatório Completo
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SetoresAnalise",
  data() {
    return {
      dadosPlanilha: [],
      filtroLocal: "",
      filtroStatus: "",
      filtroProduto: "",
      abaAtiva: "todos",
    };
  },
  computed: {
    locaisUnicos() {
      const locais = [...new Set(this.dadosPlanilha.map((item) => item.Local))];
      return locais.filter((local) => local).sort();
    },

    itensFiltrados() {
      let filtrados = this.dadosPlanilha;

      // Filtro por local
      if (this.filtroLocal) {
        filtrados = filtrados.filter((item) => item.Local === this.filtroLocal);
      }

      // Filtro por status
      if (this.filtroStatus) {
        filtrados = filtrados.filter((item) => {
          if (this.filtroStatus === "Atualizado") {
            return item.Situacao === "Atualizado";
          } else {
            return item.Situacao !== "Atualizado";
          }
        });
      }

      // Filtro por produto
      if (this.filtroProduto) {
        const termo = this.filtroProduto.toLowerCase();
        filtrados = filtrados.filter(
          (item) => item.Produto && item.Produto.toLowerCase().includes(termo)
        );
      }

      // Filtro por aba ativa
      if (this.abaAtiva === "lidos") {
        filtrados = filtrados.filter((item) => item.Situacao === "Atualizado");
      } else if (this.abaAtiva === "naoLidos") {
        filtrados = filtrados.filter((item) => item.Situacao !== "Atualizado");
      }

      return filtrados;
    },

    tituloAbaAtiva() {
      switch (this.abaAtiva) {
        case "lidos":
          return "Itens Lidos no Local";
        case "naoLidos":
          return "Itens Não Lidos no Local";
        default:
          return "Todos os Itens do Local";
      }
    },

    itensDoLocal() {
      if (!this.filtroLocal) return this.dadosPlanilha;
      return this.dadosPlanilha.filter(
        (item) => item.Local === this.filtroLocal
      );
    },

    totalItensLocal() {
      return this.itensDoLocal.length;
    },

    itensLidosLocal() {
      return this.itensDoLocal.filter((item) => item.Situacao === "Atualizado")
        .length;
    },

    itensNaoLidosLocal() {
      return this.totalItensLocal - this.itensLidosLocal;
    },

    percentualLidos() {
      if (this.totalItensLocal === 0) return 0;
      return Math.round((this.itensLidosLocal / this.totalItensLocal) * 100);
    },

    percentualNaoLidos() {
      return 100 - this.percentualLidos;
    },

    colaboradoresLocal() {
      const colaboradores = new Set();
      this.itensDoLocal.forEach((item) => {
        if (item.Usuario) colaboradores.add(item.Usuario);
      });
      return Array.from(colaboradores);
    },

    locaisComEstatisticas() {
      return this.locaisUnicos.map((local) => {
        const itensLocal = this.dadosPlanilha.filter(
          (item) => item.Local === local
        );
        const lidos = itensLocal.filter(
          (item) => item.Situacao === "Atualizado"
        ).length;
        const total = itensLocal.length;
        const percentualLidos =
          total > 0 ? Math.round((lidos / total) * 100) : 0;

        return {
          nome: local,
          total,
          lidos,
          percentualLidos,
        };
      });
    },
  },
  mounted() {
    this.carregarDados();
  },
  methods: {
    carregarDados() {
      const dadosSalvos = localStorage.getItem("dadosPlanilha");
      if (dadosSalvos) {
        this.dadosPlanilha = JSON.parse(dadosSalvos);

        // Normalizar dados para garantir consistência
        this.dadosPlanilha = this.dadosPlanilha.map((item) => ({
          ...item,
          Situacao: item.Situacao || item.Situação || "Não lido",
          Local: item.Local || "Não especificado",
        }));
      }
    },

    formatarData(data) {
      if (!data) return "N/A";

      // Converter número do Excel para data (se necessário)
      if (typeof data === "number") {
        const excelEpoch = new Date(1899, 11, 30);
        const date = new Date(excelEpoch.getTime() + data * 86400000);
        return date.toLocaleDateString("pt-BR");
      }

      return data;
    },

    getHeatmapClass(percentual) {
      if (percentual >= 90) return "excelente";
      if (percentual >= 70) return "bom";
      if (percentual >= 50) return "medio";
      if (percentual >= 30) return "baixo";
      return "critico";
    },

    exportarRelatorio() {
      const relatorioData = this.locaisComEstatisticas.map((local) => ({
        Local: local.nome,
        "Total Itens": local.total,
        "Itens Lidos": local.lidos,
        "Itens Não Lidos": local.total - local.lidos,
        "Percentual Lidos": `${local.percentualLidos}%`,
        Status: this.getStatusLabel(local.percentualLidos),
      }));

      const csvContent = [
        "Local,Total Itens,Itens Lidos,Itens Não Lidos,Percentual Lidos,Status",
        ...relatorioData.map(
          (item) =>
            `"${item.Local}",${item["Total Itens"]},${item["Itens Lidos"]},${item["Itens Não Lidos"]},"${item["Percentual Lidos"]}","${item.Status}"`
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `relatorio_setores_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    getStatusLabel(percentual) {
      if (percentual >= 90) return "Excelente";
      if (percentual >= 70) return "Bom";
      if (percentual >= 50) return "Médio";
      if (percentual >= 30) return "Baixo";
      return "Crítico";
    },
  },
};
</script>

<style scoped>
.setores-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Header */
.header-section {
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
}

.header-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.header-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Filtros */
.filters-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-select,
.filter-input {
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #667eea;
}

/* Estatísticas */
.local-stats-section {
  margin-bottom: 30px;
}

.stats-title {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-card.primary {
  border-left: 4px solid #667eea;
}
.stat-card.success {
  border-left: 4px solid #51cf66;
}
.stat-card.warning {
  border-left: 4px solid #ffd43b;
}
.stat-card.info {
  border-left: 4px solid #339af0;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content h3 {
  font-size: 2rem;
  margin: 0;
  color: #2c3e50;
}

.stat-content p {
  margin: 5px 0 0 0;
  color: #7f8c8d;
}

.stat-percentage {
  font-weight: 600;
  font-size: 0.9rem;
}

.stat-card.success .stat-percentage {
  color: #51cf66;
}
.stat-card.warning .stat-percentage {
  color: #f59f00;
}

/* Tabs */
.tabs-section {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #e9ecef;
}

.tab-btn {
  flex: 1;
  padding: 15px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: #7f8c8d;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.tab-btn.active {
  color: #667eea;
  border-bottom: 3px solid #667eea;
}

.tab-content {
  padding: 20px;
}

.resumo-section {
  margin-bottom: 30px;
}

.progress-container {
  max-width: 500px;
  margin: 0 auto;
}

.progress-bar {
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
}

.progress-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.progress-fill.lidos {
  background: #51cf66;
}
.progress-fill.nao-lidos {
  background: #ffd43b;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

/* Itens */
.itens-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.item-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.item-card.nao-lido {
  border-color: #ffd43b;
  background: #fff9db;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

.item-codigo {
  font-weight: 600;
  color: #2c3e50;
}

.item-status {
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.item-status.lido {
  background: #d3f9d8;
  color: #2b8a3e;
}

.item-status.nao-lido {
  background: #fff3bf;
  color: #e67700;
}

.item-nome {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.detail {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7f8c8d;
}

.item-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: #51cf66;
  color: white;
}

.action-btn.secondary {
  background: #e9ecef;
  color: #495057;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

/* Heatmap */
.heatmap-section {
  margin-bottom: 30px;
}

.section-title {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.heatmap-item {
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.heatmap-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.heatmap-item.excelente {
  border-left: 4px solid #51cf66;
}
.heatmap-item.bom {
  border-left: 4px solid #74c0fc;
}
.heatmap-item.medio {
  border-left: 4px solid #ffd43b;
}
.heatmap-item.baixo {
  border-left: 4px solid #ff922b;
}
.heatmap-item.critico {
  border-left: 4px solid #ff6b6b;
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.heatmap-title {
  font-weight: 600;
  color: #2c3e50;
}

.heatmap-percentage {
  font-weight: 700;
  font-size: 1.1rem;
}

.heatmap-item.excelente .heatmap-percentage {
  color: #51cf66;
}
.heatmap-item.bom .heatmap-percentage {
  color: #74c0fc;
}
.heatmap-item.medio .heatmap-percentage {
  color: #f59f00;
}
.heatmap-item.baixo .heatmap-percentage {
  color: #ff922b;
}
.heatmap-item.critico .heatmap-percentage {
  color: #ff6b6b;
}

.heatmap-progress {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.heatmap-progress-bar {
  height: 100%;
  transition: width 0.5s ease;
}

.heatmap-item.excelente .heatmap-progress-bar {
  background: #51cf66;
}
.heatmap-item.bom .heatmap-progress-bar {
  background: #74c0fc;
}
.heatmap-item.medio .heatmap-progress-bar {
  background: #ffd43b;
}
.heatmap-item.baixo .heatmap-progress-bar {
  background: #ff922b;
}
.heatmap-item.critico .heatmap-progress-bar {
  background: #ff6b6b;
}

.heatmap-stats {
  font-size: 0.9rem;
  color: #7f8c8d;
}

/* Exportar */
.export-section {
  text-align: center;
}

.export-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
}

.export-btn:hover {
  transform: translateY(-2px);
}

/* Responsivo */
@media (max-width: 768px) {
  .filters-section {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .tabs-header {
    flex-direction: column;
  }

  .itens-grid {
    grid-template-columns: 1fr;
  }

  .heatmap-grid {
    grid-template-columns: 1fr;
  }

  .item-actions {
    flex-direction: column;
  }
}

.icon {
  font-size: 1.2em;
  vertical-align: middle;
}
</style>
