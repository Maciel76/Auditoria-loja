<template>
  <div class="metricas-corredor-container">
    <!-- Indicador de carregamento -->
    <div v-if="carregando" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando métricas dos corredores...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="erro" class="erro-container">
      <p class="erro-mensagem">{{ erro }}</p>
      <button class="action-btn" @click="buscarMetricasLoja">
        Tentar Novamente
      </button>
    </div>

    <!-- Mensagem quando não há dados -->
    <div v-else-if="!temDados" class="erro-container">
      <p class="erro-mensagem">
        📊 Nenhum dado de corredor encontrado para exibir.
      </p>
      <p style="font-size: 0.9rem; color: #718096; margin-top: 0.5rem">
        Isso pode acontecer se ainda não foram processadas auditorias para esta
        loja.
      </p>
      <button
        class="action-btn"
        @click="buscarMetricasLoja"
        style="margin-top: 1rem"
      >
        Atualizar Dados
      </button>
    </div>

    <!-- Conteúdo principal -->
    <div v-else>
      <div class="metricas-header">
        <h3>🗺️ Mapa de Desempenho por Corredor</h3>
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
        </div>
      </div>

      <!-- Filtro de Setores -->
      <div class="setores-filter">
        <button
          class="setor-btn"
          :class="{ active: setorSelecionado === 'todos' }"
          @click="setorSelecionado = 'todos'"
        >
          🏪 Todos
        </button>
        <button
          v-for="setor in setores"
          :key="setor.id"
          class="setor-btn"
          :class="{ active: setorSelecionado === setor.id }"
          @click="setorSelecionado = setor.id"
        >
          {{ setor.icone }} {{ setor.nome }}
        </button>
      </div>

      <!-- Cards de Resumo -->
      <div class="resumo-cards">
        <div class="resumo-card">
          <div class="resumo-icon">📊</div>
          <div class="resumo-content">
            <div class="resumo-valor">{{ desempenhoMedio }}%</div>
            <div class="resumo-label">Desempenho Médio</div>
          </div>
        </div>
        <div class="resumo-card">
          <div class="resumo-icon">✅</div>
          <div class="resumo-content">
            <div class="resumo-valor">{{ totalItens }}</div>
            <div class="resumo-label">Total de Itens</div>
          </div>
        </div>
        <div class="resumo-card">
          <div class="resumo-icon">👥</div>
          <div class="resumo-content">
            <div class="resumo-valor">{{ totalColaboradores }}</div>
            <div class="resumo-label">Colaboradores</div>
          </div>
        </div>
        <div class="resumo-card">
          <div class="resumo-icon">🎯</div>
          <div class="resumo-content">
            <div class="resumo-valor">{{ corredorDestaque.nome }}</div>
            <div class="resumo-label">Melhor Corredor</div>
          </div>
        </div>
      </div>

      <!-- Grid de Corredores Agrupados por Setor -->
      <div v-if="setorSelecionado === 'todos'">
        <div v-for="setor in setores" :key="setor.id" class="setor-secao">
          <div class="setor-header">
            <div class="setor-title-wrapper">
              <h4>{{ setor.icone }} {{ setor.nome }}</h4>
              <span class="setor-percentual"
                >{{ getPercentualSetor(setor.id).toFixed(1) }}%</span
              >
            </div>
            <span class="setor-badge"
              >{{ getCorredoresPorSetor(setor.id).length }} corredores</span
            >
          </div>
          <div class="corredores-grid">
            <div
              v-for="corredor in getCorredoresPorSetor(setor.id)"
              :key="corredor.local"
              class="corredor-card"
              :class="getStatusCorredor(corredor)"
              @click="verDetalhesCorredor(corredor)"
            >
              <div class="corredor-header">
                <div class="corredor-icon">
                  {{ getIconeCorredor(corredor.local) }}
                </div>
                <div class="corredor-info">
                  <h4 class="corredor-nome">
                    {{ formatarNomeCorredor(corredor.local) }}
                  </h4>
                  <div class="corredor-score">
                    {{ getPercentualLeitura(corredor).toFixed(2) }}%
                  </div>
                </div>
                <div
                  class="corredor-status"
                  :class="getStatusCorredor(corredor)"
                >
                  {{ getStatusLabel(getPercentualLeitura(corredor)) }}
                </div>
              </div>
              <div class="corredor-progress">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: getPercentualLeitura(corredor) + '%' }"
                    :class="getClasseDesempenho(getPercentualLeitura(corredor))"
                  ></div>
                </div>
                <div class="progress-text">
                  {{ getPercentualLeitura(corredor).toFixed(2) }}% concluído
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid de Corredores - Setor Específico -->
      <div v-else class="setor-secao">
        <div class="setor-header">
          <div class="setor-title-wrapper">
            <h4>
              {{ getSetorInfo(setorSelecionado)?.icone }}
              {{ getSetorInfo(setorSelecionado)?.nome }}
            </h4>
            <span class="setor-percentual"
              >{{ getPercentualSetor(setorSelecionado).toFixed(1) }}%</span
            >
          </div>
          <span class="setor-badge"
            >{{
              getCorredoresPorSetor(setorSelecionado).length
            }}
            corredores</span
          >
        </div>
        <div class="corredores-grid">
          <div
            v-for="corredor in getCorredoresPorSetor(setorSelecionado)"
            :key="corredor.local"
            class="corredor-card"
            :class="getStatusCorredor(corredor)"
            @click="verDetalhesCorredor(corredor)"
          >
            <div class="corredor-header">
              <div class="corredor-icon">
                {{ getIconeCorredor(corredor.local) }}
              </div>
              <div class="corredor-info">
                <h4 class="corredor-nome">
                  {{ formatarNomeCorredor(corredor.local) }}
                </h4>
                <div class="corredor-score">
                  {{ getPercentualLeitura(corredor).toFixed(2) }}%
                </div>
              </div>
              <div class="corredor-status" :class="getStatusCorredor(corredor)">
                {{ getStatusLabel(getPercentualLeitura(corredor)) }}
              </div>
            </div>

            <div class="corredor-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: getPercentualLeitura(corredor) + '%' }"
                  :class="getClasseDesempenho(getPercentualLeitura(corredor))"
                ></div>
              </div>
              <div class="progress-text">
                {{ getPercentualLeitura(corredor).toFixed(2) }}% concluído
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Detalhes do Corredor -->
      <div
        v-if="corredorSelecionado"
        class="modal-overlay"
        @click="fecharModal"
      >
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <div class="modal-title">
              <div class="modal-icon">
                {{ getIconeCorredor(corredorSelecionado.local) }}
              </div>
              <div>
                <h3>{{ formatarNomeCorredor(corredorSelecionado.local) }}</h3>
                <span class="modal-subtitle">{{
                  getTipoAuditoriaLabel()
                }}</span>
              </div>
            </div>
            <button class="modal-close" @click="fecharModal">×</button>
          </div>

          <div class="modal-body">
            <div class="metricas-destaque">
              <div class="metrica-principal">
                <div class="metrica-valor">
                  {{ getPercentualLeitura(corredorSelecionado).toFixed(2) }}%
                </div>
                <div class="metrica-label">Taxa de Conclusão</div>
                <div class="progress-bar-large">
                  <div
                    class="progress-fill"
                    :style="{
                      width: getPercentualLeitura(corredorSelecionado) + '%',
                    }"
                    :class="
                      getClasseDesempenho(
                        getPercentualLeitura(corredorSelecionado)
                      )
                    "
                  ></div>
                </div>
              </div>
            </div>

            <div class="metricas-detalhadas">
              <div class="metrica-item">
                <div class="metrica-numero">
                  {{ corredorSelecionado.total }}
                </div>
                <div class="metrica-desc">Total de Itens</div>
              </div>
              <div class="metrica-item">
                <div class="metrica-numero">
                  {{ corredorSelecionado.itensValidos }}
                </div>
                <div class="metrica-desc">Itens Válidos</div>
              </div>
              <div class="metrica-item">
                <div class="metrica-numero">
                  {{ corredorSelecionado.lidos }}
                </div>
                <div class="metrica-desc">Itens Lidos</div>
              </div>
              <div class="metrica-item">
                <div class="metrica-numero">
                  {{ Object.keys(corredorSelecionado.usuarios || {}).length }}
                </div>
                <div class="metrica-desc">Colaboradores</div>
              </div>
            </div>

            <!-- Colaboradores Detalhados -->
            <div
              v-if="
                corredorSelecionado.usuarios &&
                Object.keys(corredorSelecionado.usuarios).length > 0
              "
              class="colaboradores-section"
            >
              <h4>👥 Colaboradores no Corredor</h4>
              <div class="colaboradores-detailed">
                <div
                  v-for="(quantidade, usuario) in corredorSelecionado.usuarios"
                  :key="usuario"
                  class="colaborador-item"
                >
                  <div class="colaborador-avatar">
                    {{ usuario.charAt(0).toUpperCase() }}
                  </div>
                  <div class="colaborador-info">
                    <div class="colaborador-nome">{{ usuario }}</div>
                    <div class="colaborador-stats">
                      <span class="stat">{{ quantidade }} itens</span>
                      <span class="stat"
                        >{{
                          Math.round(
                            (quantidade / corredorSelecionado.itensValidos) *
                              100
                          )
                        }}% do total</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useLojaStore } from "@/store/lojaStore";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

