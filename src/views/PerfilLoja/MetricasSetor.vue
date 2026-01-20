<template>
  <div class="metricas-setor-container">
    <!-- Indicador de carregamento -->
    <div v-if="carregando" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando métricas...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="erro" class="erro-container">
      <p class="erro-mensagem">{{ erro }}</p>
      <button class="action-btn" @click="buscarMetricasLoja">
        Tentar Novamente
      </button>
    </div>

    <!-- Conteúdo principal -->
    <div v-else>
      <div class="metricas-header">
        <h3>📊 Leitura Auditoria Atual Por Classe</h3>
        <div class="metricas-actions">
          <button
            class="action-btn"
            :class="{ active: tipoAuditoriaAtual === 'etiquetas' }"
            @click="alterarTipoAuditoria('etiquetas')"
          >
            Etiqueta
          </button>
          <button
            class="action-btn"
            :class="{ active: tipoAuditoriaAtual === 'presencas' }"
            @click="alterarTipoAuditoria('presencas')"
          >
            Presença
          </button>
          <button
            class="action-btn"
            :class="{ active: tipoAuditoriaAtual === 'rupturas' }"
            @click="alterarTipoAuditoria('rupturas')"
          >
            Ruptura
          </button>
        </div>
      </div>

      <div class="metricas-table-container">
        <table class="metricas-table">
          <thead>
            <tr>
              <th>Classe Produtos</th>
              <th>Desempenho</th>
              <th>Total Itens</th>
              <th>Itens Lidos</th>
              <th v-if="tipoAuditoriaAtual === 'rupturas'">Custo Ruptura</th>
              <th v-else-if="tipoAuditoriaAtual === 'presencas'">Presenças</th>
              <th v-else>Itens Atualizados</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="setor in dadosFiltrados"
              :key="setor.ClasseProduto"
              :class="getStatusLinha(setor)"
            >
              <!-- Nome / Ícone -->
              <td class="setor-cell">
                <div class="setor-info">
                  <div class="setor-icon">{{ setor.icone }}</div>
                  <span>{{ setor.ClasseProduto }}</span>
                </div>
              </td>

              <!-- Desempenho -->
              <td class="desempenho-cell">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: getPercentualLeitura(setor) + '%' }"
                    :class="getClasseDesempenho(getPercentualLeitura(setor))"
                  ></div>
                  <span class="progress-text">
                    {{ getPercentualLeitura(setor).toFixed(0) }}%
                  </span>
                </div>
              </td>

              <!-- Itens totais e lidos -->
              <td class="meta-cell">{{ setor.totalItens }}</td>
              <td class="conformidade-cell">{{ setor.itensValidos }}</td>

              <!-- Coluna dinâmica baseada no tipo de auditoria -->
              <td
                v-if="tipoAuditoriaAtual === 'rupturas'"
                class="custo-cell"
                :class="getClasseCusto(setor)"
              >
                R$ {{ formatarMoeda(setor.custoRuptura || 0) }}
              </td>
              <td
                v-else-if="tipoAuditoriaAtual === 'presencas'"
                class="presenca-cell"
              >
                {{ setor.presencasConfirmadas || 0 }}/{{
                  setor.totalItens || setor.itens
                }}
              </td>
              <td v-else class="atualizados-cell">
                {{ setor.itensLidos || 0 }}
              </td>

              <!-- Status -->
              <td class="status-cell">
                <span class="status-badge" :class="getStatusSetor(setor)">
                  {{ getStatusSetor(setor) }}
                </span>
              </td>

              <!-- Ações -->
              <td class="acoes-cell">
                <button
                  class="acao-btn"
                  @click="verDetalhesSetor(setor)"
                  title="Ver detalhes"
                >
                  👁️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resumo Estatístico -->
      <div class="resumo-estatistico">
        <div class="estatisticas-grid">
          <div class="estatistica-card">
            <div class="estatistica-valor">
              {{ percentualConclusaoGeral.toFixed(1) }}%
            </div>
            <div class="estatistica-label">Conclusão Geral</div>
          </div>
          <div class="estatistica-card">
            <div class="estatistica-valor">{{ totalItens }}</div>
            <div class="estatistica-label">Total de Itens</div>
          </div>
          <div class="estatistica-card">
            <div class="estatistica-valor">{{ itensLidos }}</div>
            <div class="estatistica-label">Itens Lidos</div>
          </div>
          <div class="estatistica-card">
            <div class="estatistica-valor">👥 {{ totalColaboradores }}</div>
            <div class="estatistica-label">Colaboradores Envolvidos</div>
          </div>
          <div
            class="estatistica-card"
            v-if="tipoAuditoriaAtual === 'etiquetas'"
          >
            <div class="estatistica-valor">{{ itensAtualizados }}</div>
            <div class="estatistica-label">Itens Atualizados</div>
          </div>
          <div
            class="estatistica-card"
            v-if="tipoAuditoriaAtual === 'rupturas'"
          >
            <div class="estatistica-valor">
              R$ {{ formatarMoeda(custoTotalRuptura) }}
            </div>
            <div class="estatistica-label">Custo Total Ruptura</div>
          </div>
          <div
            class="estatistica-card"
            v-if="tipoAuditoriaAtual === 'presencas'"
          >
            <div class="estatistica-valor">
              {{ percentualPresenca.toFixed(1) }}%
            </div>
            <div class="estatistica-label">Presenças Confirmadas</div>
          </div>
        </div>
      </div>

      <!-- Modal de Detalhes do Setor -->
      <div v-if="setorSelecionado" class="modal-overlay" @click="fecharModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Detalhes do Setor - {{ getTipoAuditoriaLabel() }}</h3>
            <button class="modal-close" @click="fecharModal">×</button>
          </div>
          <div class="modal-body">
            <div class="setor-detalhes">
              <div class="detalhe-header">
                <div class="setor-icone-grande">
                  {{ setorSelecionado.icone }}
                </div>
                <div class="setor-info-grande">
                  <h4>{{ setorSelecionado.ClasseProduto }}</h4>
                  <span
                    class="status-badge"
                    :class="getStatusSetor(setorSelecionado)"
                  >
                    {{ getStatusSetor(setorSelecionado) }}
                  </span>
                </div>
              </div>

              <div class="metricas-grid">
                <div class="metrica-item">
                  <div class="metrica-label">Desempenho</div>
                  <div class="metrica-valor">
                    {{ getPercentualLeitura(setorSelecionado).toFixed(1) }}%
                  </div>
                  <div class="progress-bar-small">
                    <div
                      class="progress-fill"
                      :style="{
                        width: getPercentualLeitura(setorSelecionado) + '%',
                      }"
                      :class="
                        getClasseDesempenho(
                          getPercentualLeitura(setorSelecionado)
                        )
                      "
                    ></div>
                  </div>
                </div>

                <div class="metrica-item">
                  <div class="metrica-label">Total de Itens</div>
                  <div class="metrica-valor">
                    {{ setorSelecionado.totalItens }}
                  </div>
                </div>

                <div class="metrica-item">
                  <div class="metrica-label">Itens Válidos</div>
                  <div class="metrica-valor">
                    {{ setorSelecionado.itensValidos }}
                  </div>
                </div>

                <div class="metrica-item">
                  <div class="metrica-label">Itens Lidos</div>
                  <div class="metrica-valor">
                    {{ setorSelecionado.itensLidos }}
                  </div>
                </div>

                <div class="metrica-item">
                  <div class="metrica-label">👥 Colaboradores</div>
                  <div class="metrica-valor">
                    {{ colaboradoresSetor.length }}
                  </div>
                </div>

                <!-- Métricas específicas por tipo de auditoria -->
                <div
                  class="metrica-item"
                  v-if="tipoAuditoriaAtual === 'etiquetas'"
                >
                  <div class="metrica-label">Itens Atualizados</div>
                  <div class="metrica-valor">
                    {{ setorSelecionado.itensAtualizados || 0 }}
                  </div>
                </div>

                <div
                  class="metrica-item"
                  v-if="tipoAuditoriaAtual === 'etiquetas'"
                >
                  <div class="metrica-label">Itens Desatualizados</div>
                  <div class="metrica-valor">
                    {{ setorSelecionado.itensDesatualizado || 0 }}
                  </div>
                </div>

                <div
                  class="metrica-item"
                  v-if="tipoAuditoriaAtual === 'rupturas'"
                >
                  <div class="metrica-label">Custo Ruptura</div>
                  <div class="metrica-valor">
                    R$ {{ formatarMoeda(setorSelecionado.custoRuptura || 0) }}
                  </div>
                </div>

                <div
                  class="metrica-item"
                  v-if="tipoAuditoriaAtual === 'presencas'"
                >
                  <div class="metrica-label">Presenças Confirmadas</div>
                  <div class="metrica-valor">
                    {{ setorSelecionado.presencasConfirmadas || 0 }}
                  </div>
                </div>
              </div>

              <!-- Seção: Colaboradores Envolvidos -->
              <div class="colaboradores-section">
                <h5>👥 Colaboradores Envolvidos</h5>
                <div class="colaboradores-lista">
                  <div
                    v-for="colaborador in colaboradoresSetor"
                    :key="colaborador.id"
                    class="colaborador-item"
                  >
                    <div class="colaborador-avatar">
                      <img
                        v-if="colaborador.foto"
                        :src="colaborador.foto"
                        :alt="colaborador.nome"
                        class="colaborador-foto"
                      />
                      <span v-else class="colaborador-iniciais">
                        {{ colaborador.iniciais }}
                      </span>
                    </div>
                    <div class="colaborador-info-principal">
                      <div class="colaborador-nome-funcao">
                        <div class="colaborador-nome" :title="colaborador.nome">
                          {{ encurtarNome(colaborador.nome, 15) }}
                        </div>
                        <div class="colaborador-funcao">
                          {{ colaborador.funcao }}
                        </div>
                      </div>
                      <div class="colaborador-metricas-inline">
                        <div class="colaborador-metrica">
                          <span class="metrica-valor">{{
                            colaborador.itensLidos
                          }}</span>
                          <span class="metrica-label">Itens</span>
                        </div>
                        <div class="colaborador-metrica">
                          <span class="metrica-valor"
                            >{{ colaborador.eficiencia }}%</span
                          >
                          <span class="metrica-label">Eficiência</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="action-btn secondary" @click="fecharModal">
              Fechar
            </button>
            <button
              class="action-btn primary"
              @click="exportarSetor(setorSelecionado)"
            >
              Exportar Dados
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useLojaStore } from "@/store/lojaStore";

