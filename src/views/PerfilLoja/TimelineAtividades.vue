<template>
  <div class="timeline-atividades-container">
    <!-- Header  timeline-->
    <div class="timeline-header">
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
              <path
                d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                fill="currentColor"
              />
              <path
                d="M12.5 7H11V13L16.25 16.15L17 15.08L12.5 12.25V7Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="text-content">
            <div class="titulo">Linha do Tempo de Atividades</div>
            <div class="descricao">
              Acompanhe as principais ações realizadas na loja ao longo do tempo
            </div>
          </div>
        </div>
      </div>
      <div class="header-controls">
        <div class="view-toggle">
          <button
            class="toggle-btn"
            :class="{ active: visualizacaoAtiva === 'todos' }"
            @click="visualizacaoAtiva = 'todos'"
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
            Todos
          </button>
          <button
            class="toggle-btn"
            :class="{ active: visualizacaoAtiva === 'auditorias' }"
            @click="visualizacaoAtiva = 'auditorias'"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                fill="currentColor"
              />
            </svg>
            Auditorias
          </button>
          <button
            class="toggle-btn"
            :class="{ active: visualizacaoAtiva === 'alertas' }"
            @click="visualizacaoAtiva = 'alertas'"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z"
                fill="currentColor"
              />
            </svg>
            Alertas
          </button>
        </div>
        <div class="filter-group">
          <label for="periodo">Período</label>
          <select
            v-model="periodoSelecionado"
            id="periodo"
            class="filtro-select"
          >
            <option value="hoje">Hoje</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="trimestre">Este Trimestre</option>
          </select>
        </div>
        <button
          class="compact-toggle"
          @click="visualizacaoCompacta = !visualizacaoCompacta"
          :class="{ active: visualizacaoCompacta }"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5.83L15.17 9L16.58 7.59L12 3L7.41 7.59L8.83 9L12 5.83ZM12 18.17L8.83 15L7.42 16.41L12 21L16.59 16.41L15.17 15L12 18.17Z"
              fill="currentColor"
            />
          </svg>
          Compacto
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ estatisticas.concluidos }}</span>
            <span class="stat-label">Concluídos</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon warning">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 14H11V9H13V14ZM13 18H11V16H13V18ZM1 21H23L12 2L1 21Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ estatisticas.alertas }}</span>
            <span class="stat-label">Alertas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon info">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 9H11V7H13V9ZM13 17H11V11H13V17ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ estatisticas.andamento }}</span>
            <span class="stat-label">Em Andamento</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon secondary">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.11 21 21 20.1 21 19V5C21 3.9 20.11 3 19 3ZM19 19H5V5H19V19ZM7 12H9V17H7V12ZM11 7H13V17H11V7ZM15 10H17V17H15V10Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ eventosFiltrados.length }}</span>
            <span class="stat-label">Total</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros Rápidos -->
    <div class="filtros-rapidos">
      <div class="filtros-header" @click="mostrarFiltros = !mostrarFiltros">
        <span class="filtros-titulo">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"
              fill="currentColor"
            />
          </svg>
          Filtros
        </span>
        <button class="filtros-toggle">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <div v-if="mostrarFiltros" class="filtros-conteudo">
        <div class="filtro-grupo">
          <label class="filtro-label">Status</label>
          <div class="filtro-opcoes">
            <label
              v-for="status in opcoesStatus"
              :key="status"
              class="filtro-opcao"
            >
              <input type="checkbox" v-model="filtros.status" :value="status" />
              <span class="checkmark"></span>
              <span class="opcao-texto">
                {{
                  status === "concluido"
                    ? "Concluído"
                    : status === "andamento"
                      ? "Em Andamento"
                      : "Pendente"
                }}
              </span>
            </label>
          </div>
        </div>

        <div class="filtro-grupo">
          <label class="filtro-label">Prioridade</label>
          <div class="filtro-opcoes">
            <label
              v-for="prioridade in opcoesPrioridade"
              :key="prioridade"
              class="filtro-opcao"
            >
              <input
                type="checkbox"
                v-model="filtros.prioridade"
                :value="prioridade"
              />
              <span class="checkmark"></span>
              <span class="opcao-texto">
                {{
                  prioridade === "alta"
                    ? "Alta"
                    : prioridade === "media"
                      ? "Média"
                      : "Baixa"
                }}
              </span>
            </label>
          </div>
        </div>

        <div class="filtro-grupo">
          <label class="filtro-label">Setor</label>
          <div class="filtro-opcoes">
            <label
              v-for="setor in opcoesSetor"
              :key="setor"
              class="filtro-opcao"
            >
              <input type="checkbox" v-model="filtros.setor" :value="setor" />
              <span class="checkmark"></span>
              <span class="opcao-texto">{{ setor }}</span>
            </label>
          </div>
        </div>

        <div class="filtro-acoes">
          <button class="acao-btn secundario" @click="resetarFiltros">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z"
                fill="currentColor"
              />
            </svg>
            Redefinir
          </button>
          <button class="acao-btn primario" @click="aplicarFiltros">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                fill="currentColor"
              />
            </svg>
            Aplicar
          </button>
        </div>
      </div>
    </div>

    <!-- Timeline -->
    <div class="timeline-content">
      <div class="timeline-line"></div>

      <div
        v-for="(evento, index) in eventosFiltrados"
        :key="evento.id"
        class="timeline-item"
        :class="[
          evento.tipo,
          {
            destaque: evento.destaque,
            compact: visualizacaoCompacta,
            'first-item': index === 0,
            'last-item': index === eventosFiltrados.length - 1,
          },
        ]"
        :style="{ '--item-order': index }"
      >
        <!-- Ponto da Timeline -->
        <div class="timeline-marker">
          <div class="marker-icon" :class="evento.status">
            <div class="marker-inner">
              <component
                :is="evento.iconeComponente"
                v-if="evento.iconeComponente"
              />
              <span v-else>{{ evento.icone }}</span>
            </div>
          </div>
          <div class="marker-line"></div>
        </div>

        <!-- Card do Evento -->
        <div class="evento-card">
          <div class="evento-header">
            <div class="evento-info">
              <div class="evento-titulo">
                <h3>{{ evento.titulo }}</h3>
                <div class="evento-badges">
                  <span
                    v-if="evento.prioridade"
                    class="prioridade-badge"
                    :class="evento.prioridade"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.66 8L12 2.35L6.34 8C4.78 9.56 4 11.64 4 13.64C4 15.64 4.78 17.75 6.34 19.31C7.9 20.87 9.95 21.66 12 21.66C14.05 21.66 16.1 20.87 17.66 19.31C19.22 17.75 20 15.64 20 13.64C20 11.64 19.22 9.56 17.66 8ZM12 20C10.42 20 8.84 19.44 7.58 18.28C6.42 17.12 5.66 15.54 5.66 13.64C5.66 11.74 6.42 10.16 7.58 9C8.84 7.84 10.42 7.28 12 7.28C13.58 7.28 15.16 7.84 16.42 9C17.58 10.16 18.34 11.74 18.34 13.64C18.34 15.54 17.58 17.12 16.42 18.28C15.16 19.44 13.58 20 12 20Z"
                        fill="currentColor"
                      />
                    </svg>
                    {{
                      evento.prioridade === "alta"
                        ? "Alta"
                        : evento.prioridade === "media"
                          ? "Média"
                          : "Baixa"
                    }}
                  </span>
                  <span
                    v-if="evento.status"
                    class="status-badge"
                    :class="evento.status"
                  >
                    {{
                      evento.status === "concluido"
                        ? "Concluído"
                        : evento.status === "andamento"
                          ? "Em Andamento"
                          : "Pendente"
                    }}
                  </span>
                </div>
              </div>
              <p class="evento-descricao">{{ evento.descricao }}</p>
            </div>
            <div class="evento-tempo">
              <div class="tempo-relativo">{{ evento.tempoRelativo }}</div>
              <div class="tempo-exato">{{ evento.tempoExato }}</div>
            </div>
          </div>

          <div v-if="!visualizacaoCompacta" class="evento-corpo">
            <!-- Metadados do Evento -->
            <div v-if="evento.metadata" class="evento-metadata">
              <div
                v-for="(meta, key) in evento.metadata"
                :key="key"
                class="meta-item"
              >
                <span class="meta-label">{{ key }}:</span>
                <span class="meta-value">{{ meta }}</span>
              </div>
            </div>

            <!-- Ações do Evento -->
            <div
              v-if="evento.acoes && evento.acoes.length > 0"
              class="evento-acoes"
            >
              <button
                v-for="acao in evento.acoes"
                :key="acao.nome"
                class="acao-btn"
                :class="acao.tipo"
                @click="executarAcao(acao, evento)"
              >
                <component
                  :is="acao.iconeComponente"
                  v-if="acao.iconeComponente"
                />
                <span v-else class="acao-icone">{{ acao.icone }}</span>
                {{ acao.nome }}
              </button>
            </div>

            <!-- Colaboradores Envolvidos -->
            <div
              v-if="evento.colaboradores && evento.colaboradores.length > 0"
              class="evento-colaboradores"
            >
              <span class="colaboradores-label">Envolvidos:</span>
              <div class="colaboradores-list">
                <div
                  v-for="colab in evento.colaboradores"
                  :key="colab.id"
                  class="colaborador-avatar"
                  :title="colab.nome"
                >
                  <img :src="colab.avatar" :alt="colab.nome" />
                </div>
              </div>
            </div>
          </div>

          <!-- Progresso (para eventos em andamento) -->
          <div
            v-if="evento.status === 'andamento' && evento.progresso"
            class="evento-progresso"
          >
            <div class="progresso-info">
              <span class="progresso-texto"
                >Progresso: {{ evento.progresso }}%</span
              >
              <span class="progresso-tempo">{{ evento.tempoRestante }}</span>
            </div>
            <div class="progresso-bar">
              <div
                class="progresso-fill"
                :style="{ width: evento.progresso + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Carregando atividades...</span>
    </div>

    <!-- Empty State -->
    <div
      v-if="!carregando && eventosFiltrados.length === 0"
      class="empty-state"
    >
      <div class="empty-icon">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.11 21 21 20.1 21 19V5C21 3.9 20.11 3 19 3ZM19 19H5V5H19V19ZM7 12H9V17H7V12ZM11 7H13V17H11V7ZM15 10H17V17H15V10Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <h3>Nenhuma atividade encontrada</h3>
      <p>Tente ajustar os filtros ou período selecionado</p>
      <button class="reset-filtros-btn" @click="resetarFiltros">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z"
            fill="currentColor"
          />
        </svg>
        Redefinir Filtros
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Ícones SVG como componentes
const IconeAuditoria = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
    </svg>
  `,
};

const IconeAlerta = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="currentColor"/>
    </svg>
  `,
};

