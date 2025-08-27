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

    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-info">
          <div class="stat-value">{{ topPerformer.value }}</div>
          <div class="stat-label">Top: {{ topPerformer.name }}</div>
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

    <div v-if="viewMode === 'chart'" class="chart-view">
      <div class="chart-bars">
        <div
          v-for="(employee, index) in displayedEmployees"
          :key="employee.name"
          class="employee-bar-item"
        >
          <div class="employee-info">
            <div class="employee-rank" :class="getRankClass(index)">
              {{ index + 1 }}
            </div>
            <div class="employee-name">{{ employee.name }}</div>
            <div class="employee-value">{{ employee.value }}</div>
          </div>
          <div class="bar-container">
            <div
              class="bar-fill"
              :style="{ width: (employee.value / maxValue) * 100 + '%' }"
              :class="getRankClass(index)"
            >
              <div class="bar-shimmer"></div>
            </div>
          </div>
          <div class="employee-percentage">
            {{ ((employee.value / totalReads) * 100).toFixed(1) }}%
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
          :key="employee.name"
          class="list-item"
          :class="getRankClass(index)"
        >
          <div class="item-rank">
            <div class="rank-badge" :class="getRankClass(index)">
              {{ index + 1 }}
            </div>
          </div>
          <div class="item-name">
            <span class="name-text">{{ employee.name }}</span>
          </div>
          <div class="item-value">
            <span class="value-number">{{ employee.value }}</span>
          </div>
          <div class="item-percentage">
            <div class="percentage-bar">
              <div
                class="percentage-fill"
                :style="{ width: (employee.value / maxValue) * 100 + '%' }"
              ></div>
            </div>
            <span class="percentage-text">
              {{ ((employee.value / totalReads) * 100).toFixed(1) }}%
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
      </div>
      <div class="footer-actions">
        <button class="action-btn" @click="exportData">
          <span class="btn-icon">📄</span>
          Exportar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmployeeChart",
  props: {
    employees: Array,
  },
  data() {
    return {
      viewMode: "chart",
      sortBy: "value",
      itemsToShow: 10,
    };
  },
  computed: {
    sortedEmployees() {
      return [...this.employees].sort((a, b) => {
        if (this.sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        return b.value - a.value;
      });
    },
    displayedEmployees() {
      return this.sortedEmployees.slice(0, this.itemsToShow);
    },
    maxValue() {
      return Math.max(...this.employees.map((e) => e.value));
    },
    totalReads() {
      return this.employees.reduce((sum, emp) => sum + emp.value, 0);
    },
    averageReads() {
      return Math.round(this.totalReads / this.employees.length);
    },
    topPerformer() {
      if (this.employees.length === 0) return { name: "N/A", value: 0 };
      return this.sortedEmployees[0];
    },
  },
  methods: {
    getRankClass(index) {
      if (index === 0) return "rank-1";
      if (index === 1) return "rank-2";
      if (index === 2) return "rank-3";
      return "";
    },
    exportData() {
      const csvContent = this.sortedEmployees
        .map((emp) => `${emp.name},${emp.value}`)
        .join("\n");

      const blob = new Blob([`Nome,Leituras\n${csvContent}`], {
        type: "text/csv",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "leituras-colaboradores.csv";
      link.click();
      window.URL.revokeObjectURL(url);
    },
  },
};
</script>

<style>
:root {
  /* Cores para o painel de colaboradores */
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
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px var(--employee-shadow);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.panel-header {
  margin-bottom: 10px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 28px;
}

.title-section h2 {
  margin: 0;
  font-size: 1.5rem;
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
  gap: 16px;
}

.view-toggle {
  display: flex;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 4px;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--employee-text-light);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.view-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.view-btn.active {
  background: var(--employee-primary);
  color: white;
  box-shadow: 0 2px 8px rgba(67, 97, 238, 0.3);
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--employee-border);
  border-radius: 8px;
  background: var(--employee-bg);
  color: var(--employee-text);
  font-size: 0.9rem;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 10px 0;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 14px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--employee-shadow);
}

.stat-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--employee-text);
  margin-bottom: 2px;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--employee-text-light);
  font-weight: 500;
}

.chart-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 10px 0;
}

.chart-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.employee-bar-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.employee-bar-item:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateX(4px);
}

.employee-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 200px;
}

.employee-rank {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
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
  flex: 1;
}

.employee-value {
  font-weight: 700;
  color: var(--employee-primary);
  min-width: 50px;
  text-align: right;
}

.bar-container {
  flex: 2;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  min-width: 150px;
}

.bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.bar-fill.rank-1 {
  background: linear-gradient(90deg, var(--employee-rank1), #ffed4e);
}

.bar-fill.rank-2 {
  background: linear-gradient(90deg, var(--employee-rank2), #e8e8e8);
}

.bar-fill.rank-3 {
  background: linear-gradient(90deg, var(--employee-rank3), #e3964c);
}

.bar-fill:not(.rank-1):not(.rank-2):not(.rank-3) {
  background: linear-gradient(
    90deg,
    var(--employee-primary),
    var(--employee-secondary)
  );
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

.employee-percentage {
  font-weight: 600;
  color: var(--employee-text-light);
  min-width: 50px;
  text-align: right;
  font-size: 0.9rem;
}

.list-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 10px 0;
}

.list-header {
  display: grid;
  grid-template-columns: 50px 1fr 80px 80px;
  gap: 16px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  font-weight: 600;
  color: var(--employee-text-light);
  font-size: 0.9rem;
}

.employee-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list-item {
  display: grid;
  grid-template-columns: 50px 1fr 80px 80px;
  gap: 16px;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
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
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.9rem;
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

.name-text {
  font-weight: 600;
  color: var(--employee-text);
}

.value-number {
  font-weight: 700;
  color: var(--employee-primary);
  text-align: center;
}

.item-percentage {
  display: flex;
  align-items: center;
  gap: 8px;
}

.percentage-bar {
  flex: 1;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.percentage-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--employee-primary),
    var(--employee-secondary)
  );
  border-radius: 3px;
  transition: width 0.5s ease;
}

.percentage-text {
  font-weight: 600;
  color: var(--employee-text-light);
  font-size: 0.8rem;
  min-width: 40px;
  text-align: right;
}

.panel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--employee-border);
}

.footer-info {
  font-size: 0.85rem;
  color: var(--employee-text-light);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--employee-border);
  border-radius: 20px;
  background: var(--employee-bg);
  color: var(--employee-text);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  font-weight: 500;
}

.action-btn:hover {
  background: var(--employee-primary);
  color: white;
  border-color: var(--employee-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
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
    gap: 16px;
  }

  .header-controls {
    width: 100%;
    justify-content: space-between;
  }

  .employee-info {
    min-width: 150px;
  }
}

@media (max-width: 768px) {
  .employee-chart {
    padding: 20px;
    gap: 16px;
  }

  .stats-overview {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .chart-view {
    gap: 8px;
  }

  .employee-bar-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .employee-info {
    min-width: auto;
  }

  .list-header {
    display: none;
  }

  .list-item {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 16px;
  }

  .item-rank {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .panel-footer {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .title-section h2 {
    font-size: 1.3rem;
  }

  .header-controls {
    flex-direction: column;
    gap: 12px;
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

  .employee-percentage {
    display: none;
  }
}
</style>
