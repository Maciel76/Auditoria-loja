// store/tarefasAuditoriaStore.js - Store Pinia para delegação de tarefas de auditoria
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/config/api";

export const useTarefasAuditoriaStore = defineStore("tarefasAuditoria", () => {
  // ============ STATE ============
  const produtosCache = ref({}); // { lojaId: { data, timestamp } }
  const cacheTTL = 5 * 60 * 1000; // 5 minutos

  const tipoAuditoriaSelecionado = ref("etiqueta"); // 'etiqueta', 'presenca', 'ruptura'
  const corredorSelecionado = ref(null);
  const loading = ref(false);
  const loadingChecklist = ref(false);
  const error = ref(null);

  // Itens marcados pelo colaborador (localmente + persistidos no backend)
  // Formato: { "lojaId::tipo::codigoProduto": true }
  const itensVerificados = ref({});

  // Versão da planilha (para detectar atualizações)
  const versaoPlanilha = ref({});  // { lojaId: timestamp }

  // ============ GETTERS ============

  // Produtos do cache para a loja atual
  const getProdutosPorLoja = computed(() => (lojaId) => {
    const cache = produtosCache.value[lojaId];
    if (!cache) return null;

    const agora = Date.now();
    if (agora - cache.timestamp > cacheTTL) return null;

    return cache.data;
  });

  // Todos os corredores disponíveis para o tipo de auditoria selecionado
  const getCorredores = computed(() => (lojaId) => {
    const dados = getProdutosPorLoja.value(lojaId);
    if (!dados) return [];

    const produtos = dados[tipoAuditoriaSelecionado.value] || [];
    const corredoresSet = new Set(
      produtos
        .map((p) => p.local || "Sem Corredor")
        .filter((c) => c && c !== "N/A")
    );
    return [...corredoresSet].sort();
  });

  // Produtos do corredor selecionado (apenas não lidos - faltam ler)
  const getProdutosCorredor = computed(() => (lojaId) => {
    const dados = getProdutosPorLoja.value(lojaId);
    if (!dados || !corredorSelecionado.value) return [];

    const produtos = dados[tipoAuditoriaSelecionado.value] || [];
    return produtos
      .filter((p) => {
        const local = p.local || "Sem Corredor";
        return local === corredorSelecionado.value;
      })
      .map((p) => ({
        ...p,
        verificado: isItemVerificado(lojaId, tipoAuditoriaSelecionado.value, p.codigo),
      }));
  });

  // Produtos que faltam ler (não lidos + não verificados)
  const getProdutosFaltam = computed(() => (lojaId) => {
    const todos = getProdutosCorredor.value(lojaId);
    return todos.filter((p) => !isItemLido(p) && !p.verificado);
  });

  // Estatísticas do corredor
  const getEstatisticasCorredor = computed(() => (lojaId) => {
    const todos = getProdutosCorredor.value(lojaId);
    const total = todos.length;
    const lidos = todos.filter((p) => isItemLido(p)).length;
    const verificados = todos.filter((p) => p.verificado).length;
    const faltam = total - lidos - verificados;

    return {
      total,
      lidos,
      verificados,
      faltam: faltam > 0 ? faltam : 0,
      progresso: total > 0 ? Math.round(((lidos + verificados) / total) * 100) : 0,
    };
  });

  // Estatísticas gerais (todos os corredores)
  const getEstatisticasGerais = computed(() => (lojaId) => {
    const dados = getProdutosPorLoja.value(lojaId);
    if (!dados) return { total: 0, lidos: 0, faltam: 0, progresso: 0 };

    const produtos = dados[tipoAuditoriaSelecionado.value] || [];
    const total = produtos.length;
    const lidos = produtos.filter((p) => isItemLido(p)).length;

    return {
      total,
      lidos,
      faltam: total - lidos,
      progresso: total > 0 ? Math.round((lidos / total) * 100) : 0,
    };
  });

  // ============ HELPERS ============

  function isItemLido(produto) {
    const situacao = produto.situacao || produto.situacaoAuditoria || "Não lido";
    return situacao === "Atualizado" || (produto.auditadoDia && produto.auditadoDia !== "");
  }

  function getChecklistKey(lojaId, tipo, codigoProduto) {
    return `${lojaId}::${tipo}::${codigoProduto}`;
  }

  function isItemVerificado(lojaId, tipo, codigoProduto) {
    return !!itensVerificados.value[getChecklistKey(lojaId, tipo, codigoProduto)];
  }

  // ============ ACTIONS ============

  // Carregar produtos da API com cache
  async function carregarProdutos(lojaId, forcar = false) {
    if (!lojaId) {
      error.value = "ID da loja não fornecido";
      return null;
    }

    // Verificar cache
    if (!forcar && produtosCache.value[lojaId]) {
      const cache = produtosCache.value[lojaId];
      const agora = Date.now();
      if (agora - cache.timestamp < cacheTTL) {
        // Verificar se a versão da planilha mudou
        if (cache.versao === versaoPlanilha.value[lojaId]) {
          return cache.data;
        }
      }
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await api.get(
        `/api/audit-products/produtos-auditorias/${lojaId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Erro ao carregar produtos");
      }

      const produtos = response.data.produtos;
      const versaoAtual = Date.now();

      // Verificar se houve atualização de planilha
      const versaoAnterior = versaoPlanilha.value[lojaId];
      if (versaoAnterior && cache_mudou(produtos, lojaId)) {
        // Planilha atualizada: limpar checklist
        limparChecklistLoja(lojaId);
      }
      versaoPlanilha.value[lojaId] = versaoAtual;

      // Armazenar no cache
      produtosCache.value[lojaId] = {
        data: produtos,
        timestamp: versaoAtual,
        versao: versaoAtual,
      };

      return produtos;
    } catch (err) {
      error.value = err.message;
      console.error("❌ Erro ao carregar produtos:", err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Detectar se os dados do cache mudaram (planilha nova)
  function cache_mudou(produtosNovos, lojaId) {
    const cacheAntigo = produtosCache.value[lojaId];
    if (!cacheAntigo) return false;

    const antigosEtiqueta = cacheAntigo.data?.etiqueta?.length || 0;
    const novosEtiqueta = produtosNovos?.etiqueta?.length || 0;

    // Se a quantidade de produtos mudou significativamente, provavelmente é uma nova planilha
    return Math.abs(antigosEtiqueta - novosEtiqueta) > 10;
  }

  // Marcar/desmarcar item como verificado
  function toggleItemVerificado(lojaId, tipo, codigoProduto) {
    const key = getChecklistKey(lojaId, tipo, codigoProduto);
    
    if (itensVerificados.value[key]) {
      delete itensVerificados.value[key];
    } else {
      itensVerificados.value[key] = true;
    }

    // Persistir localmente
    salvarChecklistLocal(lojaId);
    
    // Persistir no backend (assíncrono, sem bloquear)
    salvarChecklistBackend(lojaId, tipo);
  }

  // Marcar vários itens de uma vez
  function marcarVariosItens(lojaId, tipo, codigos, estado = true) {
    codigos.forEach((codigo) => {
      const key = getChecklistKey(lojaId, tipo, codigo);
      if (estado) {
        itensVerificados.value[key] = true;
      } else {
        delete itensVerificados.value[key];
      }
    });

    salvarChecklistLocal(lojaId);
    salvarChecklistBackend(lojaId, tipo);
  }

  // Limpar checklist de uma loja (quando planilha é atualizada)
  function limparChecklistLoja(lojaId) {
    const prefixo = `${lojaId}::`;
    const novoChecklist = {};
    
    Object.keys(itensVerificados.value).forEach((key) => {
      if (!key.startsWith(prefixo)) {
        novoChecklist[key] = itensVerificados.value[key];
      }
    });

    itensVerificados.value = novoChecklist;
    salvarChecklistLocal(lojaId);
  }

  // Persistir checklist no localStorage
  function salvarChecklistLocal(lojaId) {
    try {
      const checklistData = {};
      const prefixo = `${lojaId}::`;
      
      Object.keys(itensVerificados.value).forEach((key) => {
        if (key.startsWith(prefixo)) {
          checklistData[key] = true;
        }
      });

      localStorage.setItem(
        `checklist_auditoria_${lojaId}`,
        JSON.stringify(checklistData)
      );
    } catch (err) {
      console.error("Erro ao salvar checklist local:", err);
    }
  }

  // Carregar checklist do localStorage
  function carregarChecklistLocal(lojaId) {
    try {
      const data = localStorage.getItem(`checklist_auditoria_${lojaId}`);
      if (data) {
        const checklist = JSON.parse(data);
        Object.keys(checklist).forEach((key) => {
          itensVerificados.value[key] = true;
        });
      }
    } catch (err) {
      console.error("Erro ao carregar checklist local:", err);
    }
  }

  // Persistir checklist no backend
  async function salvarChecklistBackend(lojaId, tipo) {
    try {
      const prefixo = `${lojaId}::${tipo}::`;
      const codigos = [];

      Object.keys(itensVerificados.value).forEach((key) => {
        if (key.startsWith(prefixo)) {
          codigos.push(key.replace(prefixo, ""));
        }
      });

      await api.post("/api/tarefas-auditoria/checklist", {
        lojaId,
        tipo,
        itensVerificados: codigos,
      });
    } catch (err) {
      // Falha silenciosa - localStorage é o fallback
      console.warn("Não foi possível salvar checklist no backend:", err.message);
    }
  }

  // Carregar checklist do backend
  async function carregarChecklistBackend(lojaId, usuarioId) {
    loadingChecklist.value = true;
    try {
      const response = await api.get(
        `/api/tarefas-auditoria/checklist/${lojaId}/${usuarioId}`
      );

      if (response.data.success && response.data.checklist) {
        const { tipo, itensVerificados: codigos } = response.data.checklist;
        codigos.forEach((codigo) => {
          const key = getChecklistKey(lojaId, tipo, codigo);
          itensVerificados.value[key] = true;
        });
      }
    } catch (err) {
      // Fallback para localStorage
      carregarChecklistLocal(lojaId);
    } finally {
      loadingChecklist.value = false;
    }
  }

  // Selecionar tipo de auditoria
  function selecionarTipoAuditoria(tipo) {
    tipoAuditoriaSelecionado.value = tipo;
    corredorSelecionado.value = null;
  }

  // Selecionar corredor
  function selecionarCorredor(corredor) {
    corredorSelecionado.value = corredor;
  }

  // Info do cache
  function getInfoCache(lojaId) {
    const cache = produtosCache.value[lojaId];
    if (!cache) return null;

    const agora = Date.now();
    const idade = Math.floor((agora - cache.timestamp) / 1000);
    const valido = agora - cache.timestamp < cacheTTL;

    return {
      timestamp: cache.timestamp,
      idade: `${idade}s`,
      valido,
    };
  }

  // Inicializar store para um usuário/loja
  async function inicializar(lojaId, usuarioId) {
    // Carregar checklist (local primeiro, depois backend)
    carregarChecklistLocal(lojaId);
    
    // Carregar produtos com cache
    await carregarProdutos(lojaId);

    // Tentar sincronizar com backend
    if (usuarioId) {
      await carregarChecklistBackend(lojaId, usuarioId);
    }
  }

  return {
    // State
    produtosCache,
    tipoAuditoriaSelecionado,
    corredorSelecionado,
    loading,
    loadingChecklist,
    error,
    itensVerificados,

    // Getters
    getProdutosPorLoja,
    getCorredores,
    getProdutosCorredor,
    getProdutosFaltam,
    getEstatisticasCorredor,
    getEstatisticasGerais,

    // Actions
    carregarProdutos,
    toggleItemVerificado,
    marcarVariosItens,
    limparChecklistLoja,
    selecionarTipoAuditoria,
    selecionarCorredor,
    getInfoCache,
    inicializar,
    isItemVerificado,
    isItemLido,
  };
});
