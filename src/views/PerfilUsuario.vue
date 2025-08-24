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
      />

      <!-- Selos e Conquistas -->
      <SelosConquistas
        :selos="selos"
        :usuario="usuario"
        :corredoresUnicos="corredoresUnicos"
        :mediaGeral="mediaGeral"
        :itensFaltantes="itensFaltantes"
        :atividadesRecentes="atividadesRecentes"
      />

      <!-- Estatísticas Principais -->
      <EstatisticasPrincipais
        :usuario="usuario"
        :mediaGeral="mediaGeral"
        :diferencaMedia="diferencaMedia"
        :percentualConcluido="percentualConcluido"
        :corredoresComContagem="corredoresComContagem"
      />

      <!-- Timeline de Atividades -->
      <TimelineAtividades
        :atividadesRecentes="atividadesRecentes"
        v-if="atividadesRecentes.length > 0"
      />

      <!-- Itens Faltantes -->
      <ItensFaltantes
        :itensFaltantes="itensFaltantes"
        v-if="itensFaltantes.length > 0"
      />

      <!-- Botões de Ação -->
      <BotoesAcao
        @exportarRelatorio="exportarRelatorio"
        @compartilharPerfil="compartilharPerfil"
      />
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import PerfilHeader from "./Perfiltemplate/PerfilHeader.vue";
import SelosConquistas from "./Perfiltemplate/SelosConquistas.vue";
import EstatisticasPrincipais from "./Perfiltemplate/EstatisticasPrincipais.vue";
import TimelineAtividades from "./Perfiltemplate/TimelineAtividades.vue";
import ItensFaltantes from "./Perfiltemplate/ItensFaltantes.vue";
import BotoesAcao from "./Perfiltemplate/BotoesAcao.vue";

export default {
  name: "PerfilUsuario",
  components: {
    PerfilHeader,
    SelosConquistas,
    EstatisticasPrincipais,
    TimelineAtividades,
    ItensFaltantes,
    BotoesAcao,
  },
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
            atividadesRecentes,
            dadosUsuario
          ) => {
            // Usar dadosUsuario em vez de atividadesRecentes para a lógica
            if (!dadosUsuario || dadosUsuario.length < 50) return false;

            // Verificar se há 50 itens com timestamp próximo (exemplo simplificado)
            // Em produção, você precisaria de dados reais de timestamp
            return dadosUsuario.length >= 50;
          },
        },
        {
          id: 10,
          nome: "Regularidade",
          descricao: "Fez auditoria por 5 dias seguidos",
          icone: "📅",
          desbloqueado: false,
          condicao: (
            usuario,
            corredores,
            mediaGeral,
            itensFaltantes,
            atividadesRecentes,
            dadosUsuario
          ) => {
            // Exemplo simplificado - em produção você precisaria de datas reais
            return dadosUsuario && dadosUsuario.length >= 20; // Ajuste conforme sua lógica
          },
        },
        {
          id: 11,
          nome: "Primeiro Dia",
          descricao: "Fez sua primeira auditoria",
          icone: "🎉",
          desbloqueado: false,
          condicao: (
            usuario,
            corredores,
            mediaGeral,
            itensFaltantes,
            atividadesRecentes,
            dadosUsuario
          ) => {
            // Verifica se há dados de auditoria
            return dadosUsuario && dadosUsuario.length > 0;
          },
        },
        {
          id: 12,
          nome: "Veterano",
          descricao: "Fez auditoria em 20 dias diferentes",
          icone: "🥇",
          desbloqueado: false,
          condicao: (
            usuario,
            corredores,
            mediaGeral,
            itensFaltantes,
            atividadesRecentes,
            dadosUsuario
          ) => {
            return dadosUsuario && dadosUsuario.length >= 20;
          },
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
          this.atividadesRecentes,
          this.dadosUsuario // ← Adicione este parâmetro
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
.perfil-usuario-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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
