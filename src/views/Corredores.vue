<template>
  <div class="corredores-view">
    <!-- HEADER -->
    <header class="page-header">
      <div class="page-header__content">
        <div>
          <span class="page-header__eyebrow">Auditoria de Loja</span>
          <h1 class="page-header__title">
            Status de Auditoria
            <span v-if="lojaSelecionada?.codigo" class="page-header__loja"
              >· Loja {{ lojaSelecionada.codigo }}</span
            >
          </h1>
          <p class="page-header__subtitle">
            Explore, filtre e monitore o status dos produtos por corredor com
            insights em tempo real.
          </p>
        </div>
        <div class="page-header__actions">
          <button
            class="btn btn--ghost"
            @click="forcarAtualizacao"
            :disabled="loading"
            :title="ultimaAtualizacao ? `Última: ${horaUltimaAtualizacao}` : ''"
          >
            <span class="btn__icon" :class="{ spinning: loading }">⟳</span>
            {{ loading ? "Carregando…" : "Atualizar" }}
          </button>
          <button
            class="btn btn--primary"
            @click="compartilhar"
            :disabled="loading || filteredTotal === 0"
          >
            <span class="btn__icon">⬇</span> Baixar PDF
          </button>
        </div>
      </div>
    </header>

    <!-- STATS CARDS -->
    <section class="stats-grid">
      <div class="stat-card stat-card--total">
        <div class="stat-card__icon">📦</div>
        <div class="stat-card__body">
          <div class="stat-card__value">{{ formatNumber(stats.total) }}</div>
          <div class="stat-card__label">Total de Produtos</div>
        </div>
      </div>
      <div class="stat-card stat-card--ok">
        <div class="stat-card__icon">✓</div>
        <div class="stat-card__body">
          <div class="stat-card__value">{{ formatNumber(stats.lidos) }}</div>
          <div class="stat-card__label">Lidos</div>
        </div>
      </div>
      <div class="stat-card stat-card--warn">
        <div class="stat-card__icon">!</div>
        <div class="stat-card__body">
          <div class="stat-card__value">{{ formatNumber(stats.naoLidos) }}</div>
          <div class="stat-card__label">Não Lidos</div>
        </div>
      </div>
      <div class="stat-card stat-card--coverage">
        <div class="stat-card__icon">%</div>
        <div class="stat-card__body">
          <div class="stat-card__value">{{ stats.cobertura }}%</div>
          <div class="stat-card__label">Cobertura</div>
        </div>
        <div class="stat-card__bar">
          <div
            class="stat-card__bar-fill"
            :style="{ width: stats.cobertura + '%' }"
          ></div>
        </div>
      </div>
    </section>

    <!-- FILTERS CARD -->
    <section class="filters-card">
      <!-- Tipo de Auditoria (Segmented) -->
      <div class="filters-card__row">
        <label class="filters-card__label">Tipo de Auditoria</label>
        <div class="segmented">
          <button
            v-for="tipo in tiposAuditoria"
            :key="tipo.value"
            :class="['segmented__btn', { 'is-active': tipoAuditoria === tipo.value }]"
            @click="tipoAuditoria = tipo.value"
          >
            <img :src="tipo.icon" :alt="tipo.label" class="segmented__icon" />
            <span>{{ tipo.label }}</span>
          </button>
        </div>
      </div>

      <!-- Busca -->
      <div class="filters-card__row">
        <label class="filters-card__label" for="search-input"
          >Buscar produto</label
        >
        <div class="search-input">
          <span class="search-input__icon">🔍</span>
          <input
            id="search-input"
            v-model="searchInput"
            type="search"
            placeholder="Nome ou código do produto…"
            autocomplete="off"
          />
          <button
            v-if="searchInput"
            class="search-input__clear"
            @click="searchInput = ''"
            title="Limpar busca"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Filtros secundários -->
      <div class="filters-grid">
        <div class="filter-item">
          <label class="filter-item__label">Status Leitura</label>
          <select v-model="statusLeitura">
            <option value="todos">Todos</option>
            <option value="lido">Lidos</option>
            <option value="nao_lido">Não Lidos</option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-item__label">Classe</label>
          <select v-model="classeSelecionada">
            <option value="todas">Todas as Classes</option>
            <option v-for="classe in classes" :key="classe" :value="classe">
              {{ classe }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-item__label">Corredor</label>
          <select v-model="corredorSelecionado">
            <option value="todos">Todos os Corredores</option>
            <option v-for="c in corredores" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-item__label">Usuário</label>
          <select v-model="usuarioFiltro">
            <option value="todos">Todos os Usuários</option>
            <option v-for="u in usuarios" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-item__label">Dias sem Venda</label>
          <select v-model="diasSemVendaFiltro">
            <option value="todos">Todos</option>
            <option value="1-5">1–5 dias</option>
            <option value="6-9">6–9 dias</option>
            <option value="10+">10+ dias</option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-item__label">Itens por página</label>
          <select v-model.number="pageSize">
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="250">250</option>
          </select>
        </div>
      </div>

      <!-- Footer -->
      <div class="filters-card__footer">
        <div class="filters-card__info">
          <span class="filters-card__count"
            ><strong>{{ formatNumber(filteredTotal) }}</strong> resultado{{
              filteredTotal === 1 ? "" : "s"
            }}</span
          >
          <span
            v-if="infoCache"
            class="cache-pill"
            :class="{ 'cache-pill--expired': !infoCache.valido }"
            :title="infoCache.valido ? 'Cache válido' : 'Cache expirado'"
          >
            <span class="cache-pill__dot"></span>
            Cache · {{ infoCache.idade }}
          </span>
        </div>
        <div class="filters-card__actions">
          <button class="btn btn--soft" @click="limparFiltros">
            Limpar Filtros
          </button>
        </div>
      </div>
    </section>

    <!-- ACTIVE FILTER TAGS -->
    <transition name="fade">
      <div v-if="filtrosAtivos.length > 0" class="active-tags">
        <span class="active-tags__label">Filtros ativos:</span>
        <button
          v-for="filtro in filtrosAtivos"
          :key="filtro.key"
          class="tag"
          @click="removerFiltro(filtro.key)"
          :title="`Remover filtro ${filtro.label}`"
        >
          <span class="tag__label"
            >{{ filtro.label }}: {{ filtro.value }}</span
          >
          <span class="tag__remove">✕</span>
        </button>
      </div>
    </transition>

    <!-- LOADING SKELETON -->
    <div v-if="loading" class="products-card">
      <div class="skeleton-row" v-for="n in 8" :key="n">
        <div class="skeleton-block skeleton-block--md"></div>
        <div class="skeleton-block skeleton-block--sm"></div>
        <div class="skeleton-block skeleton-block--xs"></div>
        <div class="skeleton-block skeleton-block--sm"></div>
        <div class="skeleton-block skeleton-block--md"></div>
        <div class="skeleton-block skeleton-block--xs"></div>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="filteredTotal === 0" class="empty-state">
      <div class="empty-state__icon">📦</div>
      <h3>Nenhum produto encontrado</h3>
      <p>Não há produtos que correspondam aos filtros aplicados.</p>
      <p class="empty-state__hint">
        Tente ajustar os filtros ou faça o upload de uma nova planilha.
      </p>
      <router-link to="/selecionar-auditoria" class="btn btn--primary">
        <span class="btn__icon">⬆</span> Fazer Upload de Planilha
      </router-link>
    </div>

    <!-- TABLE -->
    <div v-else class="products-card">
      <div class="products-table-wrapper">
        <table class="products-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Código</th>
              <th
                class="th--sortable"
                @click="alternarOrdenacaoQuantidade"
                :title="'Ordenar por quantidade'"
              >
                <div class="th__inner">
                  <span>Quantidade</span>
                  <span class="th__sort">
                    <span v-if="ordenacaoQuantidade === 'desc'">↓</span>
                    <span v-else-if="ordenacaoQuantidade === 'asc'">↑</span>
                    <span v-else class="th__sort--neutral">⇅</span>
                  </span>
                </div>
              </th>
              <th>Corredor</th>
              <th>Classe</th>
              <th>Status Leitura</th>
              <th>Usuário</th>
              <th>Dias sem Venda</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="produto in pageProducts"
              :key="`row-${produto.id}`"
              class="products-table__row"
            >
              <td
                class="td--name"
                :title="produto.nomeOriginal || produto.nome"
              >
                {{ produto.nome }}
              </td>
              <td class="td--mono">{{ produto.ean }}</td>
              <td class="td--num">{{ produto.quantidade }}</td>
              <td>{{ produto.corredor }}</td>
              <td>{{ produto.classe }}</td>
              <td>
                <span
                  class="badge"
                  :class="produto.lido ? 'badge--ok' : 'badge--err'"
                  >{{ produto.lido ? "Lido" : "Não Lido" }}</span
                >
              </td>
              <td class="td--user">
                {{ produto.lido ? produto._usuario || "—" : "—" }}
              </td>
              <td>
                <span class="badge" :class="getAuditStatusClass(produto._audit)"
                  >{{ formatAuditStatus(produto._audit) }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="pagination">
        <span class="pagination__info">
          Mostrando
          <strong
            >{{ formatNumber(rangeStart) }}–{{ formatNumber(rangeEnd) }}</strong
          >
          de <strong>{{ formatNumber(filteredTotal) }}</strong>
        </span>
        <div class="pagination__controls">
          <button
            class="pagination__btn"
            @click="currentPage = 1"
            :disabled="currentPage === 1"
            title="Primeira"
          >
            «
          </button>
          <button
            class="pagination__btn"
            @click="currentPage--"
            :disabled="currentPage === 1"
            title="Anterior"
          >
            ‹
          </button>
          <button
            v-for="p in paginationPages"
            :key="p"
            class="pagination__btn"
            :class="{ 'is-active': p === currentPage }"
            @click="currentPage = p"
          >
            {{ p }}
          </button>
          <button
            class="pagination__btn"
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            title="Próxima"
          >
            ›
          </button>
          <button
            class="pagination__btn"
            @click="currentPage = totalPages"
            :disabled="currentPage === totalPages"
            title="Última"
          >
            »
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import jsPDF from "jspdf";
import EtiquetaSvg from "@/assets/svg/Etiqueta.svg";
import PresencaSvg from "@/assets/svg/Presenca.svg";
import RupturaSvg from "@/assets/svg/Ruptura.svg";
import { useLojaStore } from "@/store/lojaStore";
import { storeToRefs } from "pinia";

// --- STORE ---
const lojaStore = useLojaStore();
const { lojaSelecionada } = storeToRefs(lojaStore);

// --- STATE ---
const loading = ref(true);
const ultimaAtualizacao = ref(null);
const infoCache = ref(null);
const produtos = ref([]);

// Filtros
const tipoAuditoria = ref("etiqueta");
const statusLeitura = ref("todos");
const classeSelecionada = ref("todas");
const corredorSelecionado = ref("todos");
const diasSemVendaFiltro = ref("todos");
const usuarioFiltro = ref("todos");
const ordenacaoQuantidade = ref(null);

// Busca + paginação
const searchInput = ref("");
const searchQuery = ref("");
let searchTimer = null;
watch(searchInput, (v) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchQuery.value = (v || "").trim().toLowerCase();
  }, 200);
});

