<template>
  <div class="perfil-loja-container">
    <!-- Botão Voltar -->

    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando perfil da loja...</p>
    </div>

    <div v-else-if="!loja.codigo" class="error-container">
      <div class="error-icon">
        <i class="fas fa-store-slash"></i>
      </div>
      <h3>Loja não encontrada</h3>
      <p>A loja solicitada não foi encontrada no sistema.</p>
      <button @click="voltarParaDashboard" class="btn btn-primary">
        Voltar para dashboard
      </button>
    </div>

    <div v-else class="perfil-content">
      <!-- Header do Perfil da Loja -->
      <PerfilHeader
        :loja="loja"
        :metricas="metricas"
        :percentualDesempenho="percentualDesempenho"
      />

      <!-- KPIs principais (busca dados reais via /metricas/lojas) -->
      <SummaryCards />

      <!-- Insights consolidados (busca dados reais via insightsStore) -->
      <InsightsLoja />

      <!-- Métricas por Classe de Produto -->
      <MetricasSetor />

      <!-- Mapa de Performance por Corredor/Local -->
      <PerformanceMap />

      <!-- Ranking de Colaboradores -->
      <RankingColaboradores />

      <!-- Métricas detalhadas de auditoria -->
      <MetricasAuditoria />
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useLojaStore } from "../store/lojaStore";
import { computed, ref, onMounted, watch } from "vue";
import api from "@/services/api";

// Componentes
import PerfilHeader from "./PerfilLoja/PerfilHeader.vue";
import SummaryCards from "./PerfilLoja/SumaryCards.vue";
import MetricasSetor from "./PerfilLoja/MetricasSetor.vue";
import PerformanceMap from "./PerfilLoja/PerformanceMap.vue";
import RankingColaboradores from "./PerfilLoja/RankingColaboradores.vue";
import MetricasAuditoria from "./PerfilLoja/MetricasAuditoria.vue";
import InsightsLoja from "./PerfilLoja/InsightsLoja.vue";

export default {
  name: "PerfilLoja",
  components: {
    PerfilHeader,
    SummaryCards,
    MetricasSetor,
    PerformanceMap,
    RankingColaboradores,
    MetricasAuditoria,
    InsightsLoja,
  },
  props: {
    codigo: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const lojaStore = useLojaStore();

    const loja = ref({});
    const carregando = ref(true);
    const metricas = ref({});

    const voltarParaDashboard = () => {
      router.push("/dashboard");
    };

    const percentualDesempenho = computed(() => {
      const conclusao =
        metricas.value?.totais?.percentualConclusaoGeral ??
        metricas.value?.taxaAcerto ??
        0;
      return Math.min(100, Math.round(conclusao));
    });

    const carregarDadosLoja = async (codigoLoja, lojaCompleta) => {
      try {
        carregando.value = true;
        const response = await api.get(`/api/perfil-loja/${codigoLoja}`);
        const data = response.data || {};

        loja.value = {
          ...(data.loja || {}),
          codigo: data.loja?.codigo || codigoLoja,
          nome: data.loja?.nome || `Loja ${codigoLoja}`,
          cidade: data.loja?.cidade || "—",
          endereco: data.loja?.endereco || "Endereço não informado",
          telefone: data.loja?.metadata?.telefone || "—",
          gerente: data.loja?.metadata?.gerente || "Não informado",
          imagem: lojaCompleta?.imagem || data.loja?.imagem,
          coverId: data.loja?.coverId || "gradient-1",
          selectedBadges: data.loja?.selectedBadges || [],
          iniciais: (data.loja?.nome || codigoLoja)
            .substring(0, 2)
            .toUpperCase(),
        };

        metricas.value = data.metricas || {};
      } catch (error) {
        console.error("[PerfilLoja] Erro ao carregar dados:", error);
        loja.value = {
          codigo: codigoLoja,
          nome: `Loja ${codigoLoja}`,
          cidade: "—",
          endereco: "Erro ao carregar dados",
          telefone: "—",
          gerente: "Não informado",
          imagem: null,
          coverId: "gradient-1",
          iniciais: codigoLoja.substring(0, 2).toUpperCase(),
        };
      } finally {
        carregando.value = false;
      }
    };

    const inicializar = async (codigo) => {
      const lojaCompleta = lojaStore.lojas.find((l) => l.codigo === codigo);
      if (lojaCompleta) {
        await lojaStore.selecionarLoja(lojaCompleta);
      }
      await carregarDadosLoja(codigo, lojaCompleta);
    };

    onMounted(() => inicializar(props.codigo));
    watch(
      () => props.codigo,
      (novo) => novo && inicializar(novo),
    );

    return {
      loja,
      carregando,
      metricas,
      percentualDesempenho,
      voltarParaDashboard,
    };
  },
};
</script>

<style scoped>
.perfil-loja-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  font-family: "Inter", "Poppins", sans-serif;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}

.perfil-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 80px 20px;
}

.loading-container .spinner {
  border: 4px solid #e2e8f0;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-container .error-icon {
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 20px;
}

.error-container h3 {
  color: #1e293b;
  margin-bottom: 12px;
  font-size: 1.5rem;
  font-weight: 700;
}

.error-container p {
  color: #64748b;
  margin-bottom: 28px;
  font-size: 1rem;
}

.error-container .btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.error-container .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

@media (max-width: 768px) {
  .perfil-loja-container { padding: 12px; }
  .perfil-content { gap: 1rem; }
}
</style>
