<template>
  <div class="ranking-lojas-container">
    <!-- Hero Section -->
    <HeroSection
      :total-lojas="lojas.length"
      :total-itens-auditados="totalItensAuditados"
      :media-itens-por-loja="mediaItensPorLoja"
      :eficiencia-media="eficienciaMedia"
      :total-alertas-criticos="totalAlertasCriticos"
      :total-alertas-altos="totalAlertasAltos"
      :lojas-com-problemas="lojasComMaisProblemas.length"
      :usuarios-ativos="totalUsuariosAtivos"
      :percentual-presenca="percentualPresencaMedia"
      @focus-metric="focusMetric"
    />

    <!-- Ranking Controls -->
    <div class="ranking-header">
      <RankingControls
        :view-mode="viewMode"
        :filtro-tipo-auditoria="filtroTipoAuditoria"
        :filtro-periodo="filtroPeriodo"
        :filtro-regiao="filtroRegiao"
        :filtro-liga="filtroLiga"
        @update:view-mode="viewMode = $event"
        @update:filtro-tipo-auditoria="handleFilterChange('tipo', $event)"
        @update:filtro-periodo="handleFilterChange('periodo', $event)"
        @update:filtro-regiao="handleFilterChange('regiao', $event)"
        @update:filtro-liga="handleFilterChange('liga', $event)"
        @buscar-dados="buscarDados"
        @compartilhar="gerarImagemParaCompartilhar"
      />
    </div>

    <!-- Podium Section -->
    <PodiumSection
      :top-lojas="lojasFiltradas.slice(0, 3)"
      :tipo-auditoria="filtroTipoAuditoria"
    />

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
import api from '@/config/api'

// Componentes
import HeroSection from './HeroSection.vue'
import RankingControls from './RankingControls.vue'
import PodiumSection from './PodiumSection.vue'
import RankingTable from './RankingTable.vue'
import RankingCards from './RankingCards.vue'

const router = useRouter()

// Estados reativas
const lojas = ref([])
const loading = ref(false)
const error = ref(null)
const alertasGerais = ref([])

// View controls
const viewMode = ref('cards')
const chartType = ref('bar')
const showSettings = ref(false)

// Search and suggestions
const filtro = ref('')
const suggestions = ref([])

// Filtros básicos
const filtroTipoAuditoria = ref('etiqueta') // Padrão para etiquetas já que removemos "todos"
const filtroPeriodo = ref('hoje')
const filtroRegiao = ref('todas')
const filtroLiga = ref('todas')
const filtroOrdenacao = ref('eficiencia')

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
const sortField = ref('eficiencia')
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

  // Filtro por busca
  if (filtro.value) {
    const termo = filtro.value.toLowerCase()
    resultado = resultado.filter(loja =>
      loja.codigo.toLowerCase().includes(termo) ||
      (loja.nome && loja.nome.toLowerCase().includes(termo)) ||
      (loja.regiao && loja.regiao.toLowerCase().includes(termo))
    )
  }

  // Filtro por tipo de auditoria - mostrar apenas lojas com dados do tipo específico
  resultado = resultado.filter(loja => {
    const tipo = filtroTipoAuditoria.value
    if (tipo === 'etiqueta') { // singular - como no RankingControls
      return loja.etiquetas && loja.etiquetas.itensValidos > 0
    } else if (tipo === 'ruptura') { // singular - como no RankingControls
      return loja.rupturas && loja.rupturas.itensLidos > 0
    } else if (tipo === 'presenca') { // sem s - como no RankingControls
      return loja.presencas && loja.presencas.itensLidos > 0
    }
    return true // fallback para casos não previstos
  })

  // Filtros por região e liga
  if (filtroRegiao.value !== 'todas') {
    resultado = resultado.filter(loja => loja.regiao === filtroRegiao.value)
  }

  if (filtroLiga.value !== 'todas') {
    resultado = resultado.filter(loja => loja.liga === filtroLiga.value)
  }

  // Filtros avançados (mantidos para compatibilidade)
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
  resultado = resultado.filter(loja => (loja.eficiencia || 0) >= eficienciaMinima.value)

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
        comparison = (b.eficiencia || 0) - (a.eficiencia || 0)
        break
      case 'pontuacao':
        comparison = (b.pontuacao || 0) - (a.pontuacao || 0)
        break
      case 'codigo':
        comparison = a.codigo.localeCompare(b.codigo)
        break
      case 'tendencia':
        comparison = (b.tendencia || 0) - (a.tendencia || 0)
        break
      default:
        comparison = (b.eficiencia || 0) - (a.eficiencia || 0)
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
  const totalEficiencia = lojas.value.reduce((total, loja) => total + (loja.eficiencia || 0), 0)
  return Math.round(totalEficiencia / lojas.value.length)
})