const pageSize = ref(50);
const currentPage = ref(1);

// Tipos de auditoria (config)
const tiposAuditoria = [
  { value: "etiqueta", label: "Etiqueta", icon: EtiquetaSvg },
  { value: "presenca", label: "Presença", icon: PresencaSvg },
  { value: "ruptura", label: "Ruptura", icon: RupturaSvg },
];

// --- COMPUTED: listas únicas (recalcula só quando produtos/tipo muda) ---
const produtosBaseTipo = computed(() => {
  const tipo = tipoAuditoria.value;
  const out = [];
  for (const p of produtos.value) {
    const audit = p.auditorias?.[tipo];
    if (!audit || audit.status === "N/A") continue;
    if (
      tipo === "etiqueta" &&
      typeof audit.status !== "number" &&
      !audit.diasSemVenda
    ) {
      continue;
    }
    // anexa _audit e _usuario para reuso (uma vez por produto/tipo)
    p._audit = audit;
    p._usuario =
      audit.usuarioLeitura ||
      audit.usuario ||
      audit.usuarioNome ||
      p.usuarioLeitura ||
      p.usuario ||
      p.usuarioNome ||
      "";
    out.push(p);
  }
  return out;
});

const corredores = computed(() => {
  const set = new Set();
  for (const p of produtosBaseTipo.value) if (p.corredor) set.add(p.corredor);
  return [...set].sort();
});

