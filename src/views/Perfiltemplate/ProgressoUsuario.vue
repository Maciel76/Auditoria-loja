<template>
  <div class="progresso-usuario">
    <div class="progresso-header">
      <h2>
        <i class="fas fa-bolt"></i>
        Progresso e Evolução
      </h2>
      <p class="subtitle">Acompanhe seu crescimento e metas alcançadas</p>
    </div>

    <!-- Estatísticas Principais -->
    <div class="progresso-cards">
      <div class="progress-card nivel-card">
        <div class="card-header">
          <i class="fas fa-star"></i>
          <span>Nível Atual</span>
        </div>
        <div class="card-content">
          <div class="nivel-display">{{ usuario.nivel }}</div>
          <p class="nivel-titulo">{{ usuario.titulo }}</p>
          <div class="xp-progress">
            <div class="xp-bar">
              <div
                class="xp-fill"
                :style="{ width: usuario.progressoXp + '%' }"
              ></div>
            </div>
            <span class="xp-text"
              >{{ usuario.xpAtual }} / {{ usuario.xpParaProximoNivel }} XP</span
            >
          </div>
        </div>
      </div>

      <div class="progress-card xp-card">
        <div class="card-header">
          <i class="fas fa-fire"></i>
          <span>XP Total</span>
        </div>
        <div class="card-content">
          <div class="xp-total">{{ usuario.xpAtual }}</div>
          <p class="xp-description">Pontos de experiência acumulados</p>
        </div>
      </div>

      <div class="progress-card conquistas-card">
        <div class="card-header">
          <i class="fas fa-trophy"></i>
          <span>Conquistas</span>
        </div>
        <div class="card-content">
          <div class="conquistas-count">{{ totalConquistas }}</div>
          <p class="conquistas-description">Conquistas desbloqueadas</p>
        </div>
      </div>

      <div class="progress-card ranking-card">
        <div class="card-header">
          <i class="fas fa-medal"></i>
          <span>Ranking</span>
        </div>
        <div class="card-content">
          <div class="ranking-position">#{{ posicaoRanking }}</div>
          <p class="ranking-description">Posição no ranking geral</p>
        </div>
      </div>
    </div>

    <!-- Gráfico de Progresso -->
    <div class="progresso-timeline">
      <h3>
        <i class="fas fa-chart-line"></i>
        Evolução Mensal
      </h3>
      <div class="timeline-info">
        <p>Acompanhe seu progresso ao longo do tempo</p>
      </div>
      <div class="timeline-placeholder">
        <i class="fas fa-chart-bar"></i>
        <p>Gráfico de evolução em desenvolvimento</p>
        <span class="info-text"
          >Em breve você poderá visualizar sua evolução com gráficos
          detalhados</span
        >
      </div>
    </div>

    <!-- Metas e Objetivos -->
    <div class="metas-section">
      <h3>
        <i class="fas fa-bullseye"></i>
        Próximas Metas
      </h3>
      <div class="metas-list">
        <div class="meta-item">
          <div class="meta-icon">
            <i class="fas fa-level-up-alt"></i>
          </div>
          <div class="meta-content">
            <h4>Próximo Nível</h4>
            <p>
              Faltam {{ xpParaProximoNivel }} XP para alcançar o nível
              {{ usuario.nivel + 1 }}
            </p>
            <div class="meta-progress">
              <div class="meta-bar">
                <div
                  class="meta-fill"
                  :style="{ width: usuario.progressoXp + '%' }"
                ></div>
              </div>
              <span>{{ Math.round(usuario.progressoXp) }}%</span>
            </div>
          </div>
        </div>

        <div class="meta-item">
          <div class="meta-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="meta-content">
            <h4>Conquistas Pendentes</h4>
            <p>{{ conquistasPendentes }} conquistas ainda não desbloqueadas</p>
          </div>
        </div>

        <div class="meta-item">
          <div class="meta-icon">
            <i class="fas fa-tasks"></i>
          </div>
          <div class="meta-content">
            <h4>Auditorias Realizadas</h4>
            <p>{{ usuario.totalAuditorias }} auditorias completas</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  usuario: {
    type: Object,
    required: true,
  },
  posicaoRanking: {
    type: [Number, String],
    default: "-",
  },
  totalConquistas: {
    type: Number,
    default: 0,
  },
  conquistasPendentes: {
    type: Number,
    default: 0,
  },
});

