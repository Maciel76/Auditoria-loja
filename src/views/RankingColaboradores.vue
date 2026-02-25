<template>
  <div class="ranking-colaboradores-container">
    <!-- Seletor de Loja (quando nenhuma loja selecionada) -->
    <div v-if="!lojaStore.isLojaSelected" class="loja-selection">
      <div class="loja-selection-content">
        <div class="loja-selection-icon">
          <i class="fas fa-store"></i>
        </div>
        <h2>Selecione uma Loja</h2>
        <p>
          Para visualizar o ranking de colaboradores, selecione uma loja
          primeiro.
        </p>

        <div class="lojas-grid">
          <div
            v-for="loja in lojasDisponiveis"
            :key="loja.codigo"
            class="loja-card"
            @click="selecionarLoja(loja)"
            :class="{ loading: carregando }"
          >
            <div class="loja-image">
              <img :src="loja.imagem" :alt="loja.nome" @error="handleImageError" />
            </div>
            <div class="loja-info">
              <h3>{{ loja.nome }}</h3>
              <p><i class="fas fa-map-marker-alt"></i> {{ loja.cidade }}</p>
              <span class="loja-codigo">{{ loja.codigo }}</span>
            </div>
          </div>
        </div>

        <div v-if="erro" class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          {{ erro }}
        </div>
      </div>
    </div>

    <!-- Conteúdo Principal (apenas quando loja selecionada) -->
    <div v-else>
    <!-- Indicador de Período -->
    <div v-if="usarPeriodoCompleto" class="periodo-indicator">
      <i class="fas fa-calendar-alt"></i>
      <span
        >Exibindo <strong>TODAS as auditorias</strong> de
        <strong>{{ getTipoAuditoriaName(filtroTipoAuditoriaCompleto) }}</strong>
        do período completo (Modelo: MetricasUsuario)</span
      >
    </div>
    <div v-else class="periodo-indicator periodo-diario">
      <i class="fas fa-calendar-day"></i>
      <span
        >Exibindo auditorias <strong>DIÁRIAS</strong> de
        <strong>{{ getTipoAuditoriaName(filtroTipoAuditoria) }}</strong>
        (Modelo: UserDailyMetrics)</span
      >
    </div>

    <!-- Hero Section -->
    <HeroSection
      :usuarios="usuarios"
      :totalItensLidos="totalItensLidos"
      :mediaItensPorUsuario="mediaItensPorUsuario"
      :tipoAuditoria="filtroTipoAuditoria"
      @trocarLoja="trocarLoja"
      @recarregar="buscarDados"
    />

    <!-- Controles e Filtros Unificados -->
    <div class="unified-controls">
      <!-- Filtros Principais -->
      <div class="filters-main">
        <!-- Modo: Diário ou Todas -->
        <div class="filter-group">
          <label class="filter-label">
            <i class="fas fa-calendar-check"></i>
            Período:
          </label>
          <div class="view-options">
            <button
              @click="setPeriodo('diario')"
              :class="['view-btn', { active: !usarPeriodoCompleto }]"
            >
              <i class="fas fa-calendar-day"></i>
              Diário
            </button>
            <button
              @click="setPeriodo('completo')"
              :class="['view-btn', { active: usarPeriodoCompleto }]"
            >
              <i class="fas fa-calendar-alt"></i>
              Todas
            </button>
          </div>
        </div>

        <!-- Filtro de Tipo - DIÁRIO -->
        <div v-if="!usarPeriodoCompleto" class="filter-group">
          <label class="filter-label">
            <i class="fas fa-clipboard-check"></i>
            Tipo de Auditoria (Diário):
          </label>
          <select
            v-model="filtroTipoAuditoria"
            @change="buscarDados"
            class="filter-select"
          >
            <option value="todos">🔍 Todas as auditorias</option>
            <option value="etiqueta">🏷️ Etiqueta</option>
            <option value="presenca">👥 Presença</option>
            <option value="ruptura">📦 Ruptura</option>
          </select>
        </div>

        <!-- Filtro de Tipo - PERÍODO COMPLETO -->
        <div v-if="usarPeriodoCompleto" class="filter-group">
          <label class="filter-label">
            <i class="fas fa-clipboard-check"></i>
            Tipo de Auditoria (Todas):
          </label>
          <select
            v-model="filtroTipoAuditoriaCompleto"
            @change="buscarDados"
            class="filter-select"
          >
            <option value="todos">🔍 Todas as auditorias</option>
            <option value="etiqueta">🏷️ Etiqueta</option>
            <option value="presenca">👥 Presença</option>
            <option value="ruptura">📦 Ruptura</option>
          </select>
        </div>

        <!-- Ordenação por Ruptura (visível apenas quando tipo = ruptura) -->
        <div v-if="tipoAuditoriaAtual === 'ruptura'" class="filter-group">
          <label class="filter-label">
            <i class="fas fa-sort-amount-down"></i>
            Ordenar por:
          </label>
          <div class="view-options">
            <button
              @click="ordenacaoRuptura = 'itens'"
              :class="['view-btn', { active: ordenacaoRuptura === 'itens' }]"
            >
              <i class="fas fa-box-open"></i>
              Itens
            </button>
            <button
              @click="ordenacaoRuptura = 'valor'"
              :class="['view-btn', { active: ordenacaoRuptura === 'valor' }]"
            >
              <i class="fas fa-dollar-sign"></i>
              Valor (R$)
            </button>
          </div>
        </div>

        <!-- Controles de Visualização -->
        <div class="filter-group">
          <label class="filter-label">
            <i class="fas fa-eye"></i>
            Visualização:
          </label>
          <div class="view-options">
            <button
              @click="viewMode = 'podium'"
              :class="['view-btn', { active: viewMode === 'podium' }]"
            >
              <i class="fas fa-trophy"></i>
              Pódio
            </button>
            <button
              @click="viewMode = 'all'"
              :class="['view-btn', { active: viewMode === 'all' }]"
            >
              <i class="fas fa-list"></i>
              Lista
            </button>
          </div>
        </div>

        <!-- Botão de Compartilhar -->
        <div class="filter-group">
          <button @click="gerarImagemParaCompartilhar" class="share-btn">
            <i class="fas fa-share-alt"></i>
            Compartilhar
          </button>
        </div>
      </div>
    </div>

    <!-- Estado de Carregamento -->
    <div v-if="carregando" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando ranking de colaboradores...</p>
    </div>

    <!-- Estado de Erro -->
    <div v-else-if="erro" class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3>Erro ao carregar dados</h3>
      <p>{{ erro }}</p>
      <button @click="buscarDados" class="btn-retry">
        <i class="fas fa-redo-alt"></i>
        Tentar Novamente
      </button>
    </div>

    <!-- Pódio - Top 3 -->
    <PodiumSection
      v-if="
        !carregando &&
        !erro &&
        viewMode === 'podium' &&
        usuariosOrdenados.length >= 3
      "
      :usuariosOrdenados="usuariosOrdenados"
      :tipoAuditoria="
        usarPeriodoCompleto ? filtroTipoAuditoriaCompleto : filtroTipoAuditoria
      "
      :filtroTipo="usarPeriodoCompleto ? 'completo' : 'diario'"
    />

    <!-- Lista Completa de Ranking -->
    <RankingListColaboradores
      v-if="!carregando && !erro && usuarios.length > 0"
      :usuariosFiltradosOrdenados="usuariosFiltradosOrdenados"
      :viewMode="viewMode"
      :usuariosOrdenados="usuariosOrdenados"
      :tipoAuditoria="
        usarPeriodoCompleto ? filtroTipoAuditoriaCompleto : filtroTipoAuditoria
      "
      :filtroTipo="usarPeriodoCompleto ? 'completo' : 'diario'"
    />

    <!-- Estatísticas Avançadas -->
    <AdvancedStats
      v-if="!carregando && !erro && usuarios.length > 0"
      :topPerformer="topPerformer"
      :mediaItensPorUsuario="mediaItensPorUsuario"
      :totalItensLidos="totalItensLidos"
      :usuarios="usuarios"
      :tipoAuditoria="filtroTipoAuditoria"
    />

    <!-- Botão de Exportar -->
    <ExportSection
      v-if="!carregando && !erro && usuarios.length > 0"
      @exportarRanking="exportarRanking"
      :tipoAuditoria="filtroTipoAuditoria"
    />

    <!-- Estado Vazio -->
    <div
      v-if="!carregando && !erro && usuarios.length === 0"
      class="empty-state"
    >
      <div class="empty-icon">
        <i class="fas fa-users-slash"></i>
      </div>
      <h3>Nenhum colaborador encontrado</h3>
      <p v-if="filtroTipoAuditoria !== 'todos'">
        Não foram encontrados dados para auditorias do tipo "{{
          getTipoAuditoriaName(filtroTipoAuditoria)
        }}".
      </p>
      <p v-else>Não foram encontrados dados de ranking.</p>
      <p class="empty-suggestion">
        Verifique se há planilhas processadas para esta loja.
      </p>
    </div>
    </div><!-- fim v-else conteúdo principal -->
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useLojaStore } from "@/store/lojaStore";
import axios from "axios";

