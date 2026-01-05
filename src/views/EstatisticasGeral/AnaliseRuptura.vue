<template>
  <div class="metricas-loja-container">
    <h2 class="titulo-principal">📊 Estatísticas de Ruptura por Loja</h2>

    <!-- Filtro por data -->
    <div class="filtro-data">
      <label for="data-select"
        ><i class="fas fa-calendar-alt"></i> Filtrar por data:
      </label>
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
        <i class="fas fa-sync-alt"></i> Atualizar Dados
      </button>
    </div>

    <div v-if="loading" class="loading">Carregando dados...</div>

    <div v-else-if="dadosRuptura.length === 0" class="no-data">
      Nenhum dado de ruptura encontrado para o período selecionado.
    </div>

    <div v-else>
      <!-- Cards de Resumo -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-store"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ Object.keys(lojasStats).length }}</span>
            <span class="stat-label">Total de Lojas</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-box-open"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ formatarNumero(totalItens) }}</span>
            <span class="stat-label">Itens Processados</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon custo"><i class="fas fa-dollar-sign"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{
              formatarMoeda(totalCustoRuptura)
            }}</span>
            <span class="stat-label">Custo Total de Ruptura</span>
          </div>
        </div>
      </div>

      <table class="stats-table">
        <thead>
          <tr>
            <th>Loja</th>
            <th>ID</th>
            <th>Itens Lidos</th>
            <th>Custo de Ruptura</th>
            <th>Estoque Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(stats, loja) in lojasStats" :key="loja">
            <td class="loja-cell">{{ extrairNomeLoja(loja) }}</td>
            <td>{{ extrairCodigoLoja(loja) }}</td>
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
      lojasStats: {},
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

    gerarDadosFake() {
      const dados = [];
      // Lista de lojas baseada no seu componente SelecionarLoja.vue
      const lojas = [
        { codigo: "056", nome: "Buritis" },
        { codigo: "084", nome: "Independência" },
        { codigo: "105", nome: "T9" },
        { codigo: "111", nome: "Rio Verde" },
        { codigo: "140", nome: "Perimetral" },
        { codigo: "214", nome: "Caldas Novas" },
        { codigo: "176", nome: "Palmas Teotônio" },
        { codigo: "194", nome: "Anápolis" },
        { codigo: "310", nome: "Portugal" },
        { codigo: "320", nome: "Palmas Cesamar" },
        { codigo: "347", nome: "Araguaina" },
      ];

      for (let i = 0; i < 250; i++) {
        // Seleciona uma loja aleatória da lista
        const loja = lojas[Math.floor(Math.random() * lojas.length)];

        // Formata a string para ser compatível com as funções de extração
        // Ex: "056 (Buritis)"
        const lojaFormatada = `${loja.codigo} (${loja.nome})`;

        // Gera dados aleatórios de custo e estoque
        const custoRuptura = (Math.random() * 500 + 10).toFixed(2);
        const estoqueAtual = Math.floor(Math.random() * 50);

        dados.push({
          // O campo continua se chamando 'usuario' para manter a compatibilidade
          // com o resto do componente, mas agora contém dados da loja.
          usuario: lojaFormatada,
          custoRuptura,
          estoqueAtual,
        });
      }
      return dados;
    },

    async carregarDados() {
      this.loading = true;
      // Simula um pequeno atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Gera os dados falsos
      const dadosFalsos = this.gerarDadosFake();

      // Filtra os dados como se viessem da API
      this.dadosRuptura = dadosFalsos.filter((item) => {
        const custo = Number(item.custoRuptura);
        return !isNaN(custo) && custo > 0;
      });

      this.calcularEstatisticas();
      this.loading = false;
    },

    aplicarFiltroData() {
      this.carregarDados();
    },

    calcularEstatisticas() {
      const lojasStats = {};
      let totalItens = 0;
      let totalCusto = 0;

      this.dadosRuptura.forEach((item) => {
        const loja = item.usuario; // O campo ainda se chama 'usuario' nos dados fake
        const custoRuptura = Number(item.custoRuptura) || 0;
        const estoqueAtual = Number(item.estoqueAtual) || 0;

        if (!lojasStats[loja]) {
          lojasStats[loja] = {
            quantidade: 0,
            custoRuptura: 0,
            estoqueTotal: 0,
          };
        }

        // Incrementar estatísticas
        lojasStats[loja].quantidade += 1;
        lojasStats[loja].custoRuptura += custoRuptura;
        lojasStats[loja].estoqueTotal += estoqueAtual;

        totalItens += 1;
        totalCusto += custoRuptura;
      });

      this.lojasStats = lojasStats;
      this.totalItens = totalItens;
      this.totalCustoRuptura = totalCusto;
    },

    extrairCodigoLoja(lojaString) {
      const match = lojaString.match(/^(\d+)/);
      return match ? match[1] : lojaString;
    },

    extrairNomeLoja(lojaString) {
      const match = lojaString.match(/\((.*?)\)/);
      return match ? match[1] : lojaString;
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
.metricas-loja-container {
  padding: 20px;
  font-family: "Inter", sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.titulo-principal {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filtro-data {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.filtro-data label {
  font-weight: bold;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filtro-data select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: #f8f9fa;
}

.btn-atualizar {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;
}

.btn-atualizar:hover {
  background-color: #2980b9;
}

.btn-atualizar i {
  transition: transform 0.5s ease;
}

.btn-atualizar:hover i {
  transform: rotate(180deg);
}

.loading,
.no-data {
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #7f8c8d;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 1.5rem;
  color: #3498db;
  background-color: #eaf5ff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.custo {
  color: #e74c3c;
  background-color: #fdedec;
}

.stat-info .stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.stat-info .stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stats-table th,
.stats-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.stats-table th {
  background-color: #2c3e50;
  color: white;
  font-weight: bold;
}
.loja-cell {
  font-weight: 600;
  color: #34495e;
}

.stats-table tr:hover {
  background-color: #f1f5f9;
}

.stats-table td:nth-child(4) {
  font-weight: bold;
  color: #e74c3c;
  font-family: "Courier New", Courier, monospace;
}

.stats-table td:nth-child(3) {
  color: #27ae60;
  font-weight: 500;
}
</style>
