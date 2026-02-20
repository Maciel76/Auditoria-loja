<template>
  <div class="minhas-tarefas">
    <!-- Header -->
    <div class="tarefas-header">
      <h2>
        <i class="fas fa-tasks"></i>
        Minhas Tarefas de Auditoria
      </h2>
      <p class="subtitle">
        Escolha o corredor e acompanhe os itens que faltam ser auditados
      </p>
    </div>

    <!-- Seleção do Tipo de Auditoria -->
    <div class="tipo-auditoria-selector">
      <div class="segmented-control">
        <button
          :class="{ active: tipoSelecionado === 'etiqueta' }"
          @click="selecionarTipo('etiqueta')"
        >
          <i class="fas fa-tag"></i>
          Etiqueta
        </button>
        <button
          :class="{ active: tipoSelecionado === 'presenca' }"
          @click="selecionarTipo('presenca')"
        >
          <i class="fas fa-eye"></i>
          Presença
        </button>
        <button
          :class="{ active: tipoSelecionado === 'ruptura' }"
          @click="selecionarTipo('ruptura')"
        >
          <i class="fas fa-exclamation-triangle"></i>
          Ruptura
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Carregando itens da auditoria...</p>
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ error }}</p>
      <button class="btn-retry" @click="carregarDados(true)">
        <i class="fas fa-redo"></i> Tentar novamente
      </button>
    </div>

    <!-- Sem dados -->
    <div v-else-if="!temDados" class="empty-state">
      <i class="fas fa-inbox"></i>
      <h3>Nenhuma auditoria disponível</h3>
      <p>Não há dados de auditoria para esta loja no momento.</p>
      <p class="info-text">
        Aguarde o upload de uma nova planilha de auditoria ou selecione outra loja.
      </p>
    </div>

    <!-- Conteúdo Principal -->
    <div v-else class="tarefas-content">
      <!-- Estatísticas Gerais -->
      <div class="stats-gerais">
        <div class="stat-card-mini">
          <div class="stat-icon-mini"><i class="fas fa-box"></i></div>
          <div class="stat-info-mini">
            <span class="stat-value-mini">{{ estatisticasGerais.total }}</span>
            <span class="stat-label-mini">Total Itens</span>
          </div>
        </div>
        <div class="stat-card-mini lidos">
          <div class="stat-icon-mini"><i class="fas fa-check"></i></div>
          <div class="stat-info-mini">
            <span class="stat-value-mini">{{ estatisticasGerais.lidos }}</span>
            <span class="stat-label-mini">Já Lidos</span>
          </div>
        </div>
        <div class="stat-card-mini faltam">
          <div class="stat-icon-mini"><i class="fas fa-clock"></i></div>
          <div class="stat-info-mini">
            <span class="stat-value-mini">{{ estatisticasGerais.faltam }}</span>
            <span class="stat-label-mini">Faltam</span>
          </div>
        </div>
        <div class="stat-card-mini progresso">
          <div class="stat-icon-mini"><i class="fas fa-chart-pie"></i></div>
          <div class="stat-info-mini">
            <span class="stat-value-mini">{{ estatisticasGerais.progresso }}%</span>
            <span class="stat-label-mini">Progresso</span>
          </div>
        </div>
      </div>

      <!-- Seleção de Corredor -->
      <div class="corredor-selector">
        <h3><i class="fas fa-map-marker-alt"></i> Escolha seu Corredor</h3>
        <div class="corredores-grid">
          <button
            v-for="corredor in corredores"
            :key="corredor"
            class="corredor-card"
            :class="{ active: corredorAtual === corredor }"
            @click="selecionarCorredor(corredor)"
          >
            <div class="corredor-icon">
              <i class="fas fa-road"></i>
            </div>
            <span class="corredor-nome">{{ corredor }}</span>
            <span class="corredor-count">
              {{ getContagemCorredor(corredor) }} itens
            </span>
          </button>
        </div>
      </div>

      <!-- Lista de itens do corredor selecionado -->
      <div v-if="corredorAtual" class="corredor-itens">
        <!-- Header do corredor -->
        <div class="corredor-header">
          <div class="corredor-title">
            <h3>
              <i class="fas fa-clipboard-list"></i>
              Corredor {{ corredorAtual }}
            </h3>
            <span class="corredor-badge" :class="progressoClasse">
              {{ estatisticasCorredor.progresso }}% concluído
            </span>
          </div>

          <!-- Barra de progresso do corredor -->
          <div class="progresso-bar-container">
            <div class="progresso-bar">
              <div
                class="progresso-fill lidos-fill"
                :style="{ width: barraLidos + '%' }"
              ></div>
              <div
                class="progresso-fill verificados-fill"
                :style="{ width: barraVerificados + '%', left: barraLidos + '%' }"
              ></div>
            </div>
            <div class="progresso-legenda">
              <span class="legenda-item lidos">
                <span class="legenda-dot"></span>
                {{ estatisticasCorredor.lidos }} lidos no sistema
              </span>
              <span class="legenda-item verificados">
                <span class="legenda-dot"></span>
                {{ estatisticasCorredor.verificados }} verificados por você
              </span>
              <span class="legenda-item faltam">
                <span class="legenda-dot"></span>
                {{ estatisticasCorredor.faltam }} faltam
              </span>
            </div>
          </div>

          <!-- Ações -->
          <div class="corredor-acoes">
            <div class="filtro-itens">
              <button
                :class="{ active: filtroItens === 'todos' }"
                @click="filtroItens = 'todos'"
              >
                Todos ({{ produtosCorredor.length }})
              </button>
              <button
                :class="{ active: filtroItens === 'faltam' }"
                @click="filtroItens = 'faltam'"
              >
                Faltam ({{ produtosFaltam.length }})
              </button>
              <button
                :class="{ active: filtroItens === 'verificados' }"
                @click="filtroItens = 'verificados'"
              >
                Verificados ({{ produtosVerificados.length }})
              </button>
            </div>

            <div class="acoes-lote">
              <button
                v-if="filtroItens === 'faltam' && produtosFaltam.length > 0"
                class="btn-lote"
                @click="marcarTodosFaltam"
              >
                <i class="fas fa-check-double"></i>
                Marcar todos
              </button>
              <button
                v-if="filtroItens === 'verificados' && produtosVerificados.length > 0"
                class="btn-lote desmarcar"
                @click="desmarcarTodosVerificados"
              >
                <i class="fas fa-times"></i>
                Desmarcar todos
              </button>
            </div>
          </div>
        </div>

        <!-- Busca rápida -->
        <div class="busca-container">
          <i class="fas fa-search"></i>
          <input
            v-model="buscaItem"
            type="text"
            placeholder="Buscar produto por nome ou código..."
            class="busca-input"
          />
          <button v-if="buscaItem" class="btn-limpar-busca" @click="buscaItem = ''">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Lista de itens -->
        <div v-if="itensFiltrados.length > 0" class="itens-lista">
          <div
            v-for="item in itensFiltrados"
            :key="item.codigo"
            class="item-card"
            :class="{
              'item-lido': isLido(item),
              'item-verificado': item.verificado,
              'item-falta': !isLido(item) && !item.verificado,
            }"
            @click="toggleItem(item)"
          >
            <div class="item-check">
              <div class="checkbox" :class="{ checked: item.verificado || isLido(item) }">
                <i v-if="item.verificado || isLido(item)" class="fas fa-check"></i>
              </div>
            </div>

            <div class="item-info">
              <div class="item-nome" :title="item.nome">
                {{ item.nome }}
              </div>
              <div class="item-meta">
                <span class="item-codigo">
                  <i class="fas fa-barcode"></i> {{ item.codigo }}
                </span>
                <span v-if="item.classe" class="item-classe">
                  {{ item.classe }}
                </span>
                <span v-if="item.estoque" class="item-estoque">
                  Est: {{ item.estoque || item.estoqueAtual || 0 }}
                </span>
              </div>
            </div>

            <div class="item-status">
              <span v-if="isLido(item)" class="status-badge lido">
                <i class="fas fa-check-circle"></i> Lido
              </span>
              <span v-else-if="item.verificado" class="status-badge verificado">
                <i class="fas fa-user-check"></i> Verificado
              </span>
              <span v-else class="status-badge pendente">
                <i class="fas fa-clock"></i> Pendente
              </span>
            </div>
          </div>
        </div>

        <!-- Lista vazia -->
        <div v-else class="itens-vazio">
          <i class="fas fa-check-circle"></i>
          <p v-if="filtroItens === 'faltam'">
            Todos os itens deste corredor foram verificados!
          </p>
          <p v-else-if="buscaItem">
            Nenhum item encontrado para "{{ buscaItem }}"
          </p>
          <p v-else>Nenhum item neste corredor.</p>
        </div>

        <!-- Info do cache -->
        <div v-if="infoCache" class="cache-info">
          <i class="fas fa-database"></i>
          Cache: {{ infoCache.idade }}
          <span :class="infoCache.valido ? 'cache-ok' : 'cache-expirado'">
            {{ infoCache.valido ? '✅' : '⚠️ Expirado' }}
          </span>
          <button class="btn-refresh" @click="carregarDados(true)" :disabled="loading">
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useTarefasAuditoriaStore } from "@/store/tarefasAuditoriaStore";
import { useLojaStore } from "@/store/lojaStore";
import { useUserSessionStore } from "@/store/userSessionStore";
import { storeToRefs } from "pinia";