// Store da loja
const lojaStore = useLojaStore();

// Estado para controlar o tipo de auditoria atual
const tipoAuditoriaAtual = ref("etiquetas");

// Estado para armazenar dados carregados da API
const dadosReais = ref({
  usuarioId: "",
  loja: "",
  lojaNome: "",
  metricas: {
    data: new Date().toISOString(),
    etiquetas: {
      totalItens: 0,
      itensValidos: 0,
      itensLidos: 0,
      itensAtualizados: 0,
      itensDesatualizado: 0,
      itensSemEstoque: 0,
      itensNaopertence: 0,
      percentualConclusao: 0,
      classesLeitura: {},
      contadorClasses: {},
    },
    rupturas: {
      totalItens: 0,
      itensLidos: 0,
      itensAtualizados: 0,
      itensDesatualizado: 0,
      itensSemEstoque: 0,
      itensNaopertence: 0,
      percentualConclusao: 0,
      custoTotalRuptura: 0,
      custoMedioRuptura: 0,
      classesLeitura: {},
      contadorClasses: {},
    },
    presencas: {
      totalItens: 0,
      itensLidos: 0,
      itensAtualizados: 0,
      itensDesatualizado: 0,
      itensSemEstoque: 0,
      itensNaopertence: 0,
      percentualConclusao: 0,
      presencasConfirmadas: 0,
      percentualPresenca: 0,
      classesLeitura: {},
      contadorClasses: {},
    },
    totais: {
      totalItens: 0,
      itensLidos: 0,
      itensAtualizados: 0,
      percentualConclusaoGeral: 0,
      pontuacaoTotal: 0,
    },
  },
});

