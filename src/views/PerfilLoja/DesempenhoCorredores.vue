<template>
  <div class="desempenho-corredores-container">
    <!-- Indicador de carregamento -->
    <div v-if="carregando" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando desempenho por corredor...</p>
    </div>

    <!-- Mensagem de erro -->
    <div v-else-if="erro" class="erro-container">
      <p class="erro-mensagem">{{ erro }}</p>
      <button class="action-btn" @click="buscarDadosCorredores">
        Tentar Novamente
      </button>
    </div>

    <!-- Conteúdo principal -->
    <div v-else>
      <div class="metricas-header">
        <h3>🗺️ Desempenho por Corredor</h3>
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

      <!-- Grid de Corredores -->
      <div class="corredores-grid">
        <div
          v-for="corredor in dadosFiltrados"
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
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useLojaStore } from "@/store/lojaStore";

const lojaStore = useLojaStore();

// Estado para controlar o tipo de auditoria atual
const tipoAuditoriaAtual = ref("etiquetas");

// Estado para armazenar dados carregados da API
const dadosReais = ref({
  loja: "",
  data: new Date().toISOString(),
  etiquetas: {
    locaisLeitura: {},
    resumo: {},
  },
  rupturas: {
    locaisLeitura: {},
    resumo: {},
  },
  presencas: {
    locaisLeitura: {},
    resumo: {},
  },
});

// Estado de carregamento e erro
const carregando = ref(true);
const erro = ref(null);
const corredorSelecionado = ref(null);

// Computed para obter dados filtrados pelo tipo de auditoria
const dadosFiltrados = computed(() => {
  const auditoriaAtual = dadosReais.value[tipoAuditoriaAtual.value];

  if (!auditoriaAtual || !auditoriaAtual.locaisLeitura) {
    console.log(`⚠️ Nenhum dado encontrado para ${tipoAuditoriaAtual.value}`);
    return [];
  }

  // Converter o objeto de locais em array
  const locaisArray = Object.entries(auditoriaAtual.locaisLeitura).map(
    ([local, dados]) => {
      return {
        local: local,
        total: dados.total || 0,
        itensValidos: dados.itensValidos || 0,
        lidos: dados.lidos || 0,
        percentual: dados.percentual || 0,
        usuarios: dados.usuarios || {},
      };
    }
  );

  console.log(
    `📊 Dados filtrados para ${tipoAuditoriaAtual.value}:`,
    locaisArray.length,
    "locais"
  );
  return locaisArray;
});

// Computed para estatísticas gerais
const desempenhoMedio = computed(() => {
  if (dadosFiltrados.value.length === 0) return 0;
  const total = dadosFiltrados.value.reduce((sum, corredor) => {
    return (
      sum +
      (corredor.itensValidos > 0
        ? (corredor.lidos / corredor.itensValidos) * 100
        : 0)
    );
  }, 0);
  return Math.round(total / dadosFiltrados.value.length);
});

const totalItens = computed(() => {
  const auditoriaAtual = dadosReais.value[tipoAuditoriaAtual.value];
  return auditoriaAtual?.resumo?.totalItens || 0;
});

const totalColaboradores = computed(() => {
  const auditoriaAtual = dadosReais.value[tipoAuditoriaAtual.value];
  return auditoriaAtual?.resumo?.usuariosAtivos || 0;
});

const corredorDestaque = computed(() => {
  if (dadosFiltrados.value.length === 0) return { nome: "-", pontuacao: 0 };

  const melhor = dadosFiltrados.value.reduce((prev, current) => {
    const prevScore =
      prev.itensValidos > 0 ? (prev.lidos / prev.itensValidos) * 100 : 0;
    const currentScore =
      current.itensValidos > 0
        ? (current.lidos / current.itensValidos) * 100
        : 0;
    return prevScore > currentScore ? prev : current;
  });

  return {
    nome: formatarNomeCorredor(melhor.local),
    pontuacao: Math.round((melhor.lidos / melhor.itensValidos) * 100),
  };
});

// Funções auxiliares
const getPercentualLeitura = (corredor) => {
  if (!corredor.itensValidos || corredor.itensValidos <= 0) return 0;
  const percentual = (corredor.lidos / corredor.itensValidos) * 100;
  return Math.min(percentual, 100);
};

const getClasseDesempenho = (valor) => {
  if (valor >= 90) return "excelente";
  if (valor >= 80) return "bom";
  if (valor >= 70) return "medio";
  return "baixo";
};

const getStatusCorredor = (corredor) => {
  return getClasseDesempenho(getPercentualLeitura(corredor));
};

const getStatusLabel = (valor) => {
  if (valor >= 90) return "Excelente";
  if (valor >= 80) return "Bom";
  if (valor >= 70) return "Médio";
  return "Atenção";
};

