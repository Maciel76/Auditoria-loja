<template>
  <div class="conquistas-section">
    <div class="conquistas-header">
      <h2 class="section-title">🏆 Conquistas e Selos</h2>
      <div class="xp-summary">
        <span class="xp-total">{{ xpTotal }} XP Total</span>
        <span class="xp-nivel">Nível {{ nivelAtual }}</span>
      </div>
    </div>

    <div class="conquistas-grid" :class="{ 'expandido': mostrarTodas }">
      <!-- Conquistas Principais -->
      <PrimeiroDia :usuario="usuario" />
      <MetaBatida :usuario="usuario" />
      <Explorador :usuario="usuario" :corredores-unicos="corredoresUnicos" />
      <Maratona :usuario="usuario" />
      <Consistencia :usuario="usuario" />

      <!-- Conquistas Expandidas -->
      <template v-if="mostrarTodas">
        <Relampago :usuario="usuario" :atividades-recentes="atividadesRecentes" />
        <ZeroFaltas :usuario="usuario" :itens-faltantes="itensFaltantes" />
        <Detetive :usuario="usuario" :itens-faltantes="itensFaltantes" />

        <!-- Novas Conquistas -->
        <GuardiaoPresenca :usuario="usuario" />
        <LendaViva :usuario="usuario" />
        <LiderPodio :usuario="usuario" />
        <MestreCorredores :usuario="usuario" />
        <OInvencivel :usuario="usuario" />
        <PioneiroDia :usuario="usuario" />
        <TopPerformer :usuario="usuario" />
      </template>
    </div>

    <div class="mostrar-mais-container">
      <button
        @click="toggleMostrarTodas"
        class="btn-mostrar-mais"
        :class="{ 'expandido': mostrarTodas }"
      >
        <span v-if="!mostrarTodas">
          <i class="fas fa-chevron-down"></i>
          Mostrar Mais Conquistas
        </span>
        <span v-else>
          <i class="fas fa-chevron-up"></i>
          Mostrar Menos
        </span>
      </button>
    </div>

    <!-- Estatísticas de Conquistas -->
    <div class="conquistas-stats">
      <div class="stat-card">
        <span class="stat-number">{{ conquistasDesbloqueadas }}</span>
        <span class="stat-label">Desbloqueadas</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ totalConquistas }}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ Math.round((conquistasDesbloqueadas / totalConquistas) * 100) }}%</span>
        <span class="stat-label">Completadas</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useNivelStore } from '@/store/nivelStore'
import {
  PrimeiroDia,
  MetaBatida,
  Explorador,
  Maratona,
  Consistencia,
  Relampago,
  ZeroFaltas,
  Detetive,
  GuardiaoPresenca,
  LendaViva,
  LiderPodio,
  MestreCorredores,
  OInvencivel,
  PioneiroDia,
  TopPerformer
} from '@/components/conquistas'

export default {
  name: "SelosConquistas",
  components: {
    PrimeiroDia,
    MetaBatida,
    Explorador,
    Maratona,
    Consistencia,
    Relampago,
    ZeroFaltas,
    Detetive,
    GuardiaoPresenca,
    LendaViva,
    LiderPodio,
    MestreCorredores,
    OInvencivel,
    PioneiroDia,
    TopPerformer
  },
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
    atividadesRecentes: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const nivelStore = useNivelStore()
    const mostrarTodas = ref(false)

    const xpTotal = computed(() => {
      return (props.usuario.contador || 0) + (props.usuario.xpConquistas || 0)
    })

    const nivelAtual = computed(() => {
      return nivelStore.calcularNivel(xpTotal.value)
    })

    const totalConquistas = computed(() => 15) // Número total de conquistas (8 antigas + 7 novas)

    const conquistasDesbloqueadas = computed(() => {
      // Simular contagem de conquistas desbloqueadas
      let count = 0

      // Conquistas originais
      if ((props.usuario.contador || 0) > 0) count++ // PrimeiroDia
      if ((props.usuario.contador || 0) >= 500) count++ // MetaBatida
      if (props.corredoresUnicos.length >= 5) count++ // Explorador
      if ((props.usuario.contador || 0) >= 1000) count++ // Maratona
      if (((props.usuario.contador || 0) / 500) >= 0.75) count++ // Consistencia
      if (props.atividadesRecentes.length >= 50) count++ // Relampago
      if (props.itensFaltantes.length === 0 && (props.usuario.contador || 0) > 0) count++ // ZeroFaltas
      if (props.itensFaltantes.length >= 10) count++ // Detetive

      // Novas conquistas
      if ((props.usuario.diasAtivos || 0) >= 30) count++ // GuardiaoPresenca
      if ((props.usuario.diasAuditados || 0) >= 365) count++ // LendaViva
      if ((props.usuario.posicaoRanking || 999) <= 3) count++ // LiderPodio
      if ((props.usuario.metricas?.velocidadeMedia || 0) >= 100) count++ // MestreCorredores
      if ((props.usuario.sequenciaVitorias || 0) >= 30) count++ // OInvencivel
      if ((props.usuario.primeiroDodia || 0) >= 10) count++ // PioneiroDia
      // TopPerformer baseia-se em métricas comparativas, assumindo critério básico
      if ((props.usuario.metricas?.ranking || 100) <= 10) count++ // TopPerformer

      return count
    })

    const toggleMostrarTodas = () => {
      mostrarTodas.value = !mostrarTodas.value
    }

    return {
      mostrarTodas,
      xpTotal,
      nivelAtual,
      totalConquistas,
      conquistasDesbloqueadas,
      toggleMostrarTodas
    }
  }
}
</script>

<style scoped>
.conquistas-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.conquistas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.xp-summary {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.xp-total {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.xp-nivel {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.conquistas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  max-height: 600px;
  overflow: hidden;
  transition: max-height 0.5s ease;
}

.conquistas-grid.expandido {
  max-height: none;
}

.mostrar-mais-container {
  text-align: center;
  margin-bottom: 2rem;
}

.btn-mostrar-mais {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.btn-mostrar-mais:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-mostrar-mais.expandido {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
}

.btn-mostrar-mais i {
  transition: transform 0.3s ease;
}

.btn-mostrar-mais.expandido i {
  transform: rotate(180deg);
}

.conquistas-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.stat-card {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

@media (max-width: 768px) {
  .conquistas-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .conquistas-grid {
    grid-template-columns: 1fr;
    max-height: 400px;
  }

  .conquistas-stats {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .xp-summary {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .conquistas-section {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .btn-mostrar-mais {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