// Estado de carregamento
const carregando = ref(true);
const erro = ref(null);

// Ícones para cada classe de produtos - dinâmico
const iconesClasses = {
  "A CLASSIFICAR": "❓",
  "ALTO GIRO": "⚡",
  BAZAR: "🛍️",
  DIVERSOS: "🧰",
  DPH: "🧴",
  FLV: "🍎",
  "LATICINIOS 1": "🥛",
  LIQUIDA: "🥤",
  "PERECIVEL 1": "🍗",
  "PERECIVEL 2": "🍖",
  "PERECIVEL 2 B": "🧀",
  "PERECIVEL 3": "🥬",
  "SECA DOCE": "🥦",
  "SECA SALGADA": "🧂",
  "SECA SALGADA 2": "🥫",
};

// Função para obter ícone dinamicamente baseado no nome da classe
const getIconeClasse = (classe) => {
  if (iconesClasses[classe]) {
    return iconesClasses[classe];
  }

  // Mapeamento genérico baseado em palavras-chave
  const classeUpper = classe.toUpperCase();
  if (classeUpper.includes('GIRO')) return '⚡';
  if (classeUpper.includes('BAZAR')) return '🛍️';
  if (classeUpper.includes('DIVERSOS')) return '🧰';
  if (classeUpper.includes('DPH') || classeUpper.includes('HIGIENE') || classeUpper.includes('BELEZA')) return '🧴';
  if (classeUpper.includes('FLV') || classeUpper.includes('FRUTA') || classeUpper.includes('VERDU') || classeUpper.includes('LEGUM')) return '🍎';
  if (classeUpper.includes('LATIC') || classeUpper.includes('LEITE')) return '🥛';
  if (classeUpper.includes('LIQUIDA')) return '🥤';
  if (classeUpper.includes('PEREC') || classeUpper.includes('CARNE') || classeUpper.includes('AVE') || classeUpper.includes('SUA')) return '🍗';
  if (classeUpper.includes('DOCE') || classeUpper.includes('CONFEIT')) return '🍬';
  if (classeUpper.includes('SALGAD') || classeUpper.includes('BISCOITO') || classeUpper.includes('SALG')) return '🍿';
  if (classeUpper.includes('PAD') || classeUpper.includes('PAO') || classeUpper.includes('BOLO')) return '🍞';
  if (classeUpper.includes('BEBID') || classeUpper.includes('REFRI') || classeUpper.includes('SUCO')) return '🥤';
  if (classeUpper.includes('FRIOS')) return '❄️';
  if (classeUpper.includes('FROZEN')) return '🧊';
  if (classeUpper.includes('PET') || classeUpper.includes('H2O')) return '💧';

  // Retorna ícone padrão se não encontrar correspondência
  return '📦';
};

