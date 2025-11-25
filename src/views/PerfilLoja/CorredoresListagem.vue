<template>
  <div class="corredores-listagem-container">
    <!-- Indicador de carregamento -->
    <div v-if="carregando" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando dados dos corredores...</p>
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
      <div class="header">
        <h3>🏬 Lista de Corredores e Locais</h3>
        <div class="acoes">
          <select 
            v-model="tipoAuditoriaSelecionado" 
            class="seletor-tipo"
            @change="buscarDadosCorredores"
          >
            <option value="etiquetas">Etiquetas</option>
            <option value="presencas">Presenças</option>
            <option value="rupturas">Rupturas</option>
          </select>
        </div>
      </div>

      <div class="resumo-container">
        <div class="resumo-card">
          <h4>📊 Resumo Geral</h4>
          <p><strong>Total de Itens:</strong> {{ resumo.totalItens }}</p>
          <p><strong>Itens Válidos:</strong> {{ resumo.itensValidos }}</p>
          <p><strong>Itens Lidos:</strong> {{ resumo.itensLidos }}</p>
          <p><strong>Conclusão:</strong> {{ resumo.percentualConclusao.toFixed(2) }}%</p>
          <p><strong>Usuários Ativos:</strong> {{ resumo.usuariosAtivos }}</p>
        </div>
      </div>

      <div class="filtro-container">
        <input 
          v-model="filtroBusca" 
          type="text" 
          placeholder="Buscar corredor (ex: G01, F01, FLV...)"
          class="filtro-input"
        />
        <div class="filtro-status">
          <label>
            <input 
              v-model="filtroStatus" 
              type="radio" 
              value="todos"
            /> Todos
          </label>
          <label>
            <input 
              v-model="filtroStatus" 
              type="radio" 
              value="excelente"
            /> Excelente (>90%)
          </label>
          <label>
            <input 
              v-model="filtroStatus" 
              type="radio" 
              value="bom"
            /> Bom (80-90%)
          </label>
          <label>
            <input 
              v-model="filtroStatus" 
              type="radio" 
              value="medio"
            /> Médio (70-79%)
          </label>
          <label>
            <input 
              v-model="filtroStatus" 
              type="radio" 
              value="baixo"
            /> Baixo (<70%)
          </label>
        </div>
      </div>

      <div class="corredores-grid">
        <div 
          v-for="corredor in corredoresFiltrados" 
          :key="corredor.local"
          class="corredor-card"
          :class="getClasseStatus(corredor)"
        >
          <div class="corredor-header">
            <div class="corredor-icon">{{ getIconeCorredor(corredor.local) }}</div>
            <div class="corredor-info">
              <h4>{{ formatarNomeCorredor(corredor.local) }}</h4>
              <div class="percentual">{{ getPercentualLeitura(corredor).toFixed(2) }}%</div>
            </div>
            <div class="status-badge" :class="getClasseStatus(corredor)">
              {{ getStatusLabel(getPercentualLeitura(corredor)) }}
            </div>
          </div>

          <div class="corredor-detalhes">
            <div class="detalhe-item">
              <span class="label">Total Itens:</span>
              <span class="value">{{ corredor.total }}</span>
            </div>
            <div class="detalhe-item">
              <span class="label">Itens Válidos:</span>
              <span class="value">{{ corredor.itensValidos }}</span>
            </div>
            <div class="detalhe-item">
              <span class="label">Itens Lidos:</span>
              <span class="value">{{ corredor.lidos }}</span>
            </div>
            <div class="detalhe-item">
              <span class="label">Colaboradores:</span>
              <span class="value">{{ Object.keys(corredor.usuarios || {}).length }}</span>
            </div>
          </div>

          <div class="progress-container">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: getPercentualLeitura(corredor) + '%' }"
                :class="getClasseDesempenho(getPercentualLeitura(corredor))"
              ></div>
            </div>
          </div>

          <div class="acoes-corredor">
            <button 
              class="visualizar-btn"
              @click="verDetalhes(corredor)"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de Detalhes -->
      <div v-if="corredorSelecionado" class="modal-overlay" @click="fecharModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ formatarNomeCorredor(corredorSelecionado.local) }}</h3>
            <button class="modal-close" @click="fecharModal">×</button>
          </div>
          
          <div class="modal-body">
            <div class="detalhes-principais">
              <div class="metrica-item">
                <div class="metrica-label">Tipo de Auditoria</div>
                <div class="metrica-valor">{{ tipoAuditoriaSelecionado }}</div>
              </div>
              <div class="metrica-item">
                <div class="metrica-label">Total de Itens</div>
                <div class="metrica-valor">{{ corredorSelecionado.total }}</div>
              </div>
              <div class="metrica-item">
                <div class="metrica-label">Itens Válidos</div>
                <div class="metrica-valor">{{ corredorSelecionado.itensValidos }}</div>
              </div>
              <div class="metrica-item">
                <div class="metrica-label">Itens Lidos</div>
                <div class="metrica-valor">{{ corredorSelecionado.lidos }}</div>
              </div>
              <div class="metrica-item">
                <div class="metrica-label">Percentual</div>
                <div class="metrica-valor">{{ getPercentualLeitura(corredorSelecionado).toFixed(2) }}%</div>
              </div>
              <div class="metrica-item">
                <div class="metrica-label">Colaboradores</div>
                <div class="metrica-valor">{{ Object.keys(corredorSelecionado.usuarios || {}).length }}</div>
              </div>
            </div>

            <div v-if="Object.keys(corredorSelecionado.usuarios || {}).length > 0" class="colaboradores-secao">
              <h4>👥 Colaboradores</h4>
              <div class="colaboradores-lista">
                <div 
                  v-for="(quantidade, usuario) in corredorSelecionado.usuarios" 
                  :key="usuario"
                  class="colaborador-item"
                >
                  <span class="usuario-nome">{{ usuario }}</span>
                  <span class="usuario-itens">{{ quantidade }} itens</span>
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