// Store da loja e autenticação
const lojaStore = useLojaStore();
const authStore = useAuthStore();
const router = useRouter();

// Estado para controlar o tipo de auditoria atual
const tipoAuditoriaAtual = ref("etiquetas");

// Estrutura de dados inicial robusta, similar ao MetricasSetor
const dadosReais = ref({
  loja: "",
  lojaNome: "",
  data: new Date().toISOString(),
  etiquetas: { locaisLeitura: {}, resumo: {} },
  rupturas: { locaisLeitura: {}, resumo: {} },
  presencas: { locaisLeitura: {}, resumo: {} },
});

// Estado de carregamento e erro
const carregando = ref(true);
const erro = ref(null);
const corredorSelecionado = ref(null);
const setorSelecionado = ref("todos");

// Definição dos setores e mapeamento de corredores
const setores = ref([
  { id: "mercearia", nome: "Mercearia", icone: "🛒" },
  { id: "padaria", nome: "Padaria", icone: "🥖" },
  { id: "emporio", nome: "Empório", icone: "🏺" },
  { id: "frios", nome: "Frios", icone: "🧀" },
  { id: "acougue", nome: "Açougue", icone: "🥩" },
  { id: "flv", nome: "FLV", icone: "🥬" },
]);

// Mapeamento de corredores para setores (pode ser configurável futuramente)
const mapeamentoSetores = ref({
  mercearia: ["C-01", "C-02", "C-03", "C-04", "C-05", "C-06", "C-07"],
  padaria: ["H-01", "H-02"],
  emporio: ["C-08", "C-09", "C-10"],
  frios: ["F-01", "F-02", "F-03"],
  acougue: ["A-01", "A-02"],
  flv: ["V-01", "V-02", "V-03"],
});

