<template>
  <div class="employee-chart">
    <div class="panel-header">
      <div class="header-content">
        <div class="title-section">
          <div class="title-icon">👥</div>
          <h2>Leituras por Colaborador</h2>
        </div>
        <div class="header-controls">
          <div class="view-toggle">
            <button
              :class="['view-btn', { active: viewMode === 'chart' }]"
              @click="viewMode = 'chart'"
            >
              <span class="btn-icon">📊</span>
              <span class="btn-text">Gráfico</span>
            </button>
            <button
              :class="['view-btn', { active: viewMode === 'list' }]"
              @click="viewMode = 'list'"
            >
              <span class="btn-icon">📋</span>
              <span class="btn-text">Lista</span>
            </button>
          </div>
          <div class="sort-filter">
            <select v-model="sortBy" class="filter-select">
              <option value="value">Por Leituras</option>
              <option value="name">Por Nome</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Seletor de Data -->
    <div class="date-selector">
      <label for="periodo-select">Período:</label>
      <select
        id="periodo-select"
        v-model="periodoSelecionado"
        @change="buscarDados"
        :disabled="carregando"
      >
        <option value="hoje">Hoje</option>
        <option value="semana">Esta Semana</option>
        <option value="mes">Este Mês</option>
        <option value="todos">Todos</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando dados dos colaboradores...</p>
    </div>

    <div v-else>
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <div class="stat-value">{{ topPerformer.contador }}</div>
            <div class="stat-label">Top: {{ topPerformer.nome }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-info">
            <div class="stat-value">{{ averageReads }}</div>
            <div class="stat-label">Média por Colab.</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👑</div>
          <div class="stat-info">
            <div class="stat-value">{{ totalReads }}</div>
            <div class="stat-label">Total de Leituras</div>
          </div>
        </div>
      </div>

      <div v-if="viewMode === 'chart'" class="chart-view horizontal">
        <div class="chart-container">
          <div
            v-for="(employee, index) in displayedEmployees"
            :key="employee.id"
            class="horizontal-bar-item"
          >
            <div class="bar-info">
              <div class="employee-rank" :class="getRankClass(index)">
                {{ index + 1 }}
              </div>
              <div class="employee-name">{{ formatarNome(employee.nome) }}</div>
              <div class="employee-value">{{ employee.contador }}</div>
            </div>
            <div class="horizontal-bar-container">
              <div
                class="horizontal-bar-fill"
                :style="{ height: (employee.contador / maxValue) * 100 + '%' }"
                :class="getRankClass(index)"
              >
                <div class="bar-shimmer"></div>
              </div>
            </div>
            <div class="employee-percentage">
              {{ ((employee.contador / totalReads) * 100).toFixed(1) }}%
            </div>
          </div>
        </div>
      </div>

      <div v-else class="list-view">
        <div class="list-header">
          <span class="header-rank">#</span>
          <span class="header-name">Colaborador</span>
          <span class="header-value">Leituras</span>
          <span class="header-percentage">%</span>
        </div>
        <div class="employee-list">
          <div
            v-for="(employee, index) in displayedEmployees"
            :key="employee.id"
            class="list-item"
            :class="getRankClass(index)"
          >
            <div class="item-rank">
              <div class="rank-badge" :class="getRankClass(index)">
                {{ index + 1 }}
              </div>
            </div>
            <div class="item-name">
              <span class="name-text">{{ formatarNome(employee.nome) }}</span>
            </div>
            <div class="item-value">
              <span class="value-number">{{ employee.contador }}</span>
            </div>
            <div class="item-percentage">
              <div class="percentage-bar">
                <div
                  class="percentage-fill"
                  :style="{ width: (employee.contador / maxValue) * 100 + '%' }"
                ></div>
              </div>
              <span class="percentage-text">
                {{ ((employee.contador / totalReads) * 100).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-footer">
        <div class="footer-info">
          <span class="info-text"
            >Mostrando {{ displayedEmployees.length }} de
            {{ employees.length }} colaboradores</span
          >
          <router-link to="/ranking/etiqueta">
            <button class="action-btn btn-ranking">Ver Ranking Completo</button>
          </router-link>
        </div>
        <div class="footer-actions">
          <button class="action-btn" @click="exportData">
            <span class="btn-icon">📄</span>
            Exportar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EmployeeChart",
  data() {
    return {
      carregando: true,
      erro: null,
      employees: [],
      viewMode: "chart",
      sortBy: "value",
      itemsToShow: 10,
      periodoSelecionado: "hoje",
    };
  },
  computed: {
    sortedEmployees() {
      return [...this.employees].sort((a, b) => {
        if (this.sortBy === "name") {
          return a.nome.localeCompare(b.nome);
        }
        return b.contador - a.contador;
      });
    },
    displayedEmployees() {
      return this.sortedEmployees.slice(0, this.itemsToShow);
    },
    maxValue() {
      return this.employees.length > 0
        ? Math.max(...this.employees.map((e) => e.contador))
        : 0;
    },
    totalReads() {
      return this.employees.reduce((sum, emp) => sum + emp.contador, 0);
    },
    averageReads() {
      return this.employees.length > 0
        ? Math.round(this.totalReads / this.employees.length)
        : 0;
    },
    topPerformer() {
      if (this.employees.length === 0) return { nome: "N/A", contador: 0 };
      return this.sortedEmployees[0];
    },
  },
  async mounted() {
    await this.buscarDados();
  },
  watch: {
    sortBy() {
      this.$nextTick(() => {
        this.renderChart();
      });
    },
  },
  methods: {
    async buscarDados() {
      try {
        this.carregando = true;
        this.erro = null;

        // Simular delay de carregamento
        await new Promise(resolve => setTimeout(resolve, 600));

        // Usar dados de exemplo diretamente
        this.employees = this.getDadosExemplo();
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        this.erro = "Falha ao carregar dados dos colaboradores";
      } finally {
        this.carregando = false;
      }
    },

    formatarNome(nomeCompleto) {
      if (!nomeCompleto) return "Nome não informado";

      // Extrair apenas o primeiro e último nome
      const partes = nomeCompleto.split(" ");
      if (partes.length <= 2) return nomeCompleto;

      return `${partes[0]} ${partes[partes.length - 1]}`;
    },

    getRankClass(index) {
      if (index === 0) return "rank-1";
      if (index === 1) return "rank-2";
      if (index === 2) return "rank-3";
      return "";
    },

    exportData() {
      const csvContent = this.sortedEmployees
        .map((emp) => `"${emp.nome}",${emp.contador}`)
        .join("\n");

      const blob = new Blob([`Nome,Leituras\n${csvContent}`], {
        type: "text/csv",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ranking-colaboradores-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    },

    getDadosExemplo() {
      return [
        {
          id: "2692473",
          nome: "NEILTON PEREIRA LIMA",
          contador: 3100,
        },
        {
          id: "5741793",
          nome: "YSMALL GOMES CUSTODIO",
          contador: 1608,
        },
        {
          id: "3642445",
          nome: "ADILSON CESAR SILVA DOS REIS",
          contador: 1250,
        },
        {
          id: "3285030",
          nome: "MARLUCIA OLIVEIRA DA SILVA",
          contador: 980,
        },
        {
          id: "3285031",
          nome: "JOÃO SILVA SANTOS",
          contador: 875,
        },
        {
          id: "3285032",
          nome: "MARIA SANTOS COSTA",
          contador: 760,
        },
        {
          id: "3285033",
          nome: "PEDRO ALVES OLIVEIRA",
          contador: 650,
        },
        {
          id: "3285034",
          nome: "ANA CAROLINA PEREIRA",
          contador: 540,
        },
        {
          id: "3285035",
          nome: "CARLOS EDUARDO RODRIGUES",
          contador: 430,
        },
        {
          id: "3285036",
          nome: "JULIANA MENDES FERNANDES",
          contador: 320,
        },
      ];
    },
  },
};
</script>

<style scoped>
:root {
  --employee-primary: #4361ee;
  --employee-secondary: #3a0ca3;
  --employee-rank1: #ffd700;
  --employee-rank2: #c0c0c0;
  --employee-rank3: #cd7f32;
  --employee-success: #4caf50;
  --employee-bg: #ffffff;
  --employee-text: #212529;
  --employee-text-light: #6c757d;
  --employee-border: #dee2e6;
  --employee-shadow: rgba(0, 0, 0, 0.08);
}

.employee-chart {
  background: var(--employee-bg);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px var(--employee-shadow);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.panel-header {
  margin-bottom: 8px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 24px;
}

.title-section h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--employee-text);
  background: linear-gradient(
    135deg,
    var(--employee-primary),
    var(--employee-secondary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-toggle {
  display: flex;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  padding: 3px;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--employee-text-light);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.85rem;
}

.view-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.view-btn.active {
  background: var(--employee-primary);
  color: white;
  box-shadow: 0 2px 6px rgba(67, 97, 238, 0.3);
}

.filter-select {
  padding: 6px 10px;
  border: 1px solid var(--employee-border);
  border-radius: 6px;
  background: var(--employee-bg);
  color: var(--employee-text);
  font-size: 0.85rem;
}

.date-selector {
  margin-bottom: 12px;
}

.date-selector label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.85rem;
  color: #546e7a;
  font-weight: 500;
}

.date-selector select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85rem;
  background: white;
}

.loading-container {
  text-align: center;
  padding: 30px 0;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e1e5e9;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 8px 0;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--employee-shadow);
}

.stat-icon {
  font-size: 22px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--employee-text);
  margin-bottom: 2px;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--employee-text-light);
  font-weight: 500;
}