const classes = computed(() => {
  const set = new Set();
  for (const p of produtosBaseTipo.value) if (p.classe) set.add(p.classe);
  return [...set].sort();
});

const usuarios = computed(() => {
  const set = new Set();
  for (const p of produtosBaseTipo.value) {
    if (p.lido && p._usuario) set.add(p._usuario);
  }
  return [...set].sort();
});

// --- COMPUTED: filtros ativos ---
const filtrosAtivos = computed(() => {
  const filtros = [];
  if (statusLeitura.value !== "todos") {
    filtros.push({
      key: "statusLeitura",
      label: "Status",
      value: statusLeitura.value === "lido" ? "Lidos" : "Não Lidos",
    });
  }
  if (classeSelecionada.value !== "todas")
    filtros.push({
      key: "classe",
      label: "Classe",
      value: classeSelecionada.value,
    });
  if (corredorSelecionado.value !== "todos")
    filtros.push({
      key: "corredor",
      label: "Corredor",
      value: corredorSelecionado.value,
    });
  if (diasSemVendaFiltro.value !== "todos")
    filtros.push({
      key: "diasSemVenda",
      label: "Dias",
      value: diasSemVendaFiltro.value,
    });
  if (usuarioFiltro.value !== "todos")
    filtros.push({
      key: "usuario",
      label: "Usuário",
      value: usuarioFiltro.value,
    });
  if (searchQuery.value)
    filtros.push({ key: "busca", label: "Busca", value: searchQuery.value });
  return filtros;
});