// Computed para verificar se existem dados para exibir
const temDados = computed(() => {
  const filtrados = dadosFiltrados.value;
  return filtrados && filtrados.length > 0;
});

// Computed para obter dados filtrados, agora para LOCAIS
const dadosFiltrados = computed(() => {
  const auditoriaAtual = dadosReais.value[tipoAuditoriaAtual.value];
  if (!auditoriaAtual || !auditoriaAtual.locaisLeitura) {
    return [];
  }

  const locaisLeitura = auditoriaAtual.locaisLeitura;
  if (typeof locaisLeitura !== "object" || locaisLeitura === null) {
    return [];
  }

  return Object.entries(locaisLeitura)
    .map(([local, dados]) => ({
      local: local,
      total: dados.total || 0,
      itensValidos: dados.itensValidos || 0,
      lidos: dados.lidos || 0,
      percentual: dados.percentual || 0,
      usuarios: dados.usuarios || {},
    }))
    .filter((corredor) => corredor.total > 0) // Apenas corredores com itens
    .sort((a, b) => (b.percentual || 0) - (a.percentual || 0));
});

// Computed para estatísticas gerais
const desempenhoMedio = computed(() => {
  if (!dadosFiltrados.value || dadosFiltrados.value.length === 0) return 0;
  const total = dadosFiltrados.value.reduce(
    (sum, corredor) => sum + (corredor.percentual || 0),
    0
  );
  return Math.round(total / dadosFiltrados.value.length);
});

const totalItens = computed(() => {
  return dadosFiltrados.value.reduce(
    (sum, corredor) => sum + corredor.total,
    0
  );
});