const xpParaProximoNivel = computed(() => {
  return props.usuario.xpParaProximoNivel - props.usuario.xpAtual;
});
</script>

<style scoped>
.progresso-usuario {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.progresso-header {
  margin-bottom: 2rem;
}

.progresso-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.progresso-header h2 i {
  color: #f59e0b;
  font-size: 1.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin: 0;
}

/* Cards de Progresso */
.progresso-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.progress-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.progress-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #6c757d;
  font-weight: 600;
  font-size: 0.9rem;
}

.card-header i {
  font-size: 1.2rem;
}

.nivel-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.nivel-card .card-header {
  color: rgba(255, 255, 255, 0.9);
}

.nivel-display {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.nivel-titulo {
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  opacity: 0.95;
}

.xp-progress {
  margin-top: 1rem;
}

.xp-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.xp-fill {
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.xp-text {
  font-size: 0.85rem;
  opacity: 0.9;
}

.xp-card .card-header i {
  color: #f59e0b;
}

.xp-total {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.xp-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.conquistas-card .card-header i {
  color: #10b981;
}

.conquistas-count {
  font-size: 2.5rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 0.5rem;
}

.conquistas-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.ranking-card .card-header i {
  color: #8b5cf6;
}

.ranking-position {
  font-size: 2.5rem;
  font-weight: 700;
  color: #8b5cf6;
  margin-bottom: 0.5rem;
}

.ranking-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

/* Timeline */
.progresso-timeline {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.progresso-timeline h3 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progresso-timeline h3 i {
  color: #667eea;
}

.timeline-info {
  margin-bottom: 1.5rem;
}

.timeline-info p {
  color: #6c757d;
  margin: 0;
}

.timeline-placeholder {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 10px;
  border: 2px dashed #cbd5e0;
}

.timeline-placeholder i {
  font-size: 3rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.timeline-placeholder p {
  font-size: 1.1rem;
  color: #6c757d;
  margin: 0.5rem 0;
}

.info-text {
  font-size: 0.9rem;
  color: #95a5a6;
}

/* Metas */
.metas-section h3 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.metas-section h3 i {
  color: #667eea;
}

.metas-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.meta-item {
  display: flex;
  gap: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.meta-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.meta-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  flex-shrink: 0;
}

.meta-icon i {
  font-size: 1.5rem;
  color: #667eea;
}

.meta-content {
  flex: 1;
}

.meta-content h4 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.meta-content p {
  color: #6c757d;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
}

.meta-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.meta-bar {
  flex: 1;
  height: 10px;
  background: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
}

.meta-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.meta-progress span {
  font-weight: 600;
  color: #667eea;
  font-size: 0.9rem;
  min-width: 40px;
}

/* Mobile responsivo */
@media (max-width: 768px) {
  .progresso-usuario {
    border-radius: 12px;
    padding: 1.5rem 1rem;
  }

  .progresso-header h2 {
    font-size: 1.4rem;
  }

  .progresso-header h2 i {
    font-size: 1.2rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .progresso-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .progress-card {
    padding: 1.2rem;
  }

  .nivel-display {
    font-size: 2.5rem;
  }

  .xp-total,
  .conquistas-count,
  .ranking-position {
    font-size: 2rem;
  }

  .progresso-timeline {
    padding: 1.5rem;
  }

  .progresso-timeline h3 {
    font-size: 1.2rem;
  }

  .timeline-placeholder {
    padding: 2rem 1rem;
  }

  .timeline-placeholder i {
    font-size: 2.5rem;
  }

  .metas-section h3 {
    font-size: 1.2rem;
  }

  .meta-item {
    flex-direction: column;
    padding: 1.2rem;
  }

  .meta-icon {
    width: 45px;
    height: 45px;
  }

  .meta-content h4 {
    font-size: 1rem;
  }

  .meta-content p {
    font-size: 0.9rem;
  }
}

/* Mobile pequeno */
@media (max-width: 480px) {
  .progresso-usuario {
    padding: 1rem;
  }

  .progresso-header h2 {
    font-size: 1.2rem;
  }

  .nivel-display {
    font-size: 2rem;
  }

  .xp-total,
  .conquistas-count,
  .ranking-position {
    font-size: 1.8rem;
  }

  .meta-item {
    padding: 1rem;
  }
}
</style>