const setorSelecionado = ref(null);

// Computed para obter dados filtrados pelo tipo de auditoria
const dadosFiltrados = computed(() => {
  const auditoriaAtual = dadosReais.value.metricas[tipoAuditoriaAtual.value];
  if (!auditoriaAtual || !auditoriaAtual.classesLeitura) return [];

  return Object.entries(auditoriaAtual.classesLeitura).map(
    ([classe, dados]) => {
      return {
        ClasseProduto: classe,
        icone: getIconeClasse(classe),
        totalItens: dados.total || 0,
        itensValidos: dados.itensValidos || 0,
        itensLidos: dados.lidos || 0,
        itensAtualizados: dados.itensAtualizados || 0,
        itensDesatualizado: dados.itensDesatualizado || 0,
        custoRuptura: dados.custoRuptura || 0,
        presencasConfirmadas: dados.presencasConfirmadas || 0,
        percentualConclusao: dados.percentual || 0,
        usuarios: dados.usuarios || {},
      };
    }
  );
});

// Computed para obter colaboradores do setor selecionado
const colaboradoresSetor = computed(() => {
  if (!setorSelecionado.value) return [];

  const usuariosObj = setorSelecionado.value.usuarios || {};

  // Transformar objeto de usuários em array
  const usuariosArray = Object.entries(usuariosObj).map(
    ([nome, itensLidos], index) => {
      // Calcular eficiência
      const eficiencia =
        setorSelecionado.value.itensValidos > 0
          ? Math.round((itensLidos / setorSelecionado.value.itensValidos) * 100)
          : 0;

      // Avatares rotativos
      const avatares = ["👨‍💼", "👩‍💼", "👨‍🔧", "👩‍🔧", "👨‍🎨", "👩‍🎨", "👨‍🍳", "👩‍🍳"];
      const avatar = avatares[index % avatares.length];

      return {
        id: index + 1,
        nome: nome,
        funcao: "Auditor",
        status: itensLidos > 0 ? "ativo" : "ausente",
        itensLidos: itensLidos,
        eficiencia: eficiencia,
        avatar: avatar,
        foto: null,
        iniciais: nome
          .split(" ")
          .map((p) => p[0])
          .join("")
          .toUpperCase()
          .substring(0, 2),
      };
    }
  );

  return usuariosArray.sort((a, b) => b.itensLidos - a.itensLidos);
});