// Importar componentes unificados
import HeroSection from "./Ranking/RankingColaboradores/HeroSection.vue";
import PodiumSection from "./Ranking/RankingColaboradores/PodiumSection.vue";
import RankingListColaboradores from "./Ranking/Colaboradores/RankingListColaboradores.vue";
import AdvancedStats from "./Ranking/RankingColaboradores/AdvancedStats.vue";
import ExportSection from "./Ranking/RankingColaboradores/ExportSection.vue";

export default {
  name: "RankingColaboradores",
  components: {
    HeroSection,
    PodiumSection,
    RankingListColaboradores,
    AdvancedStats,
    ExportSection,
  },
  setup() {
    const lojaStore = useLojaStore();

    // Estados principais
    const usuarios = ref([]);
    const viewMode = ref("podium");

    // Filtros separados por período
    const filtroTipoAuditoria = ref("etiqueta"); // Para UserDailyMetrics
    const filtroTipoAuditoriaCompleto = ref("etiqueta"); // Para MetricasUsuario
    const usarPeriodoCompleto = ref(false);
    const ordenacaoRuptura = ref("itens"); // 'itens' ou 'valor'

    const carregando = ref(false);
    const erro = ref("");

    const lojasDisponiveis = ref([
      { codigo: "056", nome: "Loja 056 - Goiania Burits", cidade: "Goiânia", imagem: "/images/lojas/056.jpg" },
      { codigo: "084", nome: "Loja 084 - Goiania Independência", cidade: "Goiânia", imagem: "/images/lojas/084.jpg" },
      { codigo: "105", nome: "Loja 105 - T9", cidade: "Goiânia", imagem: "/images/lojas/105.jpg" },
      { codigo: "111", nome: "Loja 111 - Rio Verde", cidade: "Rio Verde", imagem: "/images/lojas/111.jpg" },
      { codigo: "140", nome: "Loja 140 - Perimetral", cidade: "Goiânia", imagem: "/images/lojas/140.jpg" },
      { codigo: "214", nome: "Loja 214 - Caldas Novas", cidade: "Caldas Novas", imagem: "/images/lojas/214.jpg" },
      { codigo: "176", nome: "Loja 176 - Palmas Teotônio", cidade: "Palmas", imagem: "/images/lojas/176.jpg" },
      { codigo: "194", nome: "Loja 194 - Anápolis", cidade: "Anápolis", imagem: "/images/lojas/194.jpg" },
      { codigo: "310", nome: "Loja 310 - Portugal", cidade: "Goiânia", imagem: "/images/lojas/310.jpg" },
      { codigo: "320", nome: "Loja 320 - Palmas cesamar", cidade: "Palmas", imagem: "/images/lojas/320.jpg" },
      { codigo: "347", nome: "Loja 347 - Araguaina", cidade: "Araguaina", imagem: "/images/lojas/347.jpeg" },
      { codigo: "348", nome: "Loja 348 - Aparecida", cidade: "Aparecida", imagem: "/images/lojas/348.jpg" },
    ]);

    // Computadas
    const tipoAuditoriaAtual = computed(() => {
      return usarPeriodoCompleto.value ? filtroTipoAuditoriaCompleto.value : filtroTipoAuditoria.value;
    });

    const usuariosOrdenados = computed(() => {
      const lista = [...usuarios.value];
      if (tipoAuditoriaAtual.value === 'ruptura' && ordenacaoRuptura.value === 'valor') {
        return lista.sort((a, b) => {
          const valorA = a.metricas?.rupturas?.custoTotalRuptura || 0;
          const valorB = b.metricas?.rupturas?.custoTotalRuptura || 0;
          return valorB - valorA;
        });
      }
      return lista.sort((a, b) => b.contador - a.contador);
    });

    const usuariosFiltradosOrdenados = computed(() => {
      let filtered = usuariosOrdenados.value;

      // Se estiver no modo pódio, mostra apenas do 4º lugar em diante na lista
      if (viewMode.value === "podium") {
        return filtered.slice(3);
      }

      // Se estiver no modo lista, mostra todos os usuários
      return filtered;
    });

    const totalItensLidos = computed(() => {
      return usuarios.value.reduce(
        (total, usuario) => total + (usuario.contador || 0),
        0,
      );
    });

    const mediaItensPorUsuario = computed(() => {
      return usuarios.value.length
        ? Math.round(totalItensLidos.value / usuarios.value.length)
        : 0;
    });

    const topPerformer = computed(() => {
      return usuariosOrdenados.value[0] || { nome: "N/A", contador: 0 };
    });

    const percentualAboveAverage = computed(() => {
      if (usuarios.value.length === 0) return 0;
      const aboveAverage = usuarios.value.filter(
        (u) => u.contador > mediaItensPorUsuario.value,
      ).length;
      return Math.round((aboveAverage / usuarios.value.length) * 100);
    });

    // Métodos
    const getTipoAuditoriaName = (tipo) => {
      const tipos = {
        etiqueta: "Etiqueta",
        presenca: "Presença",
        ruptura: "Ruptura",
        todos: "Todas",
      };
      return tipos[tipo] || tipo;
    };

    const setPeriodo = async (periodo) => {
      const novoValor = periodo === "completo";
      if (usarPeriodoCompleto.value !== novoValor) {
        usarPeriodoCompleto.value = novoValor;
        await buscarDados();
      }
    };

    const buscarDados = async () => {
      if (!lojaStore.isLojaSelected) {
        erro.value = "Nenhuma loja selecionada";
        return;
      }

      try {
        carregando.value = true;
        erro.value = "";

        let url;
        const params = new URLSearchParams();
        let modeloUsado;
        let tipoSelecionado;

        if (usarPeriodoCompleto.value) {
          // Modo PERÍODO COMPLETO - usa MetricasUsuario
          url = "/api/ranking-colaboradores-completo";
          tipoSelecionado = filtroTipoAuditoriaCompleto.value;
          params.append("tipo", tipoSelecionado);
          modeloUsado = `MetricasUsuario (Período Completo - ${getTipoAuditoriaName(
            tipoSelecionado,
          )})`;
        } else {
          // Modo DIÁRIO - usa UserDailyMetrics
          url = "/api/ranking-colaboradores";
          tipoSelecionado = filtroTipoAuditoria.value;
          params.append("tipo", tipoSelecionado);
          modeloUsado = `UserDailyMetrics (Diário - ${getTipoAuditoriaName(
            tipoSelecionado,
          )})`;
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        console.log(`🔄 Buscando dados do ${modeloUsado}:`, url);

        const response = await axios.get(url, {
          headers: {
            "x-loja": lojaStore.codigoLojaAtual,
          },
        });

        // Os dados já vêm prontos do backend
        usuarios.value = response.data.map((usuario) => ({
          ...usuario,
          iniciais: obterIniciais(usuario.nome),
        }));

        console.log(
          `✅ ${usuarios.value.length} colaboradores carregados do ${modeloUsado}`,
        );

        // Log para debug
        if (usuarios.value.length > 0) {
          console.log("📊 Exemplo de dados carregados:", {
            usuario: usuarios.value[0].nome,
            contador: usuarios.value[0].contador,
            eficiencia: usuarios.value[0].eficiencia,
            pontuacao: usuarios.value[0].pontuacao,
            tipoFiltrado: tipoSelecionado,
            periodoCompleto: usarPeriodoCompleto.value,
            metricas: usuarios.value[0].metricas,
          });
        }
      } catch (error) {
        console.error("❌ Erro ao buscar dados:", error);
        erro.value =
          error.response?.data?.erro ||
          error.response?.data?.detalhes ||
          "Erro ao conectar com o servidor";

        usuarios.value = [];
      } finally {
        carregando.value = false;
      }
    };

    const trocarLoja = () => {
      lojaStore.limparLoja();
      usuarios.value = [];
    };

    const selecionarLoja = async (loja) => {
      try {
        carregando.value = true;
        erro.value = "";
        const sucesso = await lojaStore.selecionarLoja(loja);
        if (sucesso) {
          await buscarDados();
        } else {
          erro.value = "Erro ao validar loja. Tente novamente.";
        }
      } catch (error) {
        erro.value = "Erro ao validar loja. Tente novamente.";
        console.error("Erro ao selecionar loja:", error);
      } finally {
        carregando.value = false;
      }
    };

    const handleImageError = (event) => {
      event.target.src = "/images/lojas/default.jpg";
    };

    const obterIniciais = (nome) => {
      if (!nome) return "??";
      return nome
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    };

    const exportarRanking = () => {
      const tipoTexto = getTipoAuditoriaName(filtroTipoAuditoria.value);

      const rankingData = usuariosOrdenados.value.map((user, index) => ({
        Posição: `${index + 1}º`,
        Nome: user.nome,
        Matrícula: user.id,
        "Itens Lidos": user.contador,
        "Eficiência (%)": user.eficiencia,
        Pontuação: user.pontuacao,
        "Posição na Loja": user.posicaoLoja || "N/A",
        "Tipo de Auditoria": tipoTexto,
        "Data da Última Atualização": user.metricas?.data
          ? new Date(user.metricas.data).toLocaleDateString("pt-BR")
          : "N/A",
        Loja: user.loja,
      }));

      const csvContent = [
        "Posição,Nome,Matrícula,Itens Lidos,Eficiência (%),Pontuação,Posição na Loja,Tipo de Auditoria,Data da Última Atualização,Loja",
        ...rankingData.map(
          (item) =>
            `"${item.Posição}","${item.Nome}","${item.Matrícula}",${item["Itens Lidos"]},${item["Eficiência (%)"]},${item.Pontuação},"${item["Posição na Loja"]}","${item["Tipo de Auditoria"]}","${item["Data da Última Atualização"]}","${item.Loja}"`,
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `ranking_colaboradores_${tipoTexto.toLowerCase()}_${
          new Date().toISOString().split("T")[0]
        }.csv`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(
        `📊 Exportado ranking de ${rankingData.length} colaboradores (${tipoTexto})`,
      );
    };

    // Método para gerar imagem para compartilhamento
    const gerarImagemParaCompartilhar = async () => {
      try {
        // Importar html2canvas dinamicamente
        const { default: html2canvas } = await import("html2canvas");

        // Criar um container temporário com apenas os elementos que queremos capturar
        const contentToCapture = document.createElement("div");
        contentToCapture.style.position = "absolute";
        contentToCapture.style.left = "-9999px";
        contentToCapture.style.width = "1200px";
        contentToCapture.style.maxWidth = "100%";
        contentToCapture.style.backgroundColor = "white";
        contentToCapture.style.padding = "30px";
        contentToCapture.style.boxSizing = "border-box";
        contentToCapture.style.overflow = "hidden";

        // Título
        const titleElement = document.createElement("h1");
        titleElement.textContent = `Ranking de Colaboradores - ${
          lojaStore.nomeLojaAtual || "Loja"
        }`;
        titleElement.style.textAlign = "center";
        titleElement.style.color = "#1f2937";
        titleElement.style.marginBottom = "30px";
        titleElement.style.fontSize = "24px";
        titleElement.style.fontFamily = '"Inter", sans-serif';
        contentToCapture.appendChild(titleElement);

        // Clonar o pódio Top Performers
        const podiumElement = document.querySelector(".podium-section");
        if (podiumElement) {
          const podiumClone = podiumElement.cloneNode(true);
          podiumClone.style.width = "100%";
          podiumClone.style.overflow = "visible";
          contentToCapture.appendChild(podiumClone);
        }

        // Clonar a lista de ranking com base no modo de visualização atual
        let rankingListToCapture = null;

        if (viewMode.value === "podium") {
          // Em modo pódio, capturar apenas os primeiros colaboradores (do 4º ao 15º lugar)
          const rankingListElement = document.querySelector(
            ".full-ranking-section",
          );
          if (rankingListElement) {
            const rankingClone = rankingListElement.cloneNode(true);

            // Encontrar e manter apenas os primeiros 12 colaboradores (posição 4 a 15)
            const rankingItems = rankingClone.querySelectorAll(".ranking-item");
            if (rankingItems.length > 0) {
              // Remover itens além dos 12 primeiros (para que tenhamos do 4º ao 15º)
              for (let i = 12; i < rankingItems.length; i++) {
                rankingItems[i].remove();
              }
            }

            rankingClone.style.width = "100%";
            rankingClone.style.overflow = "visible";
            rankingListToCapture = rankingClone;
          }
        } else if (viewMode.value === "all") {
          // Em modo lista, capturar a lista completa de ranking
          const rankingListElement = document.querySelector(
            ".full-ranking-section",
          );
          if (rankingListElement) {
            const rankingClone = rankingListElement.cloneNode(true);
            rankingClone.style.width = "100%";
            rankingClone.style.overflow = "visible";
            rankingListToCapture = rankingClone;
          }
        }

        if (rankingListToCapture) {
          contentToCapture.appendChild(rankingListToCapture);
        }

        // Adicionar ao body temporariamente para renderização
        document.body.appendChild(contentToCapture);

        // Aguardar um pouco para garantir que todos os estilos e imagens sejam carregados
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Processar avatares que usam iniciais (geralmente SVGs ou fallbacks)
        const avatarImages = contentToCapture.querySelectorAll(
          ".avatar-icon img, .user-avatar img",
        );
        avatarImages.forEach((img) => {
          // Força o carregamento da imagem
          if (img.src.includes("ui-avatars.com")) {
            // Força o carregamento da imagem de iniciais
            img.crossOrigin = "anonymous";
          }
        });

        // Determinar altura dinamicamente com base no conteúdo
        const height = contentToCapture.scrollHeight;

        // Capturar a imagem
        const canvas = await html2canvas(contentToCapture, {
          scale: 2, // Maior qualidade
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: Math.min(1200, window.innerWidth || 1200), // Ajustar largura dinamicamente
          height: height + 100, // Adicionar um pouco de altura extra
          scrollX: 0,
          scrollY: 0,
          logging: false,
          imageTimeout: 15000,
          // Opções para melhor renderização de conteúdo responsivo
          onclone: (clonedDoc) => {
            // Ajustar estilos para melhor captura
            const elements = clonedDoc.querySelectorAll(
              ".ranking-item, .podium-item",
            );
            elements.forEach((el) => {
              el.style.maxWidth = "100%";
              el.style.overflow = "visible";
            });

            // Garantir que os avatares sejam renderizados corretamente
            const avatarImgs = clonedDoc.querySelectorAll(
              ".avatar-icon img, .user-avatar img",
            );
            avatarImgs.forEach((img) => {
              // Força renderização de imagens de avatares/iniciais
              if (!img.complete) {
                img.style.visibility = "hidden";
                img.onload = () => {
                  img.style.visibility = "visible";
                };
              }
            });
          },
        });

        // Remover o elemento temporário
        document.body.removeChild(contentToCapture);

        // Converter canvas para imagem
        const imgData = canvas.toDataURL("image/png");

        // Criar link para download
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `ranking-colaboradores-${
          lojaStore.codigoLojaAtual || "loja"
        }-${new Date().toISOString().slice(0, 10)}-${viewMode.value}.png`;
        link.click();
      } catch (error) {
        console.error("Erro ao gerar imagem para compartilhamento:", error);

        // Fallback - abrir uma nova janela com os elementos para impressão
        const podiumElement = document.querySelector(".podium-section");

        // Determinar qual conteúdo de ranking será capturado com base no modo de visualização
        let rankingListElement = null;
        if (viewMode.value === "podium") {
          rankingListElement = document.querySelector(".full-ranking-section");
        } else if (viewMode.value === "all") {
          rankingListElement = document.querySelector(".full-ranking-section");
        }

        if (podiumElement || rankingListElement) {
          let printContent =
            '<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto;">';
          printContent += `<h1 style="text-align: center; color: #1f2937;">Ranking de Colaboradores - ${
            lojaStore.nomeLojaAtual || "Loja"
          } - Modo: ${viewMode.value === "podium" ? "Pódio" : "Lista Completa"}</h1>`;

          if (podiumElement) {
            printContent +=
              '<div style="margin-bottom: 30px;">' +
              podiumElement.outerHTML +
              "</div>";
          }

          if (rankingListElement) {
            // Clonar a lista baseado no modo de visualização
            const rankingClone = rankingListElement.cloneNode(true);
            if (viewMode.value === "podium") {
              // Limitar a 12 colaboradores (posição 4 a 15)
              const rankingItems =
                rankingClone.querySelectorAll(".ranking-item");
              if (rankingItems.length > 12) {
                for (let i = 12; i < rankingItems.length; i++) {
                  rankingItems[i].remove();
                }
              }
            }
            printContent +=
              '<div style="margin-top: 30px;">' +
              rankingClone.innerHTML +
              "</div>";
          }

          printContent += "</div>";

          const printWindow = window.open("", "_blank");
          printWindow.document.write(`
            <html>
              <head>
                <title>Ranking de Colaboradores - Compartilhamento</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; }
                  .podium-section, .full-ranking-section { margin: 20px 0; background: white; }
                  .podium-item, .ranking-item { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 10px 0; box-sizing: border-box; }
                  .avatar-icon img { width: 60px; height: 60px; object-fit: cover; border-radius: 50%; }
                  .avatar-icon { display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-weight: bold; }
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
          alert(
            "Não foi possível encontrar os elementos para compartilhamento.",
          );
        }
      }
    };

    // Lifecycle e Watchers
    onMounted(async () => {
      if (lojaStore.isLojaSelected) {
        await buscarDados();
      }
    });

    // Watch para mudanças na loja
    watch(
      () => lojaStore.lojaSelecionada,
      async (novaLoja) => {
        if (novaLoja) {
          await buscarDados();
        } else {
          usuarios.value = [];
        }
      },
    );

    return {
      // Estados
      usuarios,
      viewMode,
      filtroTipoAuditoria,
      filtroTipoAuditoriaCompleto,
      usarPeriodoCompleto,
      ordenacaoRuptura,
      carregando,
      erro,
      lojaStore,

      // Computadas
      tipoAuditoriaAtual,
      usuariosOrdenados,
      usuariosFiltradosOrdenados,
      totalItensLidos,
      mediaItensPorUsuario,
      topPerformer,
      percentualAboveAverage,

      // Dados
      lojasDisponiveis,

      // Métodos
      getTipoAuditoriaName,
      buscarDados,
      setPeriodo,
      exportarRanking,
      gerarImagemParaCompartilhar,
      trocarLoja,
      selecionarLoja,
      handleImageError,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

.ranking-colaboradores-container {
  max-width: auto;
  margin: 0 auto;
  padding: 2px;
  font-family: "Inter", sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* ===== SELEÇÃO DE LOJA ===== */
.loja-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.loja-selection-content {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  width: 100%;
}

.loja-selection-icon {
  font-size: 4rem;
  color: #667eea;
  margin-bottom: 2rem;
}

.loja-selection-content h2 {
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

.loja-selection-content p {
  font-size: 1.2rem;
  color: #64748b;
  margin-bottom: 3rem;
}

.lojas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.loja-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.loja-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.loja-card.loading {
  opacity: 0.7;
  pointer-events: none;
}

.loja-image {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e2e8f0;
}

.loja-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loja-info h3 {
  font-size: 1.1rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.loja-info p {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.loja-codigo {
  background: #667eea;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
}

/* ===== INDICADOR DE PERÍODO ===== */
.periodo-indicator {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  animation: slideDown 0.4s ease;
}

.periodo-indicator.periodo-diario {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.periodo-indicator i {
  font-size: 1.25rem;
}

.periodo-indicator span {
  font-size: 0.95rem;
  line-height: 1.5;
}

.periodo-indicator strong {
  font-weight: 700;
  text-decoration: underline;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== INFORMAÇÕES EM TEMPO REAL ===== */
.realtime-info {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-left: 5px solid #10b981;
}

.realtime-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.realtime-header h3 {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.realtime-header h3 i {
  color: #10b981;
}

.data-source {
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
}

.realtime-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.stat-icon i {
  color: white;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

/* ===== CONTROLES UNIFICADOS ===== */
.unified-controls {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.filters-main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label i {
  color: #667eea;
}

.filter-with-button {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}

.filter-select {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-periodo-completo {
  padding: 0.875rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  white-space: nowrap;
}

.btn-periodo-completo:hover {
  border-color: #10b981;
  color: #10b981;
  background: #f0fdf4;
}

.btn-periodo-completo.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.btn-periodo-completo.active:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: "Inter", sans-serif;
}

.view-btn:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f8fafc;
}

.view-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.refresh-btn {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  min-width: 120px;
  justify-content: center;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.share-btn {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  min-width: 120px;
  justify-content: center;
}

.share-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ===== ESTADOS ===== */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  margin: 2rem 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

.loading-container p {
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 500;
}

.error-container {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  margin: 2rem 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 1.5rem;
}

.error-container h3 {
  color: #1f2937;
  font-size: 1.75rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.error-container p {
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.btn-retry {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-family: "Inter", sans-serif;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  margin: 2rem 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 5rem;
  color: #cbd5e1;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  color: #1f2937;
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.empty-suggestion {
  color: #9ca3af !important;
  font-style: italic;
}

/* ===== RESPONSIVO ===== */
@media (max-width: 768px) {
  .ranking-colaboradores-container {
    padding: 1rem;
  }

  .unified-controls {
    padding: 1.5rem;
  }

  .filters-main {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .view-options {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .unified-controls {
    padding: 1rem;
  }

  .filter-select,
  .view-btn,
  .refresh-btn {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