const props = defineProps({
  usuario: {
    type: Object,
    required: true,
  },
});

// Stores
const tarefasStore = useTarefasAuditoriaStore();
const lojaStore = useLojaStore();
const userSessionStore = useUserSessionStore();
const { lojaSelecionada } = storeToRefs(lojaStore);

// State local
const filtroItens = ref("faltam");
const buscaItem = ref("");

// Computed - dados da store
const loading = computed(() => tarefasStore.loading);
const error = computed(() => tarefasStore.error);
const tipoSelecionado = computed(() => tarefasStore.tipoAuditoriaSelecionado);
const corredorAtual = computed(() => tarefasStore.corredorSelecionado);

const lojaId = computed(() => {
  return (
    props.usuario?.loja?._id ||
    props.usuario?.loja?.codigo ||
    lojaSelecionada.value?._id ||
    lojaSelecionada.value?.codigo ||
    null
  );
});

const temDados = computed(() => {
  if (!lojaId.value) return false;
  const dados = tarefasStore.getProdutosPorLoja(lojaId.value);
  if (!dados) return false;
  const tipo = tarefasStore.tipoAuditoriaSelecionado;
  return (dados[tipo]?.length || 0) > 0;
});

const corredores = computed(() => {
  if (!lojaId.value) return [];
  return tarefasStore.getCorredores(lojaId.value);
});