// Computed properties para o resumo
const percentualConclusaoGeral = computed(() => {
  return (
    dadosReais.value.metricas[tipoAuditoriaAtual.value]?.resumo?.percentualConclusao ||
    0
  );
});

const totalItens = computed(() => {
  return dadosReais.value.metricas[tipoAuditoriaAtual.value]?.resumo?.totalItens || 0;
});

const itensLidos = computed(() => {
  return dadosReais.value.metricas[tipoAuditoriaAtual.value]?.itensLidos || 0;
});

const itensAtualizados = computed(() => {
  return dadosReais.value.metricas.etiquetas?.resumo?.itensAtualizados || 0;
});

const custoTotalRuptura = computed(() => {
  return dadosReais.value.metricas.rupturas?.resumo?.custoTotalRuptura || 0;
});

const percentualPresenca = computed(() => {
  return dadosReais.value.metricas.presencas?.resumo?.percentualPresenca || 0;
});

// Computed para calcular total de colaboradores únicos
const totalColaboradores = computed(() => {
  const auditoriaAtual = dadosReais.value.metricas[tipoAuditoriaAtual.value];
  if (!auditoriaAtual || !auditoriaAtual.classesLeitura) return 0;

  const usuariosUnicos = new Set();

  Object.values(auditoriaAtual.classesLeitura).forEach((classe) => {
    if (classe.usuarios) {
      Object.keys(classe.usuarios).forEach((usuario) => {
        if (usuario !== "Produto não auditado") {
          usuariosUnicos.add(usuario);
        }
      });
    }
  });

  return usuariosUnicos.size;
});

const getPercentualLeitura = (setor) => {
  if (
    typeof setor.percentualConclusao !== "undefined" &&
    setor.percentualConclusao !== null
  ) {
    return setor.percentualConclusao;
  }
  if (!setor.itensValidos || setor.itensValidos <= 0) return 0;
  const percentual = (setor.itensLidos / setor.itensValidos) * 100;
  return Math.min(percentual, 100);
};

