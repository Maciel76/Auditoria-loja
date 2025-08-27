<template>
  <div class="setores-container">
    <!-- Header -->
    <div class="header-section">
      <h1 class="header-title">
        <span class="icon" aria-hidden="true">🏢</span> Análise por Setores
      </h1>
      <p class="header-subtitle">
        Controle e monitoramento de auditoria por localização
      </p>
    </div>

    <!-- Seletor de Data com Loading Específico -->
    <div class="date-selector">
      <label class="filter-label" for="data-auditoria-select">
        <span class="icon" aria-hidden="true">📅</span> Selecione a data de
        auditoria:
      </label>
      <div class="select-wrapper">
        <select
          id="data-auditoria-select"
          v-model="dataSelecionada"
          @change="trocarDataAuditoria"
          class="filter-select"
          :disabled="carregando || carregandoData"
          aria-label="Selecionar data de auditoria"
          aria-describedby="data-loading-status"
        >
          <option v-if="datasAuditoria.length === 0" value="" disabled>
            Carregando datas...
          </option>
          <option v-for="data in datasAuditoria" :key="data" :value="data">
            {{ formatarDataParaExibicao(data) }}
          </option>
        </select>
        <span
          v-if="carregandoData"
          class="select-loading"
          aria-hidden="true"
        ></span>
      </div>
      <span id="data-loading-status" class="sr-only" aria-live="polite">
        {{ carregandoData ? "Carregando dados para a data selecionada" : "" }}
      </span>
    </div>

    <!-- Loading Principal -->
    <div v-if="carregando && !carregandoData" class="loading-container">
      <div class="spinner" aria-hidden="true"></div>
      <p>Carregando dados dos setores...</p>
    </div>

    <!-- Erro -->
    <div v-else-if="erro" class="error-container">
      <div class="error-icon" aria-hidden="true">
        <span class="icon">⚠️</span>
      </div>
      <h3>Ocorreu um erro</h3>
      <p>{{ erro }}</p>
      <button @click="carregarDados" class="btn btn-primary">
        <span class="icon" aria-hidden="true">🔄</span> Tentar Novamente
      </button>
    </div>

    <!-- Sem dados -->
    <div v-else-if="dadosPlanilha.length === 0" class="empty-state">
      <div class="empty-icon" aria-hidden="true">
        <span class="icon">🏭</span>
      </div>
      <h3>Nenhum dado de setores disponível</h3>
      <p>Faça o upload de uma planilha para visualizar os setores</p>
      <router-link to="/" class="btn btn-primary">
        <span class="icon" aria-hidden="true">📤</span> Fazer Upload
      </router-link>
    </div>

    <!-- Com dados -->
    <div v-else>
      <!-- Filtros -->
      <div class="filters-section">
        <div class="filter-group">
          <label class="filter-label" for="filtro-local">
            <span class="icon" aria-hidden="true">📍</span> Filtrar por
            Local/Corredor:
          </label>
          <select id="filtro-local" v-model="filtroLocal" class="filter-select">
            <option value="">Todos os locais</option>
            <option v-for="local in locaisUnicos" :key="local" :value="local">
              {{ local }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label" for="filtro-status">
            <span class="icon" aria-hidden="true">📊</span> Status:
          </label>
          <select
            id="filtro-status"
            v-model="filtroStatus"
            class="filter-select"
          >
            <option value="">Todos os status</option>
            <option value="Atualizado">Itens Lidos</option>
            <option value="Não lido">Itens Não Lidos</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label" for="produto-search">
            <span class="icon" aria-hidden="true">🔍</span> Buscar produto:
          </label>
          <div class="search-wrapper">
            <input
              id="produto-search"
              v-model="filtroProdutoInput"
              type="text"
              placeholder="Digite o nome do produto..."
              class="filter-input"
              aria-label="Buscar produto"
            />
            <span
              v-if="buscandoProduto"
              class="search-loading"
              aria-hidden="true"
            ></span>
          </div>
        </div>
      </div>

      <!-- Resumo dos filtros ativos -->
      <div v-if="filtrosAtivos.length > 0" class="active-filters">
        <h3 class="active-filters-title">Filtros aplicados:</h3>
        <div class="filters-list">
          <span
            v-for="(filtro, index) in filtrosAtivos"
            :key="index"
            class="filter-tag"
          >
            {{ filtro }}
            <button
              @click="removerFiltro(filtro)"
              class="remove-filter"
              :aria-label="`Remover filtro ${filtro}`"
            >
              &times;
            </button>
          </span>
        </div>
        <button
          @click="limparFiltros"
          class="btn btn-secondary"
          aria-label="Limpar todos os filtros"
        >
          Limpar todos
        </button>
      </div>

      <!-- Estatísticas do Local -->
      <div v-if="filtroLocal" class="local-stats-section">
        <h2 class="stats-title">Estatísticas do Local: {{ filtroLocal }}</h2>
        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon" aria-hidden="true">
              <span class="icon">📦</span>
            </div>
            <div class="stat-content">
              <h3>{{ totalItensLocal }}</h3>
              <p>Total de Itens</p>
            </div>
          </div>

          <div class="stat-card success">
            <div class="stat-icon" aria-hidden="true">
              <span class="icon">✅</span>
            </div>
            <div class="stat-content">
              <h3>{{ itensLidosLocal }}</h3>
              <p>Itens Lidos</p>
              <span class="stat-percentage">{{ percentualLidos }}%</span>
            </div>
          </div>

          <div class="stat-card warning">
            <div class="stat-icon" aria-hidden="true">
              <span class="icon">⏳</span>
            </div>
            <div class="stat-content">
              <h3>{{ itensNaoLidosLocal }}</h3>
              <p>Itens Não Lidos</p>
              <span class="stat-percentage">{{ percentualNaoLidos }}%</span>
            </div>
          </div>

          <div class="stat-card info">
            <div class="stat-icon" aria-hidden="true">
              <span class="icon">👥</span>
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
        <div class="tabs-header" role="tablist">
          <button
            @click="abaAtiva = 'todos'"
            :class="['tab-btn', { active: abaAtiva === 'todos' }]"
            role="tab"
            :aria-selected="abaAtiva === 'todos'"
            aria-controls="tab-todos"
            id="tab-todos-btn"
          >
            <span class="icon" aria-hidden="true">📋</span> Todos os Itens
          </button>
          <button
            @click="abaAtiva = 'lidos'"
            :class="['tab-btn', { active: abaAtiva === 'lidos' }]"
            role="tab"
            :aria-selected="abaAtiva === 'lidos'"
            aria-controls="tab-lidos"
            id="tab-lidos-btn"
          >
            <span class="icon" aria-hidden="true">✅</span> Itens Lidos
          </button>
          <button
            @click="abaAtiva = 'naoLidos'"
            :class="['tab-btn', { active: abaAtiva === 'naoLidos' }]"
            role="tab"
            :aria-selected="abaAtiva === 'naoLidos'"
            aria-controls="tab-naoLidos"
            id="tab-naoLidos-btn"
          >
            <span class="icon" aria-hidden="true">⏳</span> Itens Não Lidos
          </button>
        </div>

        <div class="tab-content">
          <!-- Resumo -->
          <div class="resumo-section">
            <h3>Resumo do Local</h3>
            <div class="progress-container">
              <div
                class="progress-bar"
                role="progressbar"
                :aria-valuenow="percentualLidos"
                aria-valuemin="0"
                aria-valuemax="100"
              >
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
          <div
            v-show="abaAtiva === 'todos'"
            role="tabpanel"
            id="tab-todos"
            aria-labelledby="tab-todos-btn"
            class="tab-panel"
          >
            <h3>{{ tituloAbaAtiva }}</h3>
            <p v-if="itensFiltrados.length === 0" class="no-results">
              Nenhum item encontrado para os filtros selecionados.
              <span v-if="filtrosAtivos.length > 0"
                >Tente ajustar os filtros aplicados.</span
              >
            </p>
            <div v-else class="itens-grid">
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
                  <h4
                    class="item-nome"
                    v-html="destacarTermo(item.Produto, filtroProduto)"
                  ></h4>
                  <div class="item-details">
                    <div class="detail">
                      <span class="icon" aria-hidden="true">📦</span>
                      <span>Estoque: {{ item["Estoque atual"] || 0 }}</span>
                    </div>
                    <div class="detail">
                      <span class="icon" aria-hidden="true">👤</span>
                      <span>{{ item.Usuario || "N/A" }}</span>
                    </div>
                    <div class="detail">
                      <span class="icon" aria-hidden="true">📅</span>
                      <span
                        >Última compra:
                        {{ formatarData(item["Última compra"]) }}</span
                      >
                    </div>
                  </div>
                </div>

                <div class="item-actions">
                  <button
                    v-if="item.Situacao !== 'Atualizado'"
                    class="action-btn primary"
                    aria-label="Marcar item como lido"
                  >
                    <span class="icon" aria-hidden="true">✏️</span> Marcar como
                    Lido
                  </button>
                  <button
                    class="action-btn secondary"
                    aria-label="Ver detalhes do item"
                  >
                    <span class="icon" aria-hidden="true">📊</span> Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            v-show="abaAtiva === 'lidos'"
            role="tabpanel"
            id="tab-lidos"
            aria-labelledby="tab-lidos-btn"
            class="tab-panel"
          >
            <h3>{{ tituloAbaAtiva }}</h3>
            <p v-if="itensLidosFiltrados.length === 0" class="no-results">
              Nenhum item lido encontrado para os filtros selecionados.
            </p>
            <div v-else class="itens-grid">
              <div
                v-for="item in itensLidosFiltrados"
                :key="item.Código"
                class="item-card"
              >
                <!-- Conteúdo similar ao tab todos, mas apenas para itens lidos -->
                <div class="item-header">
                  <span class="item-codigo">{{ item.Código }}</span>
                  <span class="item-status lido">✅ Lido</span>
                </div>
                <div class="item-body">
                  <h4
                    class="item-nome"
                    v-html="destacarTermo(item.Produto, filtroProduto)"
                  ></h4>
                  <div class="item-details">
                    <div class="detail">
                      <span class="icon" aria-hidden="true">📦</span>
                      <span>Estoque: {{ item["Estoque atual"] || 0 }}</span>
                    </div>
                    <div class="detail">
                      <span class="icon" aria-hidden="true">👤</span>
                      <span>{{ item.Usuario || "N/A" }}</span>
                    </div>
                    <div class="detail">
                      <span class="icon" aria-hidden="true">📅</span>
                      <span
                        >Última compra:
                        {{ formatarData(item["Última compra"]) }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="item-actions">
                  <button
                    class="action-btn secondary"
                    aria-label="Ver detalhes do item"
                  >
                    <span class="icon" aria-hidden="true">📊</span> Detalhes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            v-show="abaAtiva === 'naoLidos'"
            role="tabpanel"
            id="tab-naoLidos"
            aria-labelledby="tab-naoLidos-btn"
            class="tab-panel"
          >
            <h3>{{ tituloAbaAtiva }}</h3>
            <p v-if="itensNaoLidosFiltrados.length === 0" class="no-results">
              Nenhum item não lido encontrado para os filtros selecionados.
            </p>
            <div v-else class="itens-grid">
              <div
                v-for="item in itensNaoLidosFiltrados"
                :key="item.Código"
                class="item-card nao-lido"
              >
                <!-- Conteúdo similar ao tab todos, mas apenas para itens não lidos -->
                <div class="item-header">
                  <span class="item-codigo">{{ item.Código }}</span>
                  <span class="item-status nao-lido">⏳ Não Lido</span>
                </div>
                <div class="item-body">
                  <h4
                    class="item-nome"
                    v-html="destacarTermo(item.Produto, filtroProduto)"
                  ></h4>
                  <div class="item-details">
                    <div class="detail">
                      <span class="icon" aria-hidden="true">📦</span>
                      <span>Estoque: {{ item["Estoque atual"] || 0 }}</span>
                    </div>
                    <div class="detail">
                      <span class="icon" aria-hidden="true">👤</span>
                      <span>{{ item.Usuario || "N/A" }}</span>
                    </div>
                    <div class="detail">
                      <span class="icon" aria-hidden="true">📅</span>
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
                    aria-label="Marcar item como lido"
                  >
                    <span class="icon" aria-hidden="true">✏️</span> Marcar como
                    Lido
                  </button>
                  <button
                    class="action-btn secondary"
                    aria-label="Ver detalhes do item"
                  >
                    <span class="icon" aria-hidden="true">📊</span> Detalhes
                  </button>
                </div>
              </div>
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
            :aria-label="`${local.nome}: ${local.percentualLidos}% de itens lidos. Clique para filtrar por este local.`"
            tabindex="0"
            @keyup.enter="filtroLocal = local.nome"
            @keyup.space="filtroLocal = local.nome"
          >
            <div class="heatmap-header">
              <span class="heatmap-title">{{ local.nome }}</span>
              <span class="heatmap-percentage"
                >{{ local.percentualLidos }}%</span
              >
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
        <button
          @click="exportarRelatorio"
          class="export-btn"
          aria-label="Exportar relatório completo em formato CSV"
        >
          <span class="icon" aria-hidden="true">📊</span> Exportar Relatório
          Completo
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { debounce } from "lodash";

export default {
  name: "SetoresAnalise",
  data() {
    return {
      dadosPlanilha: [],
      datasAuditoria: [],
      dataSelecionada: "",
      filtroLocal: "",
      filtroStatus: "",
      filtroProduto: "",
      filtroProdutoInput: "",
      abaAtiva: "todos",
      carregando: true,
      carregandoData: false,
      buscandoProduto: false,
      erro: "",
    };
  },
  computed: {
    locaisUnicos() {
      const locais = [...new Set(this.dadosPlanilha.map((item) => item.Local))];
      return locais.filter((local) => local).sort();
    },

    // Filtros otimizados com memoização
    itensFiltrados() {
      return this.aplicarFiltros(this.dadosPlanilha);
    },

    itensLidosFiltrados() {
      return this.aplicarFiltros(
        this.dadosPlanilha.filter((item) => item.Situacao === "Atualizado")
      );
    },

    itensNaoLidosFiltrados() {
      return this.aplicarFiltros(
        this.dadosPlanilha.filter((item) => item.Situacao !== "Atualizado")
      );
    },

    tituloAbaAtiva() {
      const locais = this.filtroLocal ? ` no ${this.filtroLocal}` : "";
      switch (this.abaAtiva) {
        case "lidos":
          return `Itens Lidos${locais}`;
        case "naoLidos":
          return `Itens Não Lidos${locais}`;
        default:
          return `Todos os Itens${locais}`;
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

    filtrosAtivos() {
      const filtros = [];
      if (this.filtroLocal) filtros.push(`Local: ${this.filtroLocal}`);
      if (this.filtroStatus) {
        filtros.push(
          `Status: ${
            this.filtroStatus === "Atualizado"
              ? "Itens Lidos"
              : "Itens Não Lidos"
          }`
        );
      }
      if (this.filtroProduto) filtros.push(`Produto: "${this.filtroProduto}"`);
      return filtros;
    },
  },
  watch: {
    filtroProdutoInput: debounce(function (newValue) {
      this.buscandoProduto = true;
      setTimeout(() => {
        this.filtroProduto = newValue;
        this.buscandoProduto = false;
      }, 300);
    }, 500),
  },
  methods: {
    // Método otimizado para aplicar filtros
    aplicarFiltros(itens) {
      let filtrados = itens;

      if (this.filtroLocal) {
        filtrados = filtrados.filter((item) => item.Local === this.filtroLocal);
      }

      if (this.filtroStatus) {
        filtrados = filtrados.filter((item) => {
          if (this.filtroStatus === "Atualizado") {
            return item.Situacao === "Atualizado";
          } else {
            return item.Situacao !== "Atualizado";
          }
        });
      }

      if (this.filtroProduto) {
        const termo = this.filtroProduto.toLowerCase();
        filtrados = filtrados.filter(
          (item) => item.Produto && item.Produto.toLowerCase().includes(termo)
        );
      }

      return filtrados;
    },

    destacarTermo(texto, termo) {
      if (!termo || !texto) return texto;
      const escaped = termo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      return texto.replace(regex, "<mark>$1</mark>");
    },

    limparFiltros() {
      this.filtroLocal = "";
      this.filtroStatus = "";
      this.filtroProduto = "";
      this.filtroProdutoInput = "";
    },

    removerFiltro(filtroTexto) {
      if (filtroTexto.startsWith("Local:")) {
        this.filtroLocal = "";
      } else if (filtroTexto.startsWith("Status:")) {
        this.filtroStatus = "";
      } else if (filtroTexto.startsWith("Produto:")) {
        this.filtroProduto = "";
        this.filtroProdutoInput = "";
      }
    },

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
        // Fallback para datas de exemplo em caso de erro
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

      this.carregandoData = true;
      try {
        await this.carregarDados();
      } finally {
        this.carregandoData = false;
      }
    },

    async carregarDados() {
      try {
        this.carregando = true;
        this.erro = "";
        const params = this.dataSelecionada
          ? { data: this.dataSelecionada }
          : {};
        const response = await axios.get(
          "http://localhost:3000/dados-setores",
          { params }
        );

        if (response.data && Array.isArray(response.data)) {
          this.dadosPlanilha = response.data.map((item) => ({
            ...item,
            Situacao: item.Situacao || item.Situação || "Não lido",
            Local: item.Local || "Não especificado",
          }));
        } else {
          this.erro = "Formato de dados inválido";
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        this.erro = "Falha ao carregar dados da planilha";
        // Dados de exemplo para demonstração
        this.dadosPlanilha = [
          {
            Código: "1062218",
            Produto: "CIGARRO CHESTERFIELD BLUE BOX C/10 KS RCB",
            Local: "C01 - C01",
            Usuario: "3285030 (MARLUCIA OLIVEIRA DA SILVA)",
            Situacao: "Atualizado",
            "Estoque atual": "24",
            "Última compra": "01/01/2023",
          },
          {
            Código: "1062219",
            Produto: "CIGARRO MARLBORO GOLD C/10 KS RCB",
            Local: "C01 - C01",
            Usuario: "3285031 (JOÃO SILVA)",
            Situacao: "Não lido",
            "Estoque atual": "15",
            "Última compra": "15/01/2023",
          },
          {
            Código: "1062220",
            Produto: "CERVEJA HEINEKEN LATA 350ML",
            Local: "C02 - C02",
            Usuario: "3285032 (MARIA SANTOS)",
            Situacao: "Atualizado",
            "Estoque atual": "48",
            "Última compra": "10/02/2023",
          },
        ];
      } finally {
        this.carregando = false;
      }
    },

    formatarData(data) {
      if (!data) return "N/A";
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
  async mounted() {
    await this.carregarDatasAuditoria();
    await this.carregarDados();
  },
};
</script>

<style scoped>
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
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 3rem;
  color: #e74c3c;
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  color: #bdc3c7;
  margin-bottom: 20px;
}
.setores-container {
  max-width: auto;
  margin: 0 auto;
  padding: 2px;
  font-family: "Poppins", sans-serif;
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
date-selector {
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  max-width: 400px;
  margin: 20px auto 0;
}

.date-selector .filter-label {
  color: white;
  margin-bottom: 10px;
  display: block;
}

.date-selector .filter-select {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
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