// --- COMPUTED: produtos filtrados ---
const filteredProducts = computed(() => {
  const base = produtosBaseTipo.value;
  if (base.length === 0) return [];

  const q = searchQuery.value;
  const stat = statusLeitura.value;
  const classe = classeSelecionada.value;
  const corredor = corredorSelecionado.value;
  const dias = diasSemVendaFiltro.value;
  const userF = usuarioFiltro.value;
  const userActive = userF !== "todos";

  const out = [];
  for (const p of base) {
    // Busca textual
    if (q) {
      const nome = (p.nomeOriginal || p.nome || "").toLowerCase();
      const ean = (p.ean || "").toLowerCase();
      if (!nome.includes(q) && !ean.includes(q)) continue;
    }

    // Status leitura
    if (userActive) {
      if (!p.lido) continue;
    } else if (stat === "lido" && !p.lido) continue;
    else if (stat === "nao_lido" && p.lido) continue;

    if (classe !== "todas" && p.classe !== classe) continue;
    if (corredor !== "todos" && p.corredor !== corredor) continue;

    // Dias sem venda
    if (dias !== "todos") {
      const audit = p._audit;
      const v = audit?.diasSemVenda ?? audit?.status ?? 0;
      if (typeof v === "number") {
        if (dias === "1-5" && (v < 1 || v > 5)) continue;
        else if (dias === "6-9" && (v < 6 || v > 9)) continue;
        else if (dias === "10+" && v < 10) continue;
      }
    }

    if (userActive && p._usuario !== userF) continue;

    out.push(p);
  }

  // Ordenação
  if (ordenacaoQuantidade.value === "asc") {
    out.sort((a, b) => a.quantidade - b.quantidade);
  } else if (ordenacaoQuantidade.value === "desc") {
    out.sort((a, b) => b.quantidade - a.quantidade);
  }

  return out;
});

const filteredTotal = computed(() => filteredProducts.value.length);

// --- COMPUTED: estatísticas ---
const stats = computed(() => {
  let lidos = 0;
  for (const p of filteredProducts.value) if (p.lido) lidos++;
  const total = filteredProducts.value.length;
  const cobertura = total > 0 ? Math.round((lidos / total) * 100) : 0;
  return { total, lidos, naoLidos: total - lidos, cobertura };
});

// --- COMPUTED: paginação ---
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTotal.value / pageSize.value))
);

watch(totalPages, (n) => {
  if (currentPage.value > n) currentPage.value = n;
});
watch(
  [
    tipoAuditoria,
    statusLeitura,
    classeSelecionada,
    corredorSelecionado,
    diasSemVendaFiltro,
    usuarioFiltro,
    searchQuery,
    pageSize,
  ],
  () => {
    currentPage.value = 1;
  }
);

const pageProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredProducts.value.slice(start, start + pageSize.value);
});

const rangeStart = computed(() =>
  filteredTotal.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
);
const rangeEnd = computed(() =>
  Math.min(currentPage.value * pageSize.value, filteredTotal.value)
);

