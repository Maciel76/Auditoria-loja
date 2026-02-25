import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/config/api";

export const useSetoresStore = defineStore("setores", () => {
  // State
  const dadosPlanilha = ref([]);
  const datasAuditoria = ref([]);
  const dataSelecionada = ref("");
  const filtroLocal = ref("");
  const filtroStatus = ref("");
  const filtroProduto = ref("");
  const carregando = ref(false);
  const carregandoData = ref(false);
  const erro = ref("");

  // Getters
  const locaisUnicos = computed(() => {
    const locais = [...new Set(dadosPlanilha.value.map((item) => item.Local))];
    return locais.filter((local) => local).sort();
  });

  const itensFiltrados = computed(() => {
    return aplicarFiltros(dadosPlanilha.value);
  });

  const itensLidosFiltrados = computed(() => {
    return aplicarFiltros(
      dadosPlanilha.value.filter((item) => item.Situacao === "Atualizado")
    );
  });

  const itensNaoLidosFiltrados = computed(() => {
    return aplicarFiltros(
      dadosPlanilha.value.filter((item) => item.Situacao !== "Atualizado")
    );
  });

  const itensDoLocal = computed(() => {
    if (!filtroLocal.value) return dadosPlanilha.value;
    return dadosPlanilha.value.filter(
      (item) => item.Local === filtroLocal.value
    );
  });

  const estatisticasLocal = computed(() => {
    const total = itensDoLocal.value.length;
    const lidos = itensDoLocal.value.filter(
      (item) => item.Situacao === "Atualizado"
    ).length;
    const naoLidos = total - lidos;
    const percentualLidos = total > 0 ? Math.round((lidos / total) * 100) : 0;
    const percentualNaoLidos = 100 - percentualLidos;

    const colaboradores = new Set();
    itensDoLocal.value.forEach((item) => {
      if (item.Usuario) colaboradores.add(item.Usuario);
    });

    return {
      total,
      lidos,
      naoLidos,
      percentualLidos,
      percentualNaoLidos,
      colaboradores: Array.from(colaboradores),
    };
  });

  const locaisComEstatisticas = computed(() => {
    return locaisUnicos.value.map((local) => {
      const itensLocal = dadosPlanilha.value.filter(
        (item) => item.Local === local
      );
      const lidos = itensLocal.filter(
        (item) => item.Situacao === "Atualizado"
      ).length;
      const total = itensLocal.length;
      const percentualLidos = total > 0 ? Math.round((lidos / total) * 100) : 0;

      return {
        nome: local,
        total,
        lidos,
        percentualLidos,
      };
    });
  });

  const filtrosAtivos = computed(() => {
    const filtros = [];
    if (filtroLocal.value) filtros.push(`Local: ${filtroLocal.value}`);
    if (filtroStatus.value) {
      filtros.push(
        `Status: ${
          filtroStatus.value === "Atualizado"
            ? "Itens Lidos"
            : "Itens Não Lidos"
        }`
      );
    }
    if (filtroProduto.value) filtros.push(`Produto: "${filtroProduto.value}"`);
    return filtros;
  });

  // Actions
  function aplicarFiltros(itens) {
    let filtrados = itens;

    if (filtroLocal.value) {
      filtrados = filtrados.filter((item) => item.Local === filtroLocal.value);
    }

    if (filtroStatus.value) {
      filtrados = filtrados.filter((item) => {
        if (filtroStatus.value === "Atualizado") {
          return item.Situacao === "Atualizado";
        } else {
          return item.Situacao !== "Atualizado";
        }
      });
    }

    if (filtroProduto.value) {
      const termo = filtroProduto.value.toLowerCase();
      filtrados = filtrados.filter(
        (item) => item.Produto && item.Produto.toLowerCase().includes(termo)
      );
    }

    return filtrados;
  }

  function limparFiltros() {
    filtroLocal.value = "";
    filtroStatus.value = "";
    filtroProduto.value = "";
  }

  function removerFiltro(filtroTexto) {
    if (filtroTexto.startsWith("Local:")) {
      filtroLocal.value = "";
    } else if (filtroTexto.startsWith("Status:")) {
      filtroStatus.value = "";
    } else if (filtroTexto.startsWith("Produto:")) {
      filtroProduto.value = "";
    }
  }

  async function carregarDatasAuditoria() {
    try {
      const response = await api.get("/api/datas-auditoria");
      datasAuditoria.value = response.data;
      if (datasAuditoria.value.length > 0) {
        dataSelecionada.value = datasAuditoria.value[0];
      }
    } catch (error) {
      console.error("Erro ao carregar datas:", error);
      // Fallback para datas de exemplo
      datasAuditoria.value = [
        new Date().toISOString().split("T")[0],
        new Date(Date.now() - 86400000).toISOString().split("T")[0],
      ];
      dataSelecionada.value = datasAuditoria.value[0];
    }
  }

  async function carregarDados() {
    try {
      carregando.value = true;
      erro.value = "";
      const params = dataSelecionada.value
        ? { data: dataSelecionada.value }
        : {};
      const response = await api.get("/api/dados-setores", {
        params,
      });

      if (response.data && Array.isArray(response.data)) {
        dadosPlanilha.value = response.data.map((item) => ({
          ...item,
          Situacao: item.Situacao || item.Situação || "Não lido",
          Local: item.Local || "Não especificado",
        }));
      } else {
        erro.value = "Formato de dados inválido";
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      erro.value = "Falha ao carregar dados da planilha";
      // Dados de exemplo
      dadosPlanilha.value = [
        {
          Código: "1062218",
          Produto: "CIGARRO CHESTERFIELD BLUE BOX C/10 KS RCB",
          Local: "C01 - C01",
          Usuario: "3285030 (MARLUCIA OLIVEIRA DA SILVA)",
          Situacao: "Atualizado",
          "Estoque atual": "24",
          "Última compra": "01/01/2023",
        },
        // ... outros dados
      ];
    } finally {
      carregando.value = false;
    }
  }

  return {
    // State
    dadosPlanilha,
    datasAuditoria,
    dataSelecionada,
    filtroLocal,
    filtroStatus,
    filtroProduto,
    carregando,
    carregandoData,
    erro,

    // Getters
    locaisUnicos,
    itensFiltrados,
    itensLidosFiltrados,
    itensNaoLidosFiltrados,
    itensDoLocal,
    estatisticasLocal,
    locaisComEstatisticas,
    filtrosAtivos,

    // Actions
    aplicarFiltros,
    limparFiltros,
    removerFiltro,
    carregarDatasAuditoria,
    carregarDados,
  };
});
