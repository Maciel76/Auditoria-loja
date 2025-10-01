<template>
  <div class="conquistas-timeline-section">
    <div class="timeline-header">
      <h2 class="section-title">🏆 Histórico de Conquistas</h2>
      <div class="timeline-controls">
        <div class="conquista-filter">
          <button
            v-for="filter in conquistaFilters"
            :key="filter.key"
            @click="selectedFilter = filter.key"
            :class="{ active: selectedFilter === filter.key }"
            class="filter-btn"
          >
            <span class="filter-icon">{{ filter.icon }}</span>
            {{ filter.label }}
          </button>
        </div>
        <div class="conquista-stats">
          <span class="stat-item">
            <i class="fas fa-trophy"></i>
            {{ conquistasDesbloqueadas.length }} desbloqueadas
          </span>
          <span class="stat-item">
            <i class="fas fa-star"></i>
            {{ totalXpConquistas }} XP ganho
          </span>
        </div>
      </div>
    </div>

    <div class="timeline-container">
      <div class="timeline">
        <div
          v-for="(conquista, index) in paginatedConquistas"
          :key="conquista.id"
          class="timeline-item conquista-item"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="selectConquista(conquista)"
        >
          <div class="timeline-marker conquista-marker" :class="getConquistaTipo(conquista)">
            <span class="conquista-emoji">{{ conquista.icone }}</span>
          </div>
          <div class="timeline-content conquista-content" :class="{ expanded: selectedConquista?.id === conquista.id }">
            <div class="conquista-main">
              <div class="conquista-header">
                <h4>{{ conquista.nome }}</h4>
                <div class="conquista-badges">
                  <span v-if="isRecentConquista(conquista)" class="badge recent">🆕 Nova</span>
                  <span class="badge xp">+{{ conquista.xp }} XP</span>
                </div>
              </div>
              <p class="conquista-descricao">{{ conquista.descricao }}</p>
              <div class="conquista-meta">
                <span class="conquista-data">
                  <i class="fas fa-calendar"></i>
                  {{ formatarDataConquista(conquista.timestamp) }}
                </span>
                <span class="conquista-dificuldade" :class="getDificuldadeClass(conquista)">
                  <i class="fas fa-star"></i>
                  {{ getDificuldadeTexto(conquista) }}
                </span>
              </div>
            </div>

            <div v-if="selectedConquista?.id === conquista.id" class="conquista-expanded">
              <div class="conquista-detalhes">
                <div class="detalhe-section">
                  <h5>🎯 Como Conquistar</h5>
                  <p>{{ getCondicoesConquista(conquista) }}</p>
                </div>

                <div class="detalhe-section" v-if="conquista.progresso !== undefined">
                  <h5>📈 Seu Progresso</h5>
                  <div class="progresso-bar">
                    <div class="progresso-fill" :style="{ width: `${conquista.progresso}%` }"></div>
                  </div>
                  <span class="progresso-text">{{ Math.round(conquista.progresso) }}% concluído</span>
                </div>

                <div class="detalhe-section" v-if="conquista.raridade">
                  <h5>💎 Raridade</h5>
                  <div class="raridade-info" :class="getRaridadeClass(conquista)">
                    <span class="raridade-nome">{{ conquista.raridade }}</span>
                    <span class="raridade-percentual">{{ getRaridadePercentual(conquista) }}% dos usuários</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vazio -->
        <div v-if="filteredConquistas.length === 0" class="empty-state">
          <i class="fas fa-trophy"></i>
          <h3>Nenhuma conquista encontrada</h3>
          <p>Continue auditando para desbloquear suas primeiras conquistas!</p>
        </div>
      </div>

      <!-- Paginação -->
      <div v-if="totalPages > 1" class="pagination">
        <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="page-info">{{ currentPage }} de {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: "ConquistasTimeline",
  props: {
    usuario: {
      type: Object,
      required: true,
    },
    corredoresUnicos: {
      type: Array,
      default: () => [],
    },
    itensFaltantes: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const selectedFilter = ref('all')
    const currentPage = ref(1)
    const itemsPerPage = ref(8)
    const selectedConquista = ref(null)

    const conquistaFilters = [
      { key: 'all', label: 'Todas', icon: '🏆' },
      { key: 'desbloqueadas', label: 'Desbloqueadas', icon: '✅' },
      { key: 'recentes', label: 'Recentes', icon: '🆕' },
      { key: 'altas', label: 'Alto XP', icon: '⭐' }
    ]

    const conquistasDisponiveis = computed(() => {
      const todasConquistas = [
        {
          id: 'primeira_auditoria',
          nome: 'Primeiro Dia',
          descricao: 'Fez sua primeira auditoria',
          icone: '🎉',
          xp: 10,
          desbloqueada: (props.usuario.contador || 0) > 0,
          timestamp: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
          raridade: 'Comum',
          dificuldade: 'Fácil'
        },
        {
          id: 'meta_100',
          nome: 'Centena',
          descricao: 'Leu 100 itens',
          icone: '💯',
          xp: 15,
          desbloqueada: (props.usuario.contador || 0) >= 100,
          timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          raridade: 'Comum',
          dificuldade: 'Fácil',
          progresso: Math.min(100, ((props.usuario.contador || 0) / 100) * 100)
        },
        {
          id: 'meta_500',
          nome: 'Meta Batida',
          descricao: 'Leu mais de 500 itens',
          icone: '🎯',
          xp: 50,
          desbloqueada: (props.usuario.contador || 0) >= 500,
          timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          raridade: 'Incomum',
          dificuldade: 'Médio',
          progresso: Math.min(100, ((props.usuario.contador || 0) / 500) * 100)
        },
        {
          id: 'explorador',
          nome: 'Explorador',
          descricao: 'Cobriu 5+ corredores',
          icone: '🗺️',
          xp: 25,
          desbloqueada: props.corredoresUnicos.length >= 5,
          timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
          raridade: 'Comum',
          dificuldade: 'Fácil',
          progresso: Math.min(100, (props.corredoresUnicos.length / 5) * 100)
        },
        {
          id: 'maratona',
          nome: 'Maratona',
          descricao: 'Leu mais de 1000 itens',
          icone: '🏅',
          xp: 100,
          desbloqueada: (props.usuario.contador || 0) >= 1000,
          timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          raridade: 'Raro',
          dificuldade: 'Difícil',
          progresso: Math.min(100, ((props.usuario.contador || 0) / 1000) * 100)
        }
      ]

      return todasConquistas.sort((a, b) => {
        if (a.desbloqueada && !b.desbloqueada) return -1
        if (!a.desbloqueada && b.desbloqueada) return 1
        if (a.desbloqueada && b.desbloqueada) {
          return new Date(b.timestamp) - new Date(a.timestamp)
        }
        return b.xp - a.xp
      })
    })

    const filteredConquistas = computed(() => {
      const now = new Date()

      switch (selectedFilter.value) {
        case 'desbloqueadas':
          return conquistasDisponiveis.value.filter(c => c.desbloqueada)
        case 'recentes':
          return conquistasDisponiveis.value.filter(c => {
            if (!c.desbloqueada) return false
            const diff = now - new Date(c.timestamp)
            return diff < 7 * 24 * 60 * 60 * 1000
          })
        case 'altas':
          return conquistasDisponiveis.value.filter(c => c.xp >= 50)
        default:
          return conquistasDisponiveis.value
      }
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredConquistas.value.length / itemsPerPage.value)
    })

    const paginatedConquistas = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredConquistas.value.slice(start, end)
    })

    const conquistasDesbloqueadas = computed(() => {
      return conquistasDisponiveis.value.filter(c => c.desbloqueada)
    })

    const totalXpConquistas = computed(() => {
      return conquistasDesbloqueadas.value.reduce((total, c) => total + c.xp, 0)
    })

    return {
      selectedFilter,
      currentPage,
      itemsPerPage,
      selectedConquista,
      conquistaFilters,
      conquistasDisponiveis,
      filteredConquistas,
      totalPages,
      paginatedConquistas,
      conquistasDesbloqueadas,
      totalXpConquistas
    }
  },
  methods: {
    formatarDataConquista(timestamp) {
      if (!timestamp) return 'Data desconhecida'
      const data = new Date(timestamp)
      const agora = new Date()
      const diferenca = agora - data
      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24))

      if (dias === 0) return 'Hoje'
      if (dias === 1) return 'Ontem'
      if (dias < 7) return `Há ${dias} dias`
      if (dias < 30) return `Há ${Math.floor(dias / 7)} semanas`

      return data.toLocaleDateString('pt-BR')
    },

    getConquistaTipo(conquista) {
      if (!conquista.desbloqueada) return 'locked'
      if (conquista.xp >= 100) return 'legendary'
      if (conquista.xp >= 50) return 'epic'
      return 'common'
    },

    isRecentConquista(conquista) {
      if (!conquista.desbloqueada) return false
      const diff = new Date() - new Date(conquista.timestamp)
      return diff < 7 * 24 * 60 * 60 * 1000
    },

    getDificuldadeClass(conquista) {
      switch (conquista.dificuldade) {
        case 'Fácil': return 'facil'
        case 'Médio': return 'medio'
        case 'Difícil': return 'dificil'
        default: return 'facil'
      }
    },

    getDificuldadeTexto(conquista) {
      return conquista.dificuldade || 'Normal'
    },

    getRaridadeClass(conquista) {
      switch (conquista.raridade) {
        case 'Comum': return 'comum'
        case 'Incomum': return 'incomum'
        case 'Raro': return 'raro'
        default: return 'comum'
      }
    },

    getRaridadePercentual(conquista) {
      const percentuais = {
        'Comum': 85,
        'Incomum': 65,
        'Raro': 35
      }
      return percentuais[conquista.raridade] || 50
    },

    selectConquista(conquista) {
      if (this.selectedConquista?.id === conquista.id) {
        this.selectedConquista = null
      } else {
        this.selectedConquista = conquista
      }
    },

    getCondicoesConquista(conquista) {
      const condicoes = {
        'primeira_auditoria': 'Complete sua primeira auditoria de estoque',
        'meta_100': 'Leia pelo menos 100 itens durante suas auditorias',
        'meta_500': 'Alcance a meta de 500 itens lidos',
        'explorador': 'Visite e audite pelo menos 5 corredores diferentes',
        'maratona': 'Demonstre dedicação lendo mais de 1000 itens'
      }
      return condicoes[conquista.id] || 'Condições não definidas'
    }
  },
  watch: {
    selectedFilter() {
      this.currentPage = 1
    }
  }
}
</script>