const paginationPages = computed(() => {
  const total = totalPages.value;
  const cur = currentPage.value;
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, cur - Math.floor(maxVisible / 2));
  let end = Math.min(total, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const horaUltimaAtualizacao = computed(() =>
  ultimaAtualizacao.value
    ? ultimaAtualizacao.value.toLocaleTimeString("pt-BR")
    : ""
);

// --- HELPERS ---
const formatNumber = (n) =>
  typeof n === "number" ? n.toLocaleString("pt-BR") : n;

const formatAuditStatus = (audit) => {
  if (!audit) return "N/A";
  if (typeof audit.status === "number") return `${audit.status} dias`;
  if (audit.status) return String(audit.status).replace(/_/g, " ").toUpperCase();
  return audit.situacao || "N/A";
};

const getAuditStatusClass = (audit) => {
  if (!audit) return "badge--neutral";
  const status = audit.situacao || audit.status;
  if (typeof status === "number") {
    if (status <= 5) return "badge--ok";
    if (status <= 9) return "badge--warn";
    return "badge--err";
  }
  if (status === "ok" || status === "presente" || status === "Atualizado")
    return "badge--ok";
  if (
    status === "ruptura" ||
    status === "ausente" ||
    status === "Sem Presença e Com Estoque" ||
    status === "Não lido"
  )
    return "badge--err";
  if (status === "divergente" || status === "Desatualizado")
    return "badge--warn";
  return "badge--neutral";
};

const alternarOrdenacaoQuantidade = () => {
  ordenacaoQuantidade.value =
    ordenacaoQuantidade.value === null
      ? "desc"
      : ordenacaoQuantidade.value === "desc"
      ? "asc"
      : null;
};

const removerFiltro = (key) => {
  switch (key) {
    case "statusLeitura":
      statusLeitura.value = "todos";
      break;
    case "classe":
      classeSelecionada.value = "todas";
      break;
    case "corredor":
      corredorSelecionado.value = "todos";
      break;
    case "diasSemVenda":
      diasSemVendaFiltro.value = "todos";
      break;
    case "usuario":
      usuarioFiltro.value = "todos";
      break;
    case "busca":
      searchInput.value = "";
      searchQuery.value = "";
      break;
  }
};

const limparFiltros = () => {
  statusLeitura.value = "todos";
  classeSelecionada.value = "todas";
  corredorSelecionado.value = "todos";
  diasSemVendaFiltro.value = "todos";
  usuarioFiltro.value = "todos";
  ordenacaoQuantidade.value = null;
  searchInput.value = "";
  searchQuery.value = "";
};

// --- PDF ---
const compartilhar = () => {
  const doc = new jsPDF();
  const lista = filteredProducts.value;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text("Relatório de Produtos", 20, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Gerado em: ${new Date().toLocaleDateString(
      "pt-BR"
    )} às ${new Date().toLocaleTimeString("pt-BR")}`,
    20,
    30
  );

  let y = 42;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Filtros Aplicados", 20, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(`• Tipo: ${tipoAuditoria.value}`, 24, y);
  y += 5;
  doc.text(`• Status: ${statusLeitura.value}`, 24, y);
  y += 5;
  doc.text(`• Classe: ${classeSelecionada.value}`, 24, y);
  y += 5;
  doc.text(`• Corredor: ${corredorSelecionado.value}`, 24, y);
  y += 5;
  doc.text(`• Dias: ${diasSemVendaFiltro.value}`, 24, y);
  y += 5;
  doc.text(`• Usuário: ${usuarioFiltro.value}`, 24, y);
  y += 5;
  if (searchQuery.value) {
    doc.text(`• Busca: ${searchQuery.value}`, 24, y);
    y += 5;
  }
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${lista.length} produtos`, 20, y);
  y += 8;

  // Cabeçalho
  doc.setFillColor(99, 102, 241);
  doc.rect(20, y - 5, 170, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text("Produto", 22, y);
  doc.text("Código", 80, y);
  doc.text("Qtd", 110, y);
  doc.text("Corredor", 124, y);
  doc.text("Classe", 148, y);
  doc.text("Status", 175, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  let linha = 0;
  for (const p of lista) {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    if (linha % 2 === 0) {
      doc.setFillColor(245, 247, 250);
      doc.rect(20, y - 4, 170, 6, "F");
    }
    doc.text((p.nome || "").substring(0, 28), 22, y);
    doc.text((p.ean || "").toString(), 80, y);
    doc.text(String(p.quantidade ?? 0), 110, y);
    doc.text((p.corredor || "").substring(0, 10), 124, y);
    doc.text((p.classe || "").substring(0, 12), 148, y);
    doc.text(formatAuditStatus(p._audit).substring(0, 12), 175, y);
    y += 6;
    linha++;
  }

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Sistema de Auditoria · Relatório Automatizado",
    20,
    doc.internal.pageSize.getHeight() - 10
  );
  doc.save(`relatorio-produtos-${Date.now()}.pdf`);
};

// --- DATA LOAD ---
const carregarDadosReais = async (forcarRecarregar = false) => {
  try {
    loading.value = true;
    const lojaId =
      lojaSelecionada.value?._id || lojaSelecionada.value?.codigo || "105";

    const produtosPorTipo = await lojaStore.obterProdutosAuditoria(
      lojaId,
      forcarRecarregar
    );

    infoCache.value = lojaStore.getInfoCache(lojaId);
    ultimaAtualizacao.value = new Date();

    const processar = (arr, tipo) => {
      if (!Array.isArray(arr)) return [];
      return arr.map((produto, index) => {
        const nomeProduto = produto.nome || `Produto ${index + 1}`;
        const codigoProduto = produto.codigo || `COD${index + 1}`;
        const quantidadeProduto =
          parseInt(produto.estoque) ||
          parseInt(produto.estoqueAtual) ||
          parseInt(produto.estoqueLeitura) ||
          0;
        const localProduto = produto.local || "N/A";
        const classeProduto =
          produto.classe ||
          produto.classeProduto ||
          produto.classeProdutoRaiz ||
          "N/A";
        const situacaoProduto =
          produto.situacao || produto.situacaoAuditoria || "Não lido";
        const produtoLido =
          situacaoProduto === "Atualizado" ||
          (produto.auditadoDia && produto.auditadoDia !== "");
        const usuarioAuditoria =
          produto.usuarioLeitura ||
          produto.usuario ||
          produto.usuarioNome ||
          "N/A";
        const dataAuditoria =
          produto.auditadoDia ||
          produto.dataAuditoria ||
          new Date().toISOString();
        const auditObj = {
          status: produto.diasSemVenda || 0,
          diasSemVenda: produto.diasSemVenda || 0,
          data: dataAuditoria,
          usuario: usuarioAuditoria,
          usuarioLeitura: produto.usuarioLeitura || usuarioAuditoria,
          usuarioNome: produto.usuarioNome || usuarioAuditoria,
          situacao: situacaoProduto,
          ...(tipo === "presenca" ? { presenca: produto.presenca } : {}),
        };
        return {
          id: `${tipo}-${codigoProduto}-${index}`,
          nome:
            nomeProduto.length > 30
              ? nomeProduto.substring(0, 30) + "…"
              : nomeProduto,
          nomeOriginal: nomeProduto,
          ean: codigoProduto,
          quantidade: quantidadeProduto,
          corredor: localProduto,
          classe: classeProduto,
          lido: produtoLido,
          auditorias: {
            etiqueta: tipo === "etiqueta" ? auditObj : { status: "N/A" },
            presenca: tipo === "presenca" ? auditObj : { status: "N/A" },
            ruptura: tipo === "ruptura" ? auditObj : { status: "N/A" },
          },
        };
      });
    };

    const dadosE = processar(produtosPorTipo.etiqueta || [], "etiqueta");
    const dadosP = processar(produtosPorTipo.presenca || [], "presenca");
    const dadosR = processar(produtosPorTipo.ruptura || [], "ruptura");

    // Mesclar por EAN
    const mapa = new Map();
    for (const p of [...dadosE, ...dadosP, ...dadosR]) {
      const k = p.ean;
      if (!mapa.has(k)) {
        mapa.set(k, p);
        continue;
      }
      const ex = mapa.get(k);
      for (const t of ["etiqueta", "presenca", "ruptura"]) {
        const novo = p.auditorias[t];
        if (novo && novo.status !== "N/A" && novo.status !== 0) {
          ex.auditorias[t] = { ...novo };
        }
      }
      if (p.lido) ex.lido = true;
      if (p.quantidade > ex.quantidade) ex.quantidade = p.quantidade;
      if (ex.corredor === "N/A" && p.corredor !== "N/A") ex.corredor = p.corredor;
      if (ex.classe === "N/A" && p.classe !== "N/A") ex.classe = p.classe;
    }

    produtos.value = Array.from(mapa.values());
  } catch (err) {
    console.error("❌ Erro ao carregar dados:", err);
    produtos.value = [];
  } finally {
    loading.value = false;
  }
};

const forcarAtualizacao = () => carregarDadosReais(true);

watch(
  () => lojaSelecionada.value,
  (nova, anterior) => {
    if (nova && nova.codigo !== anterior?.codigo) carregarDadosReais();
  }
);

onMounted(() => carregarDadosReais());
</script>

<style scoped>
/* ============================================
   LAYOUT
   ============================================ */
.corredores-view {
  padding: 1.75rem;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  font-family: "Inter", "Segoe UI", system-ui, sans-serif;
  color: #0f172a;
}

/* ============================================
   HEADER
   ============================================ */
.page-header {
  margin-bottom: 1.5rem;
}
.page-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.page-header__eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6366f1;
  margin-bottom: 0.25rem;
}
.page-header__title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  color: #0f172a;
  letter-spacing: -0.02em;
}
.page-header__loja {
  color: #6366f1;
  font-weight: 700;
}
.page-header__subtitle {
  margin: 0.4rem 0 0;
  color: #64748b;
  font-size: 0.95rem;
}
.page-header__actions {
  display: flex;
  gap: 0.6rem;
  flex-shrink: 0;
}

/* ============================================
   BUTTONS
   ============================================ */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.1rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
  font-family: inherit;
}
.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.btn__icon {
  display: inline-block;
  font-size: 1rem;
}
.btn__icon.spinning {
  animation: spin 1s linear infinite;
}
.btn--primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}
.btn--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
}
.btn--ghost {
  background: #fff;
  color: #475569;
  border: 1px solid #e2e8f0;
}
.btn--ghost:hover:not(:disabled) {
  border-color: #cbd5e1;
  background: #f8fafc;
}
.btn--soft {
  background: #f1f5f9;
  color: #475569;
}
.btn--soft:hover {
  background: #e2e8f0;
}

