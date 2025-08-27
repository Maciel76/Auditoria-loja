<template>
  <div class="category-chart">
    <div class="chart-header">
      <div class="header-title">
        <div class="title-icon">📊</div>
        <h2>Leituras por Categoria</h2>
      </div>
      <div class="header-filters">
        <button
          v-for="filter in filters"
          :key="filter"
          :class="['filter-btn', { active: activeFilter === filter }]"
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <div class="chart-content">
      <div class="stats-summary">
        <div class="stat-item">
          <div class="stat-icon">∑</div>
          <div class="stat-info">
            <div class="stat-value">{{ totalItems }}</div>
            <div class="stat-label">Total Itens</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">⚡</div>
          <div class="stat-info">
            <div class="stat-value">{{ averageValue }}</div>
            <div class="stat-label">Média</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">👑</div>
          <div class="stat-info">
            <div class="stat-value">{{ topCategory.value }}</div>
            <div class="stat-label">{{ topCategory.name }}</div>
          </div>
        </div>
      </div>

      <div class="chart-main">
        <div class="chart-bars">
          <div
            v-for="item in displayedData"
            :key="item.name"
            class="bar-container"
            :style="{ '--percentage': (item.value / maxValue) * 100 + '%' }"
          >
            <div class="bar-label">{{ item.name }}</div>
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{
                  backgroundColor: item.color,
                  width: (item.value / maxValue) * 100 + '%',
                }"
              ></div>
            </div>
            <div class="bar-value">{{ item.value }}</div>
          </div>
        </div>

        <div class="chart-legend">
          <div
            v-for="item in displayedData"
            :key="item.name"
            class="legend-item"
          >
            <div
              class="legend-color"
              :style="{ backgroundColor: item.color }"
            ></div>
            <span class="legend-name">{{ item.name }}</span>
            <span class="legend-percentage"
              >{{ ((item.value / totalItems) * 100).toFixed(1) }}%</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class="chart-footer">
      <div class="footer-info">
        <span class="update-time">🕒 Atualizado: {{ lastUpdate }}</span>
      </div>
      <div class="footer-actions">
        <button class="action-btn" @click="refreshData">🔄 Atualizar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CategoryChart",
  props: {
    categories: Array,
  },
  data() {
    return {
      filters: ["Todas", "Principais", "Secundárias"],
      activeFilter: "Todas",
      lastUpdate: new Date().toLocaleTimeString("pt-BR"),
    };
  },
  computed: {
    displayedData() {
      if (this.activeFilter === "Todas") return this.categories;
      if (this.activeFilter === "Principais")
        return this.categories.slice(0, 5);
      return this.categories.slice(5);
    },
    totalItems() {
      return this.displayedData.reduce((sum, item) => sum + item.value, 0);
    },
    averageValue() {
      return Math.round(this.totalItems / this.displayedData.length);
    },
    maxValue() {
      return Math.max(...this.displayedData.map((item) => item.value));
    },
    topCategory() {
      if (this.displayedData.length === 0) return { name: "N/A", value: 0 };
      const top = this.displayedData.reduce(
        (max, item) => (item.value > max.value ? item : max),
        this.displayedData[0]
      );
      return { name: top.name, value: top.value };
    },
  },
  methods: {
    refreshData() {
      this.lastUpdate = new Date().toLocaleTimeString("pt-BR");
      this.$emit("refresh");
    },
  },
};
</script>

<style>
:root {
  /* Cores principais */
  --primary-color: #4361ee;
  --secondary-color: #3a0ca3;
  --accent-color: #f72585;
  --success-color: #4cc9f0;
  --warning-color: #fca311;
  --danger-color: #e63946;

  /* Cores neutras */
  --bg-color: #f8f9fa;
  --card-bg: #ffffff;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-light: #ffffff;
  --border-color: #dee2e6;
  --shadow-color: rgba(0, 0, 0, 0.1);

  /* Espaçamentos */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Bordas */
  --border-radius-sm: 6px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;

  /* Sombras */
  --shadow-sm: 0 2px 4px var(--shadow-color);
  --shadow-md: 0 4px 12px var(--shadow-color);
  --shadow-lg: 0 8px 24px var(--shadow-color);

  /* Transições */
  --transition-fast: all 0.2s ease;
  --transition-normal: all 0.3s ease;
}

.category-chart {
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.chart-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  color: var(--text-light);
}

.header-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.title-icon {
  font-size: 1.5rem;
}

.header-title h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.header-filters {
  display: flex;
  gap: var(--spacing-xs);
  background: rgba(255, 255, 255, 0.2);
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-sm);
}

.filter-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-sm);
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition-fast);
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-light);
}

.filter-btn.active {
  background: rgba(255, 255, 255, 0.25);
  color: var(--text-light);
  box-shadow: var(--shadow-sm);
}

.chart-content {
  padding: var(--spacing-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-color);
  border-radius: var(--border-radius-md);
  transition: var(--transition-normal);
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.stat-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: var(--text-light);
  border-radius: 50%;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.chart-main {
  flex: 1;
  display: flex;
  gap: var(--spacing-lg);
  min-height: 300px;
}

.chart-bars {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  justify-content: space-around;
}

.bar-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.bar-label {
  width: 120px;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.bar-track {
  flex: 1;
  height: 20px;
  background: var(--bg-color);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.8s ease;
  position: relative;
  overflow: hidden;
}

.bar-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.3) 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.bar-value {
  width: 50px;
  text-align: right;
  font-weight: 700;
  color: var(--text-primary);
}

.chart-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--bg-color);
  border-radius: var(--border-radius-md);
  max-height: 300px;
  overflow-y: auto;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  transition: var(--transition-fast);
}

.legend-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-name {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: 500;
}

.legend-percentage {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.chart-footer {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-color);
}

.footer-info {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.update-time {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.action-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: var(--card-bg);
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition-fast);
  font-weight: 500;
}

.action-btn:hover {
  background: var(--primary-color);
  color: var(--text-light);
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

/* Responsividade */
@media (max-width: 992px) {
  .chart-main {
    flex-direction: column;
  }

  .stats-summary {
    grid-template-columns: 1fr;
  }

  .chart-header {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .header-filters {
    align-self: center;
  }
}

@media (max-width: 768px) {
  .chart-content {
    padding: var(--spacing-md);
  }

  .bar-container {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .bar-track {
    width: 100%;
  }

  .chart-footer {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
}

@media (max-width: 480px) {
  .header-filters {
    flex-wrap: wrap;
    justify-content: center;
  }

  .filter-btn {
    font-size: 0.8rem;
    padding: var(--spacing-sm);
  }

  .stat-item {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
  }

  .stat-info {
    text-align: center;
  }
}
</style>
