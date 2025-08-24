<template>
  <div class="perfil-usuario-container">
    <!-- Botão Voltar -->
    <div class="navigation-section">
      <button class="back-btn" @click="voltarParaLista">
        <span class="icon">←</span> Voltar para Lista
      </button>
    </div>

    <div v-if="carregando" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando perfil...</p>
    </div>

    <div v-else-if="!usuario.id" class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3>Usuário não encontrado</h3>
      <p>O colaborador solicitado não foi encontrado no sistema.</p>
      <button @click="voltarParaLista" class="btn btn-primary">
        Voltar para lista
      </button>
    </div>

    <div v-else>
      <!-- Header do Perfil -->
      <div class="perfil-header">
        <div class="perfil-cover">
          <div class="cover-pattern"></div>
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
              <div class="avatar-badge" v-if="usuario.contador >= 500">
                <span class="icon">⭐</span>
              </div>
            </div>
          </div>

          <div class="perfil-details">
            <h1 class="usuario-nome">{{ usuario.nome }}</h1>
            <p class="usuario-matricula">Matrícula: {{ usuario.id }}</p>
            <p class="usuario-cargo">Auditor de Estoque</p>
          </div>

          <div class="perfil-stats">
            <div class="stat-item">
              <span class="stat-number">{{ usuario.contador }}</span>
              <span class="stat-label">Itens Lidos</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ corredoresUnicos.length }}</span>
              <span class="stat-label">Corredores</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ percentualConcluido }}%</span>
              <span class="stat-label">Concluído</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Selos e Conquistas -->
      <div class="selos-section">
        <h2 class="section-title">🏆 Conquistas e Selos</h2>
        <div class="selos-grid">
          <div
            v-for="selo in selos"
            :key="selo.id"
            :class="['selo-card', { desbloqueado: selo.desbloqueado }]"
          >
            <div class="selo-icon">
              <span class="icon">{{ selo.icone }}</span>
            </div>
            <div class="selo-info">
              <h3>{{ selo.nome }}</h3>
              <p>{{ selo.descricao }}</p>
            </div>
            <div class="selo-status">
              <span v-if="selo.desbloqueado" class="desbloqueado"
                >✅ Desbloqueado</span
              >
              <span v-else class="bloqueado">🔒 Bloqueado</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Estatísticas Principais -->
      <div class="estatisticas-section">
        <div class="stats-grid">
          <!-- Progresso Geral -->
          <div class="stat-card main">
            <h3>📊 Progresso de Auditoria</h3>
            <div class="progress-container">
              <div class="progress-circle">
                <div class="circle-bg"></div>
                <div class="circle-progress" :style="progressStyle"></div>
                <div class="circle-text">
                  <span class="percent">{{ percentualConcluido }}%</span>
                  <span class="label">Concluído</span>
                </div>
              </div>
            </div>
            <div class="progress-details">
              <div class="detail-item">
                <span class="value">{{ usuario.contador }}/500</span>
                <span class="label">Meta de Itens</span>
              </div>
              <div class="detail-item">
                <span
                  class="value"
                  :class="{
                    positive: diferencaMedia > 0,
                    negative: diferencaMedia < 0,
                  }"
                >
                  {{ diferencaMedia > 0 ? "+" : "" }}{{ diferencaMedia }}
                </span>
                <span class="label">vs Média Geral</span>
              </div>
            </div>
          </div>

          <!-- Comparação com Média -->
          <div class="stat-card">
            <h3>📈 Desempenho</h3>
            <div class="comparacao-chart">
              <div class="bar-container">
                <div class="bar-label">Sua média</div>
                <div class="bar">
                  <div
                    class="bar-fill usuario"
                    :style="{ width: calcularLarguraBarra(usuario.contador) }"
                  ></div>
                  <span class="bar-value">{{ usuario.contador }}</span>
                </div>
              </div>
              <div class="bar-container">
                <div class="bar-label">Média geral</div>
                <div class="bar">
                  <div
                    class="bar-fill media"
                    :style="{ width: calcularLarguraBarra(mediaGeral) }"
                  ></div>
                  <span class="bar-value">{{ mediaGeral }}</span>
                </div>
              </div>
            </div>
            <div class="comparacao-texto">
              <p v-if="diferencaMedia > 0">
                🎉 Você está <strong>{{ diferencaMedia }} itens</strong> acima
                da média!
              </p>
              <p v-else-if="diferencaMedia < 0">
                📉 Você está
                <strong>{{ Math.abs(diferencaMedia) }} itens</strong> abaixo da
                média.
              </p>
              <p v-else>📊 Você está na média geral.</p>
            </div>
          </div>

          <!-- Distribuição por Corredor -->
          <div class="stat-card">
            <h3>🗺️ Distribuição por Corredor</h3>
            <div class="corredores-list">
              <div
                v-for="corredor in corredoresComContagem"
                :key="corredor.nome"
                class="corredor-item"
              >
                <span class="corredor-nome">{{ corredor.nome }}</span>
                <span class="corredor-contagem"
                  >{{ corredor.contagem }} itens</span
                >
                <div class="corredor-bar">
                  <div
                    class="corredor-progress"
                    :style="{ width: corredor.percentual + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline de Atividades -->
      <div class="timeline-section" v-if="atividadesRecentes.length > 0">
        <h2 class="section-title">⏰ Atividades Recentes</h2>
        <div class="timeline">
          <div
            v-for="(atividade, index) in atividadesRecentes"
            :key="index"
            class="timeline-item"
          >
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h4>{{ atividade.descricao }}</h4>
              <p class="timeline-time">
                {{ formatarTempo(atividade.timestamp) }}
              </p>
              <p class="timeline-details" v-if="atividade.detalhes">
                {{ atividade.detalhes }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Itens Faltantes -->
      <div class="faltantes-section" v-if="itensFaltantes.length > 0">
        <h2 class="section-title">⚠️ Itens com Baixo Estoque</h2>
        <div class="faltantes-grid">
          <div
            v-for="item in itensFaltantes.slice(0, 6)"
            :key="item.Código"
            class="faltante-card"
          >
            <div class="faltante-header">
              <span class="faltante-codigo">{{ item.Código }}</span>
              <span class="faltante-alerta">⚠️</span>
            </div>
            <h4 class="faltante-nome">{{ item.Produto }}</h4>
            <div class="faltante-details">
              <div class="detail">
                <span class="icon">📦</span>
                <span>Estoque: {{ item["Estoque atual"] }}</span>
              </div>
              <div class="detail">
                <span class="icon">📍</span>
                <span>{{ item.Local }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="actions-section">
        <button class="action-btn primary" @click="exportarRelatorio">
          <span class="icon">📊</span> Exportar Relatório
        </button>
        <button class="action-btn secondary" @click="compartilharPerfil">
          <span class="icon">📤</span> Compartilhar Perfil
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "PerfilUsuario",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const router = useRouter();

    const voltarParaLista = () => {
      router.push("/lista");
    };

    return {
      voltarParaLista,
    };
  },
  data() {
    return {
      usuario: {
        id: "",
        nome: "",
        contador: 0,
        iniciais: "",
        foto: null,
      },
      carregando: true,
      mediaGeral: 85,
      atividadesRecentes: [],
      dadosUsuario: [],
      selos: [
        {
          id: 1,
          nome: "Meta Batida",
          descricao: "Leu mais de 500 itens",
          icone: "🎯",
          desbloqueado: false,
          condicao: (usuario) => usuario.contador >= 500,
        },
        {
          id: 2,
          nome: "Explorador",
          descricao: "Cobriu 5+ corredores",
          icone: "🗺️",
          desbloqueado: false,
          condicao: (usuario, corredores) => corredores.length >= 5,
        },
        {
          id: 3,
          nome: "Top Performer",
          descricao: "Acima da média geral",
          icone: "⭐",
          desbloqueado: false,
          condicao: (usuario, corredores, mediaGeral) =>
            usuario.contador > mediaGeral,
        },
        {
          id: 4,
          nome: "Consistência",
          descricao: "75%+ de conclusão",
          icone: "📈",
          desbloqueado: false,
          condicao: (usuario) => usuario.contador / 500 >= 0.75,
        },
        {
          id: 5,
          nome: "Detetive",
          descricao: "Identificou 10+ itens faltantes",
          icone: "🔍",
          desbloqueado: false,
          condicao: (usuario, itensFaltantes) => itensFaltantes.length >= 10,
        },
        // Novas conquistas
        {
          id: 6,
          nome: "Maratona",
          descricao: "Leu mais de 1000 itens",
          icone: "🏅",
          desbloqueado: false,
          condicao: (usuario) => usuario.contador >= 1000,
        },
        {
          id: 7,
          nome: "Corredor Mestre",
          descricao: "Cobriu 10+ corredores",
          icone: "🏆",
          desbloqueado: false,
          condicao: (usuario, corredores) => corredores.length >= 10,
        },
        {
          id: 8,
          nome: "Zero Faltas",
          descricao: "Nenhum item com estoque baixo",
          icone: "🛡️",
          desbloqueado: false,
          condicao: (usuario, itensFaltantes) => itensFaltantes.length === 0,
        },
        {
          id: 9,
          nome: "Relâmpago",
          descricao: "Verificou 50 itens em menos de 1 hora",
          icone: "⚡",
          desbloqueado: false,
          condicao: (
            usuario,
            corredores,
            mediaGeral,
            itensFaltantes,
            atividadesRecentes
          ) => {
            // Exemplo: verifica se há 50 atividades recentes em menos de 1 hora
            if (!atividadesRecentes || atividadesRecentes.length < 50)
              return false;
            const primeira = atividadesRecentes[0]?.timestamp;
            const ultima = atividadesRecentes[49]?.timestamp;
            if (!primeira || !ultima) return false;
            return (primeira - ultima) / (1000 * 60 * 60) < 1;
          },
        },
        {
          id: 10,
          nome: "Regularidade",
          descricao: "Fez auditoria por 5 dias seguidos",
          icone: "📅",
          desbloqueado: false,
          condicao: (usuario) => {
            // Exemplo: verifica se há auditorias em 5 dias consecutivos
            if (!usuario.auditorias || usuario.auditorias.length < 5)
              return false;
            const datas = usuario.auditorias
              .map((a) => new Date(a.data).setHours(0, 0, 0, 0))
              .sort();
            let consecutivos = 1;
            for (let i = 1; i < datas.length; i++) {
              if (datas[i] - datas[i - 1] === 86400000) {
                consecutivos++;
                if (consecutivos >= 5) return true;
              } else {
                consecutivos = 1;
              }
            }
            return false;
          },
        },
        {
          id: 11,
          nome: "Primeiro Dia",
          descricao: "Fez sua primeira auditoria",
          icone: "🎉",
          desbloqueado: false,
          condicao: (usuario) =>
            usuario.auditorias && usuario.auditorias.length > 0,
        },
        {
          id: 12,
          nome: "Veterano",
          descricao: "Fez auditoria em 20 dias diferentes",
          icone: "🥇",
          desbloqueado: false,
          condicao: (usuario) =>
            usuario.auditorias && usuario.auditorias.length >= 20,
        },
      ],
    };
  },
  async mounted() {
    await this.carregarUsuarioPorId(this.id);
  },
  computed: {
    percentualConcluido() {
      return Math.min(100, Math.round((this.usuario.contador / 500) * 100));
    },

    progressStyle() {
      return {
        "--progress": `${this.percentualConcluido}%`,
      };
    },

    diferencaMedia() {
      return this.usuario.contador - this.mediaGeral;
    },

    corredoresUnicos() {
      const corredores = new Set();
      this.dadosUsuario.forEach((item) => {
        if (item.Local) corredores.add(item.Local);
      });
      return Array.from(corredores);
    },

    corredoresComContagem() {
      const contagem = {};

      this.dadosUsuario.forEach((item) => {
        if (item.Local) {
          contagem[item.Local] = (contagem[item.Local] || 0) + 1;
        }
      });

      const total = Object.values(contagem).reduce(
        (sum, count) => sum + count,
        0
      );

      return Object.entries(contagem)
        .map(([nome, contagem]) => ({
          nome,
          contagem,
          percentual: total > 0 ? Math.round((contagem / total) * 100) : 0,
        }))
        .sort((a, b) => b.contagem - a.contagem);
    },

    itensFaltantes() {
      return this.dadosUsuario.filter((item) => {
        const estoque = parseInt(item["Estoque atual"]) || 0;
        return estoque < 10;
      });
    },
  },
  // Removido watcher usuarioSelecionado, não utilizado
  methods: {
    async carregarUsuarioPorId(usuarioId) {
      try {
        this.carregando = true;
        // Busca usuário pelo backend
        const response = await fetch(`http://localhost:3000/usuarios`);
        if (response.ok) {
          const usuarios = await response.json();
          // Busca pelo id ou _id
          const usuarioEncontrado = Array.isArray(usuarios)
            ? usuarios.find((u) => u.id === usuarioId || u._id === usuarioId)
            : usuarios.id === usuarioId || usuarios._id === usuarioId
            ? usuarios
            : null;
          if (usuarioEncontrado) {
            this.usuario = {
              ...usuarioEncontrado,
              iniciais: this.obterIniciais(usuarioEncontrado.nome),
            };
            await this.carregarDadosDetalhados(
              usuarioEncontrado.id || usuarioEncontrado._id
            );
          } else {
            console.error("Usuário não encontrado:", usuarioId);
            this.$router.push("/");
          }
        } else {
          console.error("Erro ao carregar usuário:", response.status);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        this.carregando = false;
      }
    },
    // ...existing code...
    carregarDadosUsuario(usuario) {
      this.usuario = { ...usuario };
      this.usuario.iniciais = this.obterIniciais(usuario.nome);
      this.carregarDadosDetalhados(usuario.id);
    },

    async carregarDadosDetalhados(usuarioId) {
      // Busca auditorias e itens do usuário pelo backend
      try {
        const response = await fetch(
          `http://localhost:3000/usuarios/${usuarioId}/auditorias`
        );
        if (response.ok) {
          const auditorias = await response.json();
          // Supondo que auditorias seja um array de itens auditados
          this.dadosUsuario = auditorias;
          this.processarTimeline();
          this.verificarSelos();
        } else {
          console.error("Erro ao carregar dados detalhados:", response.status);
        }
      } catch (error) {
        console.error("Erro ao carregar dados detalhados:", error);
      }
    },

    processarTimeline() {
      // Criar timeline a partir dos dados reais (últimos 5 itens)
      this.atividadesRecentes = this.dadosUsuario
        .slice(-5)
        .map((item) => {
          let descricao = "";
          let detalhes = "";

          if (item.Situacao === "Atualizado") {
            descricao = "Item verificado";
            detalhes = `${item.Produto} - Local: ${item.Local}`;
          } else {
            descricao = "Item identificado";
            detalhes = `${item.Produto} - Estoque: ${
              item["Estoque atual"] || 0
            }`;
          }

          return {
            descricao,
            detalhes,
            timestamp: new Date(), // Em produção, usar data real da planilha
          };
        })
        .reverse();
    },

    obterIniciais(nome) {
      if (!nome) return "??";
      return nome
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    },

    verificarSelos() {
      this.selos.forEach((selo) => {
        // Passa todos os parâmetros possíveis para as conquistas
        selo.desbloqueado = selo.condicao(
          this.usuario,
          this.corredoresUnicos,
          this.mediaGeral,
          this.itensFaltantes,
          this.atividadesRecentes
        );
      });
    },

    calcularLarguraBarra(valor) {
      const maxValor = Math.max(this.usuario.contador, this.mediaGeral, 1);
      return `${(valor / maxValor) * 100}%`;
    },

    formatarTempo(timestamp) {
      const agora = new Date();
      const diferenca = agora - timestamp;
      const horas = Math.floor(diferenca / (1000 * 60 * 60));

      if (horas < 1) return "Há poucos minutos";
      if (horas === 1) return "Há 1 hora";
      if (horas < 24) return `Há ${horas} horas`;

      const dias = Math.floor(horas / 24);
      if (dias === 1) return "Há 1 dia";
      return `Há ${dias} dias`;
    },

    exportarRelatorio() {
      const relatorioData = {
        Nome: this.usuario.nome,
        Matrícula: this.usuario.id,
        "Itens Lidos": this.usuario.contador,
        "Meta (500)": `${this.percentualConcluido}% concluído`,
        "Corredores Cobertos": this.corredoresUnicos.length,
        "Média Geral": this.mediaGeral,
        Desempenho:
          this.diferencaMedia > 0
            ? `+${this.diferencaMedia} acima`
            : `${this.diferencaMedia} abaixo`,
        "Itens com Baixo Estoque": this.itensFaltantes.length,
      };

      const csvContent = [
        "Item,Valor",
        ...Object.entries(relatorioData).map(
          ([key, value]) => `"${key}","${value}"`
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `perfil_${this.usuario.nome}_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    compartilharPerfil() {
      if (navigator.share) {
        navigator
          .share({
            title: `Perfil de ${this.usuario.nome}`,
            text: `Confira o desempenho de ${this.usuario.nome} no sistema de auditoria! ${this.usuario.contador} itens verificados.`,
            url: window.location.href,
          })
          .catch(console.error);
      } else {
        alert(
          "Seu navegador não suporta a funcionalidade de compartilhamento."
        );
      }
    },

    voltarParaLista() {
      // Garante navegação para rota correta
      if (this.$router) {
        this.$router.push({ name: "ListaUsuarios" });
      } else {
        window.location.href = "/lista";
      }
    },
  },
};
</script>

<style scoped>
.navigation-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.back-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 28px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s, box-shadow 0.3s, transform 0.2s;
}

.back-btn:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
  transform: translateY(-2px);
}
.perfil-usuario-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Header do Perfil */
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
  font-size: 2.5rem;
  margin-bottom: 5px;
  color: #2c3e50;
}

.usuario-matricula,
.usuario-cargo {
  color: #7f8c8d;
  margin-bottom: 5px;
}

.perfil-stats {
  display: flex;
  gap: 30px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
  min-width: 300px;
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

/* Selos e Conquistas */
.selos-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.conquistas-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.selos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.selo-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
  border-left: 4px solid #dee2e6;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
}

.selo-card.desbloqueado {
  background: linear-gradient(135deg, #fff9db 0%, #ffec99 100%);
  border-left-color: #ffd43b;
}

.selo-card.rara {
  border-left: 4px solid #ffd43b;
  background: linear-gradient(135deg, #fff9db 0%, #ffec99 100%);
}

.selo-card.especial {
  border-left: 4px solid #9c36b5;
  background: linear-gradient(135deg, #eebefa 0%, #cc5de8 100%);
  color: white;
}

.selo-card.especial .selo-info h3,
.selo-card.especial .selo-info p {
  color: white;
}

.selo-icon {
  font-size: 2.5rem;
}

.selo-info {
  flex: 1;
}

.selo-info h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.selo-info p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.selo-nivel {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff6b6b;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
}

.selo-progresso {
  margin-top: 10px;
}

.progresso-bar {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progresso-fill {
  height: 100%;
  background: #51cf66;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progresso-texto {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.selo-recompensa {
  margin-top: 8px;
}

.recompensa-texto {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f76707;
}

.estatisticas-conquistas {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.estatistica {
  text-align: center;
}

.estatistica .numero {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
}

.estatistica .label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

/* Estatísticas */
.estatisticas-section {
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.stat-card.main {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: center;
}

.stat-card h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Progress Circle */
.progress-container {
  display: flex;
  justify-content: center;
}

.progress-circle {
  position: relative;
  width: 150px;
  height: 150px;
}

.circle-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #e9ecef;
}

.circle-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(#51cf66 var(--progress), transparent 0);
  mask: radial-gradient(white 55%, transparent 60%);
  -webkit-mask: radial-gradient(white 55%, transparent 60%);
}

.circle-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.circle-text .percent {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  display: block;
}

.circle-text .label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.progress-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-item {
  text-align: center;
}

.detail-item .value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  display: block;
}

.detail-item .value.positive {
  color: #51cf66;
}

.detail-item .value.negative {
  color: #ff6b6b;
}

.detail-item .label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

/* Comparação Chart */
.comparacao-chart {
  margin-bottom: 20px;
}

.bar-container {
  margin-bottom: 15px;
}

.bar-label {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-fill {
  height: 20px;
  border-radius: 10px;
  transition: width 1s ease;
}

.bar-fill.usuario {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bar-fill.media {
  background: #adb5bd;
}

.bar-value {
  font-weight: 600;
  color: #2c3e50;
}

.comparacao-texto {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}

/* Corredores List */
.corredores-list {
  max-height: 200px;
  overflow-y: auto;
}

.corredor-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
}

.corredor-item:last-child {
  border-bottom: none;
}

.corredor-nome {
  flex: 1;
  font-weight: 500;
  color: #2c3e50;
}

.corredor-contagem {
  font-size: 0.9rem;
  color: #7f8c8d;
  min-width: 80px;
  text-align: right;
}

.corredor-bar {
  width: 60px;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.corredor-progress {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  transition: width 1s ease;
}

/* Timeline */
.timeline-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e9ecef;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-marker {
  position: absolute;
  left: -30px;
  top: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  border: 3px solid white;
  box-shadow: 0 0 0 3px #667eea;
}

.timeline-content {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
}

.timeline-content h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.timeline-time {
  margin: 0 0 5px 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.timeline-details {
  margin: 0;
  color: #495057;
  font-size: 0.9rem;
}

/* Itens Faltantes */
.faltantes-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.faltantes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.faltante-card {
  background: #fff9db;
  border: 2px solid #ffd43b;
  border-radius: 12px;
  padding: 15px;
  transition: all 0.3s ease;
}

.faltante-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 212, 59, 0.3);
}

.faltante-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.faltante-codigo {
  font-weight: 600;
  color: #2c3e50;
}

.faltante-alerta {
  font-size: 1.2rem;
}

.faltante-nome {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1rem;
}

.faltante-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.faltante-details .detail {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

/* Botões de Ação */
.actions-section {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.secondary {
  background: #e9ecef;
  color: #495057;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Responsivo */
@media (max-width: 768px) {
  .perfil-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .stat-card.main {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .perfil-stats {
    flex-direction: column;
    gap: 15px;
  }

  .actions-section {
    flex-direction: column;
  }
}

.icon {
  font-size: 1.2em;
  vertical-align: middle;
}
</style>
