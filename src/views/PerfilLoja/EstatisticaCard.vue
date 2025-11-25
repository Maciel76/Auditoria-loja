<template>
  <div class="auditoria-tipos-desempenho-container">
    <!-- Cabeçalho da Seção -->
    <div class="section-header">
      <div class="header-main">
        <div class="title-section">
          <div class="title-icon">📊</div>
          <div class="title-content">
            <h2>Análise de Auditorias por Corredor</h2>
            <p>Desempenho detalhado por tipo de auditoria e local</p>
          </div>
        </div>

        <!-- Botões de Tipo de Auditoria -->
        <div class="auditoria-tabs">
          <button
            class="tab-btn"
            :class="{ active: tipoAuditoriaAtual === 'etiquetas' }"
            @click="alterarTipoAuditoria('etiquetas')"
          >
            🏷️ Etiquetas
          </button>
          <button
            class="tab-btn"
            :class="{ active: tipoAuditoriaAtual === 'presencas' }"
            @click="alterarTipoAuditoria('presencas')"
          >
            👥 Presenças
          </button>
          <button
            class="tab-btn"
            :class="{ active: tipoAuditoriaAtual === 'rupturas' }"
            @click="alterarTipoAuditoria('rupturas')"
          >
            📦 Rupturas
          </button>
        </div>
      </div>

      <!-- Cards de Resumo -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon distribuição">📋</div>
          <div class="summary-content">
            <div class="summary-value">{{ totalItens }}</div>
            <div class="summary-label">Total de Itens</div>
            <div class="summary-subtitle">{{ getTipoAuditoriaLabel() }}</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon desempenho">🎯</div>
          <div class="summary-content">
            <div class="summary-value">{{ desempenhoMedio }}%</div>
            <div class="summary-label">Desempenho Médio</div>
            <div class="summary-subtitle">Conclusão</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon setor-destaque">🏆</div>
          <div class="summary-content">
            <div class="summary-value">{{ corredorDestaque.nome }}</div>
            <div class="summary-label">Melhor Corredor</div>
            <div class="summary-subtitle">
              {{ corredorDestaque.pontuacao }}%
            </div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon tipo-predominante">👥</div>
          <div class="summary-content">
            <div class="summary-value">{{ totalColaboradores }}</div>
            <div class="summary-label">Colaboradores</div>
            <div class="summary-subtitle">Ativos</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Principal de Gráficos -->
    <div class="graficos-main-section">
      <div class="graficos-grid">
        <!-- Distribuição por Corredor -->
        <div class="grafico-card tipos-auditoria">
          <div class="grafico-header">
            <div class="grafico-title">
              <h3>📋 Distribuição por Corredor</h3>
              <p>Itens totais, válidos e lidos por local</p>
            </div>
          </div>

          <div class="grafico-content">
            <div class="chart-container">
              <canvas ref="graficoBarras"></canvas>
            </div>

            <div class="detalhes-distribuicao">
              <div class="distribuicao-stats">
                <div class="stat-item">
                  <span class="stat-label">Total de Itens:</span>
                  <span class="stat-value">{{ totalItens }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Itens Válidos:</span>
                  <span class="stat-value">{{ totalItensValidos }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Itens Lidos:</span>
                  <span class="stat-value">{{ totalItensLidos }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Taxa de Conclusão:</span>
                  <span class="stat-value">{{ taxaConclusaoGeral }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desempenho por Corredor -->
        <div class="grafico-card desempenho-setor">
          <div class="grafico-header">
            <div class="grafico-title">
              <h3>🎯 Desempenho por Corredor</h3>
              <p>Percentual de conclusão por local</p>
            </div>
          </div>

          <div class="grafico-content">
            <div class="chart-container">
              <canvas ref="graficoRadar"></canvas>
            </div>

            <div class="detalhes-setores">
              <div class="setores-ranking">
                <h4>Top 5 Corredores</h4>
                <div class="ranking-list">
                  <div
                    v-for="(corredor, index) in topCorredores"
                    :key="corredor.local"
                    class="ranking-item"
                  >
                    <div class="ranking-position">
                      <span class="position-number">{{ index + 1 }}</span>
                      <div class="position-medal" v-if="index < 3">
                        {{ ["🥇", "🥈", "🥉"][index] }}
                      </div>
                    </div>
                    <div class="ranking-info">
                      <span class="setor-name">{{
                        formatarNomeCorredor(corredor.local)
                      }}</span>
                      <span class="setor-desempenho"
                        >{{ getPercentualLeitura(corredor).toFixed(1) }}%</span
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

    <!-- Tabela de Métricas Detalhadas -->
    <div class="analise-comparativa-section">
      <div class="analise-header">
        <h3>
          📊 Métricas Detalhadas por Corredor - {{ getTipoAuditoriaLabel() }}
        </h3>
        <div class="analise-periodo">Atualizado em: {{ dataAtual }}</div>
      </div>

      <div class="comparativa-grid">
        <div class="analise-card metricas-setor">
          <div class="metricas-table-container">
            <table class="metricas-table">
              <thead>
                <tr>
                  <th>Corredor</th>
                  <th>Ícone</th>
                  <th>Total Itens</th>
                  <th>Itens Válidos</th>
                  <th>Itens Lidos</th>
                  <th>Desempenho</th>
                  <th>Progresso</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="corredor in dadosFiltrados"
                  :key="corredor.local"
                  :class="getStatusLinha(corredor)"
                >
                  <td class="setor-cell">
                    <div class="setor-info">
                      <span>{{ formatarNomeCorredor(corredor.local) }}</span>
                    </div>
                  </td>
                  <td class="icon-cell">
                    <div class="corredor-icon-small">
                      {{ getIconeCorredor(corredor.local) }}
                    </div>
                  </td>
                  <td class="total-cell">{{ corredor.total }}</td>
                  <td class="validos-cell">{{ corredor.itensValidos }}</td>
                  <td class="lidos-cell">{{ corredor.lidos }}</td>
                  <td class="desempenho-cell">
                    {{ getPercentualLeitura(corredor).toFixed(1) }}%
                  </td>
                  <td class="progress-cell">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: getPercentualLeitura(corredor) + '%' }"
                        :class="
                          getClasseDesempenho(getPercentualLeitura(corredor))
                        "
                      ></div>
                    </div>
                  </td>
                  <td class="status-cell">
                    <span
                      class="status-badge"
                      :class="getStatusCorredor(corredor)"
                    >
                      {{ getStatusLabel(getPercentualLeitura(corredor)) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer com Ações Rápidas -->
    <div class="footer-actions">
      <div class="actions-grid">
        <button class="footer-btn" @click="exportarDados">
          📄 Exportar Relatório
        </button>
        <button class="footer-btn" @click="atualizarDados">
          🔄 Atualizar Dados
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import {
  Chart,
  BarController,
  BarElement,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Registrar componentes do Chart.js
Chart.register(
  BarController,
  BarElement,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
);

// Refs para os gráficos
const graficoBarras = ref(null);
const graficoRadar = ref(null);

// Instâncias dos gráficos
const graficoBarrasInstance = ref(null);
const graficoRadarInstance = ref(null);

// Estado do componente
const tipoAuditoriaAtual = ref("etiquetas");
const dadosReais = ref({
  etiquetas: {
    locaisLeitura: {},
    resumo: { totalItens: 0, usuariosAtivos: 0 },
  },
  rupturas: {
    locaisLeitura: {},
    resumo: { totalItens: 0, usuariosAtivos: 0 },
  },
  presencas: {
    locaisLeitura: {},
    resumo: { totalItens: 0, usuariosAtivos: 0 },
  },
});

// Computed properties baseadas no modelo LojaDailyMetrics
const dadosFiltrados = computed(() => {
  const auditoriaAtual = dadosReais.value[tipoAuditoriaAtual.value];
  if (!auditoriaAtual || !auditoriaAtual.locaisLeitura) return [];

  return Object.entries(auditoriaAtual.locaisLeitura).map(([local, dados]) => {
    return {
      local: local,
      ...dados,
    };
  });
});

const totalItens = computed(() => {
  const auditoriaAtual = dadosReais.value[tipoAuditoriaAtual.value];
  return auditoriaAtual?.resumo?.totalItens || 0;
});

const totalColaboradores = computed(() => {
  const auditoriaAtual = dadosReais.value[tipoAuditoriaAtual.value];
  return auditoriaAtual?.resumo?.usuariosAtivos || 0;
});

const desempenhoMedio = computed(() => {
  if (dadosFiltrados.value.length === 0) return 0;
  const total = dadosFiltrados.value.reduce((sum, corredor) => {
    return sum + getPercentualLeitura(corredor);
  }, 0);
  return (total / dadosFiltrados.value.length).toFixed(1);
});

const corredorDestaque = computed(() => {
  if (dadosFiltrados.value.length === 0) return { nome: "-", pontuacao: 0 };

  const melhor = dadosFiltrados.value.reduce((prev, current) => {
    const prevScore = getPercentualLeitura(prev);
    const currentScore = getPercentualLeitura(current);
    return prevScore > currentScore ? prev : current;
  });

  return {
    nome: formatarNomeCorredor(melhor.local),
    pontuacao: getPercentualLeitura(melhor).toFixed(1),
  };
});

const totalItensValidos = computed(() => {
  return dadosFiltrados.value.reduce(
    (sum, corredor) => sum + (corredor.itensValidos || 0),
    0
  );
});

const totalItensLidos = computed(() => {
  return dadosFiltrados.value.reduce(
    (sum, corredor) => sum + (corredor.lidos || 0),
    0
  );
});

const taxaConclusaoGeral = computed(() => {
  if (totalItensValidos.value === 0) return 0;
  return ((totalItensLidos.value / totalItensValidos.value) * 100).toFixed(1);
});

const topCorredores = computed(() => {
  return [...dadosFiltrados.value]
    .sort((a, b) => getPercentualLeitura(b) - getPercentualLeitura(a))
    .slice(0, 5);
});

const dataAtual = computed(() => {
  return new Date().toLocaleDateString("pt-BR");
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

const getStatusLinha = (corredor) => {
  const desempenho = getPercentualLeitura(corredor);
  return {
    "linha-destaque": desempenho >= 90,
    "linha-atencao": desempenho < 70,
  };
};

// Métodos de ação
const alterarTipoAuditoria = (tipo) => {
  tipoAuditoriaAtual.value = tipo;
  setTimeout(updateCharts, 100);
};

const exportarDados = () => {
  console.log("Exportando dados...", {
    tipo: tipoAuditoriaAtual.value,
    corredores: dadosFiltrados.value,
  });
  alert("Dados exportados com sucesso!");
};

const atualizarDados = () => {
  gerarDadosFake();
  updateCharts();
};

// Gráficos
const initializeCharts = () => {
  if (!graficoBarras.value || !graficoRadar.value) return;

  // Gráfico de Barras - Distribuição por Corredor
  graficoBarrasInstance.value = new Chart(graficoBarras.value, {
    type: "bar",
    data: {
      labels: dadosFiltrados.value
        .slice(0, 10)
        .map((c) => formatarNomeCorredor(c.local)),
      datasets: [
        {
          label: "Total Itens",
          data: dadosFiltrados.value.slice(0, 10).map((c) => c.total),
          backgroundColor: "rgba(102, 126, 234, 0.6)",
          borderColor: "#667eea",
          borderWidth: 1,
        },
        {
          label: "Itens Válidos",
          data: dadosFiltrados.value.slice(0, 10).map((c) => c.itensValidos),
          backgroundColor: "rgba(76, 175, 80, 0.6)",
          borderColor: "#4CAF50",
          borderWidth: 1,
        },
        {
          label: "Itens Lidos",
          data: dadosFiltrados.value.slice(0, 10).map((c) => c.lidos),
          backgroundColor: "rgba(255, 152, 0, 0.6)",
          borderColor: "#FF9800",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Distribuição de Itens por Corredor (Top 10)",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Quantidade de Itens",
          },
        },
        x: {
          title: {
            display: true,
            text: "Corredores",
          },
        },
      },
    },
  });

  // Gráfico de Radar - Desempenho por Corredor
  graficoRadarInstance.value = new Chart(graficoRadar.value, {
    type: "radar",
    data: {
      labels: dadosFiltrados.value
        .slice(0, 8)
        .map((c) => formatarNomeCorredor(c.local)),
      datasets: [
        {
          label: "Desempenho (%)",
          data: dadosFiltrados.value
            .slice(0, 8)
            .map((c) => getPercentualLeitura(c)),
          backgroundColor: "rgba(102, 126, 234, 0.2)",
          borderColor: "#667eea",
          borderWidth: 2,
          pointBackgroundColor: "#667eea",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#667eea",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            display: true,
            color: "rgba(0,0,0,0.05)",
          },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            stepSize: 20,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
};

const updateCharts = () => {
  if (graficoBarrasInstance.value) {
    const top10 = dadosFiltrados.value.slice(0, 10);
    graficoBarrasInstance.value.data.labels = top10.map((c) =>
      formatarNomeCorredor(c.local)
    );
    graficoBarrasInstance.value.data.datasets[0].data = top10.map(
      (c) => c.total
    );
    graficoBarrasInstance.value.data.datasets[1].data = top10.map(
      (c) => c.itensValidos
    );
    graficoBarrasInstance.value.data.datasets[2].data = top10.map(
      (c) => c.lidos
    );
    graficoBarrasInstance.value.update();
  }

  if (graficoRadarInstance.value) {
    const top8 = dadosFiltrados.value.slice(0, 8);
    graficoRadarInstance.value.data.labels = top8.map((c) =>
      formatarNomeCorredor(c.local)
    );
    graficoRadarInstance.value.data.datasets[0].data = top8.map((c) =>
      getPercentualLeitura(c)
    );
    graficoRadarInstance.value.update();
  }
};

// Gerar dados fake baseados no modelo LojaDailyMetrics
const gerarDadosFake = () => {
  const corredores = [
    "G01A - G01A",
    "G01B - G01B",
    "G02A - G02A",
    "G02B - G02B",
    "G03A - G03A",
    "G03B - G03B",
    "G04A - G04A",
    "G04B - G04B",
    "G05A - G05A",
    "G05B - G05B",
    "G06A - G06A",
    "G06B - G06B",
    "G07A - G07A",
    "G07B - G07B",
    "G08A - G08A",
    "G08B - G08B",
    "G09A - G09A",
    "G09B - G09B",
    "G10A - G10A",
    "G10B - G10B",
    "F01 - F01",
    "F02 - F02",
    "C01 - C01",
    "FLV - FLV",
    "PAO - PAO",
  ];

  const usuarios = [
    "João Silva",
    "Maria Santos",
    "Carlos Lima",
    "Ana Oliveira",
    "Pedro Costa",
  ];

  const gerarLocaisLeitura = () => {
    const locaisLeitura = {};
    let totalItensGeral = 0;
    const usuariosAtivos = new Set();

    corredores.forEach((corredor) => {
      const total = Math.floor(Math.random() * 200) + 50;
      const itensValidos = Math.floor(total * (Math.random() * 0.2 + 0.8));
      const lidos = Math.floor(itensValidos * (Math.random() * 0.3 + 0.6));

      const usuariosCorredor = {};
      const numUsuarios = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < numUsuarios; i++) {
        const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
        usuariosAtivos.add(usuario);
        usuariosCorredor[usuario] = Math.floor(lidos / numUsuarios);
      }

      locaisLeitura[corredor] = {
        total,
        itensValidos,
        lidos,
        usuarios: usuariosCorredor,
        percentual:
          itensValidos > 0 ? Math.round((lidos / itensValidos) * 100) : 0,
      };
      totalItensGeral += total;
    });

    return {
      locaisLeitura,
      resumo: {
        totalItens: totalItensGeral,
        usuariosAtivos: usuariosAtivos.size,
      },
    };
  };

  dadosReais.value = {
    etiquetas: gerarLocaisLeitura(),
    rupturas: gerarLocaisLeitura(),
    presencas: gerarLocaisLeitura(),
  };

  console.log("✅ Dados fake gerados:", dadosReais.value);
};

// Lifecycle
onMounted(() => {
  gerarDadosFake();
  setTimeout(initializeCharts, 100);
});

onUnmounted(() => {
  if (graficoBarrasInstance.value) graficoBarrasInstance.value.destroy();
  if (graficoRadarInstance.value) graficoRadarInstance.value.destroy();
});

// Watchers
watch(tipoAuditoriaAtual, () => {
  setTimeout(updateCharts, 100);
});
</script>

<style scoped>
.auditoria-tipos-desempenho-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin: 1rem 0;
}

/* Header Section */
.section-header {
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title-section {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.title-icon {
  font-size: 2.5rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 0.75rem;
}

.title-content h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.title-content p {
  margin: 0;
  color: #718096;
  font-size: 1rem;
}

/* Auditoria Tabs */
.auditoria-tabs {
  display: flex;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #718096;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-btn:hover {
  background: rgba(102, 126, 234, 0.05);
  color: #667eea;
}

.tab-btn.active {
  background: #667eea;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.summary-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.summary-icon.distribuição {
  background: rgba(102, 126, 234, 0.1);
}

.summary-icon.desempenho {
  background: rgba(76, 175, 80, 0.1);
}

.summary-icon.setor-destaque {
  background: rgba(255, 193, 7, 0.1);
}

.summary-icon.tipo-predominante {
  background: rgba(156, 39, 176, 0.1);
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.summary-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.summary-subtitle {
  font-size: 0.8rem;
  color: #a0aec0;
  font-weight: 500;
}

/* Gráficos Main Section */
.graficos-main-section {
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.graficos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.grafico-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.grafico-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.grafico-title h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}

.grafico-title p {
  margin: 0;
  color: #718096;
  font-size: 0.9rem;
}

.grafico-content {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.chart-container {
  flex: 1;
  height: 300px;
  position: relative;
}

/* Detalhes Expandidos */
.detalhes-distribuicao,
.detalhes-setores {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 200px;
}

.distribuicao-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #718096;
  font-size: 0.9rem;
}

.stat-value {
  font-weight: 600;
  color: #2c3e50;
}

.setores-ranking h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
}

.ranking-position {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.position-number {
  font-weight: 700;
  color: #667eea;
  font-size: 1.1rem;
  min-width: 20px;
}

.position-medal {
  font-size: 1.2rem;
}

.ranking-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setor-name {
  font-weight: 500;
  color: #4a5568;
}

.setor-desempenho {
  font-weight: 600;
  color: #2c3e50;
}

/* Análise Comparativa */
.analise-comparativa-section {
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.analise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.analise-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.analise-periodo {
  color: #718096;
  font-size: 0.9rem;
}

.comparativa-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.analise-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.analise-card h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
}

/* Tabela de Métricas */
.metricas-table-container {
  overflow-x: auto;
}

.metricas-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
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

.corredor-icon-small {
  font-size: 1.2rem;
  text-align: center;
}

.total-cell,
.validos-cell,
.lidos-cell,
.desempenho-cell {
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
}

.progress-cell {
  min-width: 120px;
}

.progress-bar {
  position: relative;
  height: 20px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill.excelente {
  background: #4caf50;
}
.progress-fill.bom {
  background: #ff9800;
}
.progress-fill.medio {
  background: #ffeb3b;
}
.progress-fill.baixo {
  background: #f44336;
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

.status-badge.medio {
  background: rgba(255, 235, 59, 0.1);
  color: #fbc02d;
}

.status-badge.baixo {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

/* Footer Actions */
.footer-actions {
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.footer-btn {
  padding: 1rem 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.footer-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Responsividade */
@media (max-width: 1200px) {
  .graficos-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .section-header,
  .graficos-main-section,
  .analise-comparativa-section {
    padding: 1.5rem;
  }

  .header-main {
    flex-direction: column;
    gap: 1.5rem;
  }

  .auditoria-tabs {
    width: 100%;
    justify-content: center;
  }

  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .grafico-content {
    flex-direction: column;
  }

  .chart-container {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .auditoria-tabs {
    flex-direction: column;
  }

  .tab-btn {
    justify-content: center;
  }

  .metricas-table {
    font-size: 0.8rem;
  }

  .metricas-table th,
  .metricas-table td {
    padding: 0.5rem;
  }
}
</style>
