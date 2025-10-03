<template>
  <div class="ranking-lojas-container">
    <!-- Hero Section -->
    <HeroSection
      :total-lojas="lojas.length"
      :total-itens-auditados="totalItensAuditados"
      :media-itens-por-loja="mediaItensPorLoja"
      :eficiencia-media="eficienciaMedia"
      @focus-metric="focusMetric"
    />

    <!-- Insights Panel -->
    <InsightsPanel
      :insights="insights"
      @insight-click="handleInsightClick"
    />

    <!-- Controls Panel -->
    <ControlsPanel
      :view-mode="viewMode"
      :search-term="filtro"
      :suggestions="suggestions"
      :regioes="regioes"
      :ligas="ligas"
      :regioes-ativas="regioesAtivas"
      :ligas-ativas="ligasAtivas"
      :range-itens="rangeItens"
      :eficiencia-minima="eficienciaMinima"
      :filtro-tipo-auditoria="filtroTipoAuditoria"
      :filtro-periodo="filtroPeriodo"
      :filtro-ordenacao="filtroOrdenacao"
      :show-settings="showSettings"
      :items-per-page="itemsPerPage"
      :auto-refresh="autoRefresh"
      :show-animations="showAnimations"
      :compact-mode="compactMode"
      @view-mode-change="viewMode = $event"
      @search-input="onSearchInput"
      @clear-search="clearSearch"
      @select-suggestion="selectSuggestion"
      @toggle-regiao="toggleRegiao"
      @toggle-liga="toggleLiga"
      @range-change="handleRangeChange"
      @efficiency-change="eficienciaMinima = Number($event)"
      @filter-change="handleFilterChange"
      @export="handleExport"
      @share="shareRanking"
      @toggle-settings="showSettings = !showSettings"
      @setting-change="handleSettingChange"
    />

    <!-- Podium Section -->
    <PodiumSection :top-lojas="lojasFiltradas" />

    <!-- Chart Section -->
    <div class="chart-section" v-if="viewMode === 'chart'">
      <div class="section-header">
        <h2 class="section-title">
          <i class="fas fa-chart-bar"></i>
          Análise Gráfica
        </h2>
        <div class="chart-controls">
          <select v-model="chartType" class="chart-select">
            <option value="bar">Barras</option>
            <option value="line">Linha</option>
            <option value="radar">Radar</option>
            <option value="pie">Pizza</option>
          </select>
        </div>
      </div>

      <div class="chart-container">
        <canvas ref="chartCanvas" width="800" height="400"></canvas>
      </div>

      <div class="chart-insights">
        <div class="insight-item">
          <strong>Maior Crescimento:</strong>
          <span>{{ maiorCrescimento.loja }} (+{{ maiorCrescimento.percentual }}%)</span>
        </div>
        <div class="insight-item">
          <strong>Melhor Eficiência:</strong>
          <span>{{ melhorEficiencia.loja }} ({{ melhorEficiencia.valor }}%)</span>
        </div>
        <div class="insight-item">
          <strong>Tendência Geral:</strong>
          <span class="trend" :class="{ positive: tendenciaGeral > 0, negative: tendenciaGeral < 0 }">
            {{ tendenciaGeral > 0 ? '+' : '' }}{{ tendenciaGeral }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Table View -->
    <RankingTable
      v-if="viewMode === 'table'"
      :lojas="lojasFiltradas"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      @previous-page="previousPage"
      @next-page="nextPage"
      @sort="sortBy"
      @view-details="verDetalhesLoja"
      @compare="compararLoja"
    />

    <!-- Cards View -->
    <RankingCards
      v-if="viewMode === 'cards'"
      :lojas="lojasFiltradas"
      :loading="loading"
      :error="error"
      :max-itens="maxItens"
      @retry="buscarDados"
      @view-details="verDetalhesLoja"
      @compare="compararLoja"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Componentes
import HeroSection from './HeroSection.vue'
import InsightsPanel from './InsightsPanel.vue'
import ControlsPanel from './ControlsPanel.vue'
import PodiumSection from './PodiumSection.vue'
import RankingTable from './RankingTable.vue'
import RankingCards from './RankingCards.vue'

const router = useRouter()

// Estados reativas
const lojas = ref([])
const loading = ref(false)
const error = ref(null)

// View controls
const viewMode = ref('cards')
const chartType = ref('bar')
const showSettings = ref(false)

// Search and suggestions
const filtro = ref('')
const suggestions = ref([])

// Filtros básicos
const filtroTipoAuditoria = ref('todos')
const filtroPeriodo = ref('mes')
const filtroOrdenacao = ref('itens')

// Filtros avançados
const regioesAtivas = ref([])
const ligasAtivas = ref([])
const rangeItens = ref({ min: 0, max: 50000 })
const eficienciaMinima = ref(0)

// Configurações
const itemsPerPage = ref(25)
const autoRefresh = ref(false)
const showAnimations = ref(true)
const compactMode = ref(false)

// Paginação
const currentPage = ref(1)
const sortField = ref('itens')
const sortDirection = ref('desc')

// Chart references
const chartCanvas = ref(null)
let chartInstance = null
let refreshInterval = null

// Dados estáticos
const regioes = ref([
  { id: 'norte', nome: 'Norte', icon: '🌍' },
  { id: 'sul', nome: 'Sul', icon: '🏔️' },
  { id: 'leste', nome: 'Leste', icon: '🌅' },
  { id: 'oeste', nome: 'Oeste', icon: '🌇' },
  { id: 'centro', nome: 'Centro', icon: '🎯' }
])

const ligas = ref([
  { id: 'diamante', nome: 'Diamante', icon: '💎' },
  { id: 'ouro', nome: 'Ouro', icon: '🥇' },
  { id: 'prata', nome: 'Prata', icon: '🥈' },
  { id: 'bronze', nome: 'Bronze', icon: '🥉' }
])

// Computed properties
const lojasFiltradas = computed(() => {
  let resultado = [...lojas.value]

  // Aplicar dados mock se necessário
  if (resultado.length > 0) {
    resultado = resultado.map(loja => ({
      ...loja,
      tendencia: Math.floor(Math.random() * 30) - 10, // -10% a +20%
      historico: generateMockHistorico(),
      regiao: ['norte', 'sul', 'leste', 'oeste', 'centro'][Math.floor(Math.random() * 5)],
      liga: getLiga(loja.itensAuditados || 0)
    }))
  }

  // Filtro por busca
  if (filtro.value) {
    const termo = filtro.value.toLowerCase()
    resultado = resultado.filter(loja =>
      loja.codigo.toLowerCase().includes(termo) ||
      (loja.nome && loja.nome.toLowerCase().includes(termo)) ||
      (loja.regiao && loja.regiao.toLowerCase().includes(termo))
    )
  }

  // Filtros avançados
  if (regioesAtivas.value.length > 0) {
    resultado = resultado.filter(loja => regioesAtivas.value.includes(loja.regiao))
  }

  if (ligasAtivas.value.length > 0) {
    resultado = resultado.filter(loja => ligasAtivas.value.includes(loja.liga))
  }

  // Filtro por range de itens
  resultado = resultado.filter(loja => {
    const itens = loja.itensAuditados || 0
    return itens >= rangeItens.value.min && itens <= rangeItens.value.max
  })

  // Filtro por eficiência mínima
  resultado = resultado.filter(loja => calcularEficiencia(loja) >= eficienciaMinima.value)

  // Ordenação
  resultado.sort((a, b) => {
    let comparison = 0
    switch (sortField.value) {
      case 'itens':
        comparison = (b.itensAuditados || 0) - (a.itensAuditados || 0)
        break
      case 'usuarios':
        comparison = (b.usuariosAtivos || 0) - (a.usuariosAtivos || 0)
        break
      case 'eficiencia':
        comparison = calcularEficiencia(b) - calcularEficiencia(a)
        break
      case 'codigo':
        comparison = a.codigo.localeCompare(b.codigo)
        break
      case 'tendencia':
        comparison = (b.tendencia || 0) - (a.tendencia || 0)
        break
      default:
        comparison = (b.itensAuditados || 0) - (a.itensAuditados || 0)
    }
    return sortDirection.value === 'desc' ? comparison : -comparison
  })

  return resultado
})

const totalItensAuditados = computed(() => {
  return lojas.value.reduce((total, loja) => total + (loja.itensAuditados || 0), 0)
})

const mediaItensPorLoja = computed(() => {
  if (lojas.value.length === 0) return 0
  return Math.round(totalItensAuditados.value / lojas.value.length)
})

const eficienciaMedia = computed(() => {
  if (lojas.value.length === 0) return 0
  const totalEficiencia = lojas.value.reduce((total, loja) => total + calcularEficiencia(loja), 0)
  return Math.round(totalEficiencia / lojas.value.length)
})

const maxItens = computed(() => {
  return Math.max(...lojas.value.map(l => l.itensAuditados || 0))
})

// Insights inteligentes
const insights = computed(() => {
  if (lojas.value.length === 0) return []

  const insights = []

  // Melhor performance
  const melhorLoja = lojasFiltradas.value[0]
  if (melhorLoja) {
    insights.push({
      id: 'melhor',
      type: 'success',
      icon: '🚀',
      title: 'Destaque do Período',
      description: `Loja ${melhorLoja.codigo} lidera com ${melhorLoja.itensAuditados?.toLocaleString()} itens`,
      value: `+${melhorLoja.tendencia || 0}%`
    })
  }

  // Lojas com baixa performance
  const lojasAbaixoMedia = lojasFiltradas.value.filter(loja =>
    (loja.itensAuditados || 0) < mediaItensPorLoja.value
  )

  if (lojasAbaixoMedia.length > 0) {
    insights.push({
      id: 'atencao',
      type: 'warning',
      icon: '⚠️',
      title: 'Atenção Necessária',
      description: `${lojasAbaixoMedia.length} lojas abaixo da média`,
      value: `${Math.round((lojasAbaixoMedia.length / lojasFiltradas.value.length) * 100)}%`
    })
  }

  // Tendência geral
  const tendenciaGeral = lojasFiltradas.value.reduce((acc, loja) => acc + (loja.tendencia || 0), 0) / lojasFiltradas.value.length
  insights.push({
    id: 'tendencia',
    type: tendenciaGeral > 0 ? 'success' : 'danger',
    icon: tendenciaGeral > 0 ? '📈' : '📉',
    title: 'Tendência Geral',
    description: `${tendenciaGeral > 0 ? 'Crescimento' : 'Queda'} médio da rede`,
    value: `${tendenciaGeral > 0 ? '+' : ''}${tendenciaGeral.toFixed(1)}%`
  })

  return insights
})

// Chart data
const maiorCrescimento = computed(() => {
  const loja = lojasFiltradas.value.reduce((max, loja) =>
    (loja.tendencia || 0) > (max.tendencia || 0) ? loja : max, lojasFiltradas.value[0] || {}
  )
  return {
    loja: loja.codigo || 'N/A',
    percentual: loja.tendencia || 0
  }
})

const melhorEficiencia = computed(() => {
  const loja = lojasFiltradas.value.reduce((max, loja) =>
    calcularEficiencia(loja) > calcularEficiencia(max) ? loja : max, lojasFiltradas.value[0] || {}
  )
  return {
    loja: loja.codigo || 'N/A',
    valor: calcularEficiencia(loja)
  }
})

const tendenciaGeral = computed(() => {
  if (lojasFiltradas.value.length === 0) return 0
  const soma = lojasFiltradas.value.reduce((acc, loja) => acc + (loja.tendencia || 0), 0)
  return Math.round((soma / lojasFiltradas.value.length) * 10) / 10
})

// Métodos
const buscarDados = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await axios.get('http://localhost:3000/api/ranking-lojas', {
      params: {
        tipo: filtroTipoAuditoria.value,
        periodo: filtroPeriodo.value
      }
    })

    lojas.value = response.data || []
    console.log('✅ Dados das lojas carregados:', lojas.value.length)

    // Limpar erro se houve sucesso
    error.value = null
  } catch (err) {
    console.error('❌ Erro ao buscar dados das lojas:', err)

    // Apenas mostrar erro se não conseguiu carregar dados
    if (err.response?.status !== 200) {
      error.value = err.response?.data?.mensagem || err.response?.data?.erro || 'Erro ao carregar dados das lojas'
    }

    // Se não há dados, mostrar array vazio ao invés de dados mock
    if (!lojas.value || lojas.value.length === 0) {
      lojas.value = []
    }
  } finally {
    loading.value = false
    await nextTick()
    if (viewMode.value === 'chart') {
      initChart()
    }
  }
}