const getClasseDesempenho = (valor) => {
  if (valor >= 90) return "excelente";
  if (valor >= 80) return "bom";
  if (valor >= 70) return "atencao";
  return "critico";
};

const getClasseCusto = (setor) => {
  const custo = setor.custoRuptura || 0;
  if (custo === 0) return "sem-custo";
  if (custo < 50) return "baixo";
  if (custo < 200) return "medio";
  return "alto";
};

const getStatusSetor = (setor) =>
  getClasseDesempenho(getPercentualLeitura(setor));

const getStatusLinha = (setor) => ({
  "linha-destaque": getPercentualLeitura(setor) >= 90,
  "linha-atencao": getPercentualLeitura(setor) < 70,
});

const getTipoAuditoriaLabel = () => {
  const labels = {
    etiquetas: "Etiquetas",
    presencas: "Presenças",
    rupturas: "Rupturas",
  };
  return labels[tipoAuditoriaAtual.value] || "Auditoria";
};

const encurtarNome = (nome, maxLength) => {
  if (nome.length <= maxLength) return nome;
  return nome.substring(0, maxLength) + "...";
};

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
};

// Função para alterar o tipo de auditoria
const alterarTipoAuditoria = (tipo) => {
  tipoAuditoriaAtual.value = tipo;
};

// Funções para o modal
const verDetalhesSetor = (setor) => {
  setorSelecionado.value = setor;
};

const fecharModal = () => {
  setorSelecionado.value = null;
};

const exportarSetor = (setor) => {
  console.log("Exportando dados do setor:", setor);
  alert(`Dados do setor ${setor.ClasseProduto} exportados com sucesso!`);
};

// Função para buscar dados da API
const buscarMetricasLoja = async () => {
  try {
    carregando.value = true;
    erro.value = null;

    // Verificar se há loja selecionada
    if (!lojaStore.codigoLojaAtual) {
      throw new Error("Nenhuma loja selecionada. Por favor, selecione uma loja.");
    }

    console.log(`🔍 Buscando métricas para loja: ${lojaStore.codigoLojaAtual}`);

    // Buscar métricas completas de classes
    const response = await axios.get(
      "http://localhost:3000/api/metricas/loja-daily/classes-completas",
      {
        headers: {
          "x-loja": lojaStore.codigoLojaAtual,
        },
      }
    );

    if (response.data) {
      console.log("✅ Dados recebidos do backend:", response.data);

      // Mapear dados do endpoint
      dadosReais.value = {
        usuarioId: "",
        loja: response.data.loja || "",
        lojaNome: response.data.loja || "",
        metricas: {
          data: response.data.data || new Date().toISOString(),

          // Etiquetas
          etiquetas: {
            totalItens: response.data.etiquetas?.resumo?.totalItens || 0,
            itensValidos: response.data.etiquetas?.resumo?.itensValidos || 0,
            itensLidos: response.data.etiquetas?.resumo?.itensLidos || 0,
            itensAtualizados:
              response.data.etiquetas?.resumo?.itensAtualizados || 0,
            itensDesatualizado:
              response.data.etiquetas?.resumo?.itensDesatualizado || 0,
            percentualConclusao:
              response.data.etiquetas?.resumo?.percentualConclusao || 0,
            percentualDesatualizado:
              response.data.etiquetas?.resumo?.percentualDesatualizado || 0,
            classesLeitura: response.data.etiquetas?.classesLeitura || {},
            contadorClasses: {},
          },

          // Rupturas
          rupturas: {
            totalItens: response.data.rupturas?.resumo?.totalItens || 0,
            itensLidos: response.data.rupturas?.resumo?.itensLidos || 0,
            itensAtualizados: response.data.rupturas?.resumo?.itensAtualizados || 0,
            percentualConclusao:
              response.data.rupturas?.resumo?.percentualConclusao || 0,
            custoTotalRuptura:
              response.data.rupturas?.resumo?.custoTotalRuptura || 0,
            classesLeitura: response.data.rupturas?.classesLeitura || {},
            contadorClasses: {},
          },

          // Presenças
          presencas: {
            totalItens: response.data.presencas?.resumo?.totalItens || 0,
            itensLidos: response.data.presencas?.resumo?.itensLidos || 0,
            itensAtualizados:
              response.data.presencas?.resumo?.itensAtualizados || 0,
            percentualConclusao:
              response.data.presencas?.resumo?.percentualConclusao || 0,
            presencasConfirmadas:
              response.data.presencas?.resumo?.presencasConfirmadas || 0,
            percentualPresenca:
              response.data.presencas?.resumo?.percentualPresenca || 0,
            classesLeitura: response.data.presencas?.classesLeitura || {},
            contadorClasses: {},
          },

          // Totais consolidados
          totais: {
            totalItens: response.data.totais?.totalItens || 0,
            itensLidos: 0,
            itensAtualizados: 0,
            percentualConclusaoGeral:
              response.data.totais?.percentualConclusaoGeral || 0,
            pontuacaoTotal: 0,
          },
        },
      };

      console.log("✅ Métricas carregadas com sucesso");
      console.log(`📊 Classes Etiquetas: ${Object.keys(dadosReais.value.metricas.etiquetas.classesLeitura).length}`);
      console.log(`📊 Classes Rupturas: ${Object.keys(dadosReais.value.metricas.rupturas.classesLeitura).length}`);
      console.log(`📊 Classes Presenças: ${Object.keys(dadosReais.value.metricas.presencas.classesLeitura).length}`);
    }
  } catch (error) {
    console.error("❌ Erro ao buscar métricas:", error);

    if (error.response?.status === 400) {
      erro.value = "Loja não selecionada ou inválida. Por favor, selecione uma loja.";
    } else if (error.message.includes("loja selecionada")) {
      erro.value = error.message;
    } else {
      erro.value = "Erro ao carregar métricas. Tente novamente mais tarde.";
    }
  } finally {
    carregando.value = false;
  }
};

