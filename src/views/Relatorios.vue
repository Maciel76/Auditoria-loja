<template>
  <div class="relatorios-container">
    <h1>Relatórios de Auditoria</h1>

    <div class="filtros">
      <div class="filtro-group">
        <label>Período:</label>
        <select v-model="periodo">
          <option value="diario">Diário</option>
          <option value="semanal">Semanal</option>
          <option value="mensal">Mensal</option>
        </select>
      </div>

      <div class="filtro-group">
        <button @click="gerarRelatorio">Gerar Relatório</button>
      </div>
    </div>

    <div v-if="relatorio" class="resultado-relatorio">
      <h2>Resumo do Período</h2>

      <div class="estatisticas">
        <div class="estatistica-card">
          <h3>Total de Itens</h3>
          <p>{{ relatorio.totalItens }}</p>
        </div>

        <div class="estatistica-card">
          <h3>Itens Lidos</h3>
          <p>{{ relatorio.totalItensLidos }}</p>
        </div>

        <div class="estatistica-card">
          <h3>Taxa de Conclusão</h3>
          <p>{{ relatorio.taxaConclusao }}%</p>
        </div>
      </div>

      <h3>Desempenho por Colaborador</h3>
      <table class="tabela-desempenho">
        <thead>
          <tr>
            <th>Colaborador</th>
            <th>Itens Verificados</th>
            <th>Percentual</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="colab in relatorio.colaboradores" :key="colab.nome">
            <td>{{ colab.nome }}</td>
            <td>{{ colab.itens }}</td>
            <td>{{ colab.percentual }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Relatorios",
  data() {
    return {
      periodo: "diario",
      relatorio: null,
    };
  },
  methods: {
    async gerarRelatorio() {
      try {
        const response = await axios.get(
          `http://localhost:3000/relatorios?periodo=${this.periodo}`
        );
        this.relatorio = response.data;
      } catch (error) {
        console.error("Erro ao gerar relatório:", error);
      }
    },
  },
};
</script>

<style scoped>
.relatorios-container {
  padding: 20px;
}

.filtros {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.estatisticas {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.estatistica-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  text-align: center;
  flex: 1;
}

.tabela-desempenho {
  width: 100%;
  border-collapse: collapse;
}

.tabela-desempenho th,
.tabela-desempenho td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.tabela-desempenho th {
  background-color: #f5f5f5;
}
</style>
