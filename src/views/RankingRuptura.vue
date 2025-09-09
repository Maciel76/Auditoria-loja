<template>
  <div class="ranking-premium-container">
    <!-- Hero Section -->
    <HeroSection
      :usuarios="usuarios"
      :totalItensLidos="totalItensLidos"
      :mediaItensPorUsuario="mediaItensPorUsuario"
    />

    <!-- Filtros e Controles -->
    <RankingControls
      :filtro="filtro"
      :viewMode="viewMode"
      :filtroTipo="filtroTipo"
      :filtroPeriodo="filtroPeriodo"
      @update:filtro="filtro = $event"
      @update:viewMode="viewMode = $event"
      @update:filtroTipo="filtroTipo = $event"
      @update:filtroPeriodo="filtroPeriodo = $event"
      @buscarDados="buscarDados"
    />

    <!-- Loading State -->
    <div v-if="carregando" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando dados do ranking...</p>
    </div>

    <!-- Pódio - Top 3 -->
    <PodiumSection
      v-else-if="viewMode === 'podium' && usuariosOrdenados.length >= 3"
      :usuariosOrdenados="usuariosOrdenados"
    />

    <!-- Lista Completa de Ranking -->
    <RankingList
      v-if="!carregando && usuarios.length > 0"
      :usuariosFiltradosOrdenados="usuariosFiltradosOrdenados"
      :viewMode="viewMode"
      :usuariosOrdenados="usuariosOrdenados"
    />

    <!-- Estatísticas Avançadas -->
    <AdvancedStats
      v-if="!carregando && usuarios.length > 0"
      :topPerformer="topPerformer"
      :mediaItensPorUsuario="mediaItensPorUsuario"
      :totalItensLidos="totalItensLidos"
      :percentualAboveAverage="percentualAboveAverage"
    />

    <!-- Botão de Exportar -->
    <ExportSection
      v-if="!carregando && usuarios.length > 0"
      @exportarRanking="exportarRanking"
    />

    <!-- Empty State -->
    <div v-if="!carregando && usuarios.length === 0" class="empty-state">
      <img
        src="../assets/svg/icon-ranking/empty-state.svg"
        alt="Nenhum dado encontrado"
        class="empty-icon"
      />
      <h3>Nenhum dado de ruptura encontrado</h3>
      <p>
        Os dados serão exibidos aqui após o processamento de planilhas de
        ruptura.
      </p>
    </div>

    <!-- Error Message -->
    <div v-if="erro" class="error-message">
      <h3>Erro ao carregar dados</h3>
      <p>{{ erro }}</p>
      <button @click="buscarDados" class="retry-btn">Tentar Novamente</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import HeroSection from "./Ranking/Ruptura/HeroSection.vue";
import RankingControls from "./Ranking/Ruptura/RankingControls.vue";
import PodiumSection from "./Ranking/Ruptura/PodiumSection.vue";
import RankingList from "./Ranking/Ruptura/RankingList.vue";
import AdvancedStats from "./Ranking/Ruptura/AdvancedStats.vue";
import ExportSection from "./Ranking/Ruptura/ExportSection.vue";

export default {
  name: "RankingRuptura",
  components: {
    HeroSection,
    RankingControls,
    PodiumSection,
    RankingList,
    AdvancedStats,
    ExportSection,
  },
  setup() {
    const usuarios = ref([]);
    const filtro = ref("");
    const viewMode = ref("podium");
    const filtroTipo = ref("ruptura"); // Padrão para ruptura
    const filtroPeriodo = ref("todos"); // Padrão para todos os períodos
    const carregando = ref(false);
    const erro = ref(null);

    const usuariosOrdenados = computed(() => {
      return [...usuarios.value].sort((a, b) => b.contador - a.contador);
    });

    const usuariosFiltradosOrdenados = computed(() => {
      let filtered = usuariosOrdenados.value;

      if (filtro.value) {
        const searchTerm = filtro.value.toLowerCase();
        filtered = filtered.filter(
          (usuario) =>
            usuario.nome.toLowerCase().includes(searchTerm) ||
            (usuario.id && usuario.id.toLowerCase().includes(searchTerm))
        );
      }

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

    const buscarDados = async () => {
      try {
        carregando.value = true;
        erro.value = null;

        let url = "http://localhost:3000/api/ranking-ruptura";

        // Adicionar parâmetros de filtro
        const params = new URLSearchParams();
        if (filtroTipo.value && filtroTipo.value !== "todos") {
          params.append("tipo", filtroTipo.value);
        }
        if (filtroPeriodo.value && filtroPeriodo.value !== "todos") {
          params.append("periodo", filtroPeriodo.value);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        console.log("Buscando dados de ruptura de:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados de ruptura recebidos:", data);

        // Ajustar estrutura dos dados para compatibilidade
        usuarios.value = data.map((usuario) => ({
          ...usuario,
          // Garantir que temos o campo 'id' (pode vir como 'userId' ou 'id')
          id: usuario.id || usuario.userId || "N/A",
          iniciais: obterIniciais(usuario.nome),
          contador: usuario.contador || 0,
        }));

        console.log("Usuários de ruptura processados:", usuarios.value);
      } catch (error) {
        console.error("Erro ao buscar dados de ruptura:", error);
        erro.value = error.message;

        // Fallback para dados de exemplo
        usuarios.value = [
          {
            id: "2764270",
            nome: "GARDENIA VIANA BERNARDES",
            contador: 856,
            iniciais: "GV",
          },
          {
            id: "1234567",
            nome: "EXEMPLO SILVA",
            contador: 623,
            iniciais: "ES",
          },
          {
            id: "7654321",
            nome: "TESTE OLIVEIRA",
            contador: 421,
            iniciais: "TO",
          },
        ];
      } finally {
        carregando.value = false;
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
      const rankingData = usuariosOrdenados.value.map((user, index) => ({
        Posição: `${index + 1}º`,
        Nome: user.nome,
        Matrícula: user.id,
        "Itens Verificados": user.contador,
      }));

      const csvContent = [
        "Posição,Nome,Matrícula,Itens Verificados",
        ...rankingData.map(
          (item) =>
            `"${item.Posição}","${item.Nome}","${item.Matrícula}",${item["Itens Verificados"]}`
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", "ranking_ruptura_colaboradores.csv");
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    onMounted(() => {
      buscarDados();
    });

    return {
      usuarios,
      filtro,
      viewMode,
      filtroTipo,
      filtroPeriodo,
      carregando,
      erro,
      usuariosOrdenados,
      usuariosFiltradosOrdenados,
      totalItensLidos,
      mediaItensPorUsuario,
      topPerformer,
      percentualAboveAverage,
      buscarDados,
      exportarRanking,
    };
  },
};
</script>

<style scoped>
.ranking-premium-container {
  max-width: auto;
  margin: 0 auto;
  padding: 2px;
  font-family: "Poppins", sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: white;
  border-radius: 15px;
  margin: 20px 0;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  margin: 20px 0;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  color: #6c757d;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.empty-state p {
  color: #6c757d;
  font-size: 1rem;
}

.error-message {
  background: #ffe6e6;
  color: #d63384;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
  border-left: 4px solid #d63384;
}

.retry-btn {
  background: #d63384;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #c22575;
}
</style>