const estatisticasGerais = computed(() => {
  if (!lojaId.value) return { total: 0, lidos: 0, faltam: 0, progresso: 0 };
  return tarefasStore.getEstatisticasGerais(lojaId.value);
});

const produtosCorredor = computed(() => {
  if (!lojaId.value) return [];
  return tarefasStore.getProdutosCorredor(lojaId.value);
});

const produtosFaltam = computed(() => {
  return produtosCorredor.value.filter((p) => !isLido(p) && !p.verificado);
});

const produtosVerificados = computed(() => {
  return produtosCorredor.value.filter((p) => p.verificado && !isLido(p));
});

const estatisticasCorredor = computed(() => {
  if (!lojaId.value) return { total: 0, lidos: 0, verificados: 0, faltam: 0, progresso: 0 };
  return tarefasStore.getEstatisticasCorredor(lojaId.value);
});

const itensFiltrados = computed(() => {
  let itens;
  if (filtroItens.value === "faltam") {
    itens = produtosFaltam.value;
  } else if (filtroItens.value === "verificados") {
    itens = produtosVerificados.value;
  } else {
    itens = produtosCorredor.value;
  }

  // Aplicar busca
  if (buscaItem.value) {
    const term = buscaItem.value.toLowerCase();
    itens = itens.filter(
      (p) =>
        (p.nome || "").toLowerCase().includes(term) ||
        (p.codigo || "").toLowerCase().includes(term)
    );
  }

  return itens;
});

