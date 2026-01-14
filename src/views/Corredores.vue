<template>
  <div class="product-browser-container">
    <header class="browser-header">
      <h1>Status Auditoria Loja {{ lojaSelecionada?.codigo || "" }}</h1>
      <p>
        Explore, filtre e monitore o status dos produtos por corredor com
        insights em tempo real.
      </p>
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
                <img :src="EtiquetaSvg" alt="Etiqueta" class="btn-icon" />
                Etiqueta
              </button>
              <button
                :class="{ active: tipoAuditoria === 'presenca' }"
                @click="tipoAuditoria = 'presenca'"
              >
                <img :src="PresencaSvg" alt="Presença" class="btn-icon" />
                Presença
              </button>
              <button
                :class="{ active: tipoAuditoria === 'ruptura' }"
                @click="tipoAuditoria = 'ruptura'"
              >
                <img :src="RupturaSvg" alt="Ruptura" class="btn-icon" />
                Ruptura
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

          <div class="filter-item">
            <label for="usuario-filter" class="filter-label">Usuário</label>
            <select id="usuario-filter" v-model="usuarioFiltro">
              <option value="todos">Todos os Usuários</option>
              <option
                v-for="usuario in usuarios"
                :key="usuario"
                :value="usuario"
              >
                {{ usuario }}
              </option>
            </select>
          </div>

          <div class="filter-item">
            <label for="dias-sem-venda-filter" class="filter-label"
              >Dias sem Venda</label
            >
            <select id="dias-sem-venda-filter" v-model="diasSemVendaFiltro">
              <option value="todos">Todos</option>
              <option value="1-5">1-5 dias</option>
              <option value="6-9">6-9 dias</option>
              <option value="10+">10+ dias</option>
            </select>
          </div>
        </div>
      </div>

      <div class="filters-footer">
        <div class="footer-left">
          <span class="results-count"
            >{{ filteredProducts.length }} produtos encontrados</span
          >
          <span
            v-if="infoCache"
            class="cache-info"
            :class="{ expired: !infoCache.valido }"
          >
            📦 Cache: {{ infoCache.idade }}
            {{ infoCache.valido ? "✅" : "⚠️" }}
          </span>
        </div>
        <div class="footer-actions">
          <button
            class="action-btn refresh-btn"
            @click="forcarAtualizacao"
            :disabled="loading"
          >
            <span v-if="!loading">🔄 Atualizar</span>
            <span v-else>⏳ Carregando...</span>
          </button>
          <button class="action-btn share-btn" @click="compartilhar">
            Baixar Relatório
          </button>
          <button class="action-btn clear-btn" @click="limparFiltros">
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Filtros Ativos -->
    <div v-if="filtrosAtivos.length > 0" class="active-filters">
      <span class="active-filters-label">Filtros ativos:</span>
      <div class="filters-tags">
        <span
          v-for="filtro in filtrosAtivos"
          :key="filtro.key"
          class="filter-tag"
        >
          <span class="tag-label">{{ filtro.label }}: {{ filtro.value }}</span>
          <button
            class="tag-remove"
            @click="removerFiltro(filtro.key)"
            :title="`Remover filtro ${filtro.label}`"
          >
            ✕
          </button>
        </span>
      </div>
    </div>

    <!-- Indicadores -->
    <div v-if="loading" class="loading-indicator">Carregando produtos...</div>
    <div v-if="!loading && filteredProducts.length === 0" class="no-results">
      <div class="no-results-icon">📦</div>
      <h3>Nenhum produto encontrado</h3>
      <p>Não há produtos que correspondam aos filtros aplicados.</p>
      <p class="suggestion">
        Tente ajustar os filtros ou faça o upload de uma nova planilha de
        auditoria.
      </p>
      <router-link to="/selecionar-auditoria" class="upload-link">
        <button class="upload-btn">📤 Fazer Upload de Planilha</button>
      </router-link>
    </div>

    <!-- Tabela de Produtos (Lista) -->
    <div
      v-if="!loading && filteredProducts.length > 0"
      class="products-list-container"
    >
      <table class="products-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Código do Produto</th>
            <th class="sortable-header" @click="alternarOrdenacaoQuantidade">
              <div class="header-content">
                <span>Quantidade</span>
                <span class="sort-indicator">
                  <span v-if="ordenacaoQuantidade === 'desc'" class="arrow"
                    >↓</span
                  >
                  <span v-else-if="ordenacaoQuantidade === 'asc'" class="arrow"
                    >↑</span
                  >
                  <span v-else class="arrow-neutral">⇅</span>
                </span>
              </div>
            </th>
            <th>Corredor</th>
            <th>Classe</th>
            <th>Status Leitura</th>
            <th>Usuário</th>
            <th>{{ tipoAuditoriaFormatado }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="produto in filteredProducts" :key="`list-${produto.id}`">
            <td :title="produto.nomeOriginal || produto.nome">
              {{ produto.nome }}
            </td>
            <td>{{ produto.ean }}</td>
            <td>{{ produto.quantidade }}</td>
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
              <span class="user-info" v-if="produto.lido">
                {{
                  produto.auditorias[tipoAuditoria]?.usuarioLeitura ||
                  produto.auditorias[tipoAuditoria]?.usuario ||
                  produto.auditorias[tipoAuditoria]?.usuarioNome ||
                  produto.usuarioLeitura ||
                  produto.usuario ||
                  produto.usuarioNome ||
                  "N/A"
                }}
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

// Filtros
const tipoAuditoria = ref("etiqueta"); // 'etiqueta', 'presenca', 'ruptura'
const statusLeitura = ref("todos"); // 'todos', 'lido', 'nao_lido'
const classeSelecionada = ref("todas");
const corredorSelecionado = ref("todos");
const diasSemVendaFiltro = ref("todos"); // 'todos', '1-5', '6-9', '10+'
const usuarioFiltro = ref("todos"); // 'todos' ou nome do usuário
const ordenacaoQuantidade = ref(null); // null, 'asc', 'desc'

const produtos = ref([]);

// --- COMPUTED ---
const tipoAuditoriaFormatado = computed(() => {
  return "Dias sem Venda";
});

const corredores = computed(() =>
  [...new Set(produtos.value.map((p) => p.corredor))].sort()
);
const classes = computed(() =>
  [...new Set(produtos.value.map((p) => p.classe))].sort()
);
const usuarios = computed(() =>
  [
    ...new Set(
      produtos.value
        .filter((p) => p.lido)
        .map((p) => {
          // Obter o usuário do tipo de auditoria atual
          const audit = p.auditorias[tipoAuditoria.value];
          return (
            audit?.usuarioLeitura ||
            audit?.usuario ||
            audit?.usuarioNome ||
            p.usuarioLeitura ||
            p.usuario ||
            p.usuarioNome
          );
        })
        .filter((u) => u)
    ),
  ].sort()
);

const filtrosAtivos = computed(() => {
  const filtros = [];

  if (statusLeitura.value !== "todos") {
    filtros.push({
      key: "statusLeitura",
      label: "Status Leitura",
      value: statusLeitura.value === "lido" ? "Lidos" : "Não Lidos",
    });
  }

  if (classeSelecionada.value !== "todas") {
    filtros.push({
      key: "classe",
      label: "Classe",
      value: classeSelecionada.value,
    });
  }

  if (corredorSelecionado.value !== "todos") {
    filtros.push({
      key: "corredor",
      label: "Corredor",
      value: corredorSelecionado.value,
    });
  }

  if (diasSemVendaFiltro.value !== "todos") {
    filtros.push({
      key: "diasSemVenda",
      label: "Dias sem Venda",
      value: diasSemVendaFiltro.value + " dias",
    });
  }

  if (usuarioFiltro.value !== "todos") {
    filtros.push({
      key: "usuario",
      label: "Usuário",
      value: usuarioFiltro.value,
    });
  }

  return filtros;
});

const filteredProducts = computed(() => {
  if (loading.value) return [];

  let produtosFiltrados = produtos.value.filter((produto) => {
    // Verificar se o produto tem dados do tipo de auditoria selecionado
    const audit = produto.auditorias[tipoAuditoria.value];

    // Verificar se tem dados válidos para o tipo selecionado
    if (!audit || audit.status === "N/A") {
      return false;
    }

    // Para etiqueta, aceitar status 0 ou maior (dias sem venda pode ser 0)
    if (tipoAuditoria.value === "etiqueta") {
      if (typeof audit.status !== "number" && !audit.diasSemVenda) {
        return false;
      }
    }

    // Se um usuário específico for selecionado, apenas produtos lidos
    const leituraOk =
      usuarioFiltro.value !== "todos"
        ? produto.lido
        : statusLeitura.value === "todos" ||
          (statusLeitura.value === "lido" && produto.lido) ||
          (statusLeitura.value === "nao_lido" && !produto.lido);

    const classeOk =
      classeSelecionada.value === "todas" ||
      produto.classe === classeSelecionada.value;

    const corredorOk =
      corredorSelecionado.value === "todos" ||
      produto.corredor === corredorSelecionado.value;

    const diasOk = (() => {
      if (diasSemVendaFiltro.value === "todos") return true;

      const dias = audit?.diasSemVenda || audit?.status || 0;
      if (typeof dias !== "number") return true;

      if (diasSemVendaFiltro.value === "1-5") return dias >= 1 && dias <= 5;
      if (diasSemVendaFiltro.value === "6-9") return dias >= 6 && dias <= 9;
      if (diasSemVendaFiltro.value === "10+") return dias >= 10;
      return true;
    })();

    const usuarioOk =
      usuarioFiltro.value === "todos" ||
      audit?.usuarioLeitura === usuarioFiltro.value ||
      audit?.usuario === usuarioFiltro.value ||
      audit?.usuarioNome === usuarioFiltro.value;

    return leituraOk && classeOk && corredorOk && diasOk && usuarioOk;
  });

  // Aplicar ordenação por quantidade se selecionada
  if (ordenacaoQuantidade.value === "asc") {
    produtosFiltrados.sort((a, b) => a.quantidade - b.quantidade);
  } else if (ordenacaoQuantidade.value === "desc") {
    produtosFiltrados.sort((a, b) => b.quantidade - a.quantidade);
  }

  return produtosFiltrados;
});

// --- METHODS ---
const gerarMockData = () => {
  const nomes = [
    "Maçã",
    "Arroz",
    "Feijão",
    "Biscoito",
    "Leite",
    "Café",
    "Açucar",
    "Sal",
    "Óleo",
    "Sabonete",
  ];
  const corredoresMock = ["C-01", "C-02", "C-03", "H-01", "H-02"];
  const classesMock = [
    "SECA DOCE",
    "SECA SALGADA",
    "PERECIVEL 1",
    "FLV",
    "DPH",
    "BAZAR",
  ];
  const usuariosMock = [
    "João Silva",
    "Maria Santos",
    "Pedro Oliveira",
    "Ana Costa",
    "Carlos Pereira",
  ];
  const auditStatus = {
    etiqueta: () => Math.floor(Math.random() * 20) + 1, // Dias sem venda: 1-20
    presenca: () => Math.floor(Math.random() * 20) + 1, // Dias sem venda: 1-20
    ruptura: () => Math.floor(Math.random() * 20) + 1, // Dias sem venda: 1-20
  };

  const data = [];
  for (let i = 1; i <= 100; i++) {
    data.push({
      id: i,
      nome: `${nomes[i % nomes.length]} #${i}`,
      ean: `789000000000${i}`.slice(-13),
      quantidade: Math.floor(Math.random() * 50) + 1, // Quantidade: 1-50
      corredor: corredoresMock[i % corredoresMock.length],
      classe: classesMock[i % classesMock.length],
      lido: Math.random() > 0.4,
      auditorias: {
        etiqueta: {
          status: auditStatus.etiqueta(),
          data: new Date(2025, 11, 15 - (i % 5)).toISOString(),
          usuario: usuariosMock[i % usuariosMock.length],
        },
        presenca: {
          status: auditStatus.presenca(),
          data: new Date(2025, 11, 15 - (i % 5)).toISOString(),
          usuario: usuariosMock[i % usuariosMock.length],
        },
        ruptura: {
          status: auditStatus.ruptura(),
          data: new Date(2025, 11, 15 - (i % 5)).toISOString(),
          usuario: usuariosMock[i % usuariosMock.length],
        },
      },
    });
  }
  produtos.value = data;
  loading.value = false;
};

const formatAuditStatus = (audit) => {
  if (!audit) return "N/A";
  // Para etiqueta, mostrar dias sem venda se for número
  if (typeof audit.status === "number") return `${audit.status} dias`;
  // Para situação real do produto, retornar o status diretamente
  if (audit.status) return audit.status.replace(/_/g, " ").toUpperCase();
  // Caso contrário, tentar usar a situação do produto
  return audit.situacao || audit.status || "N/A";
};

const getAuditStatusClass = (audit) => {
  if (!audit) return "status-default";
  // Usar a situação real do produto se disponível
  const status = audit.situacao || audit.status;
  // Para etiqueta (dias sem venda)
  if (typeof status === "number") {
    if (status <= 5) return "status-ok"; // Verde
    if (status <= 9) return "status-warn"; // Amarelo
    return "status-error"; // Vermelho
  }
  // Para outros tipos - usando os valores reais da situação
  if (status === "ok" || status === "presente" || status === "Atualizado")
    return "status-ok";
  if (
    status === "ruptura" ||
    status === "ausente" ||
    status === "Sem Presença e Com Estoque" ||
    status === "Não lido"
  )
    return "status-error";
  if (status === "divergente" || status === "Desatualizado")
    return "status-warn";
  return "status-default";
};

const alternarOrdenacaoQuantidade = () => {
  if (ordenacaoQuantidade.value === null) {
    ordenacaoQuantidade.value = "desc"; // Primeiro clique: maior para menor
  } else if (ordenacaoQuantidade.value === "desc") {
    ordenacaoQuantidade.value = "asc"; // Segundo clique: menor para maior
  } else {
    ordenacaoQuantidade.value = null; // Terceiro clique: sem ordenação
  }
};

const removerFiltro = (key) => {
  switch (key) {
    case "tipoAuditoria":
      tipoAuditoria.value = "etiqueta";
      break;
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
  }
};

const limparFiltros = () => {
  statusLeitura.value = "todos";
  classeSelecionada.value = "todas";
  corredorSelecionado.value = "todos";
  diasSemVendaFiltro.value = "todos";
  usuarioFiltro.value = "todos";
  tipoAuditoria.value = "etiqueta";
  ordenacaoQuantidade.value = null;
};

const compartilhar = () => {
  const doc = new jsPDF();
  const produtosFiltrados = filteredProducts.value;

  // Configurações iniciais
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("Relatório de Produto", 20, 25);

  // Data do relatório
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Gerado em: ${new Date().toLocaleDateString(
      "pt-BR"
    )} às ${new Date().toLocaleTimeString("pt-BR")}`,
    20,
    35
  );

  // Filtros aplicados
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  let y = 50;
  doc.setFont("helvetica", "bold");
  doc.text("Filtros Aplicados:", 20, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text(`• Tipo de Auditoria: ${tipoAuditoriaFormatado.value}`, 25, y);
  y += 6;
  doc.text(`• Status Leitura: ${statusLeitura.value}`, 25, y);
  y += 6;
  doc.text(`• Classe: ${classeSelecionada.value}`, 25, y);
  y += 6;
  doc.text(`• Corredor: ${corredorSelecionado.value}`, 25, y);
  y += 6;
  doc.text(`• Dias sem Venda: ${diasSemVendaFiltro.value}`, 25, y);
  y += 6;
  doc.text(`• Usuário: ${usuarioFiltro.value}`, 25, y);
  y += 15;

  // Total de produtos
  doc.setFont("helvetica", "bold");
  doc.text(`Total de Produtos: ${produtosFiltrados.length}`, 20, y);
  y += 15;

  // Cabeçalhos da tabela
  doc.setFillColor(240, 240, 240);
  doc.rect(20, y - 5, 170, 10, "F"); // Fundo cinza para cabeçalho
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("Produto", 25, y + 2);
  doc.text("Código", 75, y + 2);
  doc.text("Qtd", 105, y + 2);
  doc.text("Corredor", 125, y + 2);
  doc.text("Classe", 155, y + 2);
  doc.text("Status", 185, y + 2);
  y += 10;

  // Linha separadora
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, 190, y);
  y += 5;

  // Produtos
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  let linha = 0;
  produtosFiltrados.forEach((produto) => {
    if (y > 270) {
      // Nova página se necessário
      doc.addPage();
      y = 20;
      // Recolocar cabeçalhos na nova página
      doc.setFillColor(240, 240, 240);
      doc.rect(20, y - 5, 170, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Produto", 25, y + 2);
      doc.text("Código", 75, y + 2);
      doc.text("Qtd", 105, y + 2);
      doc.text("Qtd", 105, y + 2);
      doc.text("Corredor", 125, y + 2);
      doc.text("Classe", 155, y + 2);
      doc.text("Status", 185, y + 2);
      y += 10;
      doc.line(20, y, 190, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
    }

    // Fundo alternado para linhas
    if (linha % 2 === 0) {
      doc.setFillColor(240, 248, 255); // Azul claro
      doc.rect(20, y - 3, 170, 8, "F");
    } else {
      doc.setFillColor(255, 255, 255); // Branco
      doc.rect(20, y - 3, 170, 8, "F");
    }

    doc.text(produto.nome.substring(0, 20), 25, y + 2);
    doc.text(produto.ean, 75, y + 2);
    doc.text(produto.quantidade.toString(), 105, y + 2);
    doc.text(produto.corredor, 125, y + 2);
    doc.text(produto.classe.substring(0, 10), 155, y + 2);
    doc.text(
      formatAuditStatus(produto.auditorias[tipoAuditoria.value]).substring(
        0,
        10
      ),
      185,
      y + 2
    );
    y += 8;
    linha++;
  });

  // Rodapé
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Sistema de Auditoria - Relatório Automatizado", 20, 285);

  // Salvar o PDF
  doc.save("relatorio-produtos.pdf");
};

// --- LIFECYCLE ---
// Função para carregar dados reais da API
const carregarDadosReais = async (forcarRecarregar = false) => {
  try {
    loading.value = true;

    // Obter o ID da loja - usar o ObjectId da loja
    const lojaId =
      lojaSelecionada.value?._id || lojaSelecionada.value?.codigo || "105";

    console.log("🔄 Carregando dados para loja:", lojaId);
    console.log("📋 Loja selecionada:", lojaSelecionada.value);

    // Usar cache do Pinia
    const produtosPorTipo = await lojaStore.obterProdutosAuditoria(
      lojaId,
      forcarRecarregar
    );

    // Atualizar info do cache
    infoCache.value = lojaStore.getInfoCache(lojaId);
    ultimaAtualizacao.value = new Date();

    console.log("📊 Produtos por tipo (do cache):", {
      etiqueta: produtosPorTipo.etiqueta?.length || 0,
      presenca: produtosPorTipo.presenca?.length || 0,
      ruptura: produtosPorTipo.ruptura?.length || 0,
    });

    // Processar os dados recebidos para o formato esperado pelo componente
    const processarProdutos = (produtosArray, tipo) => {
      if (!produtosArray || !Array.isArray(produtosArray)) return [];

      return produtosArray.map((produto, index) => {
        // Nome do produto
        const nomeProduto = produto.nome || `Produto ${index + 1}`;
        const nomeFormatado =
          nomeProduto.length > 30
            ? nomeProduto.substring(0, 30) + "..."
            : nomeProduto;

        // Código do produto
        const codigoProduto = produto.codigo || `COD${index + 1}`;

        // Quantidade (estoque)
        const quantidadeProduto =
          parseInt(produto.estoque) ||
          parseInt(produto.estoqueAtual) ||
          parseInt(produto.estoqueLeitura) ||
          0;

        // Local/Corredor
        const localProduto = produto.local || "N/A";

        // Classe do produto
        const classeProduto =
          produto.classe ||
          produto.classeProduto ||
          produto.classeProdutoRaiz ||
          "N/A";

        // Determinar se o produto foi lido (auditado)
        const situacaoProduto =
          produto.situacao || produto.situacaoAuditoria || "Não lido";
        const produtoLido =
          situacaoProduto === "Atualizado" ||
          (produto.auditadoDia && produto.auditadoDia !== "");

        // Usuário que auditou
        const usuarioAuditoria =
          produto.usuarioLeitura ||
          produto.usuario ||
          produto.usuarioNome ||
          "N/A";

        // Data da auditoria
        const dataAuditoria =
          produto.auditadoDia ||
          produto.dataAuditoria ||
          new Date().toISOString();

        return {
          id: `${tipo}-${codigoProduto}-${index}`,
          nome: nomeFormatado,
          nomeOriginal: nomeProduto,
          ean: codigoProduto,
          quantidade: quantidadeProduto,
          corredor: localProduto,
          classe: classeProduto,
          lido: produtoLido,
          auditorias: {
            etiqueta:
              tipo === "etiqueta"
                ? {
                    status: produto.diasSemVenda || 0,
                    diasSemVenda: produto.diasSemVenda || 0,
                    data: dataAuditoria,
                    usuario: usuarioAuditoria,
                    usuarioLeitura: produto.usuarioLeitura || usuarioAuditoria,
                    usuarioNome: produto.usuarioNome || usuarioAuditoria,
                    situacao: situacaoProduto,
                  }
                : { status: "N/A" },
            presenca:
              tipo === "presenca"
                ? {
                    status: produto.diasSemVenda || 0,
                    diasSemVenda: produto.diasSemVenda || 0,
                    presenca: produto.presenca,
                    data: dataAuditoria,
                    usuario: usuarioAuditoria,
                    usuarioLeitura: produto.usuarioLeitura || usuarioAuditoria,
                    usuarioNome: produto.usuarioNome || usuarioAuditoria,
                    situacao: situacaoProduto,
                  }
                : { status: "N/A" },
            ruptura:
              tipo === "ruptura"
                ? {
                    status: produto.diasSemVenda || 0,
                    diasSemVenda: produto.diasSemVenda || 0,
                    data: dataAuditoria,
                    usuario: usuarioAuditoria,
                    usuarioLeitura: produto.usuarioLeitura || usuarioAuditoria,
                    usuarioNome: produto.usuarioNome || usuarioAuditoria,
                    situacao: situacaoProduto,
                  }
                : { status: "N/A" },
          },
        };
      });
    };

    // Processar dados de cada tipo
    const dadosEtiqueta = processarProdutos(
      produtosPorTipo.etiqueta || [],
      "etiqueta"
    );
    const dadosPresenca = processarProdutos(
      produtosPorTipo.presenca || [],
      "presenca"
    );
    const dadosRuptura = processarProdutos(
      produtosPorTipo.ruptura || [],
      "ruptura"
    );

    console.log("✅ Dados processados:", {
      etiqueta: dadosEtiqueta.length,
      presenca: dadosPresenca.length,
      ruptura: dadosRuptura.length,
    });

    // Combinar e deduplicar produtos por código
    const mapaProdutos = new Map();

    [...dadosEtiqueta, ...dadosPresenca, ...dadosRuptura].forEach((produto) => {
      const chave = produto.ean;

      if (!mapaProdutos.has(chave)) {
        mapaProdutos.set(chave, produto);
      } else {
        // Produto já existe, mesclar informações de auditorias
        const produtoExistente = mapaProdutos.get(chave);

        // Mesclar auditorias mantendo os dados específicos de cada tipo
        Object.keys(produto.auditorias).forEach((tipoAudit) => {
          if (
            produto.auditorias[tipoAudit].status !== 0 &&
            produto.auditorias[tipoAudit].status !== "N/A"
          ) {
            // Preservar informações do usuário ao mesclar
            const auditExistente = produtoExistente.auditorias[tipoAudit];
            const auditNovo = produto.auditorias[tipoAudit];

            produtoExistente.auditorias[tipoAudit] = {
              ...auditNovo,
              // Manter informações do usuário se já existirem e forem diferentes
              usuario: auditNovo.usuario || auditExistente.usuario || "",
              usuarioLeitura:
                auditNovo.usuarioLeitura || auditExistente.usuarioLeitura || "",
              usuarioNome:
                auditNovo.usuarioNome || auditExistente.usuarioNome || "",
            };
          }
        });

        // Atualizar lido se qualquer auditoria foi feita
        if (produto.lido) {
          produtoExistente.lido = true;
        }

        // Usar quantidade maior
        if (produto.quantidade > produtoExistente.quantidade) {
          produtoExistente.quantidade = produto.quantidade;
        }

        // Atualizar informações vazias
        if (produtoExistente.corredor === "N/A" && produto.corredor !== "N/A") {
          produtoExistente.corredor = produto.corredor;
        }
        if (produtoExistente.classe === "N/A" && produto.classe !== "N/A") {
          produtoExistente.classe = produto.classe;
        }
      }
    });

    produtos.value = Array.from(mapaProdutos.values());

    console.log("🎉 Total de produtos únicos:", produtos.value.length);

    // Mensagem informativa se não houver produtos
    if (produtos.value.length === 0) {
      console.log(
        "ℹ️ Nenhuma auditoria encontrada nos últimos 30 dias para esta loja"
      );
    }
  } catch (error) {
    console.error("❌ Erro ao carregar dados da API:", error);
    // Em caso de erro, usar dados mock como fallback
    gerarMockData();
  } finally {
    loading.value = false;
  }
};

// Forçar recarregamento (ignora cache)
const forcarAtualizacao = async () => {
  console.log("🔄 Forçando atualização dos dados...");
  await carregarDadosReais(true);
};

// Observar mudanças na loja selecionada
watch(
  () => lojaSelecionada.value,
  (novaLoja, lojaAnterior) => {
    // Só recarrega se realmente mudou de loja
    if (novaLoja && novaLoja.codigo !== lojaAnterior?.codigo) {
      console.log("🏪 Loja mudou, carregando dados...");
      carregarDadosReais();
    }
  }
);

// Carregar dados ao montar componente
onMounted(() => {
  carregarDadosReais();
});
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

.btn-icon {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-right: 0.25rem;
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

.footer-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.results-count {
  font-weight: 600;
}

.cache-info {
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  background-color: #e6f3ff;
  border-radius: 0.375rem;
  color: #2563eb;
  font-weight: 500;
}

.cache-info.expired {
  background-color: #fff5e6;
  color: #d97706;
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

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-btn {
  background-color: #10b981;
  color: white;
}
.refresh-btn:hover:not(:disabled) {
  background-color: #059669;
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

/* Filtros Ativos */
.active-filters {
  background-color: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.active-filters-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  white-space: nowrap;
}

.filters-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
  transition: all 0.2s ease;
  animation: slideIn 0.3s ease;
}

.filter-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.tag-label {
  line-height: 1;
}

.tag-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: bold;
  transition: all 0.2s ease;
  line-height: 1;
}

.tag-remove:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.tag-remove:active {
  transform: scale(0.9) rotate(90deg);
}

.loading-indicator {
  text-align: center;
  padding: 4rem 0;
  font-size: 1.25rem;
  color: #718096;
}

.no-results {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 2px dashed #cbd5e0;
  max-width: 600px;
  margin: 2rem auto;
}

.no-results-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.no-results h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.no-results p {
  font-size: 1.05rem;
  color: #718096;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.no-results .suggestion {
  color: #4a5568;
  font-weight: 500;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.upload-link {
  display: inline-block;
  text-decoration: none;
}

.upload-btn {
  position: relative;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  overflow: hidden;
}

.upload-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s;
}

.upload-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.5);
}

.upload-btn:hover::before {
  left: 100%;
}

.upload-btn:active {
  transform: translateY(-1px) scale(0.98);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.audit-status,
.read-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
}
.status-ok {
  background-color: #ebf8f2;
  color: #38a169;
}
.status-error {
  background-color: #fff5f5;
  color: #c53030;
}
.status-warn {
  background-color: #fffaf0;
  color: #dd6b20;
}
.status-default {
  background-color: #edf2f7;
  color: #4a5568;
}

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

.sortable-header {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.sortable-header:hover {
  background-color: #e6f3ff;
}

.sortable-header .header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.sort-indicator {
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
  color: #667eea;
  font-weight: bold;
}

.sort-indicator .arrow {
  color: #667eea;
  font-size: 1.2rem;
  animation: sortPulse 0.3s ease;
}

.sort-indicator .arrow-neutral {
  color: #cbd5e0;
  font-size: 1rem;
}

@keyframes sortPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
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
.products-table tbody tr:nth-child(even) {
  background-color: #f0f8ff; /* Azul claro */
}
.products-table tbody tr:nth-child(odd) {
  background-color: #ffffff; /* Branco */
}
.products-table tbody tr:hover {
  background-color: #e6f3ff;
}

.read-status.lido {
  color: #38a169;
}
.read-status.nao-lido {
  color: #e53e3e;
}
.user-info {
  color: #4a5568;
  font-weight: 500;
}
</style>