const totalUsuariosAtivos = computed(() => {
  return lojas.value.reduce((total, loja) => total + (loja.usuariosAtivos || 0), 0)
})

const percentualPresencaMedia = computed(() => {
  if (lojas.value.length === 0) return 0
  const somaPresenca = lojas.value.reduce((total, loja) => {
    return total + (loja.presencas?.percentualPresenca || 0)
  }, 0)
  return Math.round(somaPresenca / lojas.value.length)
})

const maxItens = computed(() => {
  return Math.max(...lojas.value.map(l => l.itensAuditados || 0))
})

// Insights inteligentes baseados no LojaDailyMetrics
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
      description: `Loja ${melhorLoja.codigo} lidera com ${melhorLoja.pontuacao} pontos`,
      value: `${melhorLoja.notaQualidade}/10`
    })
  }

  // Alertas críticos
  if (totalAlertasCriticos.value > 0) {
    insights.push({
      id: 'alertas-criticos',
      type: 'danger',
      icon: '🚨',
      title: 'Alertas Críticos',
      description: `${totalAlertasCriticos.value} alertas críticos ativos`,
      value: `${lojasComMaisProblemas.value.length} lojas`
    })
  }

  // Eficiência das auditorias por tipo
  if (lojasFiltradas.value.length > 0) {
    const mediaEtiquetas = Math.round(lojasFiltradas.value.reduce((acc, l) => acc + (l.etiquetas?.percentualConclusao || 0), 0) / lojasFiltradas.value.length)
    const mediaRupturas = Math.round(lojasFiltradas.value.reduce((acc, l) => acc + (l.rupturas?.percentualConclusao || 0), 0) / lojasFiltradas.value.length)
    const mediaPresencas = Math.round(lojasFiltradas.value.reduce((acc, l) => acc + (l.presencas?.percentualConclusao || 0), 0) / lojasFiltradas.value.length)

    const melhorTipo = Math.max(mediaEtiquetas, mediaRupturas, mediaPresencas)
    const tipoNome = melhorTipo === mediaEtiquetas ? 'Etiquetas' : melhorTipo === mediaRupturas ? 'Rupturas' : 'Presenças'

    insights.push({
      id: 'melhor-tipo',
      type: 'info',
      icon: '📊',
      title: 'Melhor Performance por Tipo',
      description: `${tipoNome} com melhor eficiência média`,
      value: `${melhorTipo}%`
    })
  }

  // Tendência geral
  const tendencia = tendenciaGeral.value
  if (tendencia !== 0) {
    insights.push({
      id: 'tendencia',
      type: tendencia > 0 ? 'success' : 'warning',
      icon: tendencia > 0 ? '📈' : '📉',
      title: 'Tendência Geral',
      description: `${tendencia > 0 ? 'Crescimento' : 'Queda'} médio da rede`,
      value: `${tendencia > 0 ? '+' : ''}${tendencia}%`
    })
  }

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

// Computed properties para alertas
const totalAlertasCriticos = computed(() => {
  return alertasGerais.value.filter(a => a.alerta.severidade === 'critica').length
})

const totalAlertasAltos = computed(() => {
  return alertasGerais.value.filter(a => a.alerta.severidade === 'alta').length
})

const lojasComMaisProblemas = computed(() => {
  return lojasFiltradas.value
    .filter(loja => loja.alertas > 0 || loja.locaisComProblemas > 0)
    .sort((a, b) => (b.alertas + b.locaisComProblemas) - (a.alertas + a.locaisComProblemas))
    .slice(0, 5)
})

