<template>
  <div v-if="conquista" class="modal-overlay" @click.self="fecharModal">
    <div class="modal-content" :class="{ 'desbloqueada': conquista.desbloqueada }">
      <!-- Header do Modal -->
      <div class="modal-header">
        <div class="conquista-icon-large">
          <span class="icon-emoji">{{ conquista.icone }}</span>
          <div v-if="conquista.desbloqueada" class="check-mark-large">✓</div>
        </div>
        <h2 class="conquista-titulo">{{ conquista.nome }}</h2>
        <button @click="fecharModal" class="close-btn">×</button>
      </div>

      <!-- Conteúdo Principal -->
      <div class="modal-body">
        <!-- Status da Conquista -->
        <div class="status-section">
          <div class="status-badge" :class="{ 'desbloqueada': conquista.desbloqueada }">
            <span v-if="conquista.desbloqueada">🎉 Conquista Desbloqueada!</span>
            <span v-else>🔒 Conquista Bloqueada</span>
          </div>
          <p class="conquista-descricao-detalhada">{{ conquista.descricao }}</p>
        </div>

        <!-- Progresso Atual -->
        <div v-if="conquista.progresso !== undefined" class="progresso-section">
          <h3 class="section-title">📈 Progresso Atual</h3>
          <div class="progresso-container-detailed">
            <div class="progresso-bar-detailed">
              <div
                class="progresso-fill-detailed"
                :style="{ width: `${Math.min(100, conquista.progresso)}%` }"
              ></div>
            </div>
            <span class="progresso-percentage">{{ Math.round(conquista.progresso) }}%</span>
          </div>
        </div>

        <!-- Como Conquistar -->
        <div class="como-conquistar-section">
          <h3 class="section-title">🎯 Como Conquistar</h3>
          <div v-if="conquista.repeticao" class="marcos-recorrentes">
            <p class="info-text">Esta é uma conquista <strong>{{ conquista.repeticao }}</strong>. Você pode evoluir através dos seguintes marcos:</p>
            <div class="marcos-lista">
              <div
                v-for="(marco, index) in obterMarcos()"
                :key="index"
                class="marco-item"
                :class="{
                  'concluido': index <= marcoAtual,
                  'proximo': index === marcoAtual + 1,
                  'futuro': index > marcoAtual + 1
                }"
              >
                <div class="marco-numero">{{ index + 1 }}</div>
                <div class="marco-content">
                  <h4 class="marco-titulo">{{ marco.nome }}</h4>
                  <p class="marco-descricao">{{ marco.descricao }}</p>
                  <div class="marco-meta">Meta: {{ marco.meta }}</div>
                </div>
                <div class="marco-status">
                  <span v-if="index <= marcoAtual">✅</span>
                  <span v-else-if="index === marcoAtual + 1">🎯</span>
                  <span v-else>⏳</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="conquista-unica">
            <div class="requisitos-lista">
              <h4 class="requisitos-titulo">📋 Requisitos:</h4>
              <ul class="requisitos-items">
                <li v-for="requisito in obterRequisitos()" :key="requisito">{{ requisito }}</li>
              </ul>
            </div>
            <div class="dicas-section">
              <h4 class="dicas-titulo">💡 Dicas:</h4>
              <ul class="dicas-items">
                <li v-for="dica in obterDicas()" :key="dica">{{ dica }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Recompensas -->
        <div class="recompensas-section">
          <h3 class="section-title">🎁 Recompensas</h3>
          <div class="recompensas-grid">
            <div class="recompensa-item">
              <span class="recompensa-icon">⭐</span>
              <span class="recompensa-text">{{ conquista.xp }} XP</span>
            </div>
            <div v-if="conquista.repeticao" class="recompensa-item">
              <span class="recompensa-icon">🔄</span>
              <span class="recompensa-text">Conquista {{ conquista.repeticao }}</span>
            </div>
            <div class="recompensa-item">
              <span class="recompensa-icon">🏆</span>
              <span class="recompensa-text">Selo de Prestígio</span>
            </div>
          </div>
        </div>

        <!-- Estatísticas Extras -->
        <div v-if="conquista.dadosExtras" class="stats-section">
          <h3 class="section-title">📊 Estatísticas</h3>
          <div class="stats-grid">
            <div
              v-for="(valor, chave) in filtrarEstatisticas()"
              :key="chave"
              class="stat-item"
            >
              <span class="stat-label">{{ formatarLabel(chave) }}</span>
              <span class="stat-value">{{ formatarValor(valor) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button @click="fecharModal" class="btn-fechar">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConquistaDetalhes",
  props: {
    conquista: {
      type: Object,
      default: null
    }
  },
  emits: ['fechar'],
  computed: {
    marcoAtual() {
      if (!this.conquista?.dadosExtras?.marcos) return -1
      const progresso = this.conquista.progresso || 0
      return Math.floor(progresso / (100 / this.obterMarcos().length)) - 1
    }
  },
  methods: {
    fecharModal() {
      this.$emit('fechar')
    },

    obterMarcos() {
      // Define marcos baseados no tipo de conquista
      const tipo = this.conquista?.id || ''

      if (tipo.includes('lenda_viva')) {
        return [
          { nome: 'Iniciante', descricao: 'Começar a jornada de auditoria', meta: '30 dias' },
          { nome: 'Experiente', descricao: 'Manter consistência por trimestre', meta: '90 dias' },
          { nome: 'Veterano', descricao: 'Auditoria por meio ano', meta: '180 dias' },
          { nome: 'Lenda Viva', descricao: 'Um ano completo de dedicação', meta: '365 dias' }
        ]
      }

      if (tipo.includes('guardiao')) {
        return [
          { nome: 'Guardião Iniciante', descricao: 'Presença regular', meta: '7 dias ativos' },
          { nome: 'Guardião Dedicado', descricao: 'Presença quinzenal', meta: '15 dias ativos' },
          { nome: 'Guardião Presença', descricao: 'Presença mensal completa', meta: '30 dias ativos' }
        ]
      }

      return [
        { nome: 'Nível 1', descricao: 'Primeiro marco alcançado', meta: 'Meta inicial' },
        { nome: 'Nível 2', descricao: 'Progresso intermediário', meta: 'Meta intermediária' },
        { nome: 'Nível 3', descricao: 'Conquista completa', meta: 'Meta final' }
      ]
    },

    obterRequisitos() {
      const tipo = this.conquista?.id || ''

      if (tipo.includes('top_performer')) {
        return [
          'Estar acima da média geral de produtividade',
          'Manter alta taxa de precisão nas auditorias',
          'Demonstrar consistência nas atividades diárias'
        ]
      }

      if (tipo.includes('lider_podio')) {
        return [
          'Estar entre os 3 primeiros no ranking geral',
          'Manter alta performance consistente',
          'Superar outros auditores em métricas-chave'
        ]
      }

      if (tipo.includes('pioneiro')) {
        return [
          'Ser o primeiro a iniciar auditorias no dia',
          'Manter regularidade matinal',
          'Alcançar pelo menos 10 primeiros dias'
        ]
      }

      return [
        'Completar atividades específicas da conquista',
        'Manter consistência na performance',
        'Atender aos critérios estabelecidos'
      ]
    },

    obterDicas() {
      const tipo = this.conquista?.id || ''

      if (tipo.includes('top_performer')) {
        return [
          'Mantenha uma rotina de auditoria consistente',
          'Foque na qualidade além da quantidade',
          'Monitore suas métricas regularmente'
        ]
      }

      if (tipo.includes('lider_podio')) {
        return [
          'Aumente sua produtividade diária',
          'Mantenha alta precisão nas auditorias',
          'Seja consistente em suas atividades'
        ]
      }

      return [
        'Mantenha regularidade nas atividades',
        'Foque em melhorar suas métricas',
        'Seja persistente e consistente'
      ]
    },

    filtrarEstatisticas() {
      if (!this.conquista?.dadosExtras) return {}

      const stats = {}
      const dados = this.conquista.dadosExtras

      // Filtra apenas dados relevantes para exibição
      if (dados.nivelAtual) stats.nivelAtual = dados.nivelAtual
      if (dados.diasAuditados) stats.diasAuditados = dados.diasAuditados
      if (dados.metricasUsuario) {
        stats.totalItens = dados.metricasUsuario.totalItens
        stats.nivel = dados.metricasUsuario.nivel
      }

      return stats
    },

    formatarLabel(chave) {
      const labels = {
        nivelAtual: 'Nível Atual',
        diasAuditados: 'Dias Auditados',
        totalItens: 'Total de Itens',
        nivel: 'Nível do Usuário'
      }
      return labels[chave] || chave
    },

    formatarValor(valor) {
      if (typeof valor === 'number') {
        return valor.toLocaleString()
      }
      return valor
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

.modal-content.desbloqueada {
  border: 3px solid #10b981;
  box-shadow: 0 20px 50px rgba(16, 185, 129, 0.3);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  text-align: center;
  padding: 2rem 2rem 1rem;
  position: relative;
  border-bottom: 1px solid #f1f5f9;
}

.conquista-icon-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  position: relative;
}

.modal-content.desbloqueada .conquista-icon-large {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.check-mark-large {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: #10b981;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  border: 3px solid white;
}

.conquista-titulo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #64748b;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.modal-body {
  padding: 1rem 2rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-section {
  margin-bottom: 2rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.status-badge.desbloqueada {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.conquista-descricao-detalhada {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.progresso-section {
  margin-bottom: 2rem;
}

.progresso-container-detailed {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progresso-bar-detailed {
  flex: 1;
  height: 12px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.progresso-fill-detailed {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.progresso-percentage {
  font-size: 1rem;
  font-weight: 600;
  color: #667eea;
  min-width: 50px;
}

.como-conquistar-section {
  margin-bottom: 2rem;
}

.info-text {
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.marcos-lista {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.marco-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #f1f5f9;
  transition: all 0.3s ease;
}

.marco-item.concluido {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-color: #10b981;
}

.marco-item.proximo {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
}

.marco-numero {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #64748b;
  font-size: 0.9rem;
}

.marco-item.concluido .marco-numero {
  background: #10b981;
  color: white;
}

.marco-item.proximo .marco-numero {
  background: #f59e0b;
  color: white;
}

.marco-content {
  flex: 1;
}

.marco-titulo {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.marco-descricao {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 0.5rem 0;
}

.marco-meta {
  font-size: 0.8rem;
  font-weight: 600;
  color: #667eea;
}

.marco-status {
  font-size: 1.2rem;
}

.conquista-unica {
  display: grid;
  gap: 1.5rem;
}

.requisitos-lista, .dicas-section {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
}

.requisitos-titulo, .dicas-titulo {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.requisitos-items, .dicas-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requisitos-items li, .dicas-items li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.4;
}

.requisitos-items li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: bold;
}

.dicas-items li::before {
  content: "💡";
  position: absolute;
  left: 0;
}

.recompensas-section {
  margin-bottom: 2rem;
}

.recompensas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.recompensa-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  font-weight: 600;
  color: #92400e;
}

.recompensa-icon {
  font-size: 1.2rem;
}

.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  text-align: center;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
}

.modal-footer {
  padding: 1rem 2rem 2rem;
  text-align: center;
  border-top: 1px solid #f1f5f9;
}

.btn-fechar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-fechar:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    margin: 0.5rem;
    max-height: 95vh;
  }

  .modal-header, .modal-body, .modal-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .recompensas-grid, .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>