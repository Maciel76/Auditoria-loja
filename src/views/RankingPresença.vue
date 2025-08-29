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

    <!-- Pódio - Top 3 -->
    <PodiumSection
      v-if="viewMode === 'podium' && usuariosOrdenados.length >= 3"
      :usuariosOrdenados="usuariosOrdenados"
    />

    <!-- Lista Completa de Ranking -->
    <RankingList
      :usuariosFiltradosOrdenados="usuariosFiltradosOrdenados"
      :viewMode="viewMode"
      :usuariosOrdenados="usuariosOrdenados"
    />

    <!-- Estatísticas Avançadas -->
    <AdvancedStats
      :topPerformer="topPerformer"
      :mediaItensPorUsuario="mediaItensPorUsuario"
      :totalItensLidos="totalItensLidos"
      :percentualAboveAverage="percentualAboveAverage"
    />

    <!-- Botão de Exportar -->
    <ExportSection @exportarRanking="exportarRanking" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import HeroSection from "./Ranking/Presenca/HeroSection.vue";
import RankingControls from "./Ranking/Presenca/RankingControls.vue";
import PodiumSection from "./Ranking/Presenca/PodiumSection.vue";
import RankingList from "./Ranking/Presenca/RankingList.vue";
import AdvancedStats from "./Ranking/Presenca/AdvancedStats.vue";
import ExportSection from "./Ranking/Presenca/ExportSection.vue";

export default {
  name: "RankingPresença",
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
    const filtroTipo = ref("todos");
    const filtroPeriodo = ref("hoje");
    const carregando = ref(false);

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
            usuario.id.toLowerCase().includes(searchTerm)
        );
      }

      if (viewMode.value === "podium") {
        return filtered.slice(3);
      }

      return filtered;
    });

    const totalItensLidos = computed(() => {
      return usuarios.value.reduce(
        (total, usuario) => total + usuario.contador,
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
        let url = "http://localhost:3000/api/ranking";
        // Adicionar parâmetros de filtro
        const params = new URLSearchParams();
        if (filtroTipo.value !== "todos")
          params.append("tipo", filtroTipo.value);
        if (filtroPeriodo.value !== "todos")
          params.append("periodo", filtroPeriodo.value);
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          usuarios.value = data.map((usuario) => ({
            ...usuario,
            iniciais: obterIniciais(usuario.nome),
            contador: usuario.contador || 0,
          }));
        } else {
          console.error("Erro ao carregar dados do ranking");
          // Fallback para dados locais se a API falhar
          usuarios.value = [
            {
              id: "001",
              nome: "João Silva",
              contador: 156,
              iniciais: "JS",
            },
            {
              id: "002",
              nome: "Maria Santos",
              contador: 203,
              iniciais: "MS",
            },
            {
              id: "003",
              nome: "Pedro Oliveira",
              contador: 178,
              iniciais: "PO",
            },
          ];
        }
      } catch (error) {
        console.error("Erro ao conectar com o backend:", error);
        // Fallback para dados locais em caso de erro
        usuarios.value = [
          {
            id: "001",
            nome: "João Silva",
            contador: 156,
            iniciais: "JS",
          },
          {
            id: "002",
            nome: "Maria Santos",
            contador: 203,
            iniciais: "MS",
          },
          {
            id: "003",
            nome: "Pedro Oliveira",
            contador: 178,
            iniciais: "PO",
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
      link.setAttribute("download", "ranking_colaboradores.csv");
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
</style>