const infoCache = computed(() => {
  if (!lojaId.value) return null;
  return tarefasStore.getInfoCache(lojaId.value);
});

const barraLidos = computed(() => {
  const stats = estatisticasCorredor.value;
  if (stats.total === 0) return 0;
  return Math.round((stats.lidos / stats.total) * 100);
});

const barraVerificados = computed(() => {
  const stats = estatisticasCorredor.value;
  if (stats.total === 0) return 0;
  return Math.round((stats.verificados / stats.total) * 100);
});

const progressoClasse = computed(() => {
  const p = estatisticasCorredor.value.progresso;
  if (p >= 80) return "progresso-alto";
  if (p >= 50) return "progresso-medio";
  return "progresso-baixo";
});

// Methods
function isLido(produto) {
  return tarefasStore.isItemLido(produto);
}

function selecionarTipo(tipo) {
  tarefasStore.selecionarTipoAuditoria(tipo);
  filtroItens.value = "faltam";
}

function selecionarCorredor(corredor) {
  tarefasStore.selecionarCorredor(corredor);
  filtroItens.value = "faltam";
  buscaItem.value = "";
}

function toggleItem(item) {
  if (isLido(item)) return; // Não pode desmarcar itens já lidos no sistema
  tarefasStore.toggleItemVerificado(
    lojaId.value,
    tarefasStore.tipoAuditoriaSelecionado,
    item.codigo
  );
}

function marcarTodosFaltam() {
  const codigos = produtosFaltam.value.map((p) => p.codigo);
  tarefasStore.marcarVariosItens(
    lojaId.value,
    tarefasStore.tipoAuditoriaSelecionado,
    codigos,
    true
  );
}

function desmarcarTodosVerificados() {
  const codigos = produtosVerificados.value.map((p) => p.codigo);
  tarefasStore.marcarVariosItens(
    lojaId.value,
    tarefasStore.tipoAuditoriaSelecionado,
    codigos,
    false
  );
}

function getContagemCorredor(corredor) {
  if (!lojaId.value) return 0;
  const dados = tarefasStore.getProdutosPorLoja(lojaId.value);
  if (!dados) return 0;
  const tipo = tarefasStore.tipoAuditoriaSelecionado;
  const produtos = dados[tipo] || [];
  return produtos.filter((p) => (p.local || "Sem Corredor") === corredor).length;
}

async function carregarDados(forcar = false) {
  if (!lojaId.value) return;
  await tarefasStore.carregarProdutos(lojaId.value, forcar);
}

// Lifecycle
onMounted(async () => {
  if (lojaId.value) {
    const usuarioId = props.usuario?.id || userSessionStore.getUsuarioId;
    await tarefasStore.inicializar(lojaId.value, usuarioId);
  }
});

// Observar mudanças na loja
watch(lojaId, async (novaLoja) => {
  if (novaLoja) {
    const usuarioId = props.usuario?.id || userSessionStore.getUsuarioId;
    await tarefasStore.inicializar(novaLoja, usuarioId);
  }
});
</script>

