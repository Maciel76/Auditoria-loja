<template>
  <div class="pereciveis-flv">
    <div class="header">
      <h2>Analise por Categoria</h2>
      <div class="header-actions">
        <button class="filter-btn" @click="toggleFilter">
          <i class="fas fa-filter"></i>
          Filtrar
        </button>
      </div>
    </div>

    <div class="categories-grid">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-card"
        :class="{ active: selectedCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        <div class="category-icon">
          {{ category.icon }}
        </div>
        <div class="category-content">
          <div class="category-name">{{ category.name }}</div>
          <div class="category-stats">
            <div class="stat">
              <span class="stat-value">{{ category.quantity }}</span>
              <span class="stat-label">itens</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ category.percentage }}%</span>
              <span class="stat-label">total</span>
            </div>
          </div>
        </div>
        <div class="category-trend" :class="category.trend">
          <i class="fas" :class="category.trendIcon"></i>
          {{ category.trendValue }}
        </div>
      </div>
    </div>

    <div class="category-details" v-if="selectedCategory">
      <div class="details-header">
        <h3>Detalhes da Categoria</h3>
        <button class="close-btn" @click="selectedCategory = null">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="details-content">
        <div class="detail-item">
          <span class="label">Categoria:</span>
          <span class="value">{{ getSelectedCategory.name }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Total de Itens:</span>
          <span class="value">{{ getSelectedCategory.quantity }} unidades</span>
        </div>
        <div class="detail-item">
          <span class="label">Percentual do Total:</span>
          <span class="value">{{ getSelectedCategory.percentage }}%</span>
        </div>
        <div class="detail-item">
          <span class="label">Status:</span>
          <span class="value" :class="getSelectedCategory.statusClass">
            {{ getSelectedCategory.status }}
          </span>
        </div>
        <div class="detail-item">
          <span class="label">Última Atualização:</span>
          <span class="value">{{ lastUpdate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PereciveisFLV",
  data() {
    return {
      selectedCategory: null,
      lastUpdate: new Date().toLocaleTimeString("pt-BR"),
      categories: [
        {
          id: "pfo2",
          name: "Liquida",
          icon: "🧃",
          quantity: "1.245",
          percentage: "18.5",
          trend: "up",
          trendIcon: "fa-arrow-up",
          trendValue: "+2.3%",
          status: "Estável",
          statusClass: "stable",
        },
        {
          id: "f01",
          name: "Alto Giro",
          icon: "🍙",
          quantity: "987",
          percentage: "14.7",
          trend: "up",
          trendIcon: "fa-arrow-up",
          trendValue: "+1.8%",
          status: "Crescendo",
          statusClass: "growth",
        },
        {
          id: "pf01",
          name: "Bazar",
          icon: "🍫",
          quantity: "1.562",
          percentage: "23.2",
          trend: "down",
          trendIcon: "fa-arrow-down",
          trendValue: "-0.9%",
          status: "Estável",
          statusClass: "stable",
        },
        {
          id: "flv",
          name: "Seca Doce",
          icon: "🍬",
          quantity: "2.348",
          percentage: "34.9",
          trend: "up",
          trendIcon: "fa-arrow-up",
          trendValue: "+3.1%",
          status: "Crescendo",
          statusClass: "growth",
        },
        {
          id: "f02",
          name: "Seca Salgado",
          icon: "🥨",
          quantity: "756",
          percentage: "11.2",
          trend: "down",
          trendIcon: "fa-arrow-down",
          trendValue: "-1.2%",
          status: "Queda",
          statusClass: "decline",
        },
        {
          id: "f03",
          name: "Perecíveis",
          icon: "🍖",
          quantity: "632",
          percentage: "9.4",
          trend: "up",
          trendIcon: "fa-arrow-up",
          trendValue: "+0.7%",
          status: "Estável",
          statusClass: "stable",
        },
        {
          id: "sorvete",
          name: "SORVETE",
          icon: "🍦",
          quantity: "423",
          percentage: "6.3",
          trend: "up",
          trendIcon: "fa-arrow-up",
          trendValue: "+4.5%",
          status: "Crescendo",
          statusClass: "growth",
        },
      ],
    };
  },
  computed: {
    getSelectedCategory() {
      return (
        this.categories.find((cat) => cat.id === this.selectedCategory) || {}
      );
    },
  },
  methods: {
    selectCategory(categoryId) {
      this.selectedCategory =
        this.selectedCategory === categoryId ? null : categoryId;
    },
    toggleFilter() {
      console.log("Abrir filtros");
    },
  },
};
</script>

<style scoped>
.pereciveis-flv {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f3f6;
}

.header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #546e7a;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #4caf50;
  color: #4caf50;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4caf50, #66bb6a);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #4caf50;
}

.category-card:hover::before {
  opacity: 1;
}

.category-card.active {
  background: linear-gradient(135deg, #f1f8e9, #e8f5e8);
  border-color: #4caf50;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
}

.category-card.active::before {
  opacity: 1;
}

.category-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.category-content {
  flex: 1;
}

.category-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.category-stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-weight: 700;
  font-size: 1.1rem;
  color: #4caf50;
}

.stat-label {
  font-size: 0.8rem;
  color: #78909c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.category-trend.up {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.category-trend.down {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
}

.category-details {
  background: linear-gradient(135deg, #f1f8e9, #e8f5e8);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #c8e6c9;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #c8e6c9;
}

.details-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2e7d32;
  font-weight: 600;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  color: #546e7a;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.detail-item .label {
  font-weight: 500;
  color: #546e7a;
}

.detail-item .value {
  font-weight: 600;
  color: #2c3e50;
}

.detail-item .value.stable {
  color: #4caf50;
}

.detail-item .value.growth {
  color: #ff9800;
}

.detail-item .value.decline {
  color: #f44336;
}

/* Responsividade */
@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .pereciveis-flv {
    padding: 16px;
  }

  .header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .category-card {
    flex-direction: column;
    text-align: center;
  }

  .category-stats {
    justify-content: center;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .header h2 {
    font-size: 1.3rem;
  }

  .category-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .category-name {
    font-size: 1rem;
  }
}
</style>