// Estados
const carregando = ref(true);
const erro = ref(null);
const dadosBrutos = ref({
  etiquetas: { locaisLeitura: {}, resumo: {} },
  rupturas: { locaisLeitura: {}, resumo: {} },
  presencas: { locaisLeitura: {}, resumo: {} },
});
const tipoAuditoriaSelecionado = ref("etiquetas");
const filtroBusca = ref("");
const filtroStatus = ref("todos");
const corredorSelecionado = ref(null);

// Obter dados dos corredores
const buscarDadosCorredores = async () => {
  try {
    carregando.value = true;
    erro.value = null;

    if (!lojaStore.codigoLojaAtual) {
      throw new Error("Nenhuma loja selecionada. Por favor, selecione uma loja.");
    }

    const response = await axios.get(
      "http://localhost:3000/api/metricas/loja-daily/locais-completas",
      {
        headers: {
          "x-loja": lojaStore.codigoLojaAtual,
        },
      }
    );

    if (response.data) {
      dadosBrutos.value = {
        etiquetas: response.data.etiquetas || { locaisLeitura: {}, resumo: {} },
        rupturas: response.data.rupturas || { locaisLeitura: {}, resumo: {} },
        presencas: response.data.presencas || { locaisLeitura: {}, resumo: {} },
      };
    }
  } catch (error) {
    console.error("Erro ao buscar dados dos corredores:", error);
    erro.value = "Erro ao carregar dados dos corredores. Tente novamente mais tarde.";
  } finally {
    carregando.value = false;
  }
};

// Obter dados filtrados por tipo de auditoria
const dadosCorrente = computed(() => {
  return dadosBrutos.value[tipoAuditoriaSelecionado.value] || { locaisLeitura: {}, resumo: {} };
});

// Obter corredores atuais
const corredoresAtuais = computed(() => {
  const locais = dadosCorrente.value.locaisLeitura || {};
  return Object.entries(locais).map(([local, dados]) => ({
    local,
    ...dados,
    tipoAuditoria: tipoAuditoriaSelecionado.value
  }));
});

// Obter resumo
const resumo = computed(() => {
  return dadosCorrente.value.resumo || {};
});