/* ============================================
   STATS GRID
   ============================================ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.1rem 1.25rem;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.7);
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}
.stat-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 700;
  flex-shrink: 0;
}
.stat-card--total .stat-card__icon {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
}
.stat-card--ok .stat-card__icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
}
.stat-card--warn .stat-card__icon {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  color: #fff;
}
.stat-card--coverage .stat-card__icon {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  color: #fff;
}
.stat-card__body {
  flex: 1;
  min-width: 0;
}
.stat-card__value {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #0f172a;
  line-height: 1.1;
}
.stat-card__label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
  margin-top: 0.15rem;
}
.stat-card__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #e2e8f0;
}
.stat-card__bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #06b6d4, #6366f1);
  transition: width 0.4s ease;
}

/* ============================================
   FILTERS CARD
   ============================================ */
.filters-card {
  background: #fff;
  padding: 1.4rem;
  border-radius: 16px;
  margin-bottom: 1.25rem;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.7);
}
.filters-card__row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.filters-card__label {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #475569;
}

.segmented {
  display: inline-flex;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
  gap: 2px;
}
.segmented__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 9px;
  transition: all 0.2s ease;
  font-family: inherit;
}
.segmented__btn:hover {
  color: #334155;
}
.segmented__btn.is-active {
  background: #fff;
  color: #6366f1;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
}
.segmented__icon {
  width: 18px;
  height: 18px;
}

