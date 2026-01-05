<template>
  <div class="product-browser-container">
    <header class="browser-header">
      <h1>Vitrine de Produtos por Corredor</h1>
      <p>Navegue, filtre e analise os produtos em tempo real.</p>
    </header>

    <!-- Filtros -->
    <div class="filters-card">
      <div class="filter-groups">
        <!-- Filtro Principal: Auditoria e Visualização -->
        <div class="filter-section main-filters">
          <div class="filter-group">
            <label class="filter-label">Tipo de Auditoria</label>
            <div class="segmented-control">
              <button
                :class="{ active: tipoAuditoria === 'etiqueta' }"
                @click="tipoAuditoria = 'etiqueta'"
              >
                🏷️ Etiqueta
              </button>
              <button
                :class="{ active: tipoAuditoria === 'presenca' }"
                @click="tipoAuditoria = 'presenca'"
              >
                🕵️ Presença
              </button>
              <button
                :class="{ active: tipoAuditoria === 'ruptura' }"
                @click="tipoAuditoria = 'ruptura'"
              >
                🚫 Ruptura
              </button>
            </div>
          </div>
          <div class="filter-group">
            <label class="filter-label">Tipo de Visualização</label>
            <div class="segmented-control">
              <button
                :class="{ active: visualizacao === 'card' }"
                @click="visualizacao = 'card'"
              >
                🎴 Cards
              </button>
              <button
                :class="{ active: visualizacao === 'lista' }"
                @click="visualizacao = 'lista'"
              >
                📄 Lista
              </button>
            </div>
          </div>
        </div>

        <!-- Filtros Secundários: Dropdowns -->
        <div class="filter-section secondary-filters">
          <div class="filter-item">
            <label for="status-leitura-filter" class="filter-label"
              >Status Leitura</label
            >
            <select id="status-leitura-filter" v-model="statusLeitura">
              <option value="todos">Todos</option>
              <option value="lido">Lidos</option>
              <option value="nao_lido">Não Lidos</option>
            </select>
          </div>

          <div class="filter-item">
            <label for="classe-filter" class="filter-label">Classe</label>
            <select id="classe-filter" v-model="classeSelecionada">
              <option value="todas">Todas as Classes</option>
              <option v-for="classe in classes" :key="classe" :value="classe">
                {{ classe }}
              </option>
            </select>
          </div>

          <div class="filter-item">
            <label for="corredor-filter" class="filter-label">Corredor</label>
            <select id="corredor-filter" v-model="corredorSelecionado">
              <option value="todos">Todos os Corredores</option>
              <option
                v-for="corredor in corredores"
                :key="corredor"
                :value="corredor"
              >
                {{ corredor }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="filters-footer">
        <span class="results-count"
          >{{ filteredProducts.length }} produtos encontrados</span
        >
        <div class="footer-actions">
          <button class="action-btn share-btn" @click="compartilhar">
            Compartilhar
          </button>
          <button class="action-btn clear-btn" @click="limparFiltros">
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Indicadores -->
    <div v-if="loading" class="loading-indicator">Carregando produtos...</div>
    <div v-if="!loading && filteredProducts.length === 0" class="no-results">
      Nenhum produto encontrado com os filtros aplicados.
    </div>

    <!-- Grelha de Produtos (Cards) -->
    <div
      v-if="!loading && visualizacao === 'card' && filteredProducts.length > 0"
      class="products-grid"
    >
      <div
        v-for="produto in filteredProducts"
        :key="produto.id"
        class="product-card"
      >
        <div class="card-header">
          <span class="product-name">{{ produto.nome }}</span>
          <span class="product-ean">{{ produto.ean }}</span>
        </div>
        <div class="card-body">
          <div class="product-details">
            <div class="detail-item">
              <span class="detail-label">Corredor:</span>
              <span class="detail-value">{{ produto.corredor }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Classe:</span>
              <span class="detail-value">{{ produto.classe }}</span>
            </div>
          </div>
          <div class="audit-info">
            <p class="audit-label">
              Status {{ tipoAuditoriaFormatado }}:
            </p>
            <span
              class="audit-status"
              :class="getAuditStatusClass(produto.auditorias[tipoAuditoria])"
            >
              {{ formatAuditStatus(produto.auditorias[tipoAuditoria]) }}
            </span>
          </div>
        </div>
        <div class="card-footer">
          <span :class="['read-status', produto.lido ? 'lido' : 'nao-lido']">
            {{ produto.lido ? "✔️ Lido" : "❌ Não Lido" }}
          </span>
          <span class="audit-date">
            Auditado em:
            {{
              new Date(
                produto.auditorias[tipoAuditoria].data
              ).toLocaleDateString()
            }}
          </span>
        </div>
      </div>
    </div>

    <!-- Tabela de Produtos (Lista) -->
    <div
      v-if="!loading && visualizacao === 'lista' && filteredProducts.length > 0"
      class="products-list-container"
    >
      <table class="products-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>EAN</th>
            <th>Corredor</th>
            <th>Classe</th>
            <th>Status Leitura</th>
            <th>Status {{ tipoAuditoriaFormatado }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="produto in filteredProducts" :key="`list-${produto.id}`">
            <td>{{ produto.nome }}</td>
            <td>{{ produto.ean }}</td>
            <td>{{ produto.corredor }}</td>
            <td>{{ produto.classe }}</td>
            <td>
              <span
                :class="['read-status', produto.lido ? 'lido' : 'nao-lido']"
              >
                {{ produto.lido ? "Lido" : "Não Lido" }}
              </span>
            </td>
            <td>
              <span
                class="audit-status"
                :class="getAuditStatusClass(produto.auditorias[tipoAuditoria])"
              >
                {{ formatAuditStatus(produto.auditorias[tipoAuditoria]) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// --- STATE ---
const loading = ref(true);

// Filtros
const tipoAuditoria = ref("etiqueta"); // 'etiqueta', 'presenca', 'ruptura'
const visualizacao = ref("card"); // 'card', 'lista'
const statusLeitura = ref("todos"); // 'todos', 'lido', 'nao_lido'
const classeSelecionada = ref("todas");
const corredorSelecionado = ref("todos");

const produtos = ref([]);

// --- COMPUTED ---
const tipoAuditoriaFormatado = computed(
  () => tipoAuditoria.value.charAt(0).toUpperCase() + tipoAuditoria.value.slice(1)
);

const corredores = computed(() =>
  [...new Set(produtos.value.map((p) => p.corredor))].sort()
);
const classes = computed(() =>
  [...new Set(produtos.value.map((p) => p.classe))].sort()
);

const filteredProducts = computed(() => {
  if (loading.value) return [];
  return produtos.value.filter((produto) => {
    const leituraOk =
      statusLeitura.value === "todos" ||
      (statusLeitura.value === "lido" && produto.lido) ||
      (statusLeitura.value === "nao_lido" && !produto.lido);
    const classeOk =
      classeSelecionada.value === "todas" ||
      produto.classe === classeSelecionada.value;
    const corredorOk =
      corredorSelecionado.value === "todos" ||
      produto.corredor === corredorSelecionado.value;
    return leituraOk && classeOk && corredorOk;
  });
});

// --- METHODS ---
const gerarMockData = () => {
  const nomes = ["Maçã", "Arroz", "Feijão", "Biscoito", "Leite", "Café", "Açucar", "Sal", "Óleo", "Sabonete"];
  const corredoresMock = ["C-01", "C-02", "C-03", "H-01", "H-02"];
  const classesMock = ["SECA DOCE", "SECA SALGADA", "PERECIVEL 1", "FLV", "DPH", "BAZAR"];
  const auditStatus = {
    etiqueta: ["ok", "divergente", "sem_etiqueta"],
    presenca: ["presente", "ausente"],
    ruptura: ["ok", "ruptura"],
  };

  const data = [];
  for (let i = 1; i <= 100; i++) {
    data.push({
      id: i,
      nome: `${nomes[i % nomes.length]} #${i}`,
      ean: `789000000000${i}`.slice(-13),
      corredor: corredoresMock[i % corredoresMock.length],
      classe: classesMock[i % classesMock.length],
      lido: Math.random() > 0.4,
      auditorias: {
        etiqueta: { status: auditStatus.etiqueta[i % auditStatus.etiqueta.length], data: new Date(2025, 11, 15 - (i % 5)).toISOString() },
        presenca: { status: auditStatus.presenca[i % auditStatus.presenca.length], data: new Date(2025, 11, 15 - (i % 5)).toISOString() },
        ruptura: { status: auditStatus.ruptura[i % auditStatus.ruptura.length], data: new Date(2025, 11, 15 - (i % 5)).toISOString() },
      },
    });
  }
  produtos.value = data;
  loading.value = false;
};

const formatAuditStatus = (audit) => {
  if (!audit) return "N/A";
  return audit.status.replace(/_/g, " ").toUpperCase();
};

const getAuditStatusClass = (audit) => {
  if (!audit) return "status-default";
  const status = audit.status;
  if (status === "ok" || status === "presente") return "status-ok";
  if (status === "ruptura" || status === "ausente" || status === "sem_etiqueta") return "status-error";
  if (status === "divergente") return "status-warn";
  return "status-default";
};

const limparFiltros = () => {
  statusLeitura.value = "todos";
  classeSelecionada.value = "todas";
  corredorSelecionado.value = "todos";
  tipoAuditoria.value = "etiqueta";
  visualizacao.value = "card";
};

const compartilhar = () => {
  console.log("Ação de compartilhar acionada!");
  alert("Função de compartilhamento a ser implementada.");
};

// --- LIFECYCLE ---
gerarMockData();
</script>

<style scoped>
.product-browser-container {
  padding: 1.5rem;
  background-color: #f8fafc;
  color: #1a202c;
  min-height: 100vh;
  font-family: sans-serif;
}

.browser-header {
  text-align: center;
  margin-bottom: 2rem;
}
.browser-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}
.browser-header p {
  font-size: 1rem;
  color: #718096;
}

/* Card de Filtros */
.filters-card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.filter-groups {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-section.main-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.segmented-control {
  display: flex;
  background-color: #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.25rem;
}

.segmented-control button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: transparent;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0.375rem;
  white-space: nowrap;
}

.segmented-control button.active {
  background-color: #ffffff;
  color: #2c3e50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.secondary-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-item select {
  width: 100%;
  padding: 0.75rem;
  background-color: #f8fafc;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  color: #2d3748;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}
.filter-item select:hover {
  border-color: #a0aec0;
}
.filter-item select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.filters-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #718096;
}

.results-count {
  font-weight: 600;
}

.footer-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.share-btn {
  background-color: #667eea;
  color: white;
}
.share-btn:hover {
  background-color: #5a6fd8;
}

.clear-btn {
  background-color: #e53e3e;
  color: #fff;
}
.clear-btn:hover {
  background-color: #c53030;
}


.loading-indicator,
.no-results {
  text-align: center;
  padding: 4rem 0;
  font-size: 1.25rem;
  color: #718096;
}

/* Visualização em Cards */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
}

.card-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
}
.product-ean {
  font-size: 0.8rem;
  color: #718096;
  font-family: monospace;
}
.card-body {
  padding: 1.25rem;
  gap: 1rem;
}
.product-details, .audit-info {
  margin-bottom: 1rem;
}
.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
.detail-label { color: #718096; }
.detail-value { color: #2d3748; font-weight: 600; }
.audit-label { font-size: 0.9rem; color: #718096; margin-bottom: 0.25rem; }

.audit-status, .read-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
}
.status-ok { background-color: #ebf8f2; color: #38a169; }
.status-error { background-color: #fff5f5; color: #c53030; }
.status-warn { background-color: #fffaf0; color: #dd6b20; }
.status-default { background-color: #edf2f7; color: #4a5568; }

.card-footer {
  padding: 1rem 1.25rem;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}
.read-status.lido { color: #38a169; }
.read-status.nao-lido { color: #e53e3e; }
.audit-date { color: #718096; }


/* Visualização em Lista */
.products-list-container {
    background-color: #ffffff;
    border-radius: 0.75rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e8f0;
    overflow-x: auto;
}
.products-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}
.products-table th {
    padding: 1rem 1.25rem;
    background-color: #f8fafc;
    font-size: 0.8rem;
    font-weight: 600;
    color: #4a5568;
    text-transform: uppercase;
    border-bottom: 1px solid #e2e8f0;
}
.products-table td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e2e8f0;
    color: #2d3748;
    font-size: 0.9rem;
    white-space: nowrap;
}
.products-table tbody tr:last-child td {
    border-bottom: none;
}
.products-table tbody tr:hover {
    background-color: #f8fafc;
}

</style>