const totalColaboradores = computed(() => {
  const usuariosUnicos = new Set();
  dadosFiltrados.value.forEach((corredor) => {
    if (corredor.usuarios) {
      Object.keys(corredor.usuarios).forEach((usuario) =>
        usuariosUnicos.add(usuario)
      );
    }
  });
  return usuariosUnicos.size;
});

const corredorDestaque = computed(() => {
  if (!dadosFiltrados.value || dadosFiltrados.value.length === 0)
    return { nome: "-", pontuacao: 0 };
  const melhor = dadosFiltrados.value.reduce((prev, current) =>
    (prev.percentual || 0) > (current.percentual || 0) ? prev : current
  );
  return {
    nome: formatarNomeCorredor(melhor.local),
    pontuacao: Math.round(melhor.percentual || 0),
  };
});

// Funções auxiliares
const getPercentualLeitura = (corredor) => corredor.percentual || 0;
const getClasseDesempenho = (valor) => {
  if (valor >= 90) return "excelente";
  if (valor >= 80) return "bom";
  if (valor >= 70) return "medio";
  return "baixo";
};
const getStatusCorredor = (corredor) =>
  getClasseDesempenho(getPercentualLeitura(corredor));
const getStatusLabel = (valor) => {
  if (valor >= 90) return "Excelente";
  if (valor >= 80) return "Bom";
  if (valor >= 70) return "Médio";
  return "Atenção";
};

const getIconeCorredor = (local) => {
  const icones = {
    G: "🛒",
    F: "🥶",
    C: "📦",
    FLV: "🎃",
    PAO: "🥖",
    SORVETE: "🍦",
    GELO: "🧊",
    I: "🏢",
    PA: "📦",
    PF: "🥩",
    PL: "🧴",
  };
  const prefixo = local.substring(0, 3).replace(/\d/g, "");
  return icones[prefixo] || "📍";
};

const formatarNomeCorredor = (local) => {
  return local.split(" - ")[0];
};

// Funções para gerenciar setores
const getCorredoresPorSetor = (setorId) => {
  return dadosFiltrados.value.filter((corredor) => {
    const localLimpo = corredor.local.split(" - ")[0];
    const primeiraLetra = localLimpo.charAt(0).toUpperCase();

    // Mercearia: todos os corredores que começam com G
    if (setorId === "mercearia" && primeiraLetra === "G") {
      return true;
    }

    // Padaria: corredores H ou PAO
    if (
      setorId === "padaria" &&
      (primeiraLetra === "H" || localLimpo.includes("PAO"))
    ) {
      return true;
    }

    // Frios: corredores F
    if (setorId === "frios" && primeiraLetra === "F") {
      return true;
    }

    // FLV: corredores FLV ou V
    if (
      setorId === "flv" &&
      (localLimpo.includes("FLV") || primeiraLetra === "V")
    ) {
      return true;
    }

    // Açougue: corredores A ou que contenham ACOUGUE
    if (
      setorId === "acougue" &&
      (primeiraLetra === "A" || localLimpo.includes("ACOUGUE"))
    ) {
      return true;
    }

    // Empório: corredores C ou I
    if (
      setorId === "emporio" &&
      (primeiraLetra === "C" || primeiraLetra === "I")
    ) {
      return true;
    }

    return false;
  });
};

// Função para calcular porcentagem agregada de um setor
const getPercentualSetor = (setorId) => {
  const corredoresDoSetor = getCorredoresPorSetor(setorId);
  if (corredoresDoSetor.length === 0) return 0;

  const totalItens = corredoresDoSetor.reduce(
    (sum, c) => sum + c.itensValidos,
    0
  );
  const totalLidos = corredoresDoSetor.reduce((sum, c) => sum + c.lidos, 0);

  return totalItens > 0 ? (totalLidos / totalItens) * 100 : 0;
};

const getSetorInfo = (setorId) => {
  return setores.value.find((s) => s.id === setorId);
};

const getSetorDoCorredor = (local) => {
  const localLimpo = local.split(" - ")[0];
  for (const [setorId, corredores] of Object.entries(mapeamentoSetores.value)) {
    if (corredores.some((c) => localLimpo.includes(c))) {
      const setor = setores.value.find((s) => s.id === setorId);
      return setor ? setor.nome : "Outros";
    }
  }
  return "Outros";
};