<style scoped>
.conquistas-timeline-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  gap: 20px;
}

.section-title {
  font-size: 1.8rem;
  margin: 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.timeline-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-end;
}

.conquista-filter {
  display: flex;
  gap: 5px;
  background: #f8f9fa;
  padding: 4px;
  border-radius: 25px;
}

.filter-btn {
  background: transparent;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  font-weight: 500;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.conquista-stats {
  display: flex;
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: #666;
}

.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #667eea, #764ba2, #e9ecef);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 25px;
  opacity: 0;
  transform: translateX(-20px);
  animation: slideInLeft 0.6s ease forwards;
}

@keyframes slideInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.timeline-marker {
  position: absolute;
  left: -40px;
  top: 8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2;
  transition: all 0.3s ease;
}

.timeline-marker.common {
  background: linear-gradient(135deg, #40c057 0%, #51cf66 100%);
}

.timeline-marker.epic {
  background: linear-gradient(135deg, #fd7e14 0%, #ffa94d 100%);
}

.timeline-marker.legendary {
  background: linear-gradient(135deg, #ffd43b 0%, #fab005 100%);
}

.timeline-marker.locked {
  background: #adb5bd;
  opacity: 0.6;
}

.timeline-content {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid #667eea;
}

.timeline-content:hover {
  background: #fff;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.conquista-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.conquista-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.conquista-badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.badge.recent {
  background: linear-gradient(135deg, #ff8a80 0%, #ff5722 100%);
  color: white;
}

.badge.xp {
  background: linear-gradient(135deg, #ffd54f 0%, #ff9800 100%);
  color: #333;
}

.conquista-descricao {
  color: #495057;
  margin: 10px 0;
  font-size: 0.9rem;
}

.conquista-meta {
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: #666;
}

.conquista-meta > span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.conquista-expanded {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.detalhe-section {
  margin-bottom: 20px;
}

.detalhe-section h5 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 0.95rem;
}

.progresso-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progresso-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 1s ease;
}

.progresso-text {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.raridade-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
}

.raridade-info.comum {
  background: #e6ffed;
  color: #2b8a3e;
}

.raridade-info.incomum {
  background: #e3f2fd;
  color: #1565c0;
}

.raridade-info.raro {
  background: #f3e5f5;
  color: #7b1fa2;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #868e96;
}

.empty-state i {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.page-btn {
  background: #f8f9fa;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

@media (max-width: 768px) {
  .conquistas-timeline-section {
    padding: 20px;
  }

  .timeline-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .timeline-controls {
    width: 100%;
    align-items: stretch;
  }

  .conquista-stats {
    justify-content: space-between;
  }

  .timeline {
    padding-left: 35px;
  }

  .timeline-marker {
    left: -35px;
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}
</style>