// Filtrar corredores
const corredoresFiltrados = computed(() => {
  let corredores = corredoresAtuais.value;

  // Filtrar por busca
  if (filtroBusca.value) {
    const busca = filtroBusca.value.toLowerCase();
    corredores = corredores.filter(corredor => 
      corredor.local.toLowerCase().includes(busca) ||
      formatarNomeCorredor(corredor.local).toLowerCase().includes(busca)
    );
  }

  // Filtrar por status
  if (filtroStatus.value !== 'todos') {
    corredores = corredores.filter(corredor => {
      const percentual = getPercentualLeitura(corredor);
      switch (filtroStatus.value) {
        case 'excelente': return percentual >= 90;
        case 'bom': return percentual >= 80 && percentual < 90;
        case 'medio': return percentual >= 70 && percentual < 80;
        case 'baixo': return percentual < 70;
        default: return true;
      }
    });
  }

  return corredores;
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

const getClasseStatus = (corredor) => {
  return getClasseDesempenho(getPercentualLeitura(corredor));
};

const getStatusLabel = (valor) => {
  if (valor >= 90) return "Excelente";
  if (valor >= 80) return "Bom";
  if (valor >= 70) return "Médio";
  return "Baixo";
};

const getIconeCorredor = (local) => {
  const icones = {
    G01: "🛒", G02: "🛒", G03: "🛒", G04: "🛒", G05: "🛒", G06: "🛒", G07: "🛒", 
    G08: "🛒", G09: "🛒", G10: "🛒", G11: "🛒", G12: "🛒", G13: "🛒", G14: "🛒", 
    G15: "🛒", G16: "🛒", G17: "🛒", G18: "🛒", G19: "🛒", G20: "🛒", G21: "🛒", G22: "🛒",
    F01: "🥶", F02: "🥶", 
    C01: "📦", CS01: "📦",
    FLV: "🍎",
    PAO: "🥖",
    SORVETE: "🍦",
    GELO: "🧊",
    I01: "🏢",
    PA01: "📦",
    PF01: "🥩", PF02: "🥩", PF03: "🥩",
    PL01: "🧴", PL02: "🧴",
  };

  for (const [key, icone] of Object.entries(icones)) {
    if (local.includes(key)) return icone;
  }

  return "📍";
};

const formatarNomeCorredor = (local) => {
  const partes = local.split(" - ");
  if (partes[0] === partes[1]) {
    return partes[0];
  }
  return local;
};

const verDetalhes = (corredor) => {
  corredorSelecionado.value = corredor;
};

const fecharModal = () => {
  corredorSelecionado.value = null;
};

// Inicialização
onMounted(() => {
  buscarDadosCorredores();
});
</script>

<style scoped>
.corredores-listagem-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin: 1rem 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.4rem;
}

.acoes {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.seletor-tipo {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  background: white;
  color: #4a5568;
}

.resumo-container {
  margin-bottom: 1.5rem;
}

.resumo-card {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.resumo-card h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.resumo-card p {
  margin: 0.5rem 0;
  color: #4a5568;
}

.filtro-container {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.filtro-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.filtro-status {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.filtro-status label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  cursor: pointer;
}

.corredores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.corredor-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.corredor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.corredor-card.excelente {
  border-left: 4px solid #48bb78;
}

.corredor-card.bom {
  border-left: 4px solid #4299e1;
}

.corredor-card.medio {
  border-left: 4px solid #ed8936;
}

.corredor-card.baixo {
  border-left: 4px solid #f56565;
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
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.corredor-info {
  flex: 1;
}

.corredor-info h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.percentual {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.excelente {
  background: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.status-badge.bom {
  background: rgba(66, 153, 225, 0.1);
  color: #4299e1;
}

.status-badge.medio {
  background: rgba(237, 137, 54, 0.1);
  color: #ed8936;
}

.status-badge.baixo {
  background: rgba(245, 101, 101, 0.1);
  color: #f56565;
}

.corredor-detalhes {
  margin-bottom: 1rem;
}

.detalhe-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
}

.detalhe-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #718096;
  font-weight: 500;
}

.value {
  color: #2c3e50;
  font-weight: 600;
}

.progress-container {
  margin-bottom: 1rem;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
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

.acoes-corredor {
  display: flex;
  justify-content: flex-end;
}

.visualizar-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.visualizar-btn:hover {
  background: #5a6fd8;
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
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
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

.detalhes-principais {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
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
  margin-bottom: 0.25rem;
}

.metrica-valor {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
}

.colaboradores-secao {
  margin-top: 1.5rem;
}

.colaboradores-secao h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.colaboradores-lista {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.colaborador-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.usuario-nome {
  font-weight: 600;
  color: #2c3e50;
}

.usuario-itens {
  color: #718096;
  font-weight: 500;
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

/* Responsividade */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filtro-status {
    justify-content: center;
  }
  
  .detalhes-principais {
    grid-template-columns: 1fr;
  }
  
  .corredores-grid {
    grid-template-columns: 1fr;
  }
}
</style>