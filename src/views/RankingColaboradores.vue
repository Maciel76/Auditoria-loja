<template>
  <div class="ranking-colaboradores-container">
    <!-- Hero Section -->
    <HeroSection
      :usuarios="usuarios"
      :totalItensLidos="totalItensLidos"
      :mediaItensPorUsuario="mediaItensPorUsuario"
      :tipoAuditoria="filtroTipoAuditoria"
    />

    <!-- Controles e Filtros Unificados -->
    <div class="unified-controls">
      <!-- Filtros Principais -->
      <div class="filters-main">
        <!-- Filtro por Tipo de Auditoria -->
        <div class="filter-group">
          <label class="filter-label">
            <i class="fas fa-clipboard-check"></i>
            Tipo de Auditoria:
          </label>
          <select
            v-model="filtroTipoAuditoria"
            @change="buscarDados"
            class="filter-select"
          >
            <option value="todos">📋 Todas as Auditorias</option>
            <option value="etiqueta">🏷️ Etiqueta</option>
            <option value="presenca">👥 Presença</option>
            <option value="ruptura">📦 Ruptura</option>
          </select>
        </div>

        <!-- Filtro de Período -->
        <div class="filter-group">
          <label class="filter-label">
            <i class="fas fa-calendar-alt"></i>
            Período:
          </label>
          <select
            v-model="filtroPeriodo"
            @change="handlePeriodoChange"
            class="filter-select"
          >
            <option value="hoje">📅 Hoje</option>
            <option value="semana">📊 Esta Semana</option>
            <option value="mes">📆 Este Mês</option>
            <option value="personalizado">🗓️ Data Específica</option>
            <option value="todos">🔄 Todos os Períodos</option>
          </select>
        </div>

        <!-- Filtro por Data Específica -->
        <div v-if="filtroPeriodo === 'personalizado'" class="filter-group">
          <label class="filter-label">
            <i class="fas fa-calendar-day"></i>
            Data Específica:
          </label>
          <select
            v-model="dataEspecifica"
            @change="buscarDados"
            class="filter-select"
          >
            <option value="">Selecionar data...</option>
            <option
              v-for="data in datasAuditoria"
              :key="data.timestamp"
              :value="data.data"
            >
              {{ data.dataFormatada }}
            </option>
          </select>
        </div>

        <!-- Modo de Visualização -->
        <div class="filter-group">
          <label class="filter-label">
            <i class="fas fa-eye"></i>
            Visualização:
          </label>
          <div class="view-options">
            <button
              @click="viewMode = 'podium'"
              :class="['view-btn', { active: viewMode === 'podium' }]"
            >
              <i class="fas fa-trophy"></i>
              Pódio
            </button>
            <button
              @click="viewMode = 'all'"
              :class="['view-btn', { active: viewMode === 'all' }]"
            >
              <i class="fas fa-list"></i>
              Todos
            </button>
          </div>
        </div>

        <!-- Botão Atualizar -->
        <div class="filter-group">
          <button @click="buscarDados" class="refresh-btn" :disabled="carregando">
            <i class="fas fa-sync-alt" :class="{ spinning: carregando }"></i>
            Atualizar
          </button>
        </div>
      </div>
    </div>

    <!-- Estado de Carregamento -->
    <div v-if="carregando" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando ranking de colaboradores...</p>
    </div>

    <!-- Estado de Erro -->
    <div v-else-if="erro" class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3>Erro ao carregar dados</h3>
      <p>{{ erro }}</p>
      <button @click="buscarDados" class="btn-retry">
        <i class="fas fa-redo-alt"></i>
        Tentar Novamente
      </button>
    </div>

    <!-- Pódio - Top 3 -->
    <PodiumSection
      v-else-if="viewMode === 'podium' && usuariosOrdenados.length >= 3"
      :usuariosOrdenados="usuariosOrdenados"
      :tipoAuditoria="filtroTipoAuditoria"
    />

    <!-- Lista Completa de Ranking -->
    <RankingList
      v-if="!carregando && !erro && usuarios.length > 0"
      :usuariosFiltradosOrdenados="usuariosFiltradosOrdenados"
      :viewMode="viewMode"
      :usuariosOrdenados="usuariosOrdenados"
      :tipoAuditoria="filtroTipoAuditoria"
    />

    <!-- Estatísticas Avançadas -->
    <AdvancedStats
      v-if="!carregando && !erro && usuarios.length > 0"
      :topPerformer="topPerformer"
      :mediaItensPorUsuario="mediaItensPorUsuario"
      :totalItensLidos="totalItensLidos"
      :percentualAboveAverage="percentualAboveAverage"
      :tipoAuditoria="filtroTipoAuditoria"
    />

    <!-- Botão de Exportar -->
    <ExportSection
      v-if="!carregando && !erro && usuarios.length > 0"
      @exportarRanking="exportarRanking"
      :tipoAuditoria="filtroTipoAuditoria"
    />

    <!-- Estado Vazio -->
    <div v-if="!carregando && !erro && usuarios.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-users-slash"></i>
      </div>
      <h3>Nenhum colaborador encontrado</h3>
      <p v-if="filtroTipoAuditoria !== 'todos'">
        Não foram encontrados dados para auditorias do tipo "{{ getTipoAuditoriaName(filtroTipoAuditoria) }}" no período selecionado.
      </p>
      <p v-else>
        Não foram encontrados dados de ranking no período selecionado.
      </p>
      <p class="empty-suggestion">
        Experimente alterar os filtros ou o período selecionado.
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useLojaStore } from "@/store/lojaStore";
import axios from "axios";