// Helper methods
const calcularEficiencia = (loja) => {
  if (!loja.usuariosAtivos || loja.usuariosAtivos === 0) return 0

  // Se a eficiência já vem calculada da API, usar ela
  if (loja.eficiencia !== undefined) {
    return Math.min(loja.eficiencia, 100)
  }

  // Caso contrário, calcular baseado na média por usuário
  const mediaPorUsuario = loja.itensAuditados / loja.usuariosAtivos
  // Normalizar para uma escala de 0-100 (considerando 1000 itens como 100%)
  const eficiencia = Math.min((mediaPorUsuario / 1000) * 100, 100)
  return Math.round(eficiencia)
}

const getLiga = (itens) => {
  if (itens >= 8000) return 'diamante'
  if (itens >= 5000) return 'ouro'
  if (itens >= 2000) return 'prata'
  return 'bronze'
}

const generateMockHistorico = () => {
  const historico = []
  for (let i = 0; i < 7; i++) {
    historico.push(Math.floor(Math.random() * 1000) + 500)
  }
  return historico
}

// Event handlers
const onSearchInput = (value) => {
  filtro.value = value
  generateSuggestions()
  currentPage.value = 1
}

const generateSuggestions = () => {
  if (!filtro.value || filtro.value.length < 2) {
    suggestions.value = []
    return
  }

  const termo = filtro.value.toLowerCase()
  const sugestoes = []

  // Sugestões de lojas
  lojas.value.forEach(loja => {
    if (loja.codigo.toLowerCase().includes(termo)) {
      sugestoes.push({
        id: `loja-${loja.codigo}`,
        label: `Loja ${loja.codigo}`,
        category: 'Lojas',
        icon: 'fas fa-store',
        data: loja
      })
    }
    if (loja.nome && loja.nome.toLowerCase().includes(termo)) {
      sugestoes.push({
        id: `nome-${loja.codigo}`,
        label: loja.nome,
        category: 'Nomes',
        icon: 'fas fa-tag',
        data: loja
      })
    }
  })

  suggestions.value = sugestoes.slice(0, 5)
}

