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
      <PerfilHeader
        :usuario="usuario"
        :corredoresUnicos="corredoresUnicos"
        :percentualConcluido="percentualConcluido"
        :posicaoRanking="posicaoRanking"
        :mediaDesempenho="mediaDesempenho"
      />

      <!-- Selos e Conquistas -->
      <SelosConquistas
        :usuario="usuario"
        :corredoresUnicos="corredoresUnicos"
        :itensFaltantes="itensFaltantes"
        :atividadesRecentes="atividadesRecentes"
      />
      <ConquistasTimeline
        :usuario="usuario"
        :corredoresUnicos="corredoresUnicos"
        :itensFaltantes="itensFaltantes"
        :atividadesRecentes="atividadesRecentes"
      />

      <!-- QR Code da Matrícula -->
      <QrCodeMatricula :usuario="usuario" />

      <!-- Timeline de Atividades -->
      <TimelineAtividades
        :atividadesRecentes="atividadesRecentes"
        v-if="atividadesRecentes.length > 0"
      />
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useNivelStore } from "@/store/nivelStore";
import { useLojaStore } from "@/store/lojaStore";
import PerfilHeader from "./Perfiltemplate/PerfilHeader.vue";
import SelosConquistas from "./Perfiltemplate/SelosConquistas.vue";
import TimelineAtividades from "./Perfiltemplate/TimelineAtividades.vue";
import QrCodeMatricula from "./Perfiltemplate/QrCodeMatricula.vue";
import ConquistasTimeline from "./Perfiltemplate/ConquistasTimeline.vue";

export default {
  name: "PerfilUsuario",
  components: {
    PerfilHeader,
    SelosConquistas,
    TimelineAtividades,
    QrCodeMatricula,
    ConquistasTimeline,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const router = useRouter();
    const lojaStore = useLojaStore();

    const voltarParaLista = () => {
      // Verificar se veio de uma rota específica ou usar rota padrão
      if (router.options.history.state.back) {
        router.back();
      } else {
        router.push("/usuarios");
      }
    };

    return {
      voltarParaLista,
      lojaStore,
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
        xpConquistas: 0,
        totalAuditorias: 0,
      },
      carregando: true,
      mediaGeral: 85,
      atividadesRecentes: [],
      dadosUsuario: [],
      nivelStore: null,
    };
  },
  async mounted() {
    try {
      this.nivelStore = useNivelStore();
      // Carregar usuários em background (não bloquear a interface)
      this.nivelStore.carregarUsuarios().catch(console.error);
      // Carregar o usuário específico
      await this.carregarUsuarioPorId(this.id);
    } catch (error) {
      console.error("Erro ao inicializar perfil:", error);
      this.carregando = false;
    }
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

    posicaoRanking() {
      if (!this.nivelStore || !this.usuario.id) return 1;
      try {
        return this.nivelStore.calcularPosicaoRanking(this.usuario.id);
      } catch (error) {
        console.warn("Erro ao calcular posição ranking:", error);
        return 1;
      }
    },

    mediaDesempenho() {
      if (!this.nivelStore || !this.usuario.id) return 0;
      try {
        return this.nivelStore.calcularMediaDesempenho(this.usuario.id);
      } catch (error) {
        console.warn("Erro ao calcular média desempenho:", error);
        return Math.floor(Math.random() * 100); // Fallback com valor simulado
      }
    },
  },
  methods: {
    async carregarUsuarioPorId(usuarioId) {
      try {
        this.carregando = true;
        // Busca usuário pelo backend com header da loja
        const response = await fetch(`http://localhost:3000/usuarios`, {
          headers: {
            "x-loja": this.getLojaAtual(),
          },
        });
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
              xpConquistas:
                this.nivelStore?.calcularXpConquistas(usuarioEncontrado) || 0,
            };
            await this.carregarDadosDetalhados(
              usuarioEncontrado.id || usuarioEncontrado._id
            );
          } else {
            console.error("Usuário não encontrado:", usuarioId);
            // Criar usuário mock se não encontrado para demonstração
            this.usuario = {
              id: usuarioId,
              nome: `Usuário ${usuarioId}`,
              contador: Math.floor(Math.random() * 800) + 100,
              iniciais: this.obterIniciais(`Usuário ${usuarioId}`),
              xpConquistas: 0,
              totalAuditorias: Math.floor(Math.random() * 20) + 1,
            };
            await this.carregarDadosDetalhados(usuarioId);
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

    carregarDadosUsuario(usuario) {
      this.usuario = { ...usuario };
      this.usuario.iniciais = this.obterIniciais(usuario.nome);
      this.carregarDadosDetalhados(usuario.id);
    },

    async carregarDadosDetalhados(usuarioId) {
      // Simular dados de auditoria já que o endpoint específico não existe ainda
      try {
        // Por enquanto, vamos simular alguns dados de auditoria
        const dadosSimulados = this.simularDadosAuditoria(usuarioId);
        this.dadosUsuario = dadosSimulados;
        this.processarTimeline();
        this.verificarConquistas();
      } catch (error) {
        console.error("Erro ao carregar dados detalhados:", error);
      }
    },

    simularDadosAuditoria(usuarioId) {
      // Simular dados baseados no contador do usuário
      const contador = this.usuario.contador || 0;
      const dados = [];

      for (let i = 0; i < Math.min(contador, 100); i++) {
        dados.push({
          Produto: `Produto ${i + 1}`,
          Local: `Corredor ${Math.floor(Math.random() * 10) + 1}`,
          "Estoque atual": Math.floor(Math.random() * 50),
          Situacao: Math.random() > 0.3 ? "Atualizado" : "Pendente",
        });
      }

      return dados;
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

    verificarConquistas() {
      // Sistema de conquistas agora é gerenciado pelos componentes modulares
      // Atualizar XP com base nas conquistas disponíveis
      if (this.nivelStore) {
        const conquistasDisponiveis =
          this.nivelStore.verificarConquistasDisponiveis(this.usuario, {
            corredoresUnicos: this.corredoresUnicos,
            itensFaltantes: this.itensFaltantes,
            atividadesRecentes: this.atividadesRecentes,
          });

        // Calcular XP total das conquistas
        this.usuario.xpConquistas = conquistasDisponiveis.reduce(
          (total, conquista) => {
            return total + conquista.xp;
          },
          0
        );
      }
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
        this.$router.push("/usuarios");
      } else {
        window.location.href = "/usuarios";
      }
    },

    getLojaAtual() {
      return this.lojaStore.codigoLojaAtual || "056"; // fallback para loja padrão
    },
  },
};
</script>

<style scoped>
.perfil-usuario-container {
  max-width: auto;
  margin: 0 auto;
  padding: 2px;
  font-family: "Poppins", sans-serif;
}

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

.loading-container,
.error-container {
  text-align: center;
  padding: 40px;
}

.loading-container .spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}
stats-qr-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
  margin-bottom: 30px;
}

.stats-section {
  grid-column: 1;
}

.qr-section {
  grid-column: 2;
}

@media (max-width: 1024px) {
  .stats-qr-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .stats-section,
  .qr-section {
    grid-column: 1;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-container .error-icon {
  font-size: 3rem;
  color: #ff6b6b;
  margin-bottom: 20px;
}

.error-container h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.error-container p {
  color: #7f8c8d;
  margin-bottom: 20px;
}

.error-container .btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