// Inicialização
onMounted(() => {
  console.log("📦 Componente MetricasSetor montado");
  console.log(`🏪 Loja atual: ${lojaStore.codigoLojaAtual || "Nenhuma"}`);
  buscarMetricasLoja();
});
</script>
<style scoped>
.metricas-setor-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin: 1rem 0;
}

/* Loading e Erro */
.loading-container,
.erro-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  min-height: 300px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-container p {
  color: #718096;
  font-size: 1rem;
}

.erro-container {
  color: #f44336;
}

.erro-mensagem {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.metricas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.metricas-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.metricas-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  background: #e2e8f0;
  border: none;
  border-radius: 6px;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  border: 2px solid transparent;
}

.action-btn:hover {
  background: #cbd5e0;
  transform: translateY(-1px);
}

.action-btn.active {
  background: #667eea;
  color: white;
  border-color: #5a6fd8;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.metricas-table-container {
  padding: 1.5rem;
}

.metricas-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.metricas-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
  border-bottom: 1px solid #e2e8f0;
}

.metricas-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

.metricas-table tr:last-child td {
  border-bottom: none;
}

.metricas-table tr.linha-destaque {
  background: rgba(76, 175, 80, 0.05);
}

.metricas-table tr.linha-atencao {
  background: rgba(244, 67, 54, 0.05);
}

.setor-cell .setor-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setor-icon {
  font-size: 1.2rem;
}