const selectSuggestion = (suggestion) => {
  if (suggestion.category === 'Lojas' || suggestion.category === 'Nomes') {
    filtro.value = suggestion.data.codigo
  }
  suggestions.value = []
}

const clearSearch = () => {
  filtro.value = ''
  suggestions.value = []
}

const toggleRegiao = (regiaoId) => {
  const index = regioesAtivas.value.indexOf(regiaoId)
  if (index > -1) {
    regioesAtivas.value.splice(index, 1)
  } else {
    regioesAtivas.value.push(regiaoId)
  }
  currentPage.value = 1
}

const toggleLiga = (ligaId) => {
  const index = ligasAtivas.value.indexOf(ligaId)
  if (index > -1) {
    ligasAtivas.value.splice(index, 1)
  } else {
    ligasAtivas.value.push(ligaId)
  }
  currentPage.value = 1
}

const handleRangeChange = (type, field, value) => {
  if (type === 'itens') {
    rangeItens.value[field] = Number(value)
  }
  currentPage.value = 1
}

const handleFilterChange = (type, value) => {
  if (type === 'tipo') {
    filtroTipoAuditoria.value = value
    buscarDados()
  } else if (type === 'periodo') {
    filtroPeriodo.value = value
    buscarDados()
  } else if (type === 'ordenacao') {
    filtroOrdenacao.value = value
  }
}