// Importar componentes unificados (vamos usar os da Etiqueta como base)
import HeroSection from "./Ranking/Etiqueta/HeroSection.vue";
import PodiumSection from "./Ranking/Etiqueta/PodiumSection.vue";
import RankingList from "./Ranking/Etiqueta/RankingList.vue";
import AdvancedStats from "./Ranking/Etiqueta/AdvancedStats.vue";
import ExportSection from "./Ranking/Etiqueta/ExportSection.vue";

export default {
  name: "RankingColaboradores",
  components: {
    HeroSection,
    PodiumSection,
    RankingList,
    AdvancedStats,
    ExportSection,
  },
  setup() {
    const lojaStore = useLojaStore();

    // Estados principais
    const usuarios = ref([]);
    const viewMode = ref("podium");
    const filtroTipoAuditoria = ref("todos");
    const filtroPeriodo = ref("hoje");
    const dataEspecifica = ref("");
    const carregando = ref(false);
    const erro = ref("");
    const datasAuditoria = ref([]);

    // Computadas
    const usuariosOrdenados = computed(() => {
      return [...usuarios.value].sort((a, b) => b.contador - a.contador);
    });

    const usuariosFiltradosOrdenados = computed(() => {
      let filtered = usuariosOrdenados.value;

      if (viewMode.value === "podium") {
        return filtered.slice(3);
      }

      return filtered;
    });

    const totalItensLidos = computed(() => {
      return usuarios.value.reduce(
        (total, usuario) => total + (usuario.contador || 0),
        0
      );
    });

    const mediaItensPorUsuario = computed(() => {
      return usuarios.value.length
        ? Math.round(totalItensLidos.value / usuarios.value.length)
        : 0;
    });

    const topPerformer = computed(() => {
      return usuariosOrdenados.value[0] || { nome: "N/A", contador: 0 };
    });

    const percentualAboveAverage = computed(() => {
      if (usuarios.value.length === 0) return 0;
      const aboveAverage = usuarios.value.filter(
        (u) => u.contador > mediaItensPorUsuario.value
      ).length;
      return Math.round((aboveAverage / usuarios.value.length) * 100);
    });

    // Métodos
    const getTipoAuditoriaName = (tipo) => {
      const tipos = {
        etiqueta: "Etiqueta",
        presenca: "Presença",
        ruptura: "Ruptura",
        todos: "Todas",
      };
      return tipos[tipo] || tipo;
    };

    const carregarDatasAuditoria = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/datas-auditoria", {
          headers: {
            'x-loja': lojaStore.codigoLojaAtual
          }
        });
        datasAuditoria.value = data;
      } catch (error) {
        console.error("Erro ao carregar datas:", error);
      }
    };

    const buscarDados = async () => {
      if (!lojaStore.isLojaSelected) {
        erro.value = "Nenhuma loja selecionada";
        return;
      }

      try {
        carregando.value = true;
        erro.value = "";

        let url = "http://localhost:3000/api/ranking";
        const params = new URLSearchParams();

        // Filtro por tipo de auditoria
        if (filtroTipoAuditoria.value !== "todos") {
          params.append("tipo", filtroTipoAuditoria.value);
        }

        // Filtro por período
        if (filtroPeriodo.value !== "todos") {
          if (filtroPeriodo.value === "personalizado" && dataEspecifica.value) {
            params.append("dataAuditoria", dataEspecifica.value);
          } else if (filtroPeriodo.value !== "personalizado") {
            params.append("periodo", filtroPeriodo.value);
          }
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        console.log("Buscando dados de:", url);

        const response = await axios.get(url, {
          headers: {
            'x-loja': lojaStore.codigoLojaAtual
          }
        });

        usuarios.value = response.data.map((usuario) => ({
          ...usuario,
          iniciais: obterIniciais(usuario.nome),
          contador: usuario.contador || 0,
        }));

        console.log(`✅ ${usuarios.value.length} colaboradores carregados`);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        erro.value = error.response?.data?.mensagem ||
                    error.response?.data?.erro ||
                    "Erro ao conectar com o servidor";

        // Fallback para dados de exemplo em caso de erro
        usuarios.value = [];
      } finally {
        carregando.value = false;
      }
    };

    const handlePeriodoChange = () => {
      if (filtroPeriodo.value !== "personalizado") {
        dataEspecifica.value = "";
        buscarDados();
      }
    };

    const obterIniciais = (nome) => {
      if (!nome) return "??";
      return nome
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    };

    const exportarRanking = () => {
      const tipoTexto = getTipoAuditoriaName(filtroTipoAuditoria.value);
      const rankingData = usuariosOrdenados.value.map((user, index) => ({
        Posição: `${index + 1}º`,
        Nome: user.nome,
        Matrícula: user.id,
        "Itens Verificados": user.contador,
        "Tipo de Auditoria": tipoTexto,
        "Período": filtroPeriodo.value === "personalizado" ? dataEspecifica.value : filtroPeriodo.value,
      }));

      const csvContent = [
        "Posição,Nome,Matrícula,Itens Verificados,Tipo de Auditoria,Período",
        ...rankingData.map(
          (item) =>
            `"${item.Posição}","${item.Nome}","${item.Matrícula}",${item["Itens Verificados"]},"${item["Tipo de Auditoria"]}","${item.Período}"`
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `ranking_colaboradores_${tipoTexto.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // Lifecycle e Watchers
    onMounted(async () => {
      if (lojaStore.isLojaSelected) {
        await carregarDatasAuditoria();
        await buscarDados();
      }
    });

    // Watch para mudanças na loja
    watch(() => lojaStore.lojaSelecionada, async (novaLoja) => {
      if (novaLoja) {
        await carregarDatasAuditoria();
        await buscarDados();
      } else {
        usuarios.value = [];
        datasAuditoria.value = [];
      }
    });

    return {
      // Estados
      usuarios,
      viewMode,
      filtroTipoAuditoria,
      filtroPeriodo,
      dataEspecifica,
      carregando,
      erro,
      datasAuditoria,
      lojaStore,

      // Computadas
      usuariosOrdenados,
      usuariosFiltradosOrdenados,
      totalItensLidos,
      mediaItensPorUsuario,
      topPerformer,
      percentualAboveAverage,

      // Métodos
      getTipoAuditoriaName,
      buscarDados,
      handlePeriodoChange,
      exportarRanking,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

.ranking-colaboradores-container {
  max-width: auto;
  margin: 0 auto;
  padding: 2px;
  font-family: "Inter", sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* ===== CONTROLES UNIFICADOS ===== */
.unified-controls {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}


.filters-main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label i {
  color: #667eea;
}

.filter-select {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter", sans-serif;
}

.view-btn:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f8fafc;
}

.view-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.refresh-btn {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  min-width: 120px;
  justify-content: center;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== ESTADOS ===== */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  margin: 2rem 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

.loading-container p {
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 500;
}

.error-container {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  margin: 2rem 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 1.5rem;
}

.error-container h3 {
  color: #1f2937;
  font-size: 1.75rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.error-container p {
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.btn-retry {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-family: "Inter", sans-serif;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  margin: 2rem 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 5rem;
  color: #cbd5e1;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  color: #1f2937;
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.empty-suggestion {
  color: #9ca3af !important;
  font-style: italic;
}

/* ===== RESPONSIVO ===== */
@media (max-width: 768px) {
  .ranking-colaboradores-container {
    padding: 1rem;
  }

  .unified-controls {
    padding: 1.5rem;
  }

  .filters-main {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .view-options {
    flex-direction: column;
  }

}

@media (max-width: 480px) {
  .unified-controls {
    padding: 1rem;
  }

  .filter-select,
  .view-btn,
  .refresh-btn {
    padding: 0.75rem;
    font-size: 0.8rem;
  }

}
</style>