<style scoped>
.minhas-tarefas {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

/* Header */
.tarefas-header {
  margin-bottom: 1.5rem;
}

.tarefas-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.tarefas-header h2 i {
  color: #667eea;
}

.tarefas-header .subtitle {
  color: #6c757d;
  font-size: 0.95rem;
  margin: 0;
}

/* Tipo Auditoria Selector */
.tipo-auditoria-selector {
  margin-bottom: 1.5rem;
}

.segmented-control {
  display: flex;
  gap: 0.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 0.4rem;
}

.segmented-control button {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  background: transparent;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-family: "Poppins", sans-serif;
}

.segmented-control button:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.segmented-control button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Loading / Error / Empty States */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.loading-state .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state i,
.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.error-state i { color: #e74c3c; }
.empty-state i { color: #dee2e6; }

.btn-retry {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
}

.info-text {
  font-size: 0.85rem;
  color: #adb5bd;
  margin-top: 0.5rem;
}

/* Stats Gerais */
.stats-gerais {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.stat-card-mini {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.stat-card-mini:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card-mini.lidos { border-left: 3px solid #27ae60; }
.stat-card-mini.faltam { border-left: 3px solid #e74c3c; }
.stat-card-mini.progresso { border-left: 3px solid #667eea; }

.stat-icon-mini {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  font-size: 0.9rem;
}

.stat-card-mini.lidos .stat-icon-mini { background: rgba(39, 174, 96, 0.1); color: #27ae60; }
.stat-card-mini.faltam .stat-icon-mini { background: rgba(231, 76, 60, 0.1); color: #e74c3c; }
.stat-card-mini.progresso .stat-icon-mini { background: rgba(102, 126, 234, 0.1); color: #667eea; }

.stat-info-mini {
  display: flex;
  flex-direction: column;
}

.stat-value-mini {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.2;
}

.stat-label-mini {
  font-size: 0.7rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Corredor Selector */
.corredor-selector {
  margin-bottom: 1.5rem;
}

.corredor-selector h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.corredor-selector h3 i {
  color: #667eea;
}

.corredores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
}

.corredor-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.5rem;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Poppins", sans-serif;
}

.corredor-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.corredor-card.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.corredor-icon {
  font-size: 1.3rem;
  margin-bottom: 0.3rem;
}

.corredor-card.active .corredor-icon { color: white; }

.corredor-nome {
  font-size: 0.8rem;
  font-weight: 700;
}

.corredor-count {
  font-size: 0.65rem;
  opacity: 0.7;
  margin-top: 0.15rem;
}

/* Corredor Itens */
.corredor-itens {
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
}

.corredor-header {
  margin-bottom: 1rem;
}

.corredor-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.corredor-title h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.corredor-title h3 i { color: #667eea; }

.corredor-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.corredor-badge.progresso-alto {
  background: rgba(39, 174, 96, 0.1);
  color: #27ae60;
}
.corredor-badge.progresso-medio {
  background: rgba(243, 156, 18, 0.1);
  color: #f39c12;
}
.corredor-badge.progresso-baixo {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

/* Barra de Progresso */
.progresso-bar-container {
  margin-bottom: 1rem;
}

.progresso-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progresso-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
  position: absolute;
  top: 0;
}

.lidos-fill {
  background: linear-gradient(90deg, #27ae60, #2ecc71);
  z-index: 2;
}

.verificados-fill {
  background: linear-gradient(90deg, #667eea, #764ba2);
  z-index: 1;
}

.progresso-legenda {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.legenda-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  color: #6c757d;
}

.legenda-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legenda-item.lidos .legenda-dot { background: #27ae60; }
.legenda-item.verificados .legenda-dot { background: #667eea; }
.legenda-item.faltam .legenda-dot { background: #e74c3c; }

/* Filtros e Ações */
.corredor-acoes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.filtro-itens {
  display: flex;
  gap: 0.3rem;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 0.25rem;
}

.filtro-itens button {
  padding: 0.4rem 0.8rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Poppins", sans-serif;
}

.filtro-itens button.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-lote {
  padding: 0.4rem 0.8rem;
  border: none;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s ease;
  font-family: "Poppins", sans-serif;
}

.btn-lote:hover {
  background: #667eea;
  color: white;
}

.btn-lote.desmarcar {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.btn-lote.desmarcar:hover {
  background: #e74c3c;
  color: white;
}

/* Busca */
.busca-container {
  position: relative;
  margin-bottom: 1rem;
}

.busca-container > i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #adb5bd;
  font-size: 0.85rem;
}

.busca-input {
  width: 100%;
  padding: 0.6rem 2.5rem 0.6rem 2.2rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 0.85rem;
  font-family: "Poppins", sans-serif;
  color: #2c3e50;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.busca-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-limpar-busca {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  color: #adb5bd;
  cursor: pointer;
  padding: 4px;
}

/* Lista de Itens */
.itens-lista {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.itens-lista::-webkit-scrollbar {
  width: 6px;
}

.itens-lista::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.itens-lista::-webkit-scrollbar-thumb {
  background: #c4c4c4;
  border-radius: 3px;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.9rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.item-card:hover {
  background: #eef1ff;
  border-color: #667eea;
  transform: translateX(4px);
}

.item-card.item-lido {
  background: rgba(39, 174, 96, 0.05);
  border-color: rgba(39, 174, 96, 0.2);
  cursor: default;
}

.item-card.item-lido:hover {
  transform: none;
}

.item-card.item-verificado {
  background: rgba(102, 126, 234, 0.05);
  border-color: rgba(102, 126, 234, 0.2);
}

/* Checkbox */
.item-check {
  flex-shrink: 0;
}

.checkbox {
  width: 22px;
  height: 22px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox.checked {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  font-size: 0.65rem;
}

.item-card.item-lido .checkbox.checked {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  border-color: #27ae60;
}

/* Item Info */
.item-info {
  flex: 1;
  min-width: 0;
}

.item-nome {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.15rem;
  flex-wrap: wrap;
}

.item-meta span {
  font-size: 0.7rem;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.item-meta .item-codigo i { font-size: 0.65rem; }

.item-classe {
  background: rgba(102, 126, 234, 0.08);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  color: #667eea !important;
  font-weight: 500;
}

/* Status Badge */
.item-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
}

.status-badge.lido {
  background: rgba(39, 174, 96, 0.1);
  color: #27ae60;
}

.status-badge.verificado {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.status-badge.pendente {
  background: rgba(231, 76, 60, 0.08);
  color: #e74c3c;
}

/* Itens Vazio */
.itens-vazio {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.itens-vazio i {
  font-size: 2.5rem;
  color: #27ae60;
  margin-bottom: 0.5rem;
  display: block;
}

/* Cache Info */
.cache-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  margin-top: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.75rem;
  color: #6c757d;
}

.cache-ok { color: #27ae60; }
.cache-expirado { color: #e74c3c; }

.btn-refresh {
  margin-left: auto;
  border: none;
  background: none;
  color: #667eea;
  cursor: pointer;
  padding: 0.2rem;
  font-size: 0.85rem;
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsividade */
@media (max-width: 768px) {
  .minhas-tarefas {
    padding: 1.25rem;
    border-radius: 12px;
  }

  .tarefas-header h2 {
    font-size: 1.3rem;
  }

  .stats-gerais {
    grid-template-columns: repeat(2, 1fr);
  }

  .corredores-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }

  .corredor-acoes {
    flex-direction: column;
    align-items: stretch;
  }

  .filtro-itens {
    justify-content: center;
  }

  .acoes-lote {
    display: flex;
    justify-content: center;
  }

  .item-card {
    padding: 0.6rem;
    gap: 0.5rem;
  }

  .item-nome {
    font-size: 0.78rem;
  }

  .corredor-title {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .progresso-legenda {
    flex-direction: column;
    gap: 0.3rem;
  }
}

@media (max-width: 480px) {
  .minhas-tarefas {
    padding: 1rem;
  }

  .stats-gerais {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .stat-card-mini {
    padding: 0.6rem;
  }

  .stat-value-mini {
    font-size: 1rem;
  }

  .segmented-control {
    flex-direction: column;
  }

  .corredores-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .itens-lista {
    max-height: 400px;
  }
}
</style>
