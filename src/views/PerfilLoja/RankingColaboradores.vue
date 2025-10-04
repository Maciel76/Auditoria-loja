<template>
  <div class="ranking-colaboradores-container">
    <!-- Header -->
    <div class="ranking-header">
      <div class="header-left">
        <div class="icon-title">
          <div class="icon-area">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 15L7 10H17L12 15Z" fill="currentColor" />
              <path
                d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9C7.9 1 7 1.9 7 3V7H5C3.9 7 3 7.9 3 9V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9ZM19 21H5V9H19V21Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="text-content">
            <div class="titulo">Ranking de Colaboradores da Loja 001</div>
            <div class="descricao">
              Veja os colaboradores que mais se destacou nessa Loja
            </div>
          </div>
        </div>
      </div>
      <div class="header-controls">
        <div class="filter-group">
          <label for="periodo">Período</label>
          <select
            v-model="periodoSelecionado"
            id="periodo"
            class="filtro-select"
          >
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="trimestre">Este Trimestre</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="setor">Setor</label>
          <select v-model="setorSelecionado" id="setor" class="filtro-select">
            <option value="todos">Todos os Setores</option>
            <option value="atendimento">Atendimento</option>
            <option value="estoque">Estoque</option>
            <option value="caixa">Caixa</option>
            <option value="limpeza">Limpeza</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">+8.5%</span>
            <span class="stat-label">Crescimento Médio</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon success">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">12</span>
            <span class="stat-label">Metas Atingidas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon warning">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 9H11V7H13V9ZM13 17H11V11H13V17ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">5</span>
            <span class="stat-label">Melhoria Rápida</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon info">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 17H13V11H11V17ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 9H13V7H11V9Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">94.2%</span>
            <span class="stat-label">Média Geral</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Top 3 Pódio -->
    <div class="podium-section">
      <h3 class="section-title">Top Performers</h3>
      <div class="podium-container">
        <!-- Segundo Lugar -->
        <div class="podium-item segundo">
          <div class="medal-place">
            <div class="medal-icon">🥈</div>
            <div class="podium-base segundo"></div>
          </div>
          <div class="colaborador-avatar">
            <div class="avatar-img">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                alt="Carlos Silva"
              />
            </div>
            <div class="ranking-badge">2º</div>
          </div>
          <div class="colaborador-info">
            <span class="colaborador-nome">Carlos Silva</span>
            <span class="colaborador-setor">Atendimento</span>
          </div>
          <div class="colaborador-stats">
            <div class="stat">
              <span class="stat-value">96%</span>
              <span class="stat-label">Conformidade</span>
            </div>
            <div class="stat">
              <span class="stat-value">18</span>
              <span class="stat-label">Auditorias</span>
            </div>
          </div>
          <div class="performance-badge excelente">
            <span>+12%</span>
          </div>
        </div>

        <!-- Primeiro Lugar -->
        <div class="podium-item primeiro">
          <div class="medal-place">
            <div class="medal-icon">🥇</div>
            <div class="podium-base primeiro"></div>
          </div>
          <div class="colaborador-avatar">
            <div class="avatar-img">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80"
                alt="Maria Santos"
              />
            </div>
            <div class="ranking-badge">1º</div>
          </div>
          <div class="colaborador-info">
            <span class="colaborador-nome">Maria Santos</span>
            <span class="colaborador-setor">Qualidade</span>
          </div>
          <div class="colaborador-stats">
            <div class="stat">
              <span class="stat-value">98%</span>
              <span class="stat-label">Conformidade</span>
            </div>
            <div class="stat">
              <span class="stat-value">24</span>
              <span class="stat-label">Auditorias</span>
            </div>
          </div>
          <div class="performance-badge destaque">
            <span>+15%</span>
          </div>
          <div class="crown">👑</div>
        </div>

        <!-- Terceiro Lugar -->
        <div class="podium-item terceiro">
          <div class="medal-place">
            <div class="medal-icon">🥉</div>
            <div class="podium-base terceiro"></div>
          </div>
          <div class="colaborador-avatar">
            <div class="avatar-img">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                alt="Ana Oliveira"
              />
            </div>
            <div class="ranking-badge">3º</div>
          </div>
          <div class="colaborador-info">
            <span class="colaborador-nome">Ana Oliveira</span>
            <span class="colaborador-setor">Estoque</span>
          </div>
          <div class="colaborador-stats">
            <div class="stat">
              <span class="stat-value">94%</span>
              <span class="stat-label">Conformidade</span>
            </div>
            <div class="stat">
              <span class="stat-value">15</span>
              <span class="stat-label">Auditorias</span>
            </div>
          </div>
          <div class="performance-badge excelente">
            <span>+8%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Ranking -->
    <div class="ranking-list-section">
      <div class="ranking-list-header">
        <h3>Classificação Completa</h3>
        <div class="header-actions">
          <span class="total-colaboradores"
            >{{ colaboradores.length }} colaboradores</span
          >
          <div class="view-options">
            <button
              class="view-btn"
              :class="{ active: visualizacao === 'lista' }"
              @click="visualizacao = 'lista'"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 13H11V11H3V13ZM3 6H21V8H3V6ZM3 18H11V16H3V18Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              class="view-btn"
              :class="{ active: visualizacao === 'grade' }"
              @click="visualizacao = 'grade'"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3V11H11V3H3ZM9 9H5V5H9V9ZM3 13V21H11V13H3ZM9 19H5V15H9V19ZM13 3V11H21V3H13ZM19 9H15V5H19V9ZM13 13V21H21V13H13ZM19 19H15V15H19V19Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="ranking-list" :class="visualizacao">
        <div
          v-for="(colaborador, index) in colaboradores"
          :key="colaborador.id"
          class="ranking-item"
          :class="{
            top3: index < 3,
            destacado: colaborador.destaque,
            'melhoria-rapida': colaborador.tendencia === 'alta',
          }"
          @click="abrirDetalhes(colaborador)"
        >
          <div class="ranking-posicao">
            <span class="posicao-numero">{{ index + 1 }}º</span>
            <div class="posicao-trend" :class="colaborador.tendencia">
              {{
                colaborador.tendencia === "alta"
                  ? "↑"
                  : colaborador.tendencia === "baixa"
                  ? "↓"
                  : "→"
              }}
            </div>
          </div>

          <div class="colaborador-main">
            <div class="colaborador-avatar-list">
              <div class="avatar-img">
                <img :src="colaborador.foto" :alt="colaborador.nome" />
              </div>
              <div
                class="online-indicator"
                :class="{ online: colaborador.online }"
              ></div>
            </div>

            <div class="colaborador-details">
              <div class="colaborador-header">
                <span class="colaborador-nome">{{ colaborador.nome }}</span>
                <span class="colaborador-badges">
                  <span v-if="colaborador.destaque" class="badge destaque">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                    Destaque
                  </span>
                  <span v-if="colaborador.metaAtingida" class="badge meta">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                        fill="currentColor"
                      />
                    </svg>
                    Meta
                  </span>
                  <span v-if="colaborador.novato" class="badge novato">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9C7.9 1 7 1.9 7 3V7H5C3.9 7 3 7.9 3 9V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9Z"
                        fill="currentColor"
                      />
                    </svg>
                    Novato
                  </span>
                </span>
              </div>
              <span class="colaborador-setor">{{ colaborador.setor }}</span>
            </div>
          </div>

          <div class="colaborador-metrics">
            <div class="metric">
              <span class="metric-value">{{ colaborador.conformidade }}%</span>
              <span class="metric-label">Conformidade</span>
            </div>
            <div class="metric">
              <span class="metric-value">{{ colaborador.auditorias }}</span>
              <span class="metric-label">Auditorias</span>
            </div>
            <div class="metric">
              <span class="metric-value">{{ colaborador.pontuacao }}</span>
              <span class="metric-label">Pontuação</span>
            </div>
          </div>

          <div class="colaborador-progress">
            <div class="progress-container">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :class="colaborador.status"
                  :style="{ width: colaborador.conformidade + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ colaborador.conformidade }}%</span>
            </div>
          </div>

          <div class="action-menu">
            <button class="menu-btn" @click.stop="toggleMenu(colaborador.id)">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <div v-if="menuAberto === colaborador.id" class="dropdown-menu">
              <button class="menu-item" @click="abrirDetalhes(colaborador)">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                    fill="currentColor"
                  />
                </svg>
                Ver Detalhes
              </button>
              <button class="menu-item" @click="enviarFeedback(colaborador)">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"
                    fill="currentColor"
                  />
                </svg>
                Enviar Feedback
              </button>
              <button class="menu-item" @click="reconhecer(colaborador)">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
                Reconhecer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <div
      v-if="colaboradorSelecionado"
      class="modal-overlay"
      @click="fecharModal"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-colaborador">
            <div class="modal-avatar">
              <img
                :src="colaboradorSelecionado.foto"
                :alt="colaboradorSelecionado.nome"
              />
            </div>
            <div class="modal-info">
              <h3>{{ colaboradorSelecionado.nome }}</h3>
              <span class="modal-setor">{{
                colaboradorSelecionado.setor
              }}</span>
              <div class="modal-status">
                <span
                  class="status-badge"
                  :class="colaboradorSelecionado.status"
                >
                  {{
                    colaboradorSelecionado.status === "excelente"
                      ? "Excelente"
                      : colaboradorSelecionado.status === "bom"
                      ? "Bom"
                      : colaboradorSelecionado.status === "medio"
                      ? "Médio"
                      : "Baixo"
                  }}
                </span>
                <span
                  class="online-status"
                  :class="{ online: colaboradorSelecionado.online }"
                >
                  {{ colaboradorSelecionado.online ? "Online" : "Offline" }}
                </span>
              </div>
            </div>
          </div>
          <button class="fechar-btn" @click="fecharModal">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="metricas-detalhadas">
            <div class="metrica-principal">
              <span class="metrica-valor"
                >{{ colaboradorSelecionado.conformidade }}%</span
              >
              <span class="metrica-label">Taxa de Conformidade</span>
              <div
                class="metrica-variacao"
                :class="
                  colaboradorSelecionado.variacao >= 0 ? 'positiva' : 'negativa'
                "
              >
                {{ colaboradorSelecionado.variacao >= 0 ? "+" : ""
                }}{{ colaboradorSelecionado.variacao }}%
              </div>
            </div>

            <div class="metricas-secundarias">
              <div class="metrica-sec">
                <span class="sec-valor">{{
                  colaboradorSelecionado.auditorias
                }}</span>
                <span class="sec-label">Auditorias</span>
              </div>
              <div class="metrica-sec">
                <span class="sec-valor">{{
                  colaboradorSelecionado.pontuacao
                }}</span>
                <span class="sec-label">Pontuação</span>
              </div>
              <div class="metrica-sec">
                <span class="sec-valor"
                  >{{ colaboradorSelecionado.ranking }}º</span
                >
                <span class="sec-label">Posição</span>
              </div>
            </div>
          </div>

          <div class="progress-chart">
            <h4>Evolução da Conformidade</h4>
            <div class="chart-container">
              <div class="chart-bars">
                <div
                  v-for="(mes, index) in [
                    'Jan',
                    'Fev',
                    'Mar',
                    'Abr',
                    'Mai',
                    'Jun',
                  ]"
                  :key="index"
                  class="chart-bar"
                >
                  <div
                    class="bar-fill"
                    :style="{ height: getRandomHeight() + '%' }"
                  ></div>
                  <span class="bar-label">{{ mes }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="destaques-section">
            <h4>Destaques</h4>
            <div class="destaques-list">
              <div class="destaque-item">
                <span class="destaque-icon">✅</span>
                <span class="destaque-text"
                  >15 auditorias consecutivas sem NCs</span
                >
              </div>
              <div class="destaque-item">
                <span class="destaque-icon">🚀</span>
                <span class="destaque-text"
                  >Maior crescimento do trimestre</span
                >
              </div>
              <div class="destaque-item">
                <span class="destaque-icon">⭐</span>
                <span class="destaque-text">Meta superada em 25%</span>
              </div>
            </div>
          </div>

          <div class="acoes-section">
            <button
              class="acao-btn primario"
              @click="reconhecer(colaboradorSelecionado)"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="currentColor"
                />
              </svg>
              Reconhecer
            </button>
            <button
              class="acao-btn secundario"
              @click="enviarFeedback(colaboradorSelecionado)"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"
                  fill="currentColor"
                />
              </svg>
              Enviar Feedback
            </button>
            <button class="acao-btn neutro">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                  fill="currentColor"
                />
              </svg>
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Carregando ranking...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const periodoSelecionado = ref("mes");
const setorSelecionado = ref("todos");
const colaboradorSelecionado = ref(null);
const carregando = ref(true);
const menuAberto = ref(null);
const visualizacao = ref("lista");

const colaboradores = ref([
  {
    id: 1,
    nome: "Maria Santos",
    setor: "Qualidade",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80",
    conformidade: 98,
    auditorias: 24,
    pontuacao: 2450,
    ranking: 1,
    tendencia: "alta",
    status: "excelente",
    destaque: true,
    metaAtingida: true,
    online: true,
    variacao: 15,
  },
  {
    id: 2,
    nome: "Carlos Silva",
    setor: "Atendimento",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    conformidade: 96,
    auditorias: 18,
    pontuacao: 2320,
    ranking: 2,
    tendencia: "alta",
    status: "excelente",
    destaque: true,
    metaAtingida: true,
    online: false,
    variacao: 12,
  },
  {
    id: 3,
    nome: "Ana Oliveira",
    setor: "Estoque",
    foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    conformidade: 94,
    auditorias: 15,
    pontuacao: 2280,
    ranking: 3,
    tendencia: "alta",
    status: "excelente",
    destaque: false,
    metaAtingida: true,
    online: true,
    variacao: 8,
  },
  {
    id: 4,
    nome: "Pedro Costa",
    setor: "Caixa",
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    conformidade: 92,
    auditorias: 20,
    pontuacao: 2210,
    ranking: 4,
    tendencia: "neutra",
    status: "bom",
    destaque: false,
    metaAtingida: true,
    online: true,
    variacao: 5,
  },
  {
    id: 5,
    nome: "Juliana Lima",
    setor: "Limpeza",
    foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    conformidade: 90,
    auditorias: 12,
    pontuacao: 2150,
    ranking: 5,
    tendencia: "alta",
    status: "bom",
    destaque: true,
    metaAtingida: false,
    online: false,
    variacao: 10,
  },
  {
    id: 6,
    nome: "Ricardo Alves",
    setor: "Segurança",
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    conformidade: 88,
    auditorias: 8,
    pontuacao: 1980,
    ranking: 6,
    tendencia: "baixa",
    status: "bom",
    destaque: false,
    metaAtingida: false,
    online: true,
    variacao: -2,
  },
  {
    id: 7,
    nome: "Fernanda Rocha",
    setor: "Atendimento",
    foto: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    conformidade: 85,
    auditorias: 14,
    pontuacao: 1850,
    ranking: 7,
    tendencia: "neutra",
    status: "medio",
    destaque: false,
    metaAtingida: false,
    online: true,
    variacao: 3,
  },
  {
    id: 8,
    nome: "Bruno Mendes",
    setor: "Estoque",
    foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    conformidade: 82,
    auditorias: 10,
    pontuacao: 1720,
    ranking: 8,
    tendencia: "alta",
    status: "medio",
    destaque: false,
    metaAtingida: false,
    online: false,
    variacao: 7,
    novato: true,
  },
]);

const abrirDetalhes = (colaborador) => {
  colaboradorSelecionado.value = colaborador;
  menuAberto.value = null;
};

const fecharModal = () => {
  colaboradorSelecionado.value = null;
};

const toggleMenu = (id) => {
  menuAberto.value = menuAberto.value === id ? null : id;
};

const exportarRanking = () => {
  alert("Funcionalidade de exportação em desenvolvimento");
};

const enviarFeedback = (colaborador) => {
  alert(`Enviar feedback para ${colaborador.nome}`);
  menuAberto.value = null;
};

const reconhecer = (colaborador) => {
  alert(`Reconhecer ${colaborador.nome}`);
  menuAberto.value = null;
};

const getRandomHeight = () => {
  return Math.floor(Math.random() * 40) + 60;
};

onMounted(() => {
  setTimeout(() => {
    carregando.value = false;
  }, 1500);
});
</script>

<style scoped>
.ranking-colaboradores-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin: 1.5rem auto;
  max-width: 100%;
  position: relative;
  overflow: hidden;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

.ranking-header {
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

.export-btn {
  padding: 0.75rem 1.5rem;
  background: #f9fafb;
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

.export-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

/* Stats Overview */
.stats-overview {
  margin-bottom: 2.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 3fr));
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

.stat-icon.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-icon.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
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

/* Pódio Section */
.podium-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.podium-container {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 1.5rem;
  align-items: end;
}

.podium-item {
  background: white;
  border-radius: 20px;
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #f3f4f6;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.podium-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.podium-item.primeiro {
  border-color: #fcd34d;
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  order: 2;
}

.podium-item.segundo {
  border-color: #e5e7eb;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  order: 1;
}

.podium-item.terceiro {
  border-color: #fbbf24;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  order: 3;
}

.medal-place {
  margin-bottom: 1.5rem;
  position: relative;
}

.medal-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.podium-base {
  width: 80%;
  height: 8px;
  border-radius: 8px 8px 0 0;
  margin: 0 auto;
}

.podium-base.primeiro {
  background: linear-gradient(135deg, #fcd34d, #fbbf24);
}

.podium-base.segundo {
  background: linear-gradient(135deg, #e5e7eb, #d1d5db);
}

.podium-base.terceiro {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.colaborador-avatar {
  position: relative;
  margin: 0 auto 1.5rem;
  width: 100px;
}

.avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 0.5rem;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ranking-badge {
  position: absolute;
  top: -5px;
  right: 5px;
  background: #6366f1;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.podium-item.primeiro .ranking-badge {
  background: #f59e0b;
}
.podium-item.segundo .ranking-badge {
  background: #6b7280;
}
.podium-item.terceiro .ranking-badge {
  background: #d97706;
}

.colaborador-info {
  margin-bottom: 1.5rem;
}

.colaborador-nome {
  display: block;
  font-weight: 600;
  color: #1f2937;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.colaborador-setor {
  font-size: 0.875rem;
  color: #6b7280;
}

.colaborador-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-weight: 700;
  color: #1f2937;
  font-size: 1.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.performance-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
}

.performance-badge.excelente {
  background: #d1fae5;
  color: #065f46;
}

.performance-badge.destaque {
  background: linear-gradient(135deg, #fcd34d, #fbbf24);
  color: #92400e;
}

.crown {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateX(-50%) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* Ranking List */
.ranking-list-section {
  margin-bottom: 2rem;
}

.ranking-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.ranking-list-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.total-colaboradores {
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
}

.view-options {
  display: flex;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
}

.view-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn.active {
  background: white;
  color: #6366f1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ranking-list.grade {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.ranking-list.grade .ranking-item {
  flex-direction: column;
  text-align: center;
  padding: 1.5rem;
}

.ranking-list.grade .colaborador-main {
  flex-direction: column;
  margin-bottom: 1rem;
}

.ranking-list.grade .colaborador-details {
  text-align: center;
}

.ranking-list.grade .colaborador-header {
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
}

.ranking-list.grade .colaborador-metrics {
  justify-content: center;
  margin-bottom: 1rem;
}

.ranking-list.grade .colaborador-progress {
  width: 100%;
  margin-bottom: 1rem;
}

.ranking-list.grade .action-menu {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.ranking-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #6366f1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ranking-item:hover::before {
  opacity: 1;
}

.ranking-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #e5e7eb;
}

.ranking-item.top3 {
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  border-color: #d1fae5;
}

.ranking-item.destacado {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border-color: #fde68a;
}

.ranking-item.melhoria-rapida {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-color: #bfdbfe;
}

.ranking-posicao {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 50px;
}

.posicao-numero {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.posicao-trend {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.posicao-trend.alta {
  background: #d1fae5;
  color: #065f46;
}

.posicao-trend.baixa {
  background: #fee2e2;
  color: #dc2626;
}

.posicao-trend.neutra {
  background: #e5e7eb;
  color: #374151;
}

.colaborador-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.colaborador-avatar-list {
  position: relative;
}

.colaborador-avatar-list .avatar-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.colaborador-avatar-list .avatar-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid white;
}

.online-indicator.online {
  background: #10b981;
}

.colaborador-details {
  flex: 1;
}

.colaborador-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.colaborador-nome {
  font-weight: 600;
  color: #1f2937;
}

.colaborador-badges {
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.badge.destaque {
  background: #fef3c7;
  color: #92400e;
}

.badge.meta {
  background: #d1fae5;
  color: #065f46;
}

.badge.novato {
  background: #dbeafe;
  color: #1e40af;
}

.colaborador-setor {
  font-size: 0.875rem;
  color: #6b7280;
}

.colaborador-metrics {
  display: flex;
  gap: 1.5rem;
}

.metric {
  text-align: center;
  min-width: 60px;
}

.metric-value {
  display: block;
  font-weight: 700;
  color: #1f2937;
  font-size: 1rem;
}

.metric-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.colaborador-progress {
  min-width: 140px;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill.excelente {
  background: #10b981;
}
.progress-fill.bom {
  background: #3b82f6;
}
.progress-fill.medio {
  background: #f59e0b;
}
.progress-fill.baixo {
  background: #ef4444;
}

.progress-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
  min-width: 35px;
}

.action-menu {
  position: relative;
}

.menu-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  z-index: 10;
  min-width: 180px;
  overflow: hidden;
}

.menu-item {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: #374151;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #f9fafb;
}

/* Modal */
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
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: modalAppear 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.modal-colaborador {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #f3f4f6;
}

.modal-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-info h3 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-setor {
  color: #6b7280;
  font-size: 1rem;
  display: block;
  margin-bottom: 0.5rem;
}

.modal-status {
  display: flex;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.excelente {
  background: #d1fae5;
  color: #065f46;
}
.status-badge.bom {
  background: #dbeafe;
  color: #1e40af;
}
.status-badge.medio {
  background: #fef3c7;
  color: #92400e;
}
.status-badge.baixo {
  background: #fee2e2;
  color: #dc2626;
}

.online-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #f3f4f6;
  color: #6b7280;
}

.online-status.online {
  background: #d1fae5;
  color: #065f46;
}

.fechar-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: #6b7280;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.fechar-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.metricas-detalhadas {
  margin-bottom: 1rem;
}

.metrica-principal {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: 20px;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.metrica-principal::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.metrica-valor {
  display: block;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  position: relative;
}

.metrica-label {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
  display: block;
  position: relative;
}

.metrica-variacao {
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  display: inline-block;
  position: relative;
}

.metrica-variacao.positiva {
  background: rgba(255, 255, 255, 0.2);
}

.metrica-variacao.negativa {
  background: rgba(239, 68, 68, 0.2);
}

.metricas-secundarias {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.metrica-sec {
  text-align: center;
  padding: 1.5rem 1rem;
  background: #f9fafb;
  border-radius: 16px;
  border: 1px solid #f3f4f6;
}

.sec-valor {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.sec-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.progress-chart {
  background: #f9fafb;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #f3f4f6;
}

.progress-chart h4 {
  margin: 0 0 1.5rem 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.chart-container {
  width: 100%;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 120px;
  gap: 0.5rem;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 0.5rem;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #6366f1, #8b5cf6);
  border-radius: 4px 4px 0 0;
  min-height: 20px;
  transition: height 0.5s ease;
}

.bar-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.destaques-section {
  background: #f9fafb;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #f3f4f6;
}

.destaques-section h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.destaques-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.destaque-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}

.destaque-icon {
  font-size: 1.2rem;
}

.destaque-text {
  font-size: 0.875rem;
  color: #374151;
}

.acoes-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.acao-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.acao-btn.primario {
  background: #6366f1;
  color: white;
}

.acao-btn.primario:hover {
  background: #4f46e5;
}

.acao-btn.secundario {
  background: #f3f4f6;
  color: #374151;
}

.acao-btn.secundario:hover {
  background: #e5e7eb;
}

.acao-btn.neutro {
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.acao-btn.neutro:hover {
  background: #f9fafb;
}

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

/* Responsividade */
@media (max-width: 1024px) {
  .podium-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .podium-item {
    order: 0 !important;
  }
}

@media (max-width: 768px) {
  .ranking-colaboradores-container {
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 16px;
  }

  .ranking-header {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-controls {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
  }

  .filter-group {
    width: 100%;
  }

  .filtro-select {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .ranking-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
  }

  .colaborador-main {
    width: 100%;
  }

  .colaborador-metrics {
    width: 100%;
    justify-content: space-between;
  }

  .colaborador-progress {
    width: 100%;
  }

  .progress-container {
    width: 100%;
  }

  .metricas-secundarias {
    grid-template-columns: 1fr;
  }

  .acoes-section {
    flex-direction: column;
  }

  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .modal-colaborador {
    flex-direction: column;
    text-align: center;
  }

  .modal-status {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .ranking-list.grade {
    grid-template-columns: 1fr;
  }
}
</style>