const handleSettingChange = (setting, value) => {
  if (setting === 'itemsPerPage') {
    itemsPerPage.value = Number(value)
  } else if (setting === 'autoRefresh') {
    autoRefresh.value = value
  } else if (setting === 'showAnimations') {
    showAnimations.value = value
  } else if (setting === 'compactMode') {
    compactMode.value = value
  }
}

const handleExport = (format) => {
  if (format === 'pdf') {
    console.log('Exportar para PDF')
    alert('Funcionalidade de exportação PDF em desenvolvimento')
  } else if (format === 'excel') {
    console.log('Exportar para Excel')
    alert('Funcionalidade de exportação Excel em desenvolvimento')
  }
}

const shareRanking = () => {
  console.log('Compartilhar ranking')
  if (navigator.share) {
    navigator.share({
      title: 'Ranking das Lojas',
      text: `Confira o ranking atual das lojas da nossa rede!`,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copiado para a área de transferência!')
  }
}

const handleInsightClick = (insight) => {
  console.log('Insight clicked:', insight)
}

const focusMetric = (metric) => {
  console.log('Focus metric:', metric)
}

// Sorting and pagination
const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortField.value = field
    sortDirection.value = 'desc'
  }
  currentPage.value = 1
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  const totalPages = Math.ceil(lojasFiltradas.value.length / itemsPerPage.value)
  if (currentPage.value < totalPages) {
    currentPage.value++
  }
}