const IconeManutencao = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.14 12.94C19.18 12.76 19.21 12.57 19.21 12.38C19.21 11.66 19 10.96 18.59 10.38L20.12 8.85C20.68 9.84 21 10.95 21 12.11C21 13.27 20.68 14.38 20.12 15.37L18.59 13.84C19 13.26 19.14 12.94 19.14 12.94ZM14.94 19.14C14.76 19.18 14.57 19.21 14.38 19.21C13.66 19.21 12.96 19 12.38 18.59L10.85 20.12C11.84 20.68 12.95 21 14.11 21C15.27 21 16.38 20.68 17.37 20.12L15.84 18.59C15.26 19 14.94 19.14 14.94 19.14ZM9.9 4.86C10.08 4.82 10.27 4.79 10.46 4.79C11.18 4.79 11.88 5 12.46 5.41L13.99 3.88C13 3.32 11.89 3 10.73 3C9.57 3 8.46 3.32 7.47 3.88L8.99 5.41C9.58 5 9.9 4.86 9.9 4.86ZM4.86 9.9C4.82 10.08 4.79 10.27 4.79 10.46C4.79 11.18 5 11.88 5.41 12.46L3.88 13.99C3.32 13 3 11.89 3 10.73C3 9.57 3.32 8.46 3.88 7.47L5.41 8.99C5 9.58 4.86 9.9 4.86 9.9Z" fill="currentColor"/>
    </svg>
  `,
};

const IconeTreinamento = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 17.18 8 16 12 16C16 16 19 17.18 19 17.18V13.18C19 13.18 16 14.36 12 14.36C8 14.36 5 13.18 5 13.18Z" fill="currentColor"/>
    </svg>
  `,
};

