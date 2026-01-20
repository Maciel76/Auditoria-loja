<template>
  <div class="lista-lojas-container">
    <div class="header-section">
      <div class="header-content">
        <h1>
          <i class="fas fa-store-alt"></i>
          Explorar Lojas
        </h1>
        <p class="subtitle">Conheça todas as unidades e seus desempenhos</p>
      </div>

      <div class="header-stats">
        <div class="stat-chip">
          <i class="fas fa-building"></i>
          <span>{{ lojas.length }} Lojas</span>
        </div>
      </div>
    </div>

    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando lojas...</p>
    </div>

    <div v-else-if="lojas.length === 0" class="empty-state">
      <i class="fas fa-store-slash"></i>
      <h3>Nenhuma loja encontrada</h3>
      <p>Não há lojas cadastradas no sistema.</p>
    </div>

    <div v-else class="lojas-content">
      <!-- Filtros e Busca -->
      <div class="controls-section">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            v-model="buscaTexto"
            type="text"
            placeholder="Buscar loja por nome, código ou cidade..."
            class="search-input"
          />
        </div>

        <div class="filter-buttons">
          <button
            class="filter-btn"
            :class="{ active: ordenacao === 'codigo' }"
            @click="ordenacao = 'codigo'"
          >
            <i class="fas fa-hashtag"></i>
            Código
          </button>
          <button
            class="filter-btn"
            :class="{ active: ordenacao === 'nome' }"
            @click="ordenacao = 'nome'"
          >
            <i class="fas fa-sort-alpha-down"></i>
            Nome
          </button>
          <button
            class="filter-btn"
            :class="{ active: ordenacao === 'desempenho' }"
            @click="ordenacao = 'desempenho'"
          >
            <i class="fas fa-chart-line"></i>
            Desempenho
          </button>
        </div>
      </div>

      <!-- Grid de Lojas -->
      <div class="lojas-grid">
        <div
          v-for="loja in lojasFiltradas"
          :key="loja.codigo"
          class="loja-card"
          @click="irParaLoja(loja.codigo)"
        >
          <!-- Cover da Loja -->
          <div class="loja-cover" :style="getCoverStyle(loja.coverId)">
            <div class="cover-overlay">
              <div class="loja-codigo-badge">#{{ loja.codigo }}</div>
            </div>
          </div>

          <!-- Conteúdo do Card -->
          <div class="loja-content">
            <!-- Avatar sobreposto ao cover -->
            <div class="loja-avatar-wrapper">
              <div class="loja-avatar">
                <img v-if="loja.imagem" :src="loja.imagem" :alt="loja.nome" />
                <div v-else class="avatar-placeholder">
                  {{ getIniciais(loja.nome) }}
                </div>
              </div>
            </div>

            <!-- Informações da Loja -->
            <div class="loja-info">
              <h3 class="loja-nome">{{ getNomeSimplificado(loja.nome) }}</h3>

              <div class="loja-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ loja.cidade || "Não informado" }}</span>
              </div>

              <!-- Estatísticas -->
              <div class="loja-stats-row">
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="fas fa-users"></i>
                  </div>
                  <div class="stat-data">
                    <span class="stat-value">{{
                      loja.totalColaboradores || 0
                    }}</span>
                    <span class="stat-label">Colaboradores</span>
                  </div>
                </div>

                <div class="stat-divider"></div>

                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="fas fa-clipboard-check"></i>
                  </div>
                  <div class="stat-data">
                    <span class="stat-value">{{
                      loja.totalAuditorias || 0
                    }}</span>
                    <span class="stat-label">Auditorias</span>
                  </div>
                </div>
              </div>

              <!-- Performance -->
              <div class="performance-section">
                <div class="performance-header">
                  <span class="performance-label">Desempenho</span>
                  <span
                    class="performance-value"
                    :class="getDesempenhoClass(loja.percentualDesempenho)"
                  >
                    {{ loja.percentualDesempenho || 0 }}%
                  </span>
                </div>
                <div class="performance-bar">
                  <div
                    class="performance-fill"
                    :class="getDesempenhoClass(loja.percentualDesempenho)"
                    :style="{ width: (loja.percentualDesempenho || 0) + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Botão de ação -->
              <button class="btn-ver-loja">
                <span>Ver Perfil Completo</span>
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensagem quando não encontra resultados -->
      <div v-if="lojasFiltradas.length === 0 && buscaTexto" class="no-results">
        <i class="fas fa-search"></i>
        <p>Nenhuma loja encontrada para "{{ buscaTexto }}"</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useLojaStore } from "@/store/lojaStore";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "ListaLojas",
  setup() {
    const router = useRouter();
    const lojaStore = useLojaStore();
    return { router, lojaStore };
  },
  data() {
    return {
      lojasApi: [],
      carregando: true,
      buscaTexto: "",
      ordenacao: "codigo",
    };
  },
  computed: {
    lojas() {
      // Combinar lojas do store com dados da API
      return this.lojaStore.lojas.map((lojaStore) => {
        const lojaApi = this.lojasApi.find(
          (l) => l.codigo === lojaStore.codigo,
        );
        return {
          ...lojaStore,
          totalColaboradores: lojaApi?.totalColaboradores || 0,
          totalAuditorias: lojaApi?.totalAuditorias || 0,
          percentualDesempenho: lojaApi?.percentualDesempenho || 0,
          coverId: lojaApi?.coverId || "gradient-1",
        };
      });
    },

    lojasFiltradas() {
      let resultado = [...this.lojas];

      // Aplicar busca
      if (this.buscaTexto) {
        const busca = this.buscaTexto.toLowerCase();
        resultado = resultado.filter(
          (loja) =>
            loja.nome.toLowerCase().includes(busca) ||
            loja.codigo.toLowerCase().includes(busca) ||
            (loja.cidade && loja.cidade.toLowerCase().includes(busca)),
        );
      }

      // Aplicar ordenação
      switch (this.ordenacao) {
        case "nome":
          resultado.sort((a, b) => a.nome.localeCompare(b.nome));
          break;
        case "desempenho":
          resultado.sort(
            (a, b) =>
              (b.percentualDesempenho || 0) - (a.percentualDesempenho || 0),
          );
          break;
        case "codigo":
        default:
          resultado.sort((a, b) => a.codigo.localeCompare(b.codigo));
      }

      return resultado;
    },
  },
  async mounted() {
    await this.carregarLojas();
  },
  methods: {
    async carregarLojas() {
      try {
        this.carregando = true;
        // Buscar dados adicionais da API (métricas, etc)
        const response = await axios.get("http://localhost:3000/api/lojas");
        this.lojasApi = response.data || [];
      } catch (error) {
        console.error("Erro ao carregar dados das lojas:", error);
        // Mesmo com erro na API, as lojas do store estarão disponíveis
        this.lojasApi = [];
      } finally {
        this.carregando = false;
      }
    },

    irParaLoja(codigo) {
      this.router.push(`/perfil-loja/${codigo}`);
    },

    getIniciais(nome) {
      if (!nome) return "??";
      return nome
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    },

    getNomeSimplificado(nome) {
      // Remove "Loja XXX - " do nome para exibição mais limpa
      return nome.replace(/^Loja \d{3} - /, "");
    },

    getCoverStyle(coverId) {
      const coverMap = {
        "gradient-1": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-2": "linear-gradient(135deg, #15b638 0%, #0575E6 100%)",
        "gradient-3": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        "gradient-4": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        "gradient-5": "linear-gradient(135deg, #f83600 0%, #f9d423 100%)",
        "gradient-6": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "gradient-7": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        "gradient-8": "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)",
      };

      if (coverId && coverId.startsWith("http")) {
        return {
          backgroundImage: `url('${coverId}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
      }

      return {
        background: coverMap[coverId] || coverMap["gradient-1"],
      };
    },

    getDesempenhoClass(percentual) {
      if (!percentual) return "baixo";
      if (percentual >= 80) return "excelente";
      if (percentual >= 60) return "bom";
      if (percentual >= 40) return "medio";
      return "baixo";
    },
  },
};
</script>

<style scoped>
.lista-lojas-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-content h1 i {
  color: #3b82f6;
  font-size: 2rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 1rem;
}

.stat-chip {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 50px;
  height: 50px;
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

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.empty-state i {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #7f8c8d;
}

/* Controls */
.controls-section {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-box i {
  position: absolute;
  left: 1rem;
  color: #7f8c8d;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.8rem 1.2rem;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 12px;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.filter-btn.active {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Grid de Lojas */
.lojas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.loja-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid transparent;
  position: relative;
}

.loja-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 48px rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.3);
}

.loja-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(147, 51, 234, 0.05) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.loja-card:hover::before {
  opacity: 1;
}

/* Cover da Loja */
.loja-cover {
  height: 140px;
  position: relative;
  background-size: cover;
  background-position: center;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1rem;
}

.loja-codigo-badge {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1rem;
  color: #2c3e50;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
}

/* Conteúdo do Card */
.loja-content {
  position: relative;
  padding: 0 1.5rem 1.5rem;
}

/* Avatar */
.loja-avatar-wrapper {
  display: flex;
  justify-content: center;
  margin-top: -40px;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
}

.loja-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 5px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  background: white;
  transition: transform 0.3s ease;
}

.loja-card:hover .loja-avatar {
  transform: scale(1.1);
}

.loja-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #3b82f6;
  background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
}

/* Informações */
.loja-info {
  text-align: center;
  position: relative;
  z-index: 2;
}

.loja-nome {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  min-height: 2.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loja-location {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 1.2rem;
  padding: 0.4rem 1rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.loja-location i {
  color: #3b82f6;
  font-size: 0.85rem;
}

/* Estatísticas em Linha */
.loja-stats-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1.2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  margin-bottom: 1.2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-icon i {
  font-size: 1.1rem;
  color: #3b82f6;
}

.stat-data {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
}

.stat-label {
  font-size: 0.7rem;
  color: #7f8c8d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.stat-divider {
  width: 2px;
  height: 40px;
  background: linear-gradient(180deg, transparent, #cbd5e0, transparent);
}

/* Seção de Performance */
.performance-section {
  margin-bottom: 1.2rem;
}

.performance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
}

.performance-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.performance-value {
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0.3rem 0.8rem;
  border-radius: 10px;
}

.performance-value.excelente {
  background: #d1fae5;
  color: #065f46;
}

.performance-value.bom {
  background: #dbeafe;
  color: #1e40af;
}

.performance-value.medio {
  background: #fef3c7;
  color: #92400e;
}

.performance-value.baixo {
  background: #fee2e2;
  color: #991b1b;
}

/* Barra de Performance */
.performance-bar {
  height: 10px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.performance-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.performance-fill.excelente {
  background: linear-gradient(90deg, #10b981, #059669);
}

.performance-fill.bom {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

.performance-fill.medio {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.performance-fill.baixo {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

/* Botão de Ação */
.btn-ver-loja {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  letter-spacing: 0.3px;
}

.btn-ver-loja:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.btn-ver-loja i {
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.btn-ver-loja:hover i {
  transform: translateX(4px);
}

/* No Results */
.no-results {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.no-results i {
  font-size: 3rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.no-results p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .lista-lojas-container {
    padding: 1rem;
  }

  .header-section {
    padding: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-content h1 {
    font-size: 1.8rem;
  }

  .header-content h1 i {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .header-stats {
    width: 100%;
    justify-content: flex-start;
  }

  .stat-chip {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
  }

  .controls-section {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  .search-box {
    width: 100%;
    min-width: auto;
  }

  .filter-buttons {
    width: 100%;
    justify-content: space-between;
  }

  .filter-btn {
    flex: 1;
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }

  .lojas-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .loja-card {
    border-radius: 20px;
  }

  .loja-cover {
    height: 120px;
  }

  .loja-codigo-badge {
    font-size: 0.9rem;
    padding: 0.4rem 1rem;
  }

  .loja-content {
    padding: 0 1.2rem 1.2rem;
  }

  .loja-avatar-wrapper {
    margin-top: -35px;
  }

  .loja-avatar {
    width: 70px;
    height: 70px;
    border: 4px solid white;
  }

  .loja-nome {
    font-size: 1.1rem;
    min-height: auto;
  }

  .loja-location {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .loja-stats-row {
    padding: 1rem;
    gap: 1rem;
  }

  .stat-icon {
    width: 36px;
    height: 36px;
  }

  .stat-icon i {
    font-size: 1rem;
  }

  .stat-value {
    font-size: 1.2rem;
  }

  .stat-label {
    font-size: 0.65rem;
  }

  .stat-divider {
    height: 36px;
  }

  .performance-label {
    font-size: 0.75rem;
  }

  .performance-value {
    font-size: 1rem;
    padding: 0.25rem 0.6rem;
  }

  .performance-bar {
    height: 8px;
  }

  .btn-ver-loja {
    padding: 0.9rem;
    font-size: 0.9rem;
  }
}

/* Mobile muito pequeno */
@media (max-width: 375px) {
  .header-content h1 {
    font-size: 1.5rem;
  }

  .lojas-grid {
    gap: 1.2rem;
  }

  .loja-stats-row {
    flex-direction: column;
    gap: 0.8rem;
    padding: 0.8rem;
  }

  .stat-divider {
    display: none;
  }

  .stat-item {
    width: 100%;
    justify-content: center;
  }
}

/* Tablet landscape */
@media (min-width: 769px) and (max-width: 1024px) {
  .lojas-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop grande */
@media (min-width: 1400px) {
  .lojas-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