// Funções para o modal e ações
const verDetalhesCorredor = (corredor) => {
  corredorSelecionado.value = corredor;
};
const fecharModal = () => {
  corredorSelecionado.value = null;
};
const alterarTipoAuditoria = (tipo) => {
  tipoAuditoriaAtual.value = tipo;
};
const getTipoAuditoriaLabel = () => {
  const labels = {
    etiquetas: "Etiquetas",
    presencas: "Presenças",
  };
  return labels[tipoAuditoriaAtual.value] || "Auditoria";
};

// Função de logout
const handleLogout = () => {
  authStore.logout();
  router.push("/admin/login");
};

// Função para buscar dados da API, unificada com MetricasSetor
const buscarMetricasLoja = async () => {
  carregando.value = true;
  erro.value = null;
  try {
    if (!lojaStore.codigoLojaAtual) {
      throw new Error("Nenhuma loja selecionada.");
    }
    const response = await axios.get(
      "http://localhost:3000/api/metricas/loja-daily/classes-completas",
      { headers: { "x-loja": lojaStore.codigoLojaAtual } }
    );
    if (response.data) {
      // Mapeamento seguro e detalhado, igual ao do MetricasSetor.vue
      dadosReais.value = {
        loja: response.data.loja || "",
        lojaNome: response.data.lojaNome || "",
        data: response.data.data || new Date().toISOString(),
        etiquetas: {
          ...response.data.etiquetas,
          locaisLeitura: response.data.etiquetas?.locaisLeitura || {},
        },
        rupturas: {
          ...response.data.rupturas,
          locaisLeitura: response.data.rupturas?.locaisLeitura || {},
        },
        presencas: {
          ...response.data.presencas,
          locaisLeitura: response.data.presencas?.locaisLeitura || {},
        },
      };
    }
  } catch (err) {
    console.error("❌ Erro ao buscar métricas de corredores:", err);
    erro.value = "Falha ao carregar os dados. Tente novamente.";
    if (err.response?.status === 404) {
      erro.value = "Nenhuma métrica diária encontrada para esta loja.";
    }
  } finally {
    carregando.value = false;
  }
};

// Observar mudanças na loja selecionada para recarregar
watch(
  () => lojaStore.codigoLojaAtual,
  (novaLoja) => {
    if (novaLoja) buscarMetricasLoja();
  }
);

// Inicialização ao montar o componente
onMounted(() => {
  if (lojaStore.codigoLojaAtual) {
    buscarMetricasLoja();
  } else {
    erro.value = "Por favor, selecione uma loja.";
    carregando.value = false;
  }
});
</script>

<style scoped>
/* ... (mantém todos os estilos originais) ... */
.metricas-corredor-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin: 1rem 0;
}

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
  gap: 0.5rem;
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

.logout-btn {
  background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
  color: white;
  border: 2px solid transparent;
}

.logout-btn:hover {
  background: linear-gradient(135deg, #e53e3e 0%, #9b2c2c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.4);
}

.resumo-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
}

.resumo-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.resumo-icon {
  font-size: 2rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
}