.search-input {
  position: relative;
  display: flex;
  align-items: center;
}
.search-input__icon {
  position: absolute;
  left: 14px;
  font-size: 0.95rem;
  color: #94a3b8;
  pointer-events: none;
}
.search-input input {
  width: 100%;
  padding: 0.7rem 2.5rem 0.7rem 2.4rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.92rem;
  background: #f8fafc;
  color: #0f172a;
  font-family: inherit;
  transition: all 0.15s ease;
}
.search-input input:focus {
  outline: none;
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}
.search-input__clear {
  position: absolute;
  right: 8px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: #e2e8f0;
  color: #64748b;
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.search-input__clear:hover {
  background: #cbd5e1;
  color: #1e293b;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.85rem;
  margin-bottom: 1rem;
}
.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.filter-item__label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #475569;
}
.filter-item select {
  width: 100%;
  padding: 0.6rem 0.85rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #1e293b;
  font-size: 0.9rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}
.filter-item select:hover {
  border-color: #cbd5e1;
}
.filter-item select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.filters-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
  gap: 1rem;
  flex-wrap: wrap;
}
.filters-card__info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.filters-card__count {
  font-size: 0.92rem;
  color: #475569;
}
.filters-card__count strong {
  color: #0f172a;
  font-weight: 700;
}