// Navigation methods
const verDetalhesLoja = (loja) => {
  router.push(`/perfil-loja/${loja.codigo}`)
}

const compararLoja = (loja) => {
  console.log('Comparar loja:', loja.codigo)
  alert(`Funcionalidade de comparação da loja ${loja.codigo} em desenvolvimento`)
}

// Chart methods
const initChart = async () => {
  if (!chartCanvas.value) return

  try {
    const { Chart, registerables } = await import('chart.js')
    Chart.register(...registerables)

    const ctx = chartCanvas.value.getContext('2d')

    if (chartInstance) {
      chartInstance.destroy()
    }

    const data = prepareChartData()

    chartInstance = new Chart(ctx, {
      type: chartType.value,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Performance das Lojas'
          }
        },
        scales: chartType.value !== 'pie' ? {
          y: {
            beginAtZero: true
          }
        } : {}
      }
    })
  } catch (error) {
    console.error('Erro ao inicializar gráfico:', error)
  }
}

const prepareChartData = () => {
  const topLojas = lojasFiltradas.value.slice(0, 10)

  return {
    labels: topLojas.map(loja => `Loja ${loja.codigo}`),
    datasets: [{
      label: 'Itens Auditados',
      data: topLojas.map(loja => loja.itensAuditados || 0),
      backgroundColor: [
        '#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
        '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
      ],
      borderColor: [
        '#4f46e5', '#7c3aed', '#059669', '#d97706', '#dc2626',
        '#0891b2', '#65a30d', '#ea580c', '#db2777', '#4b5563'
      ],
      borderWidth: 2
    }]
  }
}

// Auto-refresh setup
const setupAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }

  if (autoRefresh.value) {
    refreshInterval = setInterval(() => {
      buscarDados()
    }, 30000) // 30 segundos
  }
}

// Watchers
watch(autoRefresh, setupAutoRefresh)
watch(chartType, () => {
  if (viewMode.value === 'chart') {
    initChart()
  }
})
watch(viewMode, async (newMode) => {
  if (newMode === 'chart') {
    await nextTick()
    initChart()
  }
})

// Lifecycle
onMounted(() => {
  buscarDados()
  setupAutoRefresh()
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.ranking-lojas-container {
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem;
}

/* Chart Section */
.chart-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.2s;
}

.chart-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.chart-container {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.chart-insights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.insight-item {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #6366f1;
}

.insight-item strong {
  display: block;
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.insight-item span {
  color: #1f2937;
  font-weight: 600;
}

.insight-item .trend {
  font-weight: 700;
}

.insight-item .trend.positive {
  color: #10b981;
}

.insight-item .trend.negative {
  color: #ef4444;
}

/* Responsive */
@media (max-width: 768px) {
  .ranking-lojas-container {
    padding: 1rem;
  }

  .chart-container {
    min-height: 300px;
  }

  .chart-insights {
    grid-template-columns: 1fr;
  }
}
</style>