.progress-bar {
  position: relative;
  height: 24px;
  background: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill.excelente {
  background: #4caf50;
}
.progress-fill.bom {
  background: #ff9800;
}
.progress-fill.atencao {
  background: #ffeb3b;
}
.progress-fill.critico {
  background: #f44336;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.meta-cell,
.conformidade-cell,
.ruptura-cell {
  font-weight: 600;
  color: #2c3e50;
}

.tendencia-cell {
  font-weight: 600;
}

.tendencia-cell.positive {
  color: #4caf50;
}

.tendencia-cell.negative {
  color: #f44336;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.excelente {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.status-badge.bom {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.status-badge.atencao {
  background: rgba(255, 235, 59, 0.1);
  color: #fbc02d;
}

.status-badge.critico {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

/* Coluna de Ações */
.acoes-cell {
  display: flex;
  gap: 0.5rem;
}

.acao-btn {
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.acao-btn:hover {
  background: #f8fafc;
  transform: scale(1.1);
}

/* Resumo Estatístico */
.resumo-estatistico {
  padding: 1.5rem;
  background: #f8fafc;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.estatisticas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.estatistica-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.estatistica-valor {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.estatistica-label {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.modal-close:hover {
  background: #f8fafc;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.secondary {
  background: #718096;
  color: white;
}

/* Detalhes do Setor */
.setor-detalhes {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detalhe-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.setor-icone-grande {
  font-size: 3rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 1rem;
}

.setor-info-grande h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.metricas-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metrica-item {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.metrica-label {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.metrica-valor {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.progress-bar-small {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-small .progress-fill {
  height: 100%;
  border-radius: 3px;
}

/* Nova Seção: Colaboradores */
.colaboradores-section {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
}

.colaboradores-section h5 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.colaboradores-lista {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.colaborador-item {
  background: white;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;

  gap: 1rem;
  transition: all 0.3s ease;
}

.colaborador-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.colaborador-avatar {
  font-size: 2rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.colaborador-foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.colaborador-iniciais {
  font-size: 1rem;
  font-weight: 700;
  color: #667eea;
}

.colaborador-info-principal {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.colaborador-nome-funcao {
  display: flex;
  flex-direction: column;
}
.colaborador-nome {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.colaborador-funcao {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.colaborador-conquistas {
  font-size: 0.75rem;
  color: #667eea;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.colaborador-ranking {
  font-size: 0.7rem;
  color: #4a5568;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.colaborador-status.ativo {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.colaborador-status.ausente {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.colaborador-metricas-inline {
  display: flex;
  gap: 1rem;
}

.colaborador-metrica {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: right;
}

.colaborador-metrica .metrica-valor {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0;
}

.colaborador-metrica .metrica-label {
  font-size: 0.7rem;
  color: #718096;
  margin-bottom: 0;
}

.detalhes-adicionais {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
}

.detalhes-adicionais h5 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: #4a5568;
}

.info-value {
  font-weight: 600;
  color: #2c3e50;
}
.custo-cell.sem-custo {
  color: #4caf50;
  font-weight: 600;
}

.custo-cell.baixo {
  color: #ff9800;
  font-weight: 600;
}

.custo-cell.medio {
  color: #ff5722;
  font-weight: 600;
}

.custo-cell.alto {
  color: #f44336;
  font-weight: 700;
}

.presenca-cell {
  font-weight: 600;
  color: #2c3e50;
}

.atualizados-cell {
  font-weight: 600;
  color: #2c3e50;
}

/* Responsividade */
@media (max-width: 768px) {
  .metricas-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .metricas-actions {
    justify-content: center;
  }

  .metricas-table-container {
    padding: 1rem;
    overflow-x: auto;
  }

  .estatisticas-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .metricas-grid {
    grid-template-columns: 1fr;
  }

  .colaboradores-lista {
    gap: 0.5rem;
  }

  .modal-content {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }

  .modal-footer {
    flex-direction: column;
  }

  .colaborador-item {
    flex-direction: row;
    align-items: flex-start;
  }

  .colaborador-metricas {
    flex-direction: row;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .estatisticas-grid {
    grid-template-columns: 1fr;
  }

  .metricas-actions {
    flex-direction: column;
  }

  .action-btn {
    text-align: center;
  }
}
</style>