/* ESTILOS PARA VISUALIZAÇÃO HORIZONTAL */
.chart-view.horizontal {
  flex: 1;
  display: flex;
  margin: 8px 0;
}

.chart-view.horizontal .chart-container {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
  height: 280px;
  width: 100%;
  padding: 0 15px;
}

.horizontal-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  gap: 6px;
  position: relative;
  transition: all 0.3s ease;
  flex: 1;
}

.horizontal-bar-item:hover {
  transform: translateY(-3px);
}

.bar-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
  text-align: center;
  gap: 4px;
}

.employee-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.employee-rank {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  font-weight: 700;
  font-size: 0.75rem;
  margin-bottom: 4px;
}

.employee-rank.rank-1 {
  background: linear-gradient(135deg, var(--employee-rank1), #ffed4e);
  color: #000;
}

.employee-rank.rank-2 {
  background: linear-gradient(135deg, var(--employee-rank2), #e8e8e8);
  color: #000;
}

.employee-rank.rank-3 {
  background: linear-gradient(135deg, var(--employee-rank3), #e3964c);
  color: #fff;
}

.employee-name {
  font-weight: 600;
  color: var(--employee-text);
  font-size: 0.8rem;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
}

.employee-value {
  font-weight: 600;
  color: var(--employee-primary);
  font-size: 0.75rem;
  background: rgba(67, 97, 238, 0.1);
  padding: 2px 6px;
  border-radius: 10px;
}

.horizontal-bar-container {
  width: 50%;
  height: 200px;
  background: rgba(216, 216, 216, 0.1);
  border-radius: 6px 6px 0 0;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: flex-end;
}

.horizontal-bar-fill {
  width: 100%;
  transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border-radius: 6px 6px 0 0;
}

.horizontal-bar-fill.rank-1 {
  background: linear-gradient(to top, var(--employee-rank1), #ffed4e);
}

.horizontal-bar-fill.rank-2 {
  background: linear-gradient(to top, var(--employee-rank2), #e8e8e8);
}

.horizontal-bar-fill.rank-3 {
  background: linear-gradient(to top, var(--employee-rank3), #e3964c);
}

.horizontal-bar-fill:not(.rank-1):not(.rank-2):not(.rank-3) {
  background: linear-gradient(
    to top,
    var(--employee-primary),
    var(--employee-secondary)
  );
}

.employee-percentage {
  margin-top: 6px;
  font-weight: 600;
  color: var(--employee-text-light);
  font-size: 0.8rem;
  background: rgba(108, 117, 125, 0.1);
  padding: 2px 6px;
  border-radius: 8px;
}

/* FIM DOS ESTILOS HORIZONTAIS */

.list-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 8px 0;
}

.list-header {
  display: grid;
  grid-template-columns: 40px 1fr 70px 60px;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  font-weight: 600;
  color: var(--employee-text-light);
  font-size: 0.8rem;
}

.employee-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.list-item {
  display: grid;
  grid-template-columns: 40px 1fr 70px 60px;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.list-item:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateX(2px);
}

.list-item.rank-1 {
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.1),
    rgba(255, 215, 0, 0.05)
  );
}

.list-item.rank-2 {
  background: linear-gradient(
    135deg,
    rgba(192, 192, 192, 0.1),
    rgba(192, 192, 192, 0.05)
  );
}

.list-item.rank-3 {
  background: linear-gradient(
    135deg,
    rgba(205, 127, 50, 0.1),
    rgba(205, 127, 50, 0.05)
  );
}

.rank-badge {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.8rem;
}

.rank-badge.rank-1 {
  background: linear-gradient(135deg, var(--employee-rank1), #ffed4e);
  color: #000;
}

.rank-badge.rank-2 {
  background: linear-gradient(135deg, var(--employee-rank2), #e8e8e8);
  color: #000;
}

.rank-badge.rank-3 {
  background: linear-gradient(135deg, var(--employee-rank3), #e3964c);
  color: #fff;
}

.rank-badge:not(.rank-1):not(.rank-2):not(.rank-3) {
  background: rgba(0, 0, 0, 0.1);
  color: var(--employee-text);
}

.item-name {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.name-text {
  font-weight: 600;
  color: var(--employee-text);
  font-size: 0.9rem;
}

.value-mobile {
  display: none;
  font-weight: 600;
  color: var(--employee-primary);
  font-size: 0.8rem;
}

.item-value {
  text-align: center;
}

.value-number {
  font-weight: 700;
  color: var(--employee-primary);
  font-size: 0.9rem;
}

.item-percentage {
  text-align: right;
}

.percentage-text {
  font-weight: 600;
  color: var(--employee-text-light);
  font-size: 0.85rem;
  background: rgba(108, 117, 125, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
}

.panel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--employee-border);
}

.footer-info {
  font-size: 0.8rem;
  color: var(--employee-text-light);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px solid var(--employee-border);
  border-radius: 16px;
  background: var(--employee-bg);
  color: var(--employee-text);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  font-weight: 500;
}
.btn-ranking {
  border-color: var(--employee-primary);
  color: var(--employee-primary);
  margin-top: 2px;
}

.action-btn:hover {
  background: var(--employee-primary);
  color: white;
  border-color: var(--employee-primary);
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(67, 97, 238, 0.3);
}

.bar-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Responsividade */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-controls {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .employee-chart {
    padding: 16px;
    gap: 12px;
  }

  .stats-overview {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .chart-view.horizontal .chart-container {
    flex-direction: column;
    height: auto;
    gap: 10px;
  }

  .horizontal-bar-item {
    flex-direction: row;
    height: auto;
    width: 100%;
    align-items: center;
    gap: 10px;
  }

  .bar-info {
    flex-direction: row;
    align-items: center;
    margin-bottom: 0;
    flex: 1;
    gap: 8px;
  }

  .employee-details {
    align-items: flex-start;
    text-align: left;
  }

  .horizontal-bar-container {
    width: 100%;
    height: 20px;
    border-radius: 10px;
  }

  .horizontal-bar-fill {
    height: 100%;
    border-radius: 10px;
  }

  .employee-percentage {
    margin-top: 0;
    min-width: 45px;
    text-align: right;
  }

  .list-header {
    display: none;
  }

  .list-item {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 12px;
  }

  .item-rank {
    position: absolute;
    top: 6px;
    right: 6px;
  }

  .value-mobile {
    display: block;
  }

  .item-value {
    display: none;
  }

  .panel-footer {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .title-section h2 {
    font-size: 1.2rem;
  }

  .header-controls {
    flex-direction: column;
    gap: 8px;
  }

  .view-toggle {
    width: 100%;
  }

  .view-btn {
    flex: 1;
    justify-content: center;
  }

  .filter-select {
    width: 100%;
  }

  .chart-view.horizontal .chart-container {
    padding: 0 8px;
  }

  .employee-name {
    max-width: 60px;
    font-size: 0.75rem;
  }

  .employee-value {
    font-size: 0.7rem;
  }
}
</style>
