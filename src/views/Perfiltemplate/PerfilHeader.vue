<template>
  <div class="perfil-header">
    <div class="perfil-cover">
      <div class="cover-pattern"></div>
      <div class="nivel-badge">
        <span class="nivel-number">{{ nivelAtual }}</span>
        <span class="nivel-label">NÍVEL</span>
      </div>
    </div>

    <div class="perfil-info">
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <img
            v-if="usuario.foto"
            :src="usuario.foto"
            :alt="usuario.nome"
            class="avatar-img"
          />
          <div v-else class="avatar-placeholder">
            {{ usuario.iniciais }}
          </div>
          <div class="avatar-badge">
            <span class="icon">{{ tituloIcon }}</span>
          </div>
        </div>

        <!-- Barra de XP -->
        <div class="xp-container">
          <div class="xp-bar">
            <div class="xp-fill" :style="{ width: `${progressoXp}%` }"></div>
          </div>
          <span class="xp-text">
            {{ xpAtual % 100 }}/100 XP para nível {{ nivelAtual + 1 }}
          </span>
        </div>
      </div>

      <div class="perfil-details">
        <h1 class="usuario-nome">{{ usuario.nome }}</h1>
        <p class="usuario-matricula">Matrícula: {{ usuario.id }}</p>
        <p class="usuario-titulo">{{ tituloAtual }}</p>
      </div>

      <div class="perfil-stats">
        <div class="stat-item nivel">
          <span class="stat-number">{{ nivelAtual }}</span>
          <span class="stat-label">Nível Atual</span>
        </div>
        <div class="stat-item auditorias">
          <span class="stat-number">{{ totalAuditorias }}</span>
          <span class="stat-label">Auditorias</span>
        </div>
        <div class="stat-item ranking">
          <span class="stat-number">#{{ posicaoRanking }}</span>
          <span class="stat-label">Posição</span>
        </div>
        <div class="stat-item desempenho">
          <span class="stat-number">{{ mediaDesempenho }}%</span>
          <span class="stat-label">Desempenho</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useNivelStore } from '@/store/nivelStore'
import { computed } from 'vue'

export default {
  name: "PerfilHeader",
  props: {
    usuario: {
      type: Object,
      required: true,
    },
    corredoresUnicos: {
      type: Array,
      default: () => [],
    },
    percentualConcluido: {
      type: Number,
      default: 0,
    },
    posicaoRanking: {
      type: Number,
      default: 1,
    },
    mediaDesempenho: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const nivelStore = useNivelStore()

    const xpAtual = computed(() => {
      return (props.usuario.contador || 0) + (props.usuario.xpConquistas || 0)
    })

    const nivelAtual = computed(() => {
      return nivelStore.calcularNivel(xpAtual.value)
    })

    const tituloAtual = computed(() => {
      return nivelStore.obterTitulo(nivelAtual.value)
    })

    const progressoXp = computed(() => {
      return (xpAtual.value % 100)
    })

    const totalAuditorias = computed(() => {
      return props.usuario.totalAuditorias || 0
    })

    const tituloIcon = computed(() => {
      const nivel = nivelAtual.value
      if (nivel >= 50) return '👑'
      if (nivel >= 40) return '💎'
      if (nivel >= 30) return '🏆'
      if (nivel >= 20) return '🥇'
      if (nivel >= 10) return '⭐'
      if (nivel >= 5) return '🎯'
      return '🆕'
    })

    return {
      xpAtual,
      nivelAtual,
      tituloAtual,
      progressoXp,
      totalAuditorias,
      tituloIcon
    }
  }
};
</script>

<style scoped>
/* Copiar os estilos relacionados ao header do arquivo original */
.perfil-header {
  background: rgb(255, 255, 255);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 20px;
}

.perfil-cover {
  height: 150px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 2rem;
}

.cover-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="5" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="50" r="8" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="5" fill="rgba(255,255,255,0.1)"/></svg>');
}

.perfil-info {
  padding: 0 30px 30px;
  margin-top: -30px;
  display: flex;
  align-items: flex-end;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.avatar-container {
  position: relative;
}

.avatar-wrapper {
  position: relative;
}

.avatar-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.avatar-placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 3rem;
  border: 4px solid white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.avatar-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #ffd43b;
  color: #000;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  font-size: 1.5rem;
}

.perfil-details {
  flex: 1;
  min-width: 300px;
}

.usuario-nome {
  font-weight: 200;
  position: relative;
  z-index: 100;
  margin-top: -10px;

  margin-bottom: 5px;
  color: #2c3e50;
}

.usuario-matricula,
.usuario-cargo {
  color: #7f8c8d;
  margin-bottom: 5px;
}

.perfil-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
  min-width: 400px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

/* Novos estilos para elementos de nível e XP */
.nivel-badge {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 0.8rem 1.2rem;
  text-align: center;
  backdrop-filter: blur(10px);
  z-index: 10;
}

.nivel-number {
  display: block;
  font-size: 2rem;
  font-weight: 900;
  color: white;
  line-height: 1;
}

.nivel-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.5px;
}

.xp-container {
  margin-top: 1rem;
  text-align: center;
}

.xp-bar {
  width: 150px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto 0.5rem;
}

.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd43b 0%, #ffb800 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.xp-text {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.usuario-titulo {
  color: #667eea;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 5px;
}

.stat-item.nivel .stat-number {
  color: #8b5cf6;
}

.stat-item.auditorias .stat-number {
  color: #10b981;
}

.stat-item.ranking .stat-number {
  color: #f59e0b;
}

.stat-item.desempenho .stat-number {
  color: #3b82f6;
}

@media (max-width: 768px) {
  .perfil-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .perfil-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    min-width: auto;
  }

  .perfil-cover {
    justify-content: center;
  }

  .nivel-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}

@media (max-width: 480px) {
  .perfil-stats {
    grid-template-columns: 1fr;
  }
}
</style>