.resumo-valor {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.resumo-label {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
}

.corredores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.corredor-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.corredor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.corredor-card.excelente {
  border-left-color: #48bb78;
}
.corredor-card.bom {
  border-left-color: #4299e1;
}
.corredor-card.medio {
  border-left-color: #ed8936;
}
.corredor-card.baixo {
  border-left-color: #f56565;
}

.corredor-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.corredor-icon {
  font-size: 2rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
}

.corredor-info {
  flex: 1;
}

.corredor-nome {
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.corredor-score {
  font-size: 1.5rem;
  font-weight: 700;
}

.corredor-card.excelente .corredor-score {
  color: #48bb78;
}
.corredor-card.bom .corredor-score {
  color: #4299e1;
}
.corredor-card.medio .corredor-score {
  color: #ed8936;
}
.corredor-card.baixo .corredor-score {
  color: #f56565;
}

.metricas-corredor-container {
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

.erro-container {
  color: #f44336;
}

.erro-mensagem {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  text-align: center;
}

/* Header */
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
  gap: 0.5rem;
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

/* Cards de Resumo */
.resumo-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
}

.resumo-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.resumo-icon {
  font-size: 2rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
}

.resumo-valor {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.resumo-label {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
}

/* Grid de Corredores */
.corredores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.corredor-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.corredor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.corredor-card.excelente {
  border-left-color: #48bb78;
}

.corredor-card.bom {
  border-left-color: #4299e1;
}

.corredor-card.medio {
  border-left-color: #ed8936;
}

.corredor-card.baixo {
  border-left-color: #f56565;
}

.corredor-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.corredor-icon {
  font-size: 2rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
}

.corredor-info {
  flex: 1;
}

.corredor-nome {
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.corredor-score {
  font-size: 1.5rem;
  font-weight: 700;
}

.corredor-card.excelente .corredor-score {
  color: #48bb78;
}

.corredor-card.bom .corredor-score {
  color: #4299e1;
}

.corredor-card.medio .corredor-score {
  color: #ed8936;
}

.corredor-card.baixo .corredor-score {
  color: #f56565;
}

.corredor-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.corredor-status.excelente {
  background: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.corredor-status.bom {
  background: rgba(66, 153, 225, 0.1);
  color: #4299e1;
}

.corredor-status.medio {
  background: rgba(237, 137, 54, 0.1);
  color: #ed8936;
}

.corredor-status.baixo {
  background: rgba(245, 101, 101, 0.1);
  color: #f56565;
}

.corredor-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-fill.excelente {
  background: #48bb78;
}

.progress-fill.bom {
  background: #4299e1;
}

.progress-fill.medio {
  background: #ed8936;
}

.progress-fill.baixo {
  background: #f56565;
}

.progress-text {
  font-size: 0.8rem;
  color: #718096;
  text-align: center;
}

.corredor-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-weight: 700;
  color: #2c3e50;
  font-size: 1.1rem;
}

.stat-label {
  font-size: 0.7rem;
  color: #718096;
  text-transform: uppercase;
  font-weight: 500;
}

.corredor-colaboradores {
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.colaboradores-label {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.colaboradores-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.colaborador-tag {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  color: #4a5568;
  cursor: help;
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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.modal-icon {
  font-size: 2.5rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
}

.modal-title h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.modal-subtitle {
  font-size: 0.9rem;
  color: #718096;
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

.metricas-destaque {
  margin-bottom: 2rem;
}

.metrica-principal {
  text-align: center;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
}

.metrica-valor {
  font-size: 3rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.metrica-label {
  font-size: 1rem;
  color: #718096;
  margin-bottom: 1rem;
}

.progress-bar-large {
  height: 12px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.metricas-detalhadas {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.metrica-item {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border-left: 4px solid #667eea;
}

.metrica-numero {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.metrica-desc {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
}

.colaboradores-section {
  margin-bottom: 2rem;
}

.colaboradores-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.colaboradores-detailed {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.colaborador-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
}

.colaborador-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.colaborador-info {
  flex: 1;
}

.colaborador-nome {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.colaborador-stats {
  display: flex;
  gap: 1rem;
}

.colaborador-stats .stat {
  font-size: 0.8rem;
  color: #718096;
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

  .resumo-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .corredores-grid {
    grid-template-columns: 1fr;
  }

  .metricas-detalhadas {
    grid-template-columns: 1fr;
  }

  .modal-content {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }

  .colaborador-stats {
    flex-direction: column;
    gap: 0.25rem;
  }
}

@media (max-width: 480px) {
  .resumo-cards {
    grid-template-columns: 1fr;
  }

  .metricas-actions {
    flex-direction: column;
  }

  .action-btn {
    text-align: center;
  }

  .setores-filter {
    flex-direction: column;
    align-items: stretch;
  }

  .setor-btn {
    text-align: center;
  }
}

/* Estilos para filtro de setores */
.setores-filter {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  background: white;
  border-bottom: 2px solid #e2e8f0;
  overflow-x: auto;
  flex-wrap: wrap;
}

.setor-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  color: #4a5568;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.setor-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.setor-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Estilos para seção de setor */
.setor-secao {
  margin-bottom: 2.5rem;
}

.setor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  border-left: 4px solid #667eea;
}

.setor-header h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.setor-title-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.setor-percentual {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.setor-badge {
  padding: 0.35rem 0.85rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}
</style>
