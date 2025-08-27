<template>
  <div class="relatorios-dashboard">
    <!-- HEADER PRINCIPAL -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">
          <span class="icon">📊</span> Dashboard de Auditorias
        </h1>
        <p class="dashboard-subtitle">Dados em tempo real da nova base</p>
      </div>

      <div class="header-actions">
        <div class="info-badge">
          <i class="fas fa-database"></i>
          Nova Coleção: Auditorias
        </div>
        <button
          @click="testarConexaoAPI"
          class="btn btn-test"
          :disabled="testandoConexao"
        >
          <i class="fas fa-wifi" :class="{ 'fa-spin': testandoConexao }"></i>
          Testar Conexão
        </button>
        <button
          @click="atualizarDashboard"
          class="btn btn-refresh"
          :disabled="carregando"
        >
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': carregando }"></i>
          Atualizar
        </button>
      </div>
    </div>

    <!-- STATUS DA API -->
    <div
      v-if="statusAPI !== null"
      :class="['api-status', statusAPI.success ? 'api-success' : 'api-error']"
    >
      <i
        :class="
          statusAPI.success
            ? 'fas fa-check-circle'
            : 'fas fa-exclamation-triangle'
        "
      ></i>
      {{ statusAPI.message }}
      <span v-if="statusAPI.endpoint"
        >(Endpoint: {{ statusAPI.endpoint }})</span
      >
    </div>

    <!-- FILTROS AVANÇADOS -->
    <div class="filtros-avancados">
      <div class="filtro-group">
        <label>Tipo de Auditoria:</label>
        <select v-model="filtros.tipo" @change="carregarDados">
          <option value="todos">Todos os Tipos</option>
          <option value="etiqueta">Etiquetas</option>
          <option value="presenca">Presença</option>
          <option value="ruptura">Ruptura</option>
        </select>
      </div>

      <div class="filtro-group">
        <label>Período:</label>
        <select v-model="filtros.periodo" @change="carregarDados">
          <option value="hoje">Hoje</option>
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mês</option>
          <option value="30dias">Últimos 30 Dias</option>
        </select>
      </div>
    </div>

    <!-- ALERTAS DO SISTEMA -->
    <div v-if="alertas.length > 0" class="alertas-container">
      <div
        v-for="(alerta, index) in alertas"
        :key="index"
        :class="['alerta', `alerta-${alerta.tipo}`]"
      >
        <div class="alerta-icon">
          <i
            v-if="alerta.tipo === 'critico'"
            class="fas fa-exclamation-circle"
          ></i>
          <i
            v-else-if="alerta.tipo === 'aviso'"
            class="fas fa-exclamation-triangle"
          ></i>
          <i v-else class="fas fa-info-circle"></i>
        </div>
        <div class="alerta-content">
          <h4>{{ alerta.mensagem }}</h4>
          <p>{{ alerta.acao }}</p>
          <small v-if="alerta.detalhes">{{ alerta.detalhes }}</small>
        </div>
        <button @click="removerAlerta(index)" class="alerta-fechar">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- CARREGAMENTO -->
    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando dashboard...</p>
      <p class="loading-step">{{ passoCarregamento }}</p>
    </div>

    <!-- ERRO -->
    <div v-else-if="erro" class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3>Erro ao carregar dados</h3>
      <p>{{ erro }}</p>
      <div class="error-actions">
        <button @click="carregarDados" class="btn btn-refresh">
          <i class="fas fa-sync-alt"></i> Tentar Novamente
        </button>
        <button @click="testarConexaoAPI" class="btn btn-test">
          <i class="fas fa-wifi"></i> Testar Conexão
        </button>
      </div>
    </div>

    <!-- CONTEÚDO PRINCIPAL -->
    <div v-else-if="dadosCarregados" class="dashboard-content">
      <!-- METRICAS PRINCIPAIS -->
      <div class="metricas-principais">
        <div class="metrica-card">
          <div class="metrica-icon" style="background: #667eea">
            <i class="fas fa-cubes"></i>
          </div>
          <div class="metrica-info">
            <h3>{{ formatarNumero(estatisticas.totalItens) }}</h3>
            <p>Total de Itens</p>
            <span class="info-text">Base: Nova Coleção</span>
          </div>
        </div>

        <div class="metrica-card">
          <div class="metrica-icon" style="background: #4caf50">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="metrica-info">
            <h3>{{ formatarNumero(estatisticas.itensVerificados) }}</h3>
            <p>Itens Verificados</p>
            <span class="info-text"
              >{{ estatisticas.taxaConclusao }}% conclusão</span
            >
          </div>
        </div>

        <div class="metrica-card">
          <div class="metrica-icon" style="background: #ff9800">
            <i class="fas fa-users"></i>
          </div>
          <div class="metrica-info">
            <h3>{{ estatisticas.colaboradoresAtivos }}</h3>
            <p>Colaboradores</p>
            <span class="info-text"
              >{{ topColaboradores.length }} no ranking</span
            >
          </div>
        </div>

        <div class="metrica-card">
          <div class="metrica-icon" style="background: #e91e63">
            <i class="fas fa-database"></i>
          </div>
          <div class="metrica-info">
            <h3>{{ estatisticasPorTipo.length }}</h3>
            <p>Tipos de Auditoria</p>
            <span class="info-text"
              >{{ Object.keys(distribuicaoSituacao).length }} situações</span
            >
          </div>
        </div>
      </div>

      <!-- VISÃO GERAL -->
      <div class="visao-geral">
        <h3>📊 Visão Geral da Nova Coleção</h3>

        <div class="estatisticas-grid">
          <div class="estatistica-item">
            <h4>📈 Distribuição por Situação</h4>
            <div class="situacao-list">
              <div
                v-for="(quantidade, situacao) in distribuicaoSituacao"
                :key="situacao"
                class="situacao-item"
              >
                <span class="situacao-label">{{ situacao }}</span>
                <div class="situacao-bar">
                  <div
                    class="bar-fill"
                    :style="{
                      width:
                        calcularPercentual(
                          quantidade,
                          estatisticas.totalItens
                        ) + '%',
                      background: getCorSituacao(situacao),
                    }"
                  ></div>
                </div>
                <span class="situacao-value"
                  >{{ quantidade }} ({{
                    calcularPercentual(quantidade, estatisticas.totalItens)
                  }}%)</span
                >
              </div>
            </div>
          </div>

          <div class="estatistica-item">
            <h4>👥 Top 5 Colaboradores</h4>
            <div class="colaboradores-list">
              <div
                v-for="(colab, index) in topColaboradores.slice(0, 5)"
                :key="colab._id || index"
                class="colab-item"
              >
                <span class="colab-pos">{{ index + 1 }}º</span>
                <span class="colab-nome">{{
                  colab.nome || colab._id || "N/A"
                }}</span>
                <span class="colab-pontos"
                  >{{ colab.itensVerificados || 0 }} itens</span
                >
              </div>
              <div v-if="topColaboradores.length === 0" class="empty-data">
                <p>Nenhum colaborador encontrado</p>
              </div>
            </div>
          </div>
        </div>

        <div class="dados-adicionais">
          <div class="info-card">
            <h4>📋 Estatísticas por Tipo</h4>
            <div
              v-for="tipo in estatisticasPorTipo"
              :key="tipo._id"
              class="tipo-item"
            >
              <span class="tipo-nome">{{ formatarTipo(tipo._id) }}</span>
              <div class="tipo-stats">
                <span class="tipo-total">{{ tipo.total || 0 }} itens</span>
                <span class="tipo-percent"
                  >{{
                    calcularPercentual(tipo.total, estatisticas.totalItens)
                  }}%</span
                >
              </div>
            </div>
            <div v-if="estatisticasPorTipo.length === 0" class="empty-data">
              <p>Nenhum tipo de auditoria encontrado</p>
            </div>
          </div>

          <div class="info-card">
            <h4>ℹ️ Informações da Base</h4>
            <div class="info-item">
              <span class="info-label">Coleção:</span>
              <span class="info-value">Auditorias</span>
            </div>
            <div class="info-item">
              <span class="info-label">Período:</span>
              <span class="info-value">{{ periodoLabel }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Última atualização:</span>
              <span class="info-value">{{ ultimaAtualizacao }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Total de registros:</span>
              <span class="info-value">{{
                formatarNumero(estatisticas.totalItens)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ESTADO VAZIO -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-database"></i>
      </div>
      <h3>Nenhum dado disponível</h3>
      <p>Os dados da nova coleção ainda não foram carregados</p>
      <div class="empty-actions">
        <button @click="carregarDados" class="btn btn-primary">
          <i class="fas fa-sync-alt"></i> Carregar Dados
        </button>
        <button @click="testarConexaoAPI" class="btn btn-test">
          <i class="fas fa-wifi"></i> Testar Conexão API
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

export default {
  name: "RelatoriosDashboard",
  setup() {
    // Estados
    const carregando = ref(false);
    const testandoConexao = ref(false);
    const dadosCarregados = ref(false);
    const erro = ref(null);
    const statusAPI = ref(null);
    const passoCarregamento = ref("Iniciando...");

    // Filtros
    const filtros = ref({
      tipo: "todos",
      periodo: "30dias",
    });

    // Dados
    const estatisticas = ref({
      totalItens: 0,
      itensVerificados: 0,
      taxaConclusao: 0,
      colaboradoresAtivos: 0,
    });

    const topColaboradores = ref([]);
    const estatisticasPorTipo = ref([]);
    const distribuicaoSituacao = ref({});
    const alertas = ref([]);
    const ultimaAtualizacao = ref(null);

    // Computed
    const periodoLabel = computed(() => {
      const periodos = {
        hoje: "Hoje",
        semana: "Esta Semana",
        mes: "Este Mês",
        "30dias": "Últimos 30 Dias",
      };
      return periodos[filtros.value.periodo] || filtros.value.periodo;
    });

    // Funções
    const testarConexaoAPI = async () => {
      testandoConexao.value = true;
      statusAPI.value = null;

      const endpoints = [
        "/api/avancado/dashboard",
        "/api/avancado/estatisticas-tipo",
        "/api/avancado/distribuicao-situacao",
      ];

      for (const endpoint of endpoints) {
        try {
          passoCarregamento.value = `Testando ${endpoint}...`;
          const response = await axios.get(endpoint, { timeout: 5000 });

          statusAPI.value = {
            success: true,
            message: `API respondendo com sucesso`,
            endpoint: endpoint,
            status: response.status,
          };

          adicionarAlerta({
            tipo: "info",
            mensagem: `Conexão OK com ${endpoint}`,
            acao: `Status: ${response.status}`,
          });

          break; // Para no primeiro sucesso
        } catch (error) {
          console.error(`Erro no endpoint ${endpoint}:`, error);

          statusAPI.value = {
            success: false,
            message: `Falha na conexão com a API`,
            endpoint: endpoint,
            error: error.message,
          };
        }
      }

      testandoConexao.value = false;
    };

    const carregarDados = async () => {
      try {
        carregando.value = true;
        erro.value = null;
        passoCarregamento.value = "Iniciando carregamento...";

        const baseURL = "/api/avancado";
        const params = new URLSearchParams({
          periodo: filtros.value.periodo,
          tipo: filtros.value.tipo,
        }).toString();

        // 1. Carregar dashboard principal
        passoCarregamento.value = "Carregando dashboard...";
        const dashboardResponse = await fazerRequisicaoSegura(
          `${baseURL}/dashboard?${params}`
        );

        if (dashboardResponse?.data) {
          estatisticas.value = {
            totalItens: dashboardResponse.data.metricas?.totalItens || 0,
            itensVerificados:
              dashboardResponse.data.metricas?.itensVerificados || 0,
            taxaConclusao: dashboardResponse.data.metricas?.taxaConclusao || 0,
            colaboradoresAtivos:
              dashboardResponse.data.metricas?.colaboradoresAtivos || 0,
          };
          topColaboradores.value = Array.isArray(
            dashboardResponse.data.topColaboradores
          )
            ? dashboardResponse.data.topColaboradores
            : [];
        }

        // 2. Carregar estatísticas por tipo
        passoCarregamento.value = "Carregando tipos...";
        const tiposResponse = await fazerRequisicaoSegura(
          `${baseURL}/estatisticas-tipo?${params}`
        );
        estatisticasPorTipo.value = Array.isArray(
          tiposResponse?.data?.estatisticas
        )
          ? tiposResponse.data.estatisticas
          : [];

        // 3. Carregar distribuição por situação
        passoCarregamento.value = "Carregando situações...";
        const situacaoResponse = await fazerRequisicaoSegura(
          `${baseURL}/distribuicao-situacao?${params}`
        );
        distribuicaoSituacao.value =
          situacaoResponse?.data && typeof situacaoResponse.data === "object"
            ? situacaoResponse.data
            : {};

        dadosCarregados.value = true;
        ultimaAtualizacao.value = new Date().toLocaleString("pt-BR");

        adicionarAlerta({
          tipo: "info",
          mensagem: "Dados carregados com sucesso",
          acao: `Total: ${estatisticas.value.totalItens} itens da nova coleção`,
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        erro.value = error.message || "Erro desconhecido";

        adicionarAlerta({
          tipo: "critico",
          mensagem: "Falha ao carregar dados",
          acao: "Verifique a conexão com a API",
          detalhes: error.message,
        });
      } finally {
        carregando.value = false;
        passoCarregamento.value = "";
      }
    };

    const fazerRequisicaoSegura = async (url) => {
      try {
        const response = await axios.get(url, { timeout: 10000 });
        return response;
      } catch (error) {
        console.warn(`Requisição falhou para ${url}:`, error.message);
        return null;
      }
    };

    const adicionarAlerta = (alerta) => {
      alertas.value.push({
        ...alerta,
        timestamp: new Date(),
        id: Date.now() + Math.random(),
      });
    };

    const removerAlerta = (index) => {
      alertas.value.splice(index, 1);
    };

    const atualizarDashboard = () => {
      carregarDados();
    };

    const formatarNumero = (numero) => {
      return new Intl.NumberFormat("pt-BR").format(numero);
    };

    const formatarTipo = (tipo) => {
      const tipos = {
        etiqueta: "Etiquetas",
        presenca: "Presença",
        ruptura: "Ruptura",
      };
      return tipos[tipo] || tipo;
    };

    const calcularPercentual = (parcial, total) => {
      if (!total || total === 0) return 0;
      return ((parcial / total) * 100).toFixed(1);
    };

    const getCorSituacao = (situacao) => {
      const cores = {
        Atualizado: "#4caf50",
        "Não lido": "#ff9800",
        "Lido sem estoque": "#f44336",
        "Com problema": "#9c27b0",
      };
      return cores[situacao] || "#607d8b";
    };

    onMounted(() => {
      // Testar conexão primeiro
      testarConexaoAPI().then(() => {
        if (statusAPI.value?.success) {
          carregarDados();
        }
      });
    });

    return {
      carregando,
      testandoConexao,
      dadosCarregados,
      erro,
      statusAPI,
      passoCarregamento,
      filtros,
      estatisticas,
      topColaboradores,
      estatisticasPorTipo,
      distribuicaoSituacao,
      alertas,
      ultimaAtualizacao,
      periodoLabel,
      carregarDados,
      atualizarDashboard,
      testarConexaoAPI,
      removerAlerta,
      formatarNumero,
      formatarTipo,
      calcularPercentual,
      getCorSituacao,
    };
  },
};
</script>

<style scoped>
.relatorios-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* HEADER */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.header-content h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2.2rem;
}

.header-content p {
  margin: 5px 0 0 0;
  color: #7f8c8d;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* FILTROS */
.filtros-avancados {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.filtro-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}
/* ... (mantenha os estilos anteriores, mas adicione esses novos) */

.error-container {
  text-align: center;
  padding: 40px;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  margin: 20px 0;
}

.error-icon {
  font-size: 3rem;
  color: #e53e3e;
  margin-bottom: 20px;
}

.error-container h3 {
  color: #c53030;
  margin-bottom: 10px;
}

.empty-data {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-style: italic;
}

.alerta-fechar {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 5px;
  opacity: 0.7;
}

.alerta-fechar:hover {
  opacity: 1;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.status-item:last-child {
  border-bottom: none;
}

.status-item i {
  color: #667eea;
  width: 20px;
}

.filtro-group label {
  font-weight: 600;
  color: #2c3e50;
}

.filtro-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

/* ALERTAS */
.alertas-container {
  margin-bottom: 30px;
}

.alerta {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  border-left: 4px solid;
}

.alerta-critico {
  background: #fff5f5;
  border-color: #e53e3e;
  color: #c53030;
}

.alerta-aviso {
  background: #fffaf0;
  border-color: #dd6b20;
  color: #c05621;
}

.alerta-info {
  background: #ebf8ff;
  border-color: #3182ce;
  color: #2c5282;
}

.alerta-icon {
  font-size: 1.5rem;
  margin-right: 15px;
}

.alerta-content {
  flex: 1;
}

.alerta-content h4 {
  margin: 0;
  font-size: 1rem;
}

.alerta-content p {
  margin: 5px 0 0 0;
  opacity: 0.8;
}

.alerta-time {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* METRICAS PRINCIPAIS */
.metricas-principais {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metrica-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.2s ease;
}

.metrica-card:hover {
  transform: translateY(-2px);
}

.metrica-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.metrica-info h3 {
  margin: 0;
  font-size: 2rem;
  color: #2c3e50;
  font-weight: 700;
}

.metrica-info p {
  margin: 5px 0;
  color: #7f8c8d;
  font-weight: 500;
}

.variacao {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
}

.variacao.positiva {
  background: #c6f6d5;
  color: #2f855a;
}

.variacao.negativa {
  background: #fed7d7;
  color: #c53030;
}

/* TABS */
.tabs-navigation {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 10px;
}

.tab-button {
  padding: 12px 24px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #7f8c8d;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.tab-button.active {
  background: #667eea;
  color: white;
}

/* CONTEÚDO DAS ABAS */
.tab-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

/* VISÃO GERAL */
.graficos-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.grafico-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.grafico-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.grafico-placeholder i {
  font-size: 3rem;
  margin-bottom: 10px;
}

.dados-adicionais {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.info-card h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

/* BOTÕES */
.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-export {
  background: #28a745;
  color: white;
}

.btn-export:hover {
  background: #218838;
}

.btn-refresh {
  background: #17a2b8;
  color: white;
}

.btn-refresh:hover {
  background: #138496;
}

.btn-refresh:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* LOADING */
.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}
.info-badge {
  background: #667eea;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.info-badge i {
  margin-right: 5px;
}

.info-text {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-top: 5px;
}

.distribuicao-section {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.situacao-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.situacao-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.situacao-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.situacao-header h4 {
  margin: 0;
  font-size: 0.9rem;
  color: #2c3e50;
}

.badge {
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.situacao-percentual {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;
}

.progresso {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progresso-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Novos estilos para as abas */
.detalhes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.detalhe-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.detalhe-card h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.detalhe-card p {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #667eea;
}

.relatorios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.relatorio-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.relatorio-card:hover {
  transform: translateY(-2px);
}

.relatorio-icon {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 15px;
}

.relatorio-card h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.relatorio-card p {
  margin: 0 0 15px 0;
  color: #7f8c8d;
}

.btn-small {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.top-locais {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.local-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
}

.local-item .posicao {
  font-weight: bold;
  color: #667eea;
  min-width: 30px;
}

.local-item .nome {
  flex: 1;
  text-align: left;
  padding: 0 10px;
}

.local-item .valor {
  font-weight: 600;
  color: #2c3e50;
}

.tipo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.tipo-item:last-child {
  border-bottom: none;
}

.tipo-stats {
  display: flex;
  gap: 10px;
  align-items: center;
}

.tipo-stats .total {
  font-weight: 600;
  color: #2c3e50;
}

.tipo-stats .percentual {
  color: #7f8c8d;
  font-size: 0.9rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

/* RESPONSIVO */
@media (max-width: 1024px) {
  .graficos-row,
  .dados-adicionais {
    grid-template-columns: 1fr;
  }

  .metricas-principais {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .filtros-avancados {
    flex-direction: column;
  }

  .metricas-principais {
    grid-template-columns: 1fr;
  }

  .tabs-navigation {
    flex-wrap: wrap;
  }

  .tab-button {
    flex: 1;
    min-width: 120px;
  }
}
</style>
