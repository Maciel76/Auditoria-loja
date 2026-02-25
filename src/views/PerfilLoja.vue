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

    <div v-else>
      <!-- Header do Perfil da Loja -->
      <PerfilHeader
        :loja="loja"
        :metricas="metricas"
        :percentualDesempenho="percentualDesempenho"
      />
      <SummaryCards
        :auditorias="25"
        :posicao="2"
        colaborador="Maria Silva"
        :total-colaboradores="30"
        :variacao="8"
      />
      <!-- Cards de Estatísticas -->
      <!-- <EstatisticaCard /> -->
      <InsightsLoja :loja="loja" :metricas="metricas" :insights="insights" />
      <MetricasSetor />

      <!-- Mapa de Performance -->
      <PerformanceMap />

      <!-- Ranking de Colaboradores -->
      <RankingColaboradores />

      <!-- Métricas Detalhadas de Auditoria -->
      <TesteMetricas />

      <!-- Timeline de Atividades Recentes -->
      <!-- <TimelineAtividades
        :atividades="atividadesRecentes"
        titulo="Atividades Recentes"
        v-if="atividadesRecentes.length > 0"
      /> -->

      <!-- Métricas por Tipo de Auditoria -->
      <MetricasAuditoria
        :metricasAuditoria="metricasAuditoria"
        v-if="Object.keys(metricasAuditoria).length > 0"
      />

      <!-- Insights e Recomendações -->

      <!-- Gráficos de Performance -->
      <!-- <GraficosPerformance
        :dadosGraficos="dadosGraficos"
        v-if="dadosGraficos.length > 0"
      /> -->

      <!-- Botões de Ação -->
      <!-- <BotoesAcao
        @exportarRelatorio="exportarRelatorio"
        @gerarQRCode="gerarQRCode"
        @compartilharPerfil="compartilharPerfil"
      /> -->
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useLojaStore } from "../store/lojaStore";
import { computed, ref, onMounted } from "vue";
import axios from "axios";

// Componentes
import PerfilHeader from "./PerfilLoja/PerfilHeader.vue";
import SummaryCards from "./PerfilLoja/SumaryCards.vue";
import EstatisticaCard from "./PerfilLoja/EstatisticaCard.vue";
import MetricasSetor from "./PerfilLoja/MetricasSetor.vue";
import PerformanceMap from "./PerfilLoja/PerformanceMap.vue";
import RankingColaboradores from "./PerfilLoja/RankingColaboradores.vue";
import TimelineAtividades from "./PerfilLoja/TimelineAtividades.vue";
import MetricasAuditoria from "./PerfilLoja/MetricasAuditoria.vue";
import InsightsLoja from "./PerfilLoja/InsightsLoja.vue";
import GraficosPerformance from "./PerfilLoja/GraficosPerformance.vue";
import BotoesAcao from "./PerfilLoja/BotoesAcao.vue";
import TesteMetricas from "./PerfilLoja/TesteMetricas.vue";

