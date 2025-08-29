<template>
  <div class="ruptura-usuario">
    <h2>Estatísticas de Ruptura por Usuário</h2>

    <!-- Filtro por data -->
    <div class="filtro-data">
      <label for="data-select">Filtrar por data: </label>
      <select
        id="data-select"
        v-model="dataSelecionada"
        @change="aplicarFiltroData"
      >
        <option value="">Todas as datas</option>
        <option v-for="data in datasDisponiveis" :key="data" :value="data">
          {{ formatarDataParaExibicao(data) }}
        </option>
      </select>

      <button @click="carregarDados" class="btn-atualizar">
        ↻ Atualizar Dados
      </button>
    </div>

    <div v-if="loading" class="loading">Carregando dados...</div>

    <div v-else-if="dadosRuptura.length === 0" class="no-data">
      Nenhum dado de ruptura encontrado para o período selecionado.
    </div>

    <div v-else>
      <div class="stats-header">
        <p>
          Período:
          {{
            dataSelecionada
              ? formatarDataParaExibicao(dataSelecionada)
              : "Todas as datas"
          }}
        </p>
        <p>Total de usuários: {{ Object.keys(usuariosStats).length }}</p>
        <p>Total de itens processados: {{ formatarNumero(totalItens) }}</p>
        <p>Custo total de ruptura: {{ formatarMoeda(totalCustoRuptura) }}</p>
      </div>

      <table class="stats-table">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>ID</th>
            <th>Itens Lidos</th>
            <th>Custo de Ruptura</th>
            <th>Estoque Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(stats, usuario) in usuariosStats" :key="usuario">
            <td>{{ extrairNomeUsuario(usuario) }}</td>
            <td>{{ extrairIdUsuario(usuario) }}</td>
            <td>{{ formatarNumero(stats.quantidade) }}</td>
            <td>{{ formatarMoeda(stats.custoRuptura) }}</td>
            <td>{{ formatarNumero(stats.estoqueTotal) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "RupturaPorUsuario",
  data() {
    return {
      loading: true,
      dadosRuptura: [],
      usuariosStats: {},
      totalItens: 0,
      totalCustoRuptura: 0,
      datasDisponiveis: [],
      dataSelecionada: "",
    };
  },
  async mounted() {
    await this.carregarDatasDisponiveis();
    await this.carregarDados();
  },
  methods: {
    async carregarDatasDisponiveis() {
      try {
        const response = await fetch("http://localhost:3000/datas-auditoria");
        this.datasDisponiveis = await response.json();
      } catch (error) {
        console.error("Erro ao carregar datas disponíveis:", error);
      }
    },

    async carregarDados() {
      try {
        this.loading = true;

        let url = "http://localhost:3000/dados-ruptura";
        if (this.dataSelecionada) {
          url += `?data=${this.dataSelecionada}`;
        }

        const response = await fetch(url);
        const dados = await response.json();

        // Filtrar apenas itens com custo de ruptura válido
        this.dadosRuptura = dados.filter((item) => {
          const custo = Number(item.custoRuptura);
          return !isNaN(custo) && custo > 0;
        });

        this.calcularEstatisticas();
        this.loading = false;
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        this.loading = false;
      }
    },

    aplicarFiltroData() {
      this.carregarDados();
    },

    calcularEstatisticas() {
      const stats = {};
      let totalItens = 0;
      let totalCusto = 0;

      this.dadosRuptura.forEach((item) => {
        const usuario = item.usuario;
        const custoRuptura = Number(item.custoRuptura) || 0;
        const estoqueAtual = Number(item.estoqueAtual) || 0;

        if (!stats[usuario]) {
          stats[usuario] = {
            quantidade: 0,
            custoRuptura: 0,
            estoqueTotal: 0,
          };
        }

        // Incrementar estatísticas
        stats[usuario].quantidade += 1;
        stats[usuario].custoRuptura += custoRuptura;
        stats[usuario].estoqueTotal += estoqueAtual;

        totalItens += 1;
        totalCusto += custoRuptura;
      });

      this.usuariosStats = stats;
      this.totalItens = totalItens;
      this.totalCustoRuptura = totalCusto;
    },

    extrairIdUsuario(usuarioString) {
      const match = usuarioString.match(/^(\d+)/);
      return match ? match[1] : usuarioString;
    },

    extrairNomeUsuario(usuarioString) {
      const match = usuarioString.match(/\((.*?)\)/);
      return match ? match[1] : usuarioString;
    },

    formatarMoeda(valor) {
      if (valor === 0 || isNaN(valor)) return "R$ 0,00";

      if (valor >= 1000000) {
        return `R$ ${(valor / 1000000).toFixed(2).replace(".", ",")} mi`;
      } else if (valor >= 1000) {
        return `R$ ${(valor / 1000).toFixed(2).replace(".", ",")} mil`;
      } else {
        return `R$ ${valor.toFixed(2).replace(".", ",")}`;
      }
    },

    formatarNumero(valor) {
      if (valor === 0 || isNaN(valor)) return "0";

      if (valor >= 1000000) {
        return `${(valor / 1000000).toFixed(2).replace(".", ",")} mi`;
      } else if (valor >= 1000) {
        return `${(valor / 1000).toFixed(2).replace(".", ",")} mil`;
      } else {
        return valor.toLocaleString("pt-BR");
      }
    },

    formatarDataParaExibicao(dataString) {
      if (!dataString) return "";

      try {
        const data = new Date(dataString);
        return data.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      } catch (error) {
        return dataString;
      }
    },
  },
};
</script>

<style scoped>
.ruptura-usuario {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.filtro-data {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.filtro-data label {
  font-weight: bold;
  color: #2c3e50;
}

.filtro-data select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn-atualizar {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-atualizar:hover {
  background-color: #2980b9;
}

.loading,
.no-data {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.stats-header {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-header p {
  margin: 8px 0;
  font-size: 16px;
  font-weight: bold;
}

.stats-header p:first-child {
  color: #2c3e50;
  font-size: 18px;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-table th,
.stats-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.stats-table th {
  background-color: #2c3e50;
  color: white;
  font-weight: bold;
}

.stats-table tr:hover {
  background-color: #f8f9fa;
}

.stats-table td:nth-child(4) {
  font-weight: bold;
  color: #e74c3c;
}

.stats-table td:nth-child(3) {
  color: #27ae60;
}
</style>
