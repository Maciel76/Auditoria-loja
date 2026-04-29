<template>
  <div class="insights-container" ref="insightsContainerRef">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <div class="icon-title">
            <div class="icon-area">
            <svg
              width="52"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
              d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V12H17V17Z"
              fill="currentColor"
              />
            </svg>
            </div>
          <div class="text-content">
            <div class="titulo" style="text-transform: capitalize;">Insights Auditoria de <span class="stileTipoAudit">{{ tipoInsightAtual }}</span>  {{ dataUltimaAuditoria || 'dd/mês/ano' }}</div>
            
            <div class="descricao">
              Analize da última auditoria de <span class="stileTipoAudit">{{ tipoInsightAtual }}</span> destacando pontos fortes e áreas de melhoria para otimizar a operação.
            </div>
          </div>
        </div>
      </div>
      <div class="header-controls">
        <div class="insights-actions">
          <button
            class="action-btn"
            :class="{ active: tipoInsightAtual === 'etiqueta' }"
            @click="alterarTipoInsight('etiqueta')"
          >
            Etiqueta
          </button>
          <button
            class="action-btn"
            :class="{ active: tipoInsightAtual === 'presenca' }"
            @click="alterarTipoInsight('presenca')"
          >
            Presença
          </button>
          <button
            class="action-btn"
            :class="{ active: tipoInsightAtual === 'ruptura' }"
            @click="alterarTipoInsight('ruptura')"
          >
            Ruptura
          </button>
        </div>
        <button @click="gerarImagemParaCompartilhar" class="share-button" :disabled="compartilhando">
          <svg v-if="!compartilhando" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor" />
          </svg>
          <svg v-else class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 13.01 17.75 13.97 17.3 14.8L18.76 16.26C19.54 15.03 20 13.57 20 12C20 7.58 16.42 4 12 4ZM12 18C8.69 18 6 15.31 6 12C6 10.99 6.25 10.03 6.7 9.2L5.24 7.74C4.46 8.97 4 10.43 4 12C4 16.42 7.58 20 12 20V23L16 19L12 15V18Z" fill="currentColor" />
          </svg>
          {{ compartilhando ? 'Gerando...' : 'Compartilhar' }}
        </button>
      </div>
    </div>

    <!-- Stats Overview - Dinâmico por filtro -->
    <div class="stats-overview">
      <div class="stats-grid">
        <div class="stat-card" v-for="(card, index) in statsCardsConfig" :key="tipoInsightAtual + '-' + index">
          <div class="stat-icon" :class="card.iconType">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path :d="card.iconPath" fill="currentColor" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ card.value }}</span>
            <span class="stat-label">{{ card.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid de Insights - Dinâmico por filtro -->
    <div class="insights-grid">

      <!-- 1. Performance -->
      <div class="insight-card performance">
        <div class="card-header">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="currentColor" />
            </svg>
          </div>
          <div class="card-title">
            <h3>{{ perfData.titulo }}</h3>
            <p class="card-subtitle">{{ perfData.subtitulo }}</p>
          </div>
        </div>
        <div class="card-content">
          <div class="metric-list">
            <div class="metric-item">
              <div class="metric-info">
                <span class="metric-label">{{ perfData.destaque.label }}</span>
                <span class="metric-value">{{ perfData.destaque.nome }}</span>
              </div>
              <div class="metric-right">
                <span class="fraction-text">{{ perfData.destaque.lidos }}/{{ perfData.destaque.total }}</span>
                <div class="metric-badge" :class="calcPercent(perfData.destaque.lidos, perfData.destaque.total) >= 50 ? 'positive' : 'negative'">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path :d="calcPercent(perfData.destaque.lidos, perfData.destaque.total) >= 50 ? 'M7 14L12 9L17 14H7Z' : 'M7 10L12 15L17 10H7Z'" fill="currentColor" />
                  </svg>
                  {{ calcPercent(perfData.destaque.lidos, perfData.destaque.total) }}%
                </div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-info">
                <span class="metric-label">{{ perfData.critico.label }}</span>
                <span class="metric-value">{{ perfData.critico.nome }}</span>
              </div>
              <div class="metric-right">
                <span class="fraction-text">{{ perfData.critico.lidos }}/{{ perfData.critico.total }}</span>
                <div class="metric-badge" :class="calcPercent(perfData.critico.lidos, perfData.critico.total) >= 50 ? 'positive' : 'negative'">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path :d="calcPercent(perfData.critico.lidos, perfData.critico.total) >= 50 ? 'M7 14L12 9L17 14H7Z' : 'M7 10L12 15L17 10H7Z'" fill="currentColor" />
                  </svg>
                  {{ calcPercent(perfData.critico.lidos, perfData.critico.total) }}%
                </div>
              </div>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-header">
              <span class="progress-label">{{ perfData.aderencia.label }}</span>
              <span class="progress-value">{{ perfData.aderencia.valor }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: perfData.aderencia.valor + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Alertas -->
      <div class="insight-card alertas">
        <div class="card-header">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="currentColor" />
            </svg>
          </div>
          <div class="card-title">
            <h3>{{ alertasData.titulo }}</h3>
            <p class="card-subtitle">{{ alertasData.subtitulo }}</p>
          </div>
        </div>
        <div class="card-content">
          <div class="alert-list">
            <div v-for="(alerta, idx) in alertasData.items" :key="'alert-' + idx" class="alert-item" :class="alerta.tipo">
              <div class="alert-indicator"></div>
              <div class="alert-content">
                <span class="alert-title">{{ alerta.titulo }}</span>
                <span class="alert-description">{{ alerta.descricao }}</span>
                <div class="alert-progress" v-if="alerta.total">
                  <div class="mini-progress-bar">
                    <div class="mini-progress-fill" :class="alerta.tipo" :style="{ width: Math.round((alerta.valor / alerta.total) * 100) + '%' }"></div>
                  </div>
                  <span class="alert-progress-text">{{ Math.round((alerta.valor / alerta.total) * 100) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Tendências / Evolução -->
      <div class="insight-card tendencias">
        <div class="card-header">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="currentColor" />
            </svg>
          </div>
          <div class="card-title">
            <h3>{{ tendenciasData.titulo }}</h3>
            <p class="card-subtitle">{{ tendenciasData.subtitulo }}</p>
          </div>
        </div>
        <div class="card-content">
          <div class="trend-list">
            <div v-for="(item, idx) in tendenciasData.items" :key="'trend-' + idx" class="trend-item">
              <div class="trend-indicator" :class="item.positivo ? 'positive' : 'negative'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path :d="item.positivo ? 'M7 14L12 9L17 14H7Z' : 'M7 10L12 15L17 10H7Z'" fill="currentColor" />
                </svg>
              </div>
              <div class="trend-content">
                <div class="trend-header-row">
                  <span class="trend-title">{{ item.label }}</span>
                  <span class="trend-badge" :class="item.positivo ? 'positive' : 'negative'">{{ item.valor }}</span>
                </div>
                <span class="trend-value">{{ item.descricao }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Plano de Ação / Recomendações -->
      <div class="insight-card recomendacoes">
        <div class="card-header">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM10.5 17.5L8 15L9.41 13.59L10.5 14.67L13.59 11.59L15 13L10.5 17.5Z" fill="currentColor" />
            </svg>
          </div>
          <div class="card-title">
            <h3>{{ recomendacoesData.titulo }}</h3>
            <p class="card-subtitle">{{ recomendacoesData.subtitulo }}</p>
          </div>
        </div>
        <div class="card-content">
          <div class="recommendation-list">
            <div v-for="(rec, idx) in recomendacoesData.items" :key="'rec-' + idx" class="recommendation-item">
              <div class="rec-priority-indicator" :class="rec.cor"></div>
              <div class="recommendation-content">
                <span class="recommendation-text">{{ rec.texto }}</span>
                <span class="recommendation-priority" :class="rec.cor">{{ rec.prioridade }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Destaques da Equipe / Reconhecimentos -->
      <div class="insight-card reconhecimentos">
        <div class="card-header">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
            </svg>
          </div>
          <div class="card-title">
            <h3>{{ reconhecimentosData.titulo }}</h3>
            <p class="card-subtitle">{{ reconhecimentosData.subtitulo }}</p>
          </div>
        </div>
        <div class="card-content">
          <div class="recognition-list">
            <div v-for="(pessoa, idx) in reconhecimentosData.items" :key="'rec-pessoa-' + idx" class="recognition-item">
              <div class="employee-avatar">
                <img :src="`https://ui-avatars.com/api/?name=${pessoa.nome}&background=random`" :alt="pessoa.nome" />
              </div>
              <div class="employee-info">
                <span class="employee-name">{{ pessoa.nome }}</span>
                <span class="employee-role">{{ pessoa.role }}</span>
                <span class="achievement">{{ pessoa.conquista }}</span>
              </div>
              <div class="achievement-badge-emoji">{{ pessoa.badge }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Distribuição por Classe -->
      <div class="insight-card distribuicao">
        <div class="card-header">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 2V22C5.9 21.5 2 17.2 2 12C2 6.8 5.9 2.5 11 2ZM13 2V11H22C21.5 6.2 17.8 2.5 13 2ZM13 13V22C17.7 21.5 21.5 17.8 22 13H13Z" fill="currentColor" />
            </svg>
          </div>
          <div class="card-title">
            <h3>{{ distribuicaoData.titulo }}</h3>
            <p class="card-subtitle">{{ distribuicaoData.subtitulo }}</p>
          </div>
        </div>
        <div class="card-content">
          <div class="distribution-list">
            <div v-for="(item, idx) in distribuicaoData.items" :key="'dist-' + idx" class="distribution-item">
              <div class="distribution-header">
                <span class="distribution-label">{{ item.classe }}</span>
                <span class="distribution-values">{{ item.valor }}/{{ item.total }}</span>
              </div>
              <div class="distribution-bar">
                <div class="distribution-fill" :style="{ width: calcPercent(item.valor, item.total) + '%', background: item.cor }"></div>
              </div>
              <span class="distribution-percent" :style="{ color: item.cor }">{{ calcPercent(item.valor, item.total) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Ranking por Local -->
      <div class="insight-card ranking">
        <div class="card-header">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 21H2V9H7.5V21ZM14.75 3H9.25V21H14.75V3ZM22 11H16.5V21H22V11Z" fill="currentColor" />
            </svg>
          </div>
          <div class="card-title">
            <h3>{{ rankingLocalData.titulo }}</h3>
            <p class="card-subtitle">{{ rankingLocalData.subtitulo }}</p>
          </div>
        </div>
        <div class="card-content">
          <div class="ranking-list">
            <div v-for="(item, idx) in rankingLocalData.items" :key="'rank-' + idx" class="ranking-item">
              <div class="ranking-position" :class="item.status">{{ item.posicao }}º</div>
              <div class="ranking-info">
                <span class="ranking-name">{{ item.nome }}</span>
                <div class="ranking-bar-container">
                  <div class="ranking-bar">
                    <div class="ranking-bar-fill" :class="item.status" :style="{ width: item.valor + '%' }"></div>
                  </div>
                </div>
              </div>
              <span class="ranking-value" :class="item.status">{{ item.valor }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 8. Resumo da Auditoria -->
      <div class="insight-card auditorias">
        <div class="card-header">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 12H9V17H7V12ZM11 7H13V17H11V7ZM15 10H17V17H15V10Z" fill="currentColor" />
            </svg>
          </div>
          <div class="card-title">
            <h3>{{ auditoriaData.titulo }}</h3>
            <p class="card-subtitle">{{ auditoriaData.subtitulo }}</p>
          </div>
        </div>
        <div class="card-content">
          <div class="audit-stats">
            <div v-for="(stat, idx) in auditoriaData.stats" :key="'audit-' + idx" class="stat-item">
              <span class="stat-value">{{ stat.valor }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
          <div class="improvement-section" :class="auditoriaData.melhoria.positivo ? 'positive-bg' : 'negative-bg'">
            <div class="improvement-indicator" :class="auditoriaData.melhoria.positivo ? 'positive' : 'negative'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :d="auditoriaData.melhoria.positivo ? 'M7 14L12 9L17 14H7Z' : 'M7 10L12 15L17 10H7Z'" fill="currentColor" />
              </svg>
            </div>
            <div class="improvement-content">
              <span class="improvement-title">{{ auditoriaData.melhoria.titulo }}</span>
              <span class="improvement-description">{{ auditoriaData.melhoria.descricao }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Analisando dados...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useInsightsStore } from "@/stores/insightsStore";
import { useRoute } from "vue-router";

const tipoInsightAtual = ref("etiqueta"); // Mantido para controle de UI, pode ser usado no futuro
const insightsStore = useInsightsStore();
const route = useRoute();

// O código da loja é pego da rota
const lojaCodigo = computed(() => route.params.codigo);

// Conecta as propriedades do template aos getters e ao state da store
const carregando = computed(() => insightsStore.loading);
const error = computed(() => insightsStore.error);
const loja = computed(() => insightsStore.loja);

// Cards de resumo (mantidos para uso em outros cards)
const itensAuditados = computed(() => insightsStore.itensAuditados);
const valorRuptura = computed(() => insightsStore.valorRuptura);
const aderencia = computed(() => insightsStore.aderencia);
const itensPorColaborador = computed(() => insightsStore.itensPorColaborador);

// Caminhos SVG dos ícones dos stat-cards
const iconPaths = {
  document: 'M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM10.5 17.5L8 15L9.41 13.59L10.5 14.67L13.59 11.59L15 13L10.5 17.5Z',
  alert: 'M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z',
  check: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z',
  person: 'M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z',
};

// Cards de resumo dinâmicos por filtro
const statsCardsConfig = computed(() => {
  const metricas = insightsStore.metricasDiarias;
  const etiquetas = metricas?.etiquetas || {};
  const presencas = metricas?.presencas || {};
  const rupturas = metricas?.rupturas || {};

  switch (tipoInsightAtual.value) {
    case 'etiqueta':
      return [
        { label: 'Total Etiquetas', value: etiquetas.totalItens ?? 0, iconType: 'primary', iconPath: iconPaths.document },
        { label: 'Etiquetas Lidas', value: etiquetas.itensAtualizados ?? 0, iconType: 'success', iconPath: iconPaths.check },
        { label: 'Etiquetas Não Lidas', value: etiquetas.itensNaolidos ?? 0, iconType: 'warning', iconPath: iconPaths.alert },
        { label: 'Colaboradores Atuando', value: etiquetas.usuariosAtivos ?? 0, iconType: 'info', iconPath: iconPaths.person },
      ];
    case 'presenca':
      return [
        { label: 'Total de Itens', value: presencas.totalItens ?? 0, iconType: 'primary', iconPath: iconPaths.document },
        { label: 'Itens Auditados', value: presencas.itensAtualizados ?? 0, iconType: 'success', iconPath: iconPaths.check },
        { label: 'Itens Não Auditados', value: presencas.itensNaoLidos ?? 0, iconType: 'warning', iconPath: iconPaths.alert },
        { label: 'Colaboradores Atuando', value: presencas.usuariosAtivos ?? 0, iconType: 'info', iconPath: iconPaths.person },
      ];
    case 'ruptura':
      return [
        { label: 'Itens em Ruptura', value: rupturas.totalItens ?? 0, iconType: 'primary', iconPath: iconPaths.document },
        { label: 'Ruptura Evitada', value: rupturas.itensLidos ?? 0, iconType: 'success', iconPath: iconPaths.check },
        { label: 'Ruptura Não Evitada', value: rupturas.itensNaoLidos ?? 0, iconType: 'warning', iconPath: iconPaths.alert },
        { label: 'Colaboradores Atuando', value: rupturas.usuariosAtivos ?? 0, iconType: 'info', iconPath: iconPaths.person },
      ];
    default:
      return [];
  }
});

// Cards de insights (store)
const setorDestaque = computed(() => insightsStore.setorDestaque);
const setorCritico = computed(() => insightsStore.setorCritico);
const colaboradorDestaque = computed(() => insightsStore.colaboradorDestaque);
const variacaoAuditorias = computed(() => insightsStore.metricasAgregadas?.variacaoAuditorias || 0);

// Data da última auditoria
const dataUltimaAuditoria = computed(() => {
  return new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
});

// Helper para calcular percentual
const calcPercent = (lidos, total) => total > 0 ? Math.round((lidos / total) * 100) : 0;

// ============================================
// Dados dinâmicos para os Insight Cards
// ============================================

// ============================================
// Helpers para transformar dados reais em rankings
// ============================================

const COLOR_PALETTE = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

const formatCurrencyBRL = (valor) => {
  const v = Number(valor) || 0;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
};

// Converte um objeto/Map de classesLeitura ou locaisLeitura em array ordenado
// Cada item: { nome, total, lidos, percent }
const normalizarMapa = (origem) => {
  if (!origem) return [];
  // Pode vir como Map (Mongoose) ou objeto plano
  let entries = [];
  if (origem instanceof Map) {
    entries = Array.from(origem.entries());
  } else if (typeof origem === 'object') {
    entries = Object.entries(origem).filter(([k]) => !k.startsWith('_') && k !== '$__parent');
  }
  return entries
    .map(([nome, valor]) => {
      // valor pode ser { total, lidos, percentual } ou um número
      if (valor && typeof valor === 'object') {
        const total = Number(valor.total ?? valor.totalItens ?? 0);
        const lidos = Number(valor.lidos ?? valor.itensAtualizados ?? valor.itensLidos ?? 0);
        const percent = total > 0 ? Math.round((lidos / total) * 100) : Number(valor.percentual ?? 0);
        return { nome, total, lidos, percent };
      }
      return { nome, total: Number(valor) || 0, lidos: 0, percent: 0 };
    })
    .filter((item) => item.nome && item.total > 0);
};

// Tipo de auditoria selecionado (sinônimo)
const tipoAuditoriaAtual = computed(() => tipoInsightAtual.value);

// Bloco real de métricas para o tipo selecionado
const metricasTipo = computed(() => {
  const m = insightsStore.metricasDiarias || {};
  return m[`${tipoInsightAtual.value}s`] || m[tipoInsightAtual.value] || {};
});

const classesRanqueadas = computed(() => {
  const arr = normalizarMapa(metricasTipo.value?.classesLeitura);
  return arr.sort((a, b) => b.percent - a.percent);
});

const locaisRanqueados = computed(() => {
  const arr = normalizarMapa(metricasTipo.value?.locaisLeitura);
  return arr.sort((a, b) => b.percent - a.percent);
});

// ============================================
// Performance Card — destaque e crítico reais
// ============================================
const perfData = computed(() => {
  const tipo = tipoInsightAtual.value;
  const m = metricasTipo.value || {};
  const classes = classesRanqueadas.value;
  const destaque = classes[0] || { nome: '—', lidos: 0, total: 0 };
  const critico = classes.length > 1 ? classes[classes.length - 1] : { nome: '—', lidos: 0, total: 0 };

  const titulos = {
    etiqueta:  { titulo: 'Performance Etiqueta',  subtitulo: 'Aderência de leitura por classe de produto', dest: 'Classe Destaque', crit: 'Classe Crítica',  ader: 'Progresso Total' },
    presenca:  { titulo: 'Performance Presença',  subtitulo: 'Confirmação de presença por classe',          dest: 'Classe Destaque', crit: 'Classe Crítica',  ader: 'Presença Confirmada' },
    ruptura:   { titulo: 'Performance Ruptura',   subtitulo: 'Cobertura anti-ruptura por classe',           dest: 'Menor Ruptura',   crit: 'Maior Ruptura',   ader: 'Cobertura Geral' },
  };
  const cfg = titulos[tipo] || titulos.etiqueta;

  return {
    titulo: cfg.titulo,
    subtitulo: cfg.subtitulo,
    destaque: { label: cfg.dest, nome: destaque.nome, lidos: destaque.lidos, total: destaque.total },
    critico:  { label: cfg.crit, nome: critico.nome,  lidos: critico.lidos,  total: critico.total },
    aderencia: { label: cfg.ader, valor: Math.round(Number(m.percentualConclusao) || 0) },
  };
});

// ============================================
// Alertas — derivados de campos reais
// ============================================
const alertasData = computed(() => {
  const tipo = tipoInsightAtual.value;
  const m = metricasTipo.value || {};
  const classes = classesRanqueadas.value;
  const piorClasse = classes.length > 0 ? classes[classes.length - 1] : null;

  if (tipo === 'etiqueta') {
    const desatualizadas = Number(m.itensDesatualizado) || 0;
    const totalItens = Number(m.totalItens) || 0;
    const semEstoque = Number(m.itensLidosemestoque) || 0;
    const naoLidos = Number(m.itensNaolidos ?? m.itensNaoLidos) || 0;
    return {
      titulo: 'Alertas de Etiqueta',
      subtitulo: 'Problemas detectados na leitura',
      items: [
        { tipo: desatualizadas > 0 ? 'critical' : 'low', titulo: 'Etiquetas Desatualizadas', descricao: `${desatualizadas} etiquetas desatualizadas de ${totalItens} totais`, valor: desatualizadas, total: Math.max(totalItens, 1) },
        { tipo: piorClasse ? 'medium' : 'low', titulo: 'Classe com Pior Aderência', descricao: piorClasse ? `${piorClasse.nome}: ${piorClasse.lidos}/${piorClasse.total} (${piorClasse.percent}%)` : 'Sem dados suficientes', valor: piorClasse?.lidos || 0, total: piorClasse?.total || 1 },
        { tipo: 'low', titulo: 'Não Lidos com Estoque', descricao: `${naoLidos} itens pendentes de leitura`, valor: naoLidos, total: Math.max(totalItens, 1) },
        { tipo: 'low', titulo: 'Lidos sem Estoque', descricao: `${semEstoque} itens lidos sem estoque disponível`, valor: semEstoque, total: Math.max(totalItens, 1) },
      ],
    };
  }
  if (tipo === 'presenca') {
    const semPresenca = Number(m.itensNaoLidos) || 0;
    const totalItens = Number(m.totalItens) || 0;
    const custo = Number(m.custoRuptura ?? m.rupturaSemPresenca) || 0;
    return {
      titulo: 'Alertas de Presença',
      subtitulo: 'Itens com falha de presença',
      items: [
        { tipo: semPresenca > 0 ? 'critical' : 'low', titulo: 'Itens Sem Presença', descricao: `${semPresenca} itens sem confirmação de presença`, valor: semPresenca, total: Math.max(totalItens, 1) },
        { tipo: custo > 0 ? 'medium' : 'low', titulo: 'Custo da Ausência', descricao: `${formatCurrencyBRL(custo)} em produtos sem presença confirmada`, valor: Math.round(custo), total: Math.max(Math.round(custo) + 1, 1) },
        { tipo: piorClasse ? 'medium' : 'low', titulo: 'Classe Crítica', descricao: piorClasse ? `${piorClasse.nome} com ${piorClasse.total - piorClasse.lidos} itens sem presença` : 'Sem dados', valor: piorClasse ? piorClasse.total - piorClasse.lidos : 0, total: piorClasse?.total || 1 },
      ],
    };
  }
  // ruptura
  const itensRuptura = Number(m.itensNaoLidos) || 0;
  const custoTotal = Number(m.custoTotalRuptura) || 0;
  const totalItens = Number(m.totalItens) || 0;
  return {
    titulo: 'Alertas de Ruptura',
    subtitulo: 'Itens em situação de ruptura',
    items: [
      { tipo: itensRuptura > 0 ? 'critical' : 'low', titulo: 'Ruptura Ativa', descricao: `${itensRuptura} itens em ruptura — custo total ${formatCurrencyBRL(custoTotal)}`, valor: itensRuptura, total: Math.max(totalItens, 1) },
      { tipo: piorClasse ? 'medium' : 'low', titulo: 'Classe com Maior Ruptura', descricao: piorClasse ? `${piorClasse.nome} concentra a pior cobertura (${piorClasse.percent}%)` : 'Sem dados', valor: piorClasse ? piorClasse.total - piorClasse.lidos : 0, total: piorClasse?.total || 1 },
      { tipo: 'low', titulo: 'Custo Médio Unitário', descricao: itensRuptura > 0 ? `Aprox. ${formatCurrencyBRL(custoTotal / itensRuptura)} por item em ruptura` : 'Sem ruptura registrada', valor: Math.round(custoTotal / Math.max(itensRuptura, 1)), total: Math.max(Math.round(custoTotal), 1) },
    ],
  };
});

// ============================================
// Tendências — usa variacaoAuditorias (agregadas) + comparativos do tipo
// ============================================
const tendenciasData = computed(() => {
  const tipo = tipoInsightAtual.value;
  const m = metricasTipo.value || {};
  const totais = insightsStore.metricasDiarias?.totais || {};
  const variacao = Number(insightsStore.metricasAgregadas?.variacaoAuditorias) || 0;
  const aderencia = Math.round(Number(m.percentualConclusao) || 0);
  const usuariosAtivos = Number(m.usuariosAtivos) || 0;

  const fmtVar = (v) => `${v >= 0 ? '+' : ''}${Math.round(v)}%`;

  if (tipo === 'etiqueta') {
    return {
      titulo: 'Indicadores de Leitura',
      subtitulo: 'Snapshot do desempenho atual',
      items: [
        { label: 'Aderência atual', valor: `${aderencia}%`, positivo: aderencia >= 70, descricao: `${m.itensAtualizados || 0} de ${m.totalItens || 0} etiquetas atualizadas` },
        { label: 'Variação vs. histórico', valor: fmtVar(variacao), positivo: variacao >= 0, descricao: 'Comparativo com o total acumulado' },
        { label: 'Colaboradores ativos', valor: String(usuariosAtivos), positivo: usuariosAtivos > 0, descricao: 'Operadores envolvidos na auditoria do dia' },
      ],
    };
  }
  if (tipo === 'presenca') {
    return {
      titulo: 'Indicadores de Presença',
      subtitulo: 'Snapshot da confirmação de presença',
      items: [
        { label: 'Confirmação atual', valor: `${aderencia}%`, positivo: aderencia >= 70, descricao: `${m.itensAtualizados || 0} de ${m.totalItens || 0} itens com presença` },
        { label: 'Custo de ausência', valor: formatCurrencyBRL(m.custoRuptura || 0), positivo: (m.custoRuptura || 0) === 0, descricao: 'Valor potencial perdido por ausência' },
        { label: 'Colaboradores ativos', valor: String(usuariosAtivos), positivo: usuariosAtivos > 0, descricao: 'Operadores envolvidos na auditoria do dia' },
      ],
    };
  }
  return {
    titulo: 'Indicadores de Ruptura',
    subtitulo: 'Snapshot do controle de ruptura',
    items: [
      { label: 'Cobertura', valor: `${aderencia}%`, positivo: aderencia >= 70, descricao: `${m.itensLidos || 0} de ${m.totalItens || 0} itens cobertos` },
      { label: 'Custo total', valor: formatCurrencyBRL(m.custoTotalRuptura || 0), positivo: (m.custoTotalRuptura || 0) === 0, descricao: 'Impacto financeiro acumulado' },
      { label: 'Variação geral', valor: fmtVar(variacao), positivo: variacao >= 0, descricao: 'Comparativo com auditorias anteriores' },
    ],
  };
});

// ============================================
// Recomendações — derivadas das classes/itens críticos
// ============================================
const recomendacoesData = computed(() => {
  const tipo = tipoInsightAtual.value;
  const m = metricasTipo.value || {};
  const classes = classesRanqueadas.value;
  const piorClasse = classes.length > 0 ? classes[classes.length - 1] : null;
  const aderencia = Math.round(Number(m.percentualConclusao) || 0);

  const titulos = { etiqueta: 'leitura de etiquetas', presenca: 'confirmação de presença', ruptura: 'controle de ruptura' };
  const items = [];

  if (piorClasse) {
    items.push({ texto: `Reforçar ${titulos[tipo] || 'auditoria'} na classe "${piorClasse.nome}" — atualmente em ${piorClasse.percent}% de cobertura`, prioridade: 'Alta', cor: 'critical' });
  }
  if (tipo === 'etiqueta' && (m.itensDesatualizado || 0) > 0) {
    items.push({ texto: `Reauditar ${m.itensDesatualizado} etiquetas marcadas como desatualizadas`, prioridade: 'Média', cor: 'medium' });
  }
  if (tipo === 'ruptura' && (m.custoTotalRuptura || 0) > 0) {
    items.push({ texto: `Solicitar reposição imediata para minimizar ${formatCurrencyBRL(m.custoTotalRuptura)} em ruptura ativa`, prioridade: 'Alta', cor: 'critical' });
  }
  if (tipo === 'presenca' && (m.itensNaoLidos || 0) > 0) {
    items.push({ texto: `Confirmar presença dos ${m.itensNaoLidos} itens pendentes ainda hoje`, prioridade: 'Alta', cor: 'critical' });
  }
  if (aderencia < 80) {
    items.push({ texto: `Aderência geral em ${aderencia}% — definir meta de 80% para o próximo ciclo`, prioridade: 'Média', cor: 'medium' });
  }
  if (items.length === 0) {
    items.push({ texto: 'Operação dentro do esperado — manter rotina e monitoramento contínuo', prioridade: 'Baixa', cor: 'low' });
  }

  return {
    titulo: 'Plano de Ação',
    subtitulo: `Sugestões para ${titulos[tipo] || 'a auditoria'}`,
    items: items.slice(0, 4),
  };
});

// ============================================
// Reconhecimentos — derivado do ranking real
// ============================================
const reconhecimentosData = computed(() => {
  const colaboradores = (insightsStore.rankingColaboradores || [])
    .filter((c) => c && c.nome && (c.auditorias > 0 || c.performance > 0))
    .slice(0, 3);

  const items = colaboradores.map((c, idx) => ({
    nome: c.nome,
    conquista: `${c.auditorias || 0} itens auditados (${Math.round(c.performance || 0)}% de eficiência)`,
    role: idx === 0 ? 'Líder do dia' : idx === 1 ? 'Vice-líder' : 'Destaque',
    badge: idx === 0 ? '1º' : idx === 1 ? '2º' : '3º',
  }));

  return {
    titulo: 'Destaques da Equipe',
    subtitulo: items.length ? 'Colaboradores com maior contribuição hoje' : 'Sem registros de colaboradores no período',
    items,
  };
});

// ============================================
// Distribuição por Classe — vem do classesLeitura real
// ============================================
const distribuicaoData = computed(() => {
  const tipo = tipoInsightAtual.value;
  const items = classesRanqueadas.value
    .slice(0, 6)
    .map((c, idx) => ({
      classe: c.nome,
      valor: c.lidos,
      total: c.total,
      cor: COLOR_PALETTE[idx % COLOR_PALETTE.length],
    }));

  const titulos = {
    etiqueta: { titulo: 'Distribuição por Classe', subtitulo: 'Leitura de etiquetas por classe de produto' },
    presenca: { titulo: 'Distribuição por Classe', subtitulo: 'Presença confirmada por classe de produto' },
    ruptura:  { titulo: 'Distribuição por Classe', subtitulo: 'Cobertura anti-ruptura por classe' },
  };
  const cfg = titulos[tipo] || titulos.etiqueta;

  return { ...cfg, items };
});

// ============================================
// Resumo da Auditoria — usa resumo real
// ============================================
const auditoriaData = computed(() => {
  const tipo = tipoInsightAtual.value;
  const m = metricasTipo.value || {};
  const aderencia = Math.round(Number(m.percentualConclusao) || 0);
  const totalItens = Number(m.totalItens) || 0;
  const lidos = Number(m.itensAtualizados ?? m.itensLidos) || 0;
  const pendentes = Math.max(totalItens - lidos, 0);
  const classes = classesRanqueadas.value;
  const melhorClasse = classes[0];

  const subtitulos = {
    etiqueta: 'Resumo do dia — auditoria de etiqueta',
    presenca: 'Resumo do dia — auditoria de presença',
    ruptura:  'Resumo do dia — auditoria de ruptura',
  };

  return {
    titulo: 'Resumo da Auditoria',
    subtitulo: subtitulos[tipo] || subtitulos.etiqueta,
    stats: [
      { valor: `${aderencia}%`, label: tipo === 'ruptura' ? 'Cobertura' : 'Conclusão' },
      { valor: lidos.toLocaleString('pt-BR'), label: tipo === 'ruptura' ? 'Cobertos' : 'Lidos' },
      { valor: pendentes.toLocaleString('pt-BR'), label: tipo === 'ruptura' ? 'Em Ruptura' : 'Pendentes' },
    ],
    melhoria: melhorClasse
      ? { titulo: `Destaque em ${melhorClasse.nome}`, descricao: `Aderência de ${melhorClasse.percent}% (${melhorClasse.lidos}/${melhorClasse.total})`, positivo: melhorClasse.percent >= 70 }
      : { titulo: 'Sem destaques', descricao: 'Aguardando dados suficientes para análise', positivo: false },
  };
});

// ============================================
// Ranking por Local — usa locaisLeitura real
// ============================================
const rankingLocalData = computed(() => {
  const tipo = tipoInsightAtual.value;
  const ordenados = [...locaisRanqueados.value];
  const ehRuptura = tipo === 'ruptura';
  // Para ruptura, menor percentual = melhor cobertura? Não — percentual aqui = cobertura, então maior é melhor para todos
  const items = ordenados.slice(0, 5).map((l, idx) => ({
    posicao: idx + 1,
    nome: l.nome,
    valor: l.percent,
    total: 100,
    status: l.percent >= 90 ? 'excelente' : l.percent >= 70 ? 'bom' : l.percent >= 40 ? 'atencao' : 'critico',
  }));

  const titulos = {
    etiqueta: { titulo: 'Ranking por Local', subtitulo: 'Locais ordenados por aderência de leitura' },
    presenca: { titulo: 'Ranking por Local', subtitulo: 'Locais ordenados por confirmação de presença' },
    ruptura:  { titulo: 'Ranking por Local', subtitulo: 'Locais ordenados por cobertura anti-ruptura' },
  };
  const cfg = titulos[tipo] || titulos.etiqueta;

  return { ...cfg, items };
});

const alterarTipoInsight = (tipo) => {
  tipoInsightAtual.value = tipo;
};

// Compartilhamento - gerar imagem do componente
const compartilhando = ref(false);

const insightsContainerRef = ref(null);

const gerarImagemParaCompartilhar = async () => {
  if (compartilhando.value) return;
  compartilhando.value = true;

  try {
    const { default: html2canvas } = await import('html2canvas');

    const container = insightsContainerRef.value;
    if (!container) throw new Error('Container não encontrado');

    // Detectar tamanho real da tela ativa
    const containerRect = container.getBoundingClientRect();
    const captureWidth = Math.round(containerRect.width);
    const captureHeight = Math.round(container.scrollHeight);

    console.log(`[Compartilhar] Capturando: ${captureWidth}x${captureHeight}px (tela: ${window.innerWidth}x${window.innerHeight})`);

    // Esconder botão de compartilhar durante a captura
    const shareBtn = container.querySelector('.share-button');
    if (shareBtn) shareBtn.style.display = 'none';

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: captureWidth,
      height: captureHeight,
      scrollX: -containerRect.left,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
      logging: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Garantir visibilidade de todo conteúdo no clone
        const clonedContainer = clonedDoc.querySelector('.insights-container');
        if (clonedContainer) {
          clonedContainer.style.overflow = 'visible';
          clonedContainer.style.height = 'auto';
        }
        const cards = clonedDoc.querySelectorAll('.insight-card, .stat-card');
        cards.forEach(el => {
          el.style.overflow = 'visible';
          el.style.breakInside = 'avoid';
        });
        // Esconder share btn no clone também
        const clonedShareBtn = clonedDoc.querySelector('.share-button');
        if (clonedShareBtn) clonedShareBtn.style.display = 'none';
      },
    });

    // Restaurar botão
    if (shareBtn) shareBtn.style.display = '';

    // Adicionar rodapé ao canvas
    const finalCanvas = document.createElement('canvas');
    const footerHeight = 50;
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height + footerHeight;
    const ctx = finalCanvas.getContext('2d');

    // Fundo branco + conteúdo capturado
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    // Linha separadora do rodapé
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, canvas.height + 10);
    ctx.lineTo(finalCanvas.width - 40, canvas.height + 10);
    ctx.stroke();

    // Texto do rodapé
    ctx.fillStyle = '#9ca3af';
    ctx.font = '22px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `Gerado em ${new Date().toLocaleString('pt-BR')} — Backoffice`,
      finalCanvas.width / 2,
      canvas.height + 38
    );

    const imgData = finalCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `insights-${tipoInsightAtual.value}-${lojaCodigo.value || 'loja'}-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  } catch (error) {
    console.error('Erro ao gerar imagem para compartilhamento:', error);

    // Fallback: abrir janela de impressão
    const container = insightsContainerRef.value;
    if (container) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Insights - Compartilhamento</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; }
              .insight-card, .stat-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin: 10px 0; }
              .share-button { display: none !important; }
            </style>
          </head>
          <body>${container.outerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    } else {
      alert('Não foi possível encontrar os elementos para compartilhamento.');
    }
  } finally {
    compartilhando.value = false;
  }
};

// Carrega os dados quando o componente é montado ou quando o código da loja na rota muda
onMounted(() => {
  console.log('[InsightsLoja] Componente montado. Código da loja:', lojaCodigo.value);
  if (lojaCodigo.value) {
    insightsStore.fetchInsights(lojaCodigo.value);
  }
});

watch(lojaCodigo, (newCodigo) => {
  if (newCodigo) {
    insightsStore.fetchInsights(newCodigo);
  }
});
</script>

<style scoped>
.insights-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin: 1.5rem auto;
  width: 100%;
  position: relative;
  overflow: hidden;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-left {
  flex: 1;
}

.icon-title {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.icon-area {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.text-content {
  display: flex;
  flex-direction: column;
}

.titulo {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2937 0%, #4b5563 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.descricao {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.header-controls {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
}
.header-controls .insights-actions {
  display: flex;
  gap: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 12px;
  padding: 0.3rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filtro-select {
  padding: 0.75rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #1f2937;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 160px;
  font-size: 0.875rem;
}

.filtro-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.refresh-btn {
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

/* Share Button */
.share-button {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  font-size: 0.875rem;
  white-space: nowrap;
}

.share-button:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.share-button:disabled {
  opacity: 0.7;
  cursor: wait;
  transform: none;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

.header-controls .action-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: transparent;
  color: #4b5563;
  font-size: 0.875rem;
}

.header-controls .action-btn:hover {
  background-color: #e5e7eb;
}

.header-controls .action-btn.active {
  background-color: #fff;
  color: #6366f1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.refresh-btn:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

/* Stats Overview */
.stats-overview {
  margin-bottom: 2.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 16px;
  border: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.primary {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.stat-icon.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-icon.info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Insights Grid */
.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #f3f4f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.insight-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transition: all 0.3s ease;
}

.insight-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #e5e7eb;
}

.insight-card:hover::before {
  height: 6px;
}

/* Card Header */
.card-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.performance .card-icon {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.alertas .card-icon {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

.tendencias .card-icon {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.recomendacoes .card-icon {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
}

.reconhecimentos .card-icon {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.auditorias .card-icon {
  background: linear-gradient(135deg, #6366f1, #818cf8);
}

.card-title h3 {
  margin: 0 0 0.25rem 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.card-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

/* Performance Card */
.metric-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.metric-badge {
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.metric-badge.positive {
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

.progress-section {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.progress-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Alertas Card */
.alert-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid;
  transition: all 0.2s ease;
}

.alert-item:hover {
  transform: translateX(4px);
}

.alert-item.critical {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.2);
}

.alert-item.medium {
  background: rgba(245, 158, 11, 0.05);
  border-color: rgba(245, 158, 11, 0.2);
}

.alert-item.low {
  background: rgba(59, 130, 246, 0.05);
  border-color: rgba(59, 130, 246, 0.2);
}

.alert-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 0.5rem;
  flex-shrink: 0;
}

.alert-item.critical .alert-indicator {
  background: #ef4444;
}

.alert-item.medium .alert-indicator {
  background: #f59e0b;
}

.alert-item.low .alert-indicator {
  background: #3b82f6;
}

.alert-content {
  flex: 1;
}

.alert-title {
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.alert-description {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Tendências Card */
.trend-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.trend-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.trend-item:hover {
  background: #f3f4f6;
}

.trend-indicator {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.trend-indicator.positive {
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

.trend-indicator.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #7f1d1d;
}

.trend-content {
  flex: 1;
}

.trend-title {
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.trend-value {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Recomendações Card */
.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}

.recommendation-content {
  flex: 1;
}

.recommendation-text {
  display: block;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.recommendation-priority {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  display: inline-block;
}

.recommendation-item:nth-child(1) .recommendation-priority {
  background: rgba(239, 68, 68, 0.1);
  color: #7f1d1d;
}

.recommendation-item:nth-child(2) .recommendation-priority {
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
}
.stileTipoAudit {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.9em;
}

.stileTipoAudit {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

/* Para quando tipoInsightAtual for 'etiqueta' */
[data-tipo="etiqueta"] .stileTipoAudit {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

/* Para quando tipoInsightAtual for 'presenca' */
[data-tipo="presenca"] .stileTipoAudit {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

/* Para quando tipoInsightAtual for 'ruptura' */
[data-tipo="ruptura"] .stileTipoAudit {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.action-btn.primary {
  background: #6366f1;
  color: white;
}

.action-btn.primary:hover {
  background: #4f46e5;
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.action-btn.secondary:hover {
  background: #e5e7eb;
}

/* Reconhecimentos Card */
.recognition-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recognition-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.recognition-item:hover {
  background: #f3f4f6;
}

.employee-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #f3f4f6;
  flex-shrink: 0;
}

.employee-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.employee-info {
  flex: 1;
}

.employee-name {
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.employee-role {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
  display: block;
}

.achievement {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.achievement-badge {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Auditorias Card */
.audit-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.improvement-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(16, 185, 129, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.improvement-indicator {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.improvement-content {
  flex: 1;
}

.improvement-title {
  display: block;
  font-weight: 600;
  color: #065f46;
  margin-bottom: 0.25rem;
}

.improvement-description {
  font-size: 0.875rem;
  color: #065f46;
}

.improvement-section.negative-bg {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.2);
}

.improvement-section.negative-bg .improvement-title,
.improvement-section.negative-bg .improvement-description {
  color: #7f1d1d;
}

.improvement-indicator.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #7f1d1d;
}

/* Metric Right (fraction + badge) */
.metric-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
}

.fraction-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  font-variant-numeric: tabular-nums;
}

.metric-badge.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #7f1d1d;
}

/* Alert Progress (mini barra dentro dos alertas) */
.alert-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.mini-progress-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.mini-progress-fill.critical {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.mini-progress-fill.medium {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.mini-progress-fill.low {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.alert-progress-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  min-width: 32px;
  text-align: right;
}

/* Trend Badge */
.trend-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.15rem;
}

.trend-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.trend-badge.positive {
  background: rgba(16, 185, 129, 0.1);
  color: #065f46;
}

.trend-badge.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #7f1d1d;
}

/* Recommendation Priority Indicator */
.rec-priority-indicator {
  width: 4px;
  border-radius: 4px;
  flex-shrink: 0;
  align-self: stretch;
}

.rec-priority-indicator.critical { background: #ef4444; }
.rec-priority-indicator.medium { background: #f59e0b; }
.rec-priority-indicator.low { background: #3b82f6; }

.recommendation-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.recommendation-item:hover {
  background: #f3f4f6;
}

.recommendation-priority {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-weight: 600;
  display: inline-block;
}

.recommendation-priority.critical {
  background: rgba(239, 68, 68, 0.1);
  color: #7f1d1d;
}

.recommendation-priority.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
}

.recommendation-priority.low {
  background: rgba(59, 130, 246, 0.1);
  color: #1e40af;
}

/* Achievement Badge Emoji */
.achievement-badge-emoji {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

/* Distribuição por Classe Card */
.distribuicao .card-icon {
  background: linear-gradient(135deg, #06b6d4, #22d3ee);
}

.distribution-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 160px;
  flex-shrink: 0;
}

.distribution-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
}

.distribution-values {
  font-size: 0.75rem;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
}

.distribution-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.distribution-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.distribution-percent {
  font-size: 0.8rem;
  font-weight: 700;
  min-width: 36px;
  text-align: right;
}

/* Ranking por Local Card */
.ranking .card-icon {
  background: linear-gradient(135deg, #ec4899, #f472b6);
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.ranking-item:hover {
  background: #f3f4f6;
}

.ranking-position {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.ranking-position.excelente { background: rgba(16, 185, 129, 0.15); color: #065f46; }
.ranking-position.bom { background: rgba(59, 130, 246, 0.15); color: #1e40af; }
.ranking-position.atencao { background: rgba(245, 158, 11, 0.15); color: #92400e; }
.ranking-position.critico { background: rgba(239, 68, 68, 0.15); color: #7f1d1d; }

.ranking-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ranking-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #1f2937;
}

.ranking-bar-container {
  width: 100%;
}

.ranking-bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.ranking-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.ranking-bar-fill.excelente { background: linear-gradient(90deg, #10b981, #34d399); }
.ranking-bar-fill.bom { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.ranking-bar-fill.atencao { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.ranking-bar-fill.critico { background: linear-gradient(90deg, #ef4444, #f87171); }

.ranking-value {
  font-size: 0.85rem;
  font-weight: 700;
  min-width: 38px;
  text-align: right;
}

.ranking-value.excelente { color: #065f46; }
.ranking-value.bom { color: #1e40af; }
.ranking-value.atencao { color: #92400e; }
.ranking-value.critico { color: #7f1d1d; }

/* Loading State */
.loading-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: 20px;
  z-index: 10;
  backdrop-filter: blur(4px);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* ============================================
   RESPONSIVIDADE
   ============================================ */

/* Tablets / Telas médias */
@media (max-width: 1200px) {
  .insights-grid {
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  }
}

/* Tablets pequenos e mobiles grandes */
@media (max-width: 768px) {
  .insights-container {
    padding: 1rem;
    margin: 0.75rem;
    border-radius: 14px;
  }

  /* Header */
  .header {
    flex-direction: column;
    gap: 1rem;
  }

  .titulo {
    font-size: 1.3rem;
  }

  .descricao {
    font-size: 0.875rem;
  }

  .icon-area {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }

  .icon-area svg {
    width: 36px;
    height: 32px;
  }

  /* Controles */
  .header-controls {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: space-between;
  }

  .insights-actions {
    flex: 1;
    min-width: 0;
  }

  .header-controls .action-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .share-button {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  /* Stats Grid */
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .stat-card {
    padding: 1rem;
    gap: 0.75rem;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  /* Insights Grid */
  .insights-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .insight-card {
    padding: 1.25rem;
  }

  /* Audit Stats */
  .audit-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .stat-item {
    padding: 0.75rem 0.5rem;
  }

  /* Distribution */
  .distribution-item {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .distribution-header {
    min-width: 120px;
    flex: 1;
  }

  .distribution-bar {
    min-width: 80px;
  }

  /* Ranking */
  .ranking-item {
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .ranking-position {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }

  /* Trend */
  .trend-item {
    padding: 0.75rem;
  }

  /* Recommendation */
  .recommendation-item {
    padding: 0.75rem;
  }

  /* Recognition */
  .recognition-item {
    padding: 0.75rem;
  }

  .employee-avatar {
    width: 40px;
    height: 40px;
  }

  /* Alerts */
  .alert-item {
    padding: 0.75rem;
  }
}

/* Mobile pequeno */
@media (max-width: 480px) {
  .insights-container {
    padding: 0.75rem;
    margin: 0.5rem;
    border-radius: 12px;
  }

  /* Header mobile vertical */
  .icon-title {
    gap: 0.75rem;
  }

  .icon-area {
    width: 42px;
    height: 42px;
    border-radius: 10px;
  }

  .icon-area svg {
    width: 28px;
    height: 26px;
  }

  .titulo {
    font-size: 1.1rem;
    line-height: 1.3;
  }

  .descricao {
    font-size: 0.8rem;
  }

  .stileTipoAudit {
    padding: 0.15rem 0.5rem;
    font-size: 0.8em;
  }

  /* Controles mobile — filtros empilham */
  .header-controls {
    flex-direction: column;
    gap: 0.5rem;
  }

  .header-controls .insights-actions {
    width: 100%;
    justify-content: center;
  }

  .header-controls .action-btn {
    flex: 1;
    text-align: center;
    padding: 0.45rem 0.5rem;
    font-size: 0.75rem;
  }

  .share-button {
    width: 100%;
    justify-content: center;
    padding: 0.55rem 1rem;
    font-size: 0.8rem;
  }

  /* Stats Grid — 2 colunas compactas */
  .stats-overview {
    margin-bottom: 1.25rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .stat-card {
    padding: 0.75rem;
    gap: 0.5rem;
    border-radius: 12px;
  }

  .stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
  }

  .stat-icon svg {
    width: 16px;
    height: 16px;
  }

  .stat-value {
    font-size: 1.1rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  /* Insight Cards mobile */
  .insights-grid {
    gap: 0.75rem;
  }

  .insight-card {
    padding: 1rem;
    border-radius: 14px;
  }

  /* Card Header */
  .card-header {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .card-icon svg {
    width: 20px;
    height: 20px;
  }

  .card-title h3 {
    font-size: 1.05rem;
  }

  .card-subtitle {
    font-size: 0.75rem;
  }

  /* Metric items */
  .metric-list {
    gap: 0.65rem;
    margin-bottom: 1rem;
  }

  .metric-item {
    padding: 0.65rem;
    border-radius: 10px;
  }

  .metric-label {
    font-size: 0.75rem;
  }

  .metric-value {
    font-size: 0.9rem;
  }

  .fraction-text {
    font-size: 0.7rem;
  }

  .metric-badge {
    font-size: 0.65rem;
    padding: 0.3rem 0.5rem;
  }

  /* Progress */
  .progress-section {
    padding: 0.75rem;
  }

  .progress-label {
    font-size: 0.8rem;
  }

  .progress-value {
    font-size: 0.9rem;
  }

  /* Alert items */
  .alert-list {
    gap: 0.5rem;
  }

  .alert-item {
    padding: 0.65rem;
    gap: 0.5rem;
    border-radius: 10px;
  }

  .alert-title {
    font-size: 0.85rem;
  }

  .alert-description {
    font-size: 0.75rem;
  }

  .mini-progress-bar {
    height: 5px;
  }

  .alert-progress-text {
    font-size: 0.65rem;
  }

  /* Trend items */
  .trend-list {
    gap: 0.65rem;
  }

  .trend-item {
    padding: 0.65rem;
    gap: 0.65rem;
    border-radius: 10px;
  }

  .trend-indicator {
    width: 28px;
    height: 28px;
  }

  .trend-title {
    font-size: 0.85rem;
  }

  .trend-value {
    font-size: 0.75rem;
  }

  .trend-badge {
    font-size: 0.65rem;
    padding: 0.15rem 0.4rem;
  }

  /* Recommendation items */
  .recommendation-list {
    gap: 0.65rem;
  }

  .recommendation-item {
    padding: 0.65rem;
    gap: 0.65rem;
    border-radius: 10px;
  }

  .recommendation-text {
    font-size: 0.85rem;
    margin-bottom: 0.35rem;
  }

  .recommendation-priority {
    font-size: 0.6rem;
    padding: 0.15rem 0.5rem;
  }

  /* Recognition items */
  .recognition-list {
    gap: 0.65rem;
  }

  .recognition-item {
    padding: 0.65rem;
    gap: 0.65rem;
    border-radius: 10px;
  }

  .employee-avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
  }

  .employee-name {
    font-size: 0.85rem;
  }

  .employee-role {
    font-size: 0.65rem;
  }

  .achievement {
    font-size: 0.75rem;
  }

  .achievement-badge-emoji {
    font-size: 1.2rem;
    width: 32px;
    height: 32px;
  }

  /* Distribution items */
  .distribution-list {
    gap: 0.6rem;
  }

  .distribution-item {
    gap: 0.5rem;
  }

  .distribution-header {
    min-width: 100px;
  }

  .distribution-label {
    font-size: 0.75rem;
  }

  .distribution-values {
    font-size: 0.65rem;
  }

  .distribution-bar {
    height: 6px;
    min-width: 60px;
  }

  .distribution-percent {
    font-size: 0.7rem;
    min-width: 30px;
  }

  /* Ranking items */
  .ranking-list {
    gap: 0.45rem;
  }

  .ranking-item {
    padding: 0.4rem 0.5rem;
    gap: 0.5rem;
    border-radius: 8px;
  }

  .ranking-position {
    width: 26px;
    height: 26px;
    font-size: 0.7rem;
    border-radius: 6px;
  }

  .ranking-name {
    font-size: 0.78rem;
  }

  .ranking-bar {
    height: 5px;
  }

  .ranking-value {
    font-size: 0.78rem;
    min-width: 32px;
  }

  /* Audit Stats */
  .audit-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4rem;
    margin-bottom: 1rem;
  }

  .stat-item {
    padding: 0.65rem 0.4rem;
    border-radius: 10px;
  }

  .audit-stats .stat-value {
    font-size: 1.15rem;
  }

  .audit-stats .stat-label {
    font-size: 0.65rem;
  }

  /* Improvement section */
  .improvement-section {
    padding: 0.75rem;
    gap: 0.65rem;
    border-radius: 10px;
  }

  .improvement-indicator {
    width: 28px;
    height: 28px;
  }

  .improvement-title {
    font-size: 0.85rem;
  }

  .improvement-description {
    font-size: 0.75rem;
  }

  /* Loading */
  .loading-spinner {
    width: 32px;
    height: 32px;
  }
}

/* Mobile muito pequeno (< 360px) */
@media (max-width: 360px) {
  .insights-container {
    padding: 0.5rem;
    margin: 0.25rem;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.35rem;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    padding: 0.6rem 0.4rem;
    gap: 0.35rem;
  }

  .stat-value {
    font-size: 1rem;
  }

  .titulo {
    font-size: 1rem;
  }

  .audit-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.25rem;
  }

  .distribution-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .distribution-header {
    width: 100%;
    min-width: unset;
  }

  .distribution-bar {
    width: 100%;
    min-width: unset;
  }
}
</style>