const getIconeCorredor = (local) => {
  const icones = {
    G01: "🛒",
    G02: "🛒",
    G03: "🛒",
    G04: "🛒",
    G05: "🛒",
    G06: "🛒",
    G07: "🛒",
    G08: "🛒",
    G09: "🛒",
    G10: "🛒",
    G11: "🛒",
    G12: "🛒",
    G13: "🛒",
    G14: "🛒",
    G15: "🛒",
    G16: "🛒",
    G17: "🛒",
    G18: "🛒",
    G19: "🛒",
    G20: "🛒",
    G21: "🛒",
    G22: "🛒",
    F01: "🥶",
    F02: "🥶",
    C01: "📦",
    CS01: "📦",
    FLV: "🍎",
    PAO: "🥖",
    SORVETE: "🍦",
    GELO: "🧊",
    I01: "🏢",
    PA01: "📦",
    PF01: "🥩",
    PF02: "🥩",
    PF03: "🥩",
    PL01: "🧴",
    PL02: "🧴",
  };

  for (const [key, icone] of Object.entries(icones)) {
    if (local.includes(key)) return icone;
  }

  return "📍";
};

const formatarNomeCorredor = (local) => {
  // Remove duplicatas como "G01A - G01A" para "G01A"
  const partes = local.split(" - ");
  if (partes[0] === partes[1]) {
    return partes[0];
  }
  return local;
};

const getTipoAuditoriaLabel = () => {
  const labels = {
    etiquetas: "Auditoria de Etiquetas",
    presencas: "Auditoria de Presenças",
    rupturas: "Auditoria de Rupturas",
  };
  return labels[tipoAuditoriaAtual.value] || "Auditoria";
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

// Função para buscar dados reais da API
const buscarDadosCorredores = async () => {
  try {
    carregando.value = true;
    erro.value = null;

    // Verificar se há loja selecionada
    if (!lojaStore.codigoLojaAtual) {
      throw new Error("Nenhuma loja selecionada. Por favor, selecione uma loja.");
    }

    console.log(`🔍 Buscando desempenho por corredor para loja: ${lojaStore.codigoLojaAtual}`);

    // Buscar métricas de desempenho por corredor (locais)
    const response = await axios.get(
      "/api/api/metricas/loja-daily/locais-completas",
      {
        headers: {
          "x-loja": lojaStore.codigoLojaAtual,
        },
      }
    );

    if (response.data) {
      console.log("📊 Dados recebidos da API:", response.data);

      // O endpoint atual retorna dados por classes, mas precisamos converter para locais (corredores)
      // A estrutura esperada pelo componente é locaisLeitura, mas o endpoint retorna classesLeitura
      // Vamos verificar se o backend tem os dados estruturados corretamente

      dadosReais.value = {
        loja: response.data.lojaNome || "056",
        data: response.data.data || new Date().toISOString(),
        etiquetas: {
          locaisLeitura: response.data.etiquetas?.locaisLeitura || {}, // Usando diretamente do backend se disponível
          resumo: {
            totalItens: response.data.etiquetas?.resumo?.totalItens || 0,
            usuariosAtivos: response.data.etiquetas?.resumo?.usuariosAtivos || 0,
          },
        },
        rupturas: {
          locaisLeitura: response.data.rupturas?.locaisLeitura || {}, // Usando diretamente do backend se disponível
          resumo: {
            totalItens: response.data.rupturas?.resumo?.totalItens || 0,
            usuariosAtivos: response.data.rupturas?.resumo?.usuariosAtivos || 0,
          },
        },
        presencas: {
          locaisLeitura: response.data.presencas?.locaisLeitura || {}, // Usando diretamente do backend se disponível
          resumo: {
            totalItens: response.data.presencas?.resumo?.totalItens || 0,
            usuariosAtivos: response.data.presencas?.resumo?.usuariosAtivos || 0,
          },
        },
      };

      console.log("✅ Dados processados:", dadosReais.value);

      // Verificar se há dados de locais, caso contrário informar ao usuário
      const totalLocais = Object.keys(dadosReais.value.etiquetas.locaisLeitura).length +
                         Object.keys(dadosReais.value.rupturas.locaisLeitura).length +
                         Object.keys(dadosReais.value.presencas.locaisLeitura).length;

      if (totalLocais === 0) {
        console.log("⚠️ Nenhum dado de locais encontrado, verifique se o backend tem os dados corretos");
      }
    }
  } catch (error) {
    console.error("❌ Erro ao buscar desempenho por corredor:", error);

    if (error.response?.status === 400) {
      erro.value = "Loja não selecionada ou inválida. Por favor, selecione uma loja.";
    } else if (error.response?.status === 404) {
      erro.value = "Nenhuma métrica encontrada para a loja e data especificadas.";
    } else if (error.message.includes("loja selecionada")) {
      erro.value = error.message;
    } else {
      erro.value = `Erro ao carregar métricas: ${error.message}`;
    }
  } finally {
    carregando.value = false;
  }
};

// Inicialização
onMounted(() => {
  console.log("📦 Componente DesempenhoCorredores montado");
  buscarDadosCorredores();
});
</script>

<style scoped>
.desempenho-corredores-container {
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
}
</style>