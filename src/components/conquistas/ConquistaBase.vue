<template>
  <div
    class="conquista-card"
    :class="{
      'desbloqueada': conquistaData.desbloqueada,
      'nova': conquistaData.nova,
      'repeticao': conquistaData.repeticao
    }"
  >
    <div class="conquista-icon">
      <span class="icon-emoji">{{ conquistaData.icone }}</span>
      <div v-if="conquistaData.desbloqueada" class="check-mark">✓</div>
    </div>

    <div class="conquista-content">
      <h3 class="conquista-nome">{{ conquistaData.nome }}</h3>
      <p class="conquista-descricao">{{ conquistaData.descricao }}</p>

      <div class="conquista-details">
        <div class="xp-badge">
          <span class="xp-icon">⭐</span>
          <span class="xp-value">{{ conquistaData.xp }} XP</span>
        </div>

        <div v-if="conquistaData.repeticao" class="repeticao-badge">
          <span class="repeticao-icon">🔄</span>
          <span class="repeticao-text">{{ conquistaData.repeticao }}</span>
        </div>
      </div>

      <div v-if="conquistaData.progresso !== undefined" class="progresso-container">
        <div class="progresso-bar">
          <div
            class="progresso-fill"
            :style="{ width: `${Math.min(100, conquistaData.progresso)}%` }"
          ></div>
        </div>
        <span class="progresso-text">
          {{ Math.min(100, Math.round(conquistaData.progresso)) }}%
        </span>
      </div>
    </div>

    <div v-if="conquistaData.nova" class="nova-badge">
      <span>NOVO!</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConquistaBase",
  props: {
    conquistaData: {
      type: Object,
      required: true,
      default: () => ({
        id: '',
        nome: '',
        descricao: '',
        icone: '🏆',
        xp: 0,
        desbloqueada: false,
        nova: false,
        repeticao: null,
        progresso: undefined
      })
    }
  }
}
</script>

<style scoped>
.conquista-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid #e2e8f0;
  opacity: 0.6;
}

.conquista-card.desbloqueada {
  opacity: 1;
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
}

.conquista-card.nova {
  animation: pulse-glow 2s infinite;
  border-color: #ffd43b;
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
}

.conquista-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.conquista-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0 auto 1rem;
  position: relative;
  font-size: 2rem;
}

.conquista-card.desbloqueada .conquista-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.icon-emoji {
  font-size: 1.8rem;
}

.check-mark {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: #10b981;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  border: 2px solid white;
}

.conquista-content {
  text-align: center;
}

.conquista-nome {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.conquista-descricao {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.conquista-details {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.xp-badge, .repeticao-badge {
  background: #f1f5f9;
  border-radius: 12px;
  padding: 0.4rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.xp-badge {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.repeticao-badge {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.xp-icon, .repeticao-icon {
  font-size: 0.9rem;
}

.progresso-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.8rem;
}

.progresso-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progresso-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progresso-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #667eea;
  min-width: 35px;
}

.nova-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  transform: rotate(15deg);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 4px 25px rgba(255, 212, 59, 0.4);
  }
}

.conquista-card.repeticao {
  border-style: dashed;
}

.conquista-card.repeticao.desbloqueada {
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
  border-color: #3b82f6;
}
</style>