// Métodos
const buscarDados = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await api.get('/api/debug/lojas-daily-ranking', {
      params: {
        regiao: filtroRegiao.value !== 'todas' ? filtroRegiao.value : undefined,
        limite: 50
      }
    })

    // Mapear dados da API LojaDailyMetrics - usar dados diretos sem cálculos
    const dadosAPI = response.data?.ranking || []
    lojas.value = dadosAPI.map(item => ({
      // Dados básicos da loja
      codigo: item.loja?.codigo || 'N/A',
      nome: item.loja?.nome || 'N/A',
      regiao: item.loja?.regiao || 'N/A',
      cidade: item.loja?.cidade || 'N/A',

      // Métricas diretas do LojaDailyMetrics - usar campo correto por tipo
      itensAuditados: getItensAuditadosPorTipo(item, filtroTipoAuditoria.value),
      usuariosAtivos: getUsuariosAtivosPorTipo(item, filtroTipoAuditoria.value),
      eficiencia: getEficienciaPorTipo(item, filtroTipoAuditoria.value),
      pontuacao: item.pontuacao || 0,
      notaQualidade: item.notaQualidade || 0,
      eficienciaOperacional: item.eficienciaOperacional || 0,
      alertas: item.alertas || 0,
      locaisComProblemas: item.locaisComProblemas || 0,
      ultimaAtualizacao: item.ultimaAtualizacao,

      // Dados por tipo de auditoria - diretamente do modelo LojaDailyMetrics
      etiquetas: {
        totalItens: item.etiquetas?.totalItens || 0,
        itensValidos: item.etiquetas?.itensValidos || 0,
        itensAtualizados: item.etiquetas?.itensAtualizados || 0,
        percentualConclusao: item.etiquetas?.percentualConclusao || 0,
        usuariosAtivos: item.etiquetas?.usuariosAtivos || 0
      },
      rupturas: {
        totalItens: item.rupturas?.totalItens || 0,
        itensLidos: item.rupturas?.itensLidos || 0,
        itensAtualizados: item.rupturas?.itensAtualizados || 0,
        percentualConclusao: item.rupturas?.percentualConclusao || 0,
        custoTotalRuptura: item.rupturas?.custoTotalRuptura || 0,
        rupturasCriticas: item.rupturas?.rupturasCriticas || 0,
        usuariosAtivos: item.rupturas?.usuariosAtivos || 0
      },
      presencas: {
        totalItens: item.presencas?.totalItens || 0,
        itensLidos: item.presencas?.itensLidos || 0,
        itensAtualizados: item.presencas?.itensAtualizados || 0,
        percentualConclusao: item.presencas?.percentualConclusao || 0,
        percentualPresenca: item.presencas?.percentualPresenca || 0,
        presencasConfirmadas: item.presencas?.presencasConfirmadas || 0,
        usuariosAtivos: item.presencas?.usuariosAtivos || 0
      },

      // Campos para compatibilidade do frontend
      liga: getLiga(item.totalItens || 0),
      tendencia: calculateTendencia(item),
      historico: generateMockHistorico()
    }))

    console.log('✅ Dados das lojas carregados do LojaDailyMetrics:', lojas.value.length)
    error.value = null

    // Buscar alertas após carregar as lojas
    await buscarAlertas()
  } catch (err) {
    console.error('❌ Erro ao buscar dados das lojas:', err)

    if (err.response?.status !== 200) {
      error.value = err.response?.data?.erro || err.response?.data?.mensagem || 'Erro ao carregar dados das lojas'
    }

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

// Buscar alertas das lojas - simplificado para usar dados já carregados
const buscarAlertas = async () => {
  try {
    // Usar dados de alertas que já vêm no LojaDailyMetrics
    alertasGerais.value = []

    // Criar alertas simulados baseados nos dados das lojas
    lojas.value.forEach(loja => {
      if (loja.alertas > 0) {
        alertasGerais.value.push({
          alerta: {
            severidade: loja.alertas > 5 ? 'critica' : 'alta',
            tipo: 'desempenho',
            descricao: `Loja ${loja.codigo} tem ${loja.alertas} alertas ativos`
          },
          loja: {
            codigo: loja.codigo,
            nome: loja.nome
          }
        })
      }

      if (loja.locaisComProblemas > 0) {
        alertasGerais.value.push({
          alerta: {
            severidade: 'alta',
            tipo: 'local',
            descricao: `Loja ${loja.codigo} tem ${loja.locaisComProblemas} locais com problemas`
          },
          loja: {
            codigo: loja.codigo,
            nome: loja.nome
          }
        })
      }
    })

    console.log('✅ Alertas processados dos dados das lojas:', alertasGerais.value.length)
  } catch (error) {
    console.error('❌ Erro ao processar alertas:', error)
    alertasGerais.value = []
  }
}

// Helper para mapear período do frontend para data
const mapPeriodoToData = (periodo) => {
  const hoje = new Date()

  switch (periodo) {
    case 'hoje':
      return hoje.toISOString().split('T')[0]

    case 'semana':
      // Buscar dados da semana passada (mais provável ter dados)
      const semanaPassada = new Date(hoje)
      semanaPassada.setDate(hoje.getDate() - 7)
      return semanaPassada.toISOString().split('T')[0]

    case 'mes':
      // Buscar dados do mês passado
      const mesPassado = new Date(hoje)
      mesPassado.setMonth(hoje.getMonth() - 1)
      return mesPassado.toISOString().split('T')[0]

    case 'trimestre':
      // Buscar dados de 3 meses atrás
      const trimestre = new Date(hoje)
      trimestre.setMonth(hoje.getMonth() - 3)
      return trimestre.toISOString().split('T')[0]

    case 'todos':
      // Não especificar data (buscar mais recente)
      return undefined

    default:
      return undefined
  }
}

// Helper methods para extrair dados por tipo de auditoria
const getItensAuditadosPorTipo = (item, tipo) => {
  switch (tipo) {
    case 'etiqueta': // singular - como no RankingControls
      return item.etiquetas?.itensValidos || 0
    case 'ruptura': // singular - como no RankingControls
      return item.rupturas?.itensLidos || 0
    case 'presenca': // sem s - como no RankingControls
      return item.presencas?.itensLidos || 0
    default: // padrão para etiquetas
      return item.etiquetas?.itensValidos || 0
  }
}

const getUsuariosAtivosPorTipo = (item, tipo) => {
  switch (tipo) {
    case 'etiqueta': // singular - como no RankingControls
      return item.etiquetas?.usuariosAtivos || 0
    case 'ruptura': // singular - como no RankingControls
      return item.rupturas?.usuariosAtivos || 0
    case 'presenca': // sem s - como no RankingControls
      return item.presencas?.usuariosAtivos || 0
    default: // padrão para etiquetas
      return item.etiquetas?.usuariosAtivos || 0
  }
}

const getEficienciaPorTipo = (item, tipo) => {
  switch (tipo) {
    case 'etiqueta': // singular - como no RankingControls
      return item.etiquetas?.percentualConclusao || 0
    case 'ruptura': // singular - como no RankingControls
      return item.rupturas?.percentualConclusao || 0
    case 'presenca': // sem s - como no RankingControls
      return item.presencas?.percentualConclusao || 0
    default: // padrão para etiquetas
      return item.etiquetas?.percentualConclusao || 0
  }
}

// Helper methods simplificados - só usar dados diretos da API
const calcularEficiencia = (loja) => {
  return loja.eficiencia || 0
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

const calculateTendencia = (item) => {
  // Calcular tendência baseada na eficiência operacional e pontuação
  const pontuacao = item.pontuacao || 0
  const eficiencia = item.eficienciaOperacional || 0

  // Simular tendência baseada na performance atual
  if (pontuacao > 80 && eficiencia > 80) {
    return Math.floor(Math.random() * 15) + 5 // +5% a +20%
  } else if (pontuacao > 60 && eficiencia > 60) {
    return Math.floor(Math.random() * 10) - 5 // -5% a +5%
  } else {
    return Math.floor(Math.random() * 15) - 15 // -15% a 0%
  }
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
  } else if (type === 'regiao') {
    filtroRegiao.value = value
    currentPage.value = 1
  } else if (type === 'liga') {
    filtroLiga.value = value
    currentPage.value = 1
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

// Método para gerar imagem para compartilhamento
const gerarImagemParaCompartilhar = async () => {
  try {
    // Importar html2canvas dinamicamente
    const { default: html2canvas } = await import('html2canvas');

    // Criar um container temporário com apenas os elementos que queremos capturar
    const contentToCapture = document.createElement('div');
    contentToCapture.style.position = 'absolute';
    contentToCapture.style.left = '-9999px';
    contentToCapture.style.width = '1200px';
    contentToCapture.style.maxWidth = '100%';
    contentToCapture.style.backgroundColor = 'white';
    contentToCapture.style.padding = '30px';
    contentToCapture.style.borderRadius = '20px';
    contentToCapture.style.fontFamily = '"Inter", sans-serif';
    contentToCapture.style.boxSizing = 'border-box';
    contentToCapture.style.overflow = 'hidden';

    // Clonar o pódio e o ranking de cartões
    const podiumElement = document.querySelector('.podium-section');
    const rankingCardsElement = document.querySelector('.ranking-section');

    if (podiumElement) {
      const podiumClone = podiumElement.cloneNode(true);
      // Remover classes responsivas que possam interferir
      podiumClone.style.width = '100%';
      podiumClone.style.overflow = 'visible';
      contentToCapture.appendChild(podiumClone);
    }

    if (rankingCardsElement) {
      const rankingClone = rankingCardsElement.cloneNode(true);
      // Ajustar largura e estilos para melhor renderização
      rankingClone.style.width = '100%';
      rankingClone.style.overflow = 'visible';
      // Remover sombras e bordas que podem causar corte
      rankingClone.style.boxShadow = 'none';
      rankingClone.style.border = '1px solid #e5e7eb';
      contentToCapture.appendChild(rankingClone);
    }

    // Adicionar ao body temporariamente para renderização
    document.body.appendChild(contentToCapture);

    // Aguardar um pouco para garantir que todos os estilos sejam aplicados
    await new Promise(resolve => setTimeout(resolve, 500));

    // Determinar altura dinamicamente com base no conteúdo
    const height = contentToCapture.scrollHeight;

    // Capturar a imagem
    const canvas = await html2canvas(contentToCapture, {
      scale: 2, // Maior qualidade
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: Math.min(1200, window.innerWidth || 1200), // Ajustar largura dinamicamente
      height: height + 100, // Adicionar um pouco de altura extra
      scrollX: 0,
      scrollY: 0,
      logging: false,
      imageTimeout: 15000,
      // Opções para melhor renderização de conteúdo responsivo
      onclone: (clonedDoc) => {
        // Ajustar estilos para melhor captura
        const elements = clonedDoc.querySelectorAll('.ranking-card, .podium-card');
        elements.forEach(el => {
          el.style.maxWidth = '100%';
          el.style.overflow = 'visible';
        });
      }
    });

    // Remover o elemento temporário
    document.body.removeChild(contentToCapture);

    // Converter canvas para imagem
    const imgData = canvas.toDataURL('image/png');

    // Criar link para download
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `ranking-lojas-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();

  } catch (error) {
    console.error('Erro ao gerar imagem para compartilhamento:', error);

    // Fallback - abrir uma nova janela com os elementos para impressão
    const podiumElement = document.querySelector('.podium-section');
    const rankingCardsElement = document.querySelector('.ranking-section');

    if (podiumElement || rankingCardsElement) {
      let printContent = '<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto;">';
      printContent += '<h1 style="text-align: center; color: #1f2937;">Ranking de Lojas</h1>';

      if (podiumElement) {
        printContent += '<div style="margin-bottom: 30px;">' + podiumElement.outerHTML + '</div>';
      }

      if (rankingCardsElement) {
        printContent += '<div style="margin-top: 30px;">' + rankingCardsElement.outerHTML + '</div>';
      }

      printContent += '</div>';

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Ranking de Lojas - Compartilhamento</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; }
              .podium-section, .ranking-section { margin: 20px 0; background: white; }
              .podium-card, .ranking-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 10px 0; box-sizing: border-box; }
              .ranking-card { display: flex; align-items: center; }
              .print-content { max-width: 100%; overflow-x: auto; }
              .ranking-list { max-width: 100%; overflow-x: auto; }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();

      // Aguardar um pouco para garantir que o conteúdo foi carregado
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      alert('Não foi possível encontrar os elementos para compartilhamento.');
    }
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
  // Navegar para página de detalhes da loja com dados do LojaDailyMetrics
  router.push({
    name: 'perfilLoja',  // Nome correto da rota (com 'p' minúsculo)
    params: { codigo: loja.codigo },
    query: {
      source: 'loja-daily-metrics',
      data: mapPeriodoToData(filtroPeriodo.value)
    }
  })
}

const compararLoja = async (loja) => {
  console.log('Comparar loja:', loja.codigo)

  try {
    // Comparação simples com as 3 primeiras lojas do ranking
    const lojasParaComparar = [loja, ...lojasFiltradas.value.slice(0, 2)].slice(0, 3)

    // Comparação local usando dados já carregados
    const comparacao = lojasParaComparar.map(l => ({
      codigo: l.codigo,
      nome: l.nome,
      pontuacao: l.pontuacao,
      itensAuditados: l.itensAuditados,
      usuariosAtivos: l.usuariosAtivos,
      eficiencia: l.eficiencia
    }))

    const melhorLoja = comparacao.reduce((best, current) =>
      current.pontuacao > best.pontuacao ? current : best
    )

    const maiorVolume = comparacao.reduce((max, current) =>
      current.itensAuditados > max.itensAuditados ? current : max
    )

    // Mostrar resultado da comparação
    alert(`Comparação realizada com dados locais!

Lojas comparadas: ${comparacao.map(c => c.codigo).join(', ')}
Melhor pontuação: ${melhorLoja.codigo} (${melhorLoja.pontuacao} pts)
Maior volume: ${maiorVolume.codigo} (${maiorVolume.itensAuditados} itens)`)

  } catch (error) {
    console.error('Erro ao comparar lojas:', error)
    alert('Erro ao realizar comparação de lojas. Tente novamente.')
  }
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

.ranking-header {
  margin-bottom: 2rem;
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