.cache-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.7rem;
  background: #ecfdf5;
  color: #047857;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
}
.cache-pill__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}
.cache-pill--expired {
  background: #fffbeb;
  color: #b45309;
}
.cache-pill--expired .cache-pill__dot {
  background: #f59e0b;
}

/* ============================================
   ACTIVE TAGS
   ============================================ */
.active-tags {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}
.active-tags__label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748b;
}
.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.45rem 0.35rem 0.85rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.25);
  font-family: inherit;
}
.tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}
.tag__label {
  line-height: 1;
}
.tag__remove {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  font-size: 0.65rem;
  font-weight: 700;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ============================================
   PRODUCTS TABLE
   ============================================ */
.products-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.7);
  overflow: hidden;
}
.products-table-wrapper {
  overflow-x: auto;
  max-height: calc(100vh - 360px);
  min-height: 400px;
}
.products-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.products-table thead {
  position: sticky;
  top: 0;
  z-index: 2;
}
.products-table th {
  padding: 0.85rem 1rem;
  text-align: left;
  background: #f8fafc;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}
.th--sortable {
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}
.th--sortable:hover {
  background: #eef2ff;
}
.th__inner {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.th__sort {
  color: #6366f1;
  font-weight: 700;
}
.th__sort--neutral {
  color: #cbd5e1;
}

.products-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
  vertical-align: middle;
}
.products-table__row {
  transition: background 0.12s ease;
}
.products-table__row:hover {
  background: #f8fafc;
}
.products-table__row:last-child td {
  border-bottom: none;
}

.td--name {
  font-weight: 500;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.td--mono {
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.84rem;
  color: #475569;
}
.td--num {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
.td--user {
  color: #475569;
  font-size: 0.88rem;
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.22rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.badge--ok {
  background: #ecfdf5;
  color: #047857;
}
.badge--err {
  background: #fef2f2;
  color: #b91c1c;
}
.badge--warn {
  background: #fffbeb;
  color: #b45309;
}
.badge--neutral {
  background: #f1f5f9;
  color: #475569;
}

/* ============================================
   PAGINATION
   ============================================ */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  border-top: 1px solid #f1f5f9;
  background: #fafafa;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.pagination__info {
  font-size: 0.85rem;
  color: #64748b;
}
.pagination__info strong {
  color: #0f172a;
  font-weight: 700;
}
.pagination__controls {
  display: flex;
  gap: 4px;
}
.pagination__btn {
  min-width: 34px;
  height: 34px;
  padding: 0 0.6rem;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}
.pagination__btn:hover:not(:disabled):not(.is-active) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}
.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.pagination__btn.is-active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
}

/* ============================================
   SKELETON
   ============================================ */
.skeleton-row {
  display: grid;
  grid-template-columns: 2fr 1.2fr 0.7fr 1fr 1.2fr 0.9fr;
  gap: 1rem;
  padding: 0.95rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
}
.skeleton-block {
  height: 14px;
  background: linear-gradient(
    90deg,
    #f1f5f9 0%,
    #e2e8f0 50%,
    #f1f5f9 100%
  );
  background-size: 200% 100%;
  border-radius: 6px;
  animation: shimmer 1.4s infinite;
}
.skeleton-block--xs {
  width: 40%;
}
.skeleton-block--sm {
  width: 60%;
}
.skeleton-block--md {
  width: 85%;
}

/* ============================================
   EMPTY STATE
   ============================================ */
.empty-state {
  text-align: center;
  padding: 3.5rem 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  border: 2px dashed #e2e8f0;
  max-width: 600px;
  margin: 2rem auto;
}
.empty-state__icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}
.empty-state h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.4rem;
}
.empty-state p {
  color: #64748b;
  margin: 0.25rem 0;
  line-height: 1.5;
}
.empty-state__hint {
  font-size: 0.92rem;
  margin-bottom: 1.5rem !important;
}

/* ============================================
   ANIMATIONS
   ============================================ */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .corredores-view {
    padding: 1rem;
  }
  .page-header__title {
    font-size: 1.4rem;
  }
  .page-header__actions {
    width: 100%;
  }
  .page-header__actions .btn {
    flex: 1;
    justify-content: center;
  }
  .segmented {
    width: 100%;
  }
  .segmented__btn {
    flex: 1;
    justify-content: center;
    padding: 0.5rem 0.6rem;
  }
  .stat-card__value {
    font-size: 1.3rem;
  }
}
</style>