const IconeReuniao = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4C16 2.89 16.89 2 18 2C19.11 2 20 2.89 20 4C20 5.11 19.11 6 18 6C16.89 6 16 5.11 16 4ZM20 22V16H22.5L20 8.4C19.68 7.63 18.93 7.15 18.1 7.15C17.27 7.15 16.52 7.63 16.2 8.4L13.7 16H14V22H20ZM12.5 11.5H10V22H3.5V11.5H1V10H12.5V11.5Z" fill="currentColor"/>
    </svg>
  `,
};

const visualizacaoAtiva = ref("todos");
const periodoSelecionado = ref("semana");
const visualizacaoCompacta = ref(false);
const mostrarFiltros = ref(false);
const carregando = ref(true);

const filtros = ref({
  status: ["concluido", "andamento", "pendente"],
  prioridade: ["alta", "media", "baixa"],
  setor: ["Todos"],
});

const opcoesStatus = ["concluido", "andamento", "pendente"];
const opcoesPrioridade = ["alta", "media", "baixa"];
const opcoesSetor = [
  "Todos",
  "Atendimento",
  "Estoque",
  "Caixa",
  "Limpeza",
  "Qualidade",
];

const eventos = ref([
  {
    id: 1,
    tipo: "auditoria",
    icone: "📋",
    iconeComponente: IconeAuditoria,
    titulo: "Auditoria de Estoque Concluída",
    descricao: "Auditoria completa do setor de estoque realizada com sucesso",
    tempoRelativo: "Há 2 horas",
    tempoExato: "10:30 AM",
    status: "concluido",
    prioridade: "media",
    destaque: true,
    metadata: {
      Setor: "Estoque",
      Conformidade: "94%",
      "Itens Verificados": "156",
    },
    acoes: [
      {
        nome: "Ver Relatório",
        icone: "📊",
        iconeComponente: {
          template: `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
            </svg>
          `,
        },
        tipo: "primario",
      },
      {
        nome: "Exportar",
        icone: "📥",
        iconeComponente: {
          template: `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z" fill="currentColor"/>
            </svg>
          `,
        },
        tipo: "secundario",
      },
    ],
    colaboradores: [
      {
        id: 1,
        nome: "Maria Silva",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80",
      },
      {
        id: 2,
        nome: "João Santos",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      },
    ],
  },
  {
    id: 2,
    tipo: "alerta",
    icone: "⚠️",
    iconeComponente: IconeAlerta,
    titulo: "Alerta: Baixo Estoque",
    descricao: "Produtos em falta detectados no setor de alimentos",
    tempoRelativo: "Há 4 horas",
    tempoExato: "08:45 AM",
    status: "pendente",
    prioridade: "alta",
    destaque: true,
    metadata: {
      Setor: "Alimentos",
      "Produtos Afetados": "5",
      Urgência: "Alta",
    },
    acoes: [
      {
        nome: "Resolver",
        icone: "🔧",
        iconeComponente: {
          template: `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
            </svg>
          `,
        },
        tipo: "alerta",
      },
      {
        nome: "Adiar",
        icone: "⏰",
        iconeComponente: {
          template: `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 1H9V3H15V1ZM11 14H13V8H11V14ZM19.03 7.39L20.45 5.97C20.02 5.46 19.55 4.98 19.04 4.56L17.62 5.98C16.07 4.74 14.12 4 12 4C7.03 4 3 8.03 3 13C3 17.97 7.03 22 12 22C16.97 22 21 17.97 21 13C21 10.88 20.26 8.93 19.03 7.39Z" fill="currentColor"/>
            </svg>
          `,
        },
        tipo: "secundario",
      },
    ],
  },
  {
    id: 3,
    tipo: "manutencao",
    icone: "🔧",
    iconeComponente: IconeManutencao,
    titulo: "Manutenção Preventiva",
    descricao: "Manutenção programada dos equipamentos de caixa",
    tempoRelativo: "Hoje",
    tempoExato: "07:00 AM",
    status: "andamento",
    prioridade: "media",
    progresso: 65,
    tempoRestante: "~2 horas restantes",
    metadata: {
      Setor: "Caixa",
      Equipamentos: "3",
      Técnico: "Carlos Lima",
    },
    acoes: [
      {
        nome: "Acompanhar",
        icone: "👀",
        iconeComponente: {
          template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
          </svg>
        `,
        },
        tipo: "primario",
      },
    ],
  },
  {
    id: 4,
    tipo: "treinamento",
    icone: "🎓",
    iconeComponente: IconeTreinamento,
    titulo: "Treinamento de Equipe",
    descricao: "Capacitação sobre novos procedimentos de atendimento",
    tempoRelativo: "Ontem",
    tempoExato: "14:00 PM",
    status: "concluido",
    prioridade: "baixa",
    metadata: {
      Participantes: "12",
      Duração: "3 horas",
      Instrutor: "Ana Costa",
    },
    colaboradores: [
      {
        id: 3,
        nome: "Pedro Alves",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 4,
        nome: "Juliana Rocha",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      },
      {
        id: 5,
        nome: "Ricardo Souza",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      },
    ],
  },
  {
    id: 5,
    tipo: "auditoria",
    icone: "📋",
    iconeComponente: IconeAuditoria,
    titulo: "Auditoria de Limpeza",
    descricao: "Verificação dos padrões de higiene e organização",
    tempoRelativo: "2 dias atrás",
    tempoExato: "09:15 AM",
    status: "concluido",
    prioridade: "media",
    metadata: {
      Setor: "Limpeza",
      Pontuação: "98%",
      Observações: "Excelente",
    },
    acoes: [
      {
        nome: "Ver Detalhes",
        icone: "📊",
        iconeComponente: {
          template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
          </svg>
        `,
        },
        tipo: "primario",
      },
    ],
  },
  {
    id: 6,
    tipo: "reuniao",
    icone: "👥",
    iconeComponente: IconeReuniao,
    titulo: "Reunião de Performance",
    descricao: "Análise dos resultados do último trimestre",
    tempoRelativo: "3 dias atrás",
    tempoExato: "16:30 PM",
    status: "concluido",
    prioridade: "baixa",
    metadata: {
      Participantes: "8",
      Duração: "1.5 horas",
      Local: "Sala de Reuniões",
    },
  },
]);

const eventosFiltrados = computed(() => {
  return eventos.value.filter((evento) => {
    // Filtro por tipo de visualização
    if (
      visualizacaoAtiva.value !== "todos" &&
      evento.tipo !== visualizacaoAtiva.value
    ) {
      return false;
    }

    // Filtro por status
    if (!filtros.value.status.includes(evento.status)) {
      return false;
    }

    // Filtro por prioridade
    if (!filtros.value.prioridade.includes(evento.prioridade)) {
      return false;
    }

    // Filtro por setor (se aplicável)
    if (
      filtros.value.setor.length > 0 &&
      !filtros.value.setor.includes("Todos")
    ) {
      const setorEvento = evento.metadata?.Setor;
      if (setorEvento && !filtros.value.setor.includes(setorEvento)) {
        return false;
      }
    }

    return true;
  });
});

const estatisticas = computed(() => {
  const concluidos = eventosFiltrados.value.filter(
    (e) => e.status === "concluido",
  ).length;
  const alertas = eventosFiltrados.value.filter(
    (e) => e.tipo === "alerta",
  ).length;
  const andamento = eventosFiltrados.value.filter(
    (e) => e.status === "andamento",
  ).length;

  return {
    concluidos,
    alertas,
    andamento,
  };
});

const executarAcao = (acao, evento) => {
  console.log(`Executando ação: ${acao.nome} no evento: ${evento.titulo}`);
  // Aqui você implementaria a lógica específica para cada ação
};

const resetarFiltros = () => {
  filtros.value = {
    status: ["concluido", "andamento", "pendente"],
    prioridade: ["alta", "media", "baixa"],
    setor: ["Todos"],
  };
  visualizacaoAtiva.value = "todos";
};

const aplicarFiltros = () => {
  mostrarFiltros.value = false;
};

onMounted(() => {
  setTimeout(() => {
    carregando.value = false;
  }, 2000);
});
</script>

<style scoped>
.timeline-atividades-container {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin: 1.5rem auto;
  width: 100%;
  position: relative;
  overflow: hidden;
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

.timeline-header {
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
  align-items: flex-start;
  flex-wrap: wrap;
}

.view-toggle {
  display: flex;
  background: #f3f4f6;
  border-radius: 12px;
  padding: 4px;
  border: 1px solid #e5e7eb;
}

.toggle-btn {
  padding: 0.6rem 1rem;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.toggle-btn.active {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  color: #6366f1;
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
  padding: 0.6rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  color: #1f2937;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  min-width: 140px;
}

.filtro-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.compact-toggle {
  padding: 0.6rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.compact-toggle.active,
.compact-toggle:hover {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

/* Stats Overview */
.stats-overview {
  margin-bottom: 2rem;
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

.stat-icon.secondary {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
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

/* Filtros Rápidos */
.filtros-rapidos {
  background: #f9fafb;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #f3f4f6;
  margin-bottom: 2rem;
}

.filtros-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.filtros-titulo {
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filtros-toggle {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.filtros-toggle:hover {
  background: #f3f4f6;
}

.filtros-conteudo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filtro-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.filtro-opcoes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filtro-opcao {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #4b5563;
  transition: color 0.2s ease;
}

.filtro-opcao:hover {
  color: #1f2937;
}

.filtro-opcao input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.filtro-opcao input:checked + .checkmark {
  background: #6366f1;
  border-color: #6366f1;
}

.filtro-opcao input:checked + .checkmark::after {
  content: "✓";
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

.opcao-texto {
  flex: 1;
}

.filtro-acoes {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;
  grid-column: 1 / -1;
}

/* Timeline Content */
.timeline-content {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-line {
  position: absolute;
  left: 40px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #6366f1, #8b5cf6, #ecfdf5);
  z-index: 1;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2.5rem;
  position: relative;
  z-index: 2;
  animation: slideIn 0.5s ease-out;
  animation-delay: calc(var(--item-order) * 0.1s);
  animation-fill-mode: both;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Timeline Marker */
.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  position: relative;
  flex-shrink: 0;
}

.marker-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  border: 3px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.marker-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

.timeline-item:hover .marker-icon {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.marker-line {
  width: 2px;
  flex: 1;
  background: #e5e7eb;
  margin-top: 0.75rem;
}

.timeline-item.last-item .marker-line {
  background: transparent;
}

/* Cores por tipo de evento e status */
.timeline-item.auditoria .marker-icon {
  border-color: #10b981;
  color: #10b981;
  background: #ecfdf5;
}

.timeline-item.alerta .marker-icon {
  border-color: #ef4444;
  color: #ef4444;
  background: #fef2f2;
}

.timeline-item.manutencao .marker-icon {
  border-color: #f59e0b;
  color: #f59e0b;
  background: #fffbeb;
}

.timeline-item.treinamento .marker-icon {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}

.timeline-item.reuniao .marker-icon {
  border-color: #8b5cf6;
  color: #8b5cf6;
  background: #faf5ff;
}

/* Status específicos */
.marker-icon.concluido {
  border-color: #10b981 !important;
  color: #10b981 !important;
}

.marker-icon.andamento {
  border-color: #f59e0b !important;
  color: #f59e0b !important;
}

.marker-icon.pendente {
  border-color: #ef4444 !important;
  color: #ef4444 !important;
}

/* Evento Card */
.evento-card {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.evento-card::before {
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

.timeline-item:hover .evento-card::before {
  opacity: 1;
}

.timeline-item:hover .evento-card {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #e5e7eb;
}

/* Destaque para eventos importantes */
.timeline-item.destaque .evento-card {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb, #fff);
}

.timeline-item.destaque .marker-icon {
  border-color: #f59e0b;
  background: #fffbeb;
}

/* Evento Header */
.evento-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.evento-info {
  flex: 1;
}

.evento-titulo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.evento-titulo h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
}

.evento-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.prioridade-badge,
.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.prioridade-badge.alta {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.prioridade-badge.media {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fde68a;
}

.prioridade-badge.baixa {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.status-badge.concluido {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.status-badge.andamento {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.status-badge.pendente {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fde68a;
}

.evento-descricao {
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
  font-size: 0.95rem;
}

.evento-tempo {
  text-align: right;
  min-width: 120px;
  flex-shrink: 0;
}

.tempo-relativo {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

.tempo-exato {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Evento Corpo */
.evento-corpo {
  border-top: 1px solid #f3f4f6;
  padding-top: 1.5rem;
}

.evento-metadata {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.meta-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.meta-value {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

.evento-acoes {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.acao-btn {
  padding: 0.6rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
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
  transform: translateY(-1px);
}

.acao-btn.secundario {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.acao-btn.secundario:hover {
  background: #e5e7eb;
}

.acao-btn.alerta {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.acao-btn.alerta:hover {
  background: #fecaca;
}

.evento-colaboradores {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.colaboradores-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.colaboradores-list {
  display: flex;
  gap: 0.5rem;
}

.colaborador-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.colaborador-avatar:hover {
  transform: scale(1.1);
}

.colaborador-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Progresso */
.evento-progresso {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.progresso-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progresso-texto {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.progresso-tempo {
  font-size: 0.875rem;
  color: #6b7280;
}

.progresso-bar {
  width: 100%;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}

.progresso-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 3px;
  transition: width 0.5s ease;
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

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-icon {
  margin-bottom: 1.5rem;
  color: #d1d5db;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 1.25rem;
  font-weight: 600;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
}

.reset-filtros-btn {
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
}

.reset-filtros-btn:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}

/* Visualização Compacta */
.timeline-item.compact .evento-card {
  padding: 1rem 1.5rem;
}

.timeline-item.compact .evento-corpo {
  display: none;
}

.timeline-item.compact .evento-header {
  margin-bottom: 0;
  align-items: center;
}

.timeline-item.compact .evento-titulo {
  margin-bottom: 0;
}

.timeline-item.compact .evento-descricao {
  display: none;
}

/* Responsividade */
@media (max-width: 1024px) {
  .timeline-header {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header-controls {
    width: 100%;
    justify-content: space-between;
  }

  .evento-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .evento-tempo {
    text-align: left;
  }
}

@media (max-width: 768px) {
  .timeline-atividades-container {
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 16px;
  }

  .header-controls {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .view-toggle {
    width: 100%;
  }

  .toggle-btn {
    flex: 1;
    text-align: center;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .timeline-item {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .timeline-marker {
    flex-direction: row;
    min-width: auto;
    width: 100%;
    gap: 1rem;
  }

  .marker-line {
    width: 100%;
    height: 2px;
    margin-top: 0;
  }

  .timeline-line {
    display: none;
  }

  .evento-metadata {
    grid-template-columns: 1fr;
  }

  .filtros-conteudo {
    grid-template-columns: 1fr;
  }

  .evento-acoes {
    justify-content: center;
  }

  .evento-titulo {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .evento-badges {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .icon-title {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .icon-area {
    align-self: center;
  }

  .text-content {
    text-align: center;
  }
}
</style>