export default {
  name: "PerfilLoja",
  components: {
    PerfilHeader,
    EstatisticaCard,
    PerformanceMap,
    RankingColaboradores,
    TimelineAtividades,
    MetricasAuditoria,
    InsightsLoja,
    GraficosPerformance,
    BotoesAcao,
    SummaryCards,
    MetricasSetor,
    TesteMetricas,
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
    const metricasSetores = ref([]);
    const colaboradores = ref([]);
    const atividadesRecentes = ref([]);
    const metricasAuditoria = ref({});
    const insights = ref([]);
    const dadosGraficos = ref([]);

    const voltarParaDashboard = () => {
      router.push("/dashboard");
    };

    const percentualDesempenho = computed(() => {
      return Math.min(100, Math.round((metricas.value.taxaAcerto || 0) * 1.2));
    });

    onMounted(async () => {
      // 🔥 IMPORTANTE: Selecionar a loja no store ANTES de carregar dados
      console.log(`🏪 Selecionando loja ${props.codigo} no store...`);

      // Buscar loja completa da lista do store
      const lojaCompleta = lojaStore.lojas.find(
        (l) => l.codigo === props.codigo
      );

      if (lojaCompleta) {
        // Selecionar loja no store (isso configura o header x-loja)
        await lojaStore.selecionarLoja(lojaCompleta);
        console.log(`✅ Loja ${props.codigo} selecionada no store`);
      } else {
        console.warn(
          `⚠️ Loja ${props.codigo} não encontrada na lista do store`
        );
      }

      await carregarDadosLoja(props.codigo, lojaCompleta);
    });

    const carregarDadosLoja = async (codigoLoja, lojaCompleta) => {
      try {
        carregando.value = true;

        // Buscar dados reais da API usando axios
        const response = await axios.get(
          `/api/api/perfil-loja/${codigoLoja}`
        );

        const data = response.data;

        // Atualizar os dados com os retornados pela API
        loja.value = {
          ...data.loja,
          nome: data.loja.nome,
          cidade: data.loja.cidade,
          endereco: data.loja.endereco || "Endereço não informado",
          telefone: data.loja.metadata?.telefone || "(00) 00000-0000",
          gerente: data.loja.metadata?.gerente || "Não informado",
          // Use image from store if available, otherwise use from API
          imagem: lojaCompleta?.imagem || data.loja.imagem,
          coverId: data.loja.coverId, // Certificar que o coverId seja incluído
          selectedBadges: data.loja.selectedBadges || [], // Carregar os selos selecionados
          iniciais: data.loja.nome
            ? data.loja.nome.substring(0, 2).toUpperCase()
            : "NL",
        };

        metricas.value = data.metricas;
        metricasSetores.value = data.metricasSetores;
        colaboradores.value = data.colaboradores;
        atividadesRecentes.value = data.atividadesRecentes;
        metricasAuditoria.value = data.metricasAuditoria;
        insights.value = data.insights;
        dadosGraficos.value = data.dadosGraficos;
      } catch (error) {
        console.error("Erro ao carregar dados da loja:", error);

        // Em caso de erro, manter dados básicos para evitar falhas na UI
        loja.value = {
          codigo: codigoLoja,
          nome: `Loja ${codigoLoja}`,
          cidade: "Cidade Exemplo",
          endereco: "Erro ao carregar dados",
          telefone: "(00) 00000-0000",
          gerente: "Não informado",
          imagem: null,
          coverId: "gradient-1", // Valor padrão em caso de erro
          iniciais: codigoLoja.substring(0, 2).toUpperCase(),
        };
      } finally {
        carregando.value = false;
      }
    };

    const exportarRelatorio = () => {
      const relatorioData = {
        "Código da Loja": loja.value.codigo,
        "Nome da Loja": loja.value.nome,
        "Total de Auditorias": metricas.value.totalAuditorias,
        "Itens Verificados": metricas.value.itensVerificados,
        "Taxa de Acerto": `${metricas.value.taxaAcerto}%`,
        "Colaboradores Ativos": metricas.value.colaboradoresAtivos,
        "Data de Geração": new Date().toLocaleDateString("pt-BR"),
      };

      const csvContent = [
        "Item,Valor",
        ...Object.entries(relatorioData).map(
          ([key, value]) => `"${key}","${value}"`
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `relatorio_loja_${loja.value.codigo}_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const gerarQRCode = () => {
      // Implementar geração de QR Code
      console.log("Gerando QR Code para a loja:", loja.value.codigo);
    };

    const compartilharPerfil = () => {
      if (navigator.share) {
        navigator
          .share({
            title: `Perfil da Loja ${loja.value.codigo}`,
            text: `Confira o desempenho da ${loja.value.nome} no sistema de auditoria!`,
            url: window.location.href,
          })
          .catch(console.error);
      } else {
        alert(
          "Seu navegador não suporta a funcionalidade de compartilhamento."
        );
      }
    };

    return {
      loja,
      carregando,
      metricas,
      metricasSetores,
      colaboradores,
      atividadesRecentes,
      metricasAuditoria,
      insights,
      dadosGraficos,
      percentualDesempenho,
      voltarParaDashboard,
      exportarRelatorio,
      gerarQRCode,
      compartilharPerfil,
    };
  },
};
</script>

<style scoped>
.perfil-loja-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  font-family: "Poppins", sans-serif;
}

.navigation-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.back-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 28px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
  transform: translateY(-2px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-container .spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-container .error-icon {
  font-size: 4rem;
  color: #ff6b6b;
  margin-bottom: 20px;
}

.error-container h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.error-container p {
  color: #7f8c8d;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.error-container .btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.error-container .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

/* Responsividade */
@media (max-width: 768px) {
  .perfil-loja-container {
    max-width: 100%;
    padding: 15px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .back-btn {
    padding: 10px 20px;
    font-size: 1rem;
  }

  .loading-container,
  .error-container {
    padding: 40px 15px;
  }
}

@media (max-width: 480px) {
  .navigation-section {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .perfil-loja-container {
    max-width: 100%;
    padding: 15px;
  }
  